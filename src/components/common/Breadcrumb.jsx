import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container my-3 pb-1 pt-2 px-3 rounded-3">
      <ol className="breadcrumb mb-0">
        {items.map((item, idx) => (
          <li
            key={idx}
            className={`breadcrumb-item${item.active ? " active" : ""}`}
            aria-current={item.active ? "page" : undefined}
          >
            {item.active ? (
              <span className="breadcrumb-active">{item.label}</span>
            ) : (
              <Link className="breadcrumb-link" to={item.to}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
