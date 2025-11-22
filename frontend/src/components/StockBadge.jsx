export default function StockBadge({ stock }) {
  const isOut = stock === 0;

  const label = isOut ? "Out of Stock" : "In Stock";
  const classes = isOut
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${classes}`}>
      {label}
    </span>
  );
}
