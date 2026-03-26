export default function CategoryTabs({ categories, active, onSelect }) {
  return (
    <nav className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`tab-btn${active === cat ? ' tab-btn--active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
