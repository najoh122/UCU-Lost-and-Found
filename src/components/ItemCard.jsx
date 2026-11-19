import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import { formatDate } from '../utils.js';

export default function ItemCard({ item }) {
  return (
    <li className={`tag-card ${item.type}`}>
      <Link to={`/items/${item.id}`} className="tag-link">
        {item.photo_url ? (
          <img src={item.photo_url} alt={`Photo of ${item.title}`} loading="lazy" />
        ) : (
          <div className="no-photo" aria-hidden="true">No photo</div>
        )}
        <div className="tag-body">
          <div className="badges">
            <StatusBadge kind={item.type} />
            <StatusBadge kind={item.status} />
          </div>
          <h3>{item.title}</h3>
          <p className="meta">{item.location}</p>
          <p className="meta">{item.category} · {formatDate(item.date)}</p>
        </div>
      </Link>
    </li>
  );
}
