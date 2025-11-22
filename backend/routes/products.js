// routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const path = require('path');

// Multer storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'images');
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, safe);
  }
});
const uploadImage = multer({ storage });

// Default CSV upload
const uploadCSV = multer({ dest: path.join(__dirname, '..', 'uploads') });

/**
 * GET /api/products
 * Query params: page, limit, sort, order, category, search
 */
router.get('/', (req, res) => {
  let { page, limit, sort, order, category, search } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 8;
  const offset = (page - 1) * limit;

  const allowedSort = ['name', 'stock', 'brand', 'category', 'id'];
  const allowedOrder = ['ASC', 'DESC'];

  sort = allowedSort.includes(sort) ? sort : 'id';
  order = allowedOrder.includes(order?.toUpperCase()) ? order.toUpperCase() : 'ASC';

  const filters = [];
  const params = [];

  if (category) {
    filters.push('category = ?');
    params.push(category);
  }

  if (search) {
    filters.push('(name LIKE ? OR brand LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const sql = `
    SELECT * FROM products
    ${where}
    ORDER BY ${sort} ${order}
    LIMIT ? OFFSET ?
  `;
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Provide total count for pagination (optional but useful)
    const countSql = `SELECT COUNT(*) as total FROM products ${where}`;
    db.get(countSql, params.slice(0, params.length - 2), (err2, countRow) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ data: rows, page, limit, total: countRow ? countRow.total : rows.length });
    });
  });
});

/**
 * GET /api/products/:id/history
 */
router.get('/:id/history', (req, res) => {
  const productId = req.params.id;
  const sql = `SELECT * FROM inventory_history WHERE product_id = ? ORDER BY change_date DESC`;
  db.all(sql, [productId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * GET /api/products/export/all   -> returns CSV
 */
router.get('/export/all', (req, res) => {
  const sql = `SELECT * FROM products`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const headers = ['id','name','unit','category','brand','stock','status','image'];
    const csvRows = [headers.join(',')];
    rows.forEach(r => {
      const line = headers.map(h => {
        const v = r[h] === null || r[h] === undefined ? '' : `${r[h]}`.replace(/"/g, '""');
        return `"${v}"`;
      }).join(',');
      csvRows.push(line);
    });
    const csvData = csvRows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.status(200).send(csvData);
  });
});

/**
 * POST /api/products/import
 * form-data: csvFile
 */
router.post('/import', uploadCSV.single('csvFile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'CSV file required' });

  const filePath = req.file.path;
  const added = [];
  const skipped = [];

  const stream = fs.createReadStream(filePath).pipe(csv());

  stream.on('data', (row) => {
    const name = row.name && row.name.trim();
    if (!name) {
      skipped.push({ row, reason: 'missing name' });
      return;
    }
    const unit = row.unit || null;
    const category = row.category || null;
    const brand = row.brand || null;
    const stock = parseInt(row.stock || '0') || 0;
    const status = row.status || null;
    const image = row.image || null;

    db.get('SELECT id FROM products WHERE name = ?', [name], (err, existing) => {
      if (err) {
        skipped.push({ row, reason: err.message });
      } else if (existing) {
        skipped.push({ row, reason: 'duplicate name' });
      } else {
        db.run(
          `INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [name, unit, category, brand, stock, status, image],
          function (err2) {
            if (err2) {
              skipped.push({ row, reason: err2.message });
            } else {
              added.push({ id: this.lastID, name });
            }
          }
        );
      }
    });
  });

  stream.on('end', () => {
    fs.unlink(filePath, () => {
      res.json({ addedCount: added.length, skippedCount: skipped.length, added, skipped });
    });
  });

  stream.on('error', (err) => {
    fs.unlink(filePath, () => res.status(500).json({ error: err.message }));
  });
});

/**
 * POST /api/products/upload-image
 * form-data: image
 */
router.post('/upload-image', uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Image required' });
  const imageUrl = `/uploads/images/${req.file.filename}`;
  res.json({ imageUrl });
});

/**
 * POST /api/products  - create new product
 */
router.post(
  '/',
  [
    body('name').exists().isString().isLength({ min: 1 }),
    body('stock').optional().isInt()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, unit, category, brand, stock = 0, status, image } = req.body;

    db.run(
      `INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, unit || null, category || null, brand || null, stock, status || null, image || null],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err2, row) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.status(201).json(row);
        });
      }
    );
  }
);

/**
 * PUT /api/products/:id   - update product, record history if stock changed
 */
router.put(
  '/:id',
  [
    body('name').optional().isString().isLength({ min: 1 }),
    body('stock').optional().isInt()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { name, unit, category, brand, stock, status, image, user_info } = req.body;

    db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!product) return res.status(404).json({ error: 'Product not found' });

      const oldStock = product.stock;

      // If name changed, ensure uniqueness
      if (name && name !== product.name) {
        db.get('SELECT id FROM products WHERE name = ?', [name], (err2, existing) => {
          if (err2) return res.status(500).json({ error: err2.message });
          if (existing) return res.status(400).json({ error: 'Product name already exists' });
          proceedUpdate();
        });
      } else {
        proceedUpdate();
      }

      function proceedUpdate() {
        const fields = [];
        const params = [];

        if (name !== undefined) { fields.push('name = ?'); params.push(name); }
        if (unit !== undefined) { fields.push('unit = ?'); params.push(unit); }
        if (category !== undefined) { fields.push('category = ?'); params.push(category); }
        if (brand !== undefined) { fields.push('brand = ?'); params.push(brand); }
        if (stock !== undefined) { fields.push('stock = ?'); params.push(stock); }
        if (status !== undefined) { fields.push('status = ?'); params.push(status); }
        if (image !== undefined) { fields.push('image = ?'); params.push(image); }

        if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

        params.push(id);
        const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;

        db.run(sql, params, function (err3) {
          if (err3) return res.status(500).json({ error: err3.message });

          if (stock !== undefined && parseInt(stock) !== oldStock) {
            db.run(
              `INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, user_info) VALUES (?, ?, ?, ?, ?)`,
              [id, oldStock, parseInt(stock), new Date().toISOString(), user_info || null],
              (err4) => {
                if (err4) console.error('history insert error:', err4);
              }
            );
          }

          db.get('SELECT * FROM products WHERE id = ?', [id], (err4, updated) => {
            if (err4) return res.status(500).json({ error: err4.message });
            res.json({ success: true, product: updated });
          });
        });
      }
    });
  }
);

/**
 * DELETE /api/products/:id
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
