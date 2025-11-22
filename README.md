## 🚀 Inventory Management System (React + Node + SQLite)

A full-stack inventory management application with:

Product CRUD

Stock tracking

CSV import/export

Image uploads

Inventory history

Authentication (Login + Registration)

Sorting, filtering & pagination

Fully responsive UI

Lucide icons + Tailwind + Shadcn-style components

Built with React + Node.js + Express + SQLite.

## 📦 Features

# ✅ Product Management

Add, edit, delete products

Upload product images

Status badges (In Stock / Out of Stock / Low Stock)

Pagination, sorting, search & category filter

# ✅ Inventory History

Tracks stock changes

Shows old vs new quantity

Timestamp & user info

# ✅ CSV Import / Export

Import bulk products

Detect duplicates

Export entire product list

# ✅ Authentication

User Registration

User Login

JWT-based route protection

# ✅ File Uploads

Images stored in /uploads/images

SQLite DB stored locally or on Render persistent disk

## 🛠 Tech Stack

# Frontend

React (CRA)

Axios

React Router DOM

TailwindCSS

Lucide Icons

Shadcn-inspired UI components

# Backend

Node.js + Express

SQLite

Multer (file uploads)

CSV Parser

Express Validator

JWT Authentication

## ⚙️ Backend Setup

cd backend

npm install

Start server:

npm start


Server runs at:

http://localhost:4000

## 🔧 Environment variables (.env)

JWT_SECRET=your-secret

PORT=4000

## 🎨 Frontend Setup

cd frontend

npm install

npm start

Frontend runs at:

http://localhost:3000


## 📥 Import Products (CSV)

CSV format:

name,unit,category,brand,stock,status,image
Apple iPhone 15,pcs,Mobiles,Apple,20,In Stock,


Endpoint:

POST /api/products/import


Form-data:

csvFile: (file)


🔗 API Endpoints

Auth

Method	Endpoint	Description

POST	/api/auth/register	Create user

POST	/api/auth/login	Login user

Products

Method	Endpoint	Description

GET	/api/products	List products

POST	/api/products	Add product

PUT	/api/products/:id	Update product

DELETE	/api/products/:id	Delete product

GET	/api/products/:id/history	Inventory history

POST	/api/products/import	Import CSV

GET	/api/products/export	Export CSV


## 🖼 Screenshots

# Login 

<img width="515" height="330" alt="image" src="https://github.com/user-attachments/assets/3128305a-9080-4dee-a33d-6b3b409e04c4" />

# Dashboard

<img width="1350" height="625" alt="image" src="https://github.com/user-attachments/assets/ca97976f-5b6d-4156-8688-5699b2896fab" />



## 📄 License

MIT License.

## 🙌 Contributions

PRs and improvements are always welcome.
