import { memo } from 'react';

// Map category names to an emoji icon
const CATEGORY_ICONS = {
  'Entradas':         '🥗',
  'Platos Principales': '🍽️',
  'Postres':          '🍮',
  'Bebidas':          '🥤',
  'Cafetería':        '☕',
  // fallback
  default:            '🍴',
};

export default memo(function CategoryTabs({ categories, active, onSelect }) {
  return (
    <nav className="category-tabs">
      {categories.map((cat) => {
        const icon = CATEGORY_ICONS[cat] ?? CATEGORY_ICONS.default;
        const isActive = active === cat;
        return (
          <button
            key={cat}
            className={`cat-pill${isActive ? ' cat-pill--active' : ''}`}
            onClick={() => onSelect(cat)}
          >
            <span className="cat-pill__icon">{icon}</span>
            <span className="cat-pill__label">{cat}</span>
            {isActive && <span className="cat-pill__bar" />}
          </button>
        );
      })}
    </nav>
  );
});
