import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SearchComponent from '../components/SearchComponent';

const Locations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/accommodations');
        setAccommodations(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Failed to load accommodations:', err);
      }
    };
    fetchData();
  }, []);

  const handleFilter = (e) => {
    const value = e.target.value;
    setLocation(value);
    if (!value) {
      setFiltered(accommodations);
    } else {
      const filteredList = accommodations.filter(acc =>
        acc.location.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(filteredList);
    }
  };

  const handleClick = (id) => {
    navigate(`/locations/${id}`);
  };

  return (
    <div className="container">
      <SearchComponent accommodations={accommodations} />
      <h1 className="page-title">Browse Listings</h1>

      <div className="filter-bar">
        <input
          type="text"
          value={location}
          onChange={handleFilter}
          placeholder="Search by location..."
          className="search-input"
        />
        <div className="filter-tags">
          <button className="tag">Free cancellation</button>
          <button className="tag">Type of place</button>
          <button className="tag">Price</button>
          <button className="tag">Instant Book</button>
          <button className="tag">More filters</button>
        </div>
      </div>

      <h2 className="subheading">
        {filtered.length} accommodation{filtered.length !== 1 && 's'} found
        {location && ` in "${location}"`}
      </h2>

      {filtered.length === 0 ? (
        <p className="no-listings">No accommodations found.</p>
      ) : (
        filtered.map(acc => (
          <div
            key={acc._id}
            onClick={() => handleClick(acc._id)}
            className="listing-card"
          >
            <img
              src={acc.images[0] || '/placeholder.jpg'}
              alt={acc.title}
              className="listing-image"
            />
            <div className="listing-info">
              <p className="listing-type">{acc.type} in {acc.location}</p>
              <h2 className="listing-title">{acc.title}</h2>
              <p className="listing-details">
                {acc.guests} guests · {acc.bedrooms} beds · {acc.bathrooms} bath
              </p>
              <p className="listing-amenities">
                {acc.amenities?.slice(0, 3).join(' · ')}
              </p>
              <div className="listing-meta">
                <span className="listing-rating">
                  <strong>{acc.rating.toFixed(1)}</strong> ⭐ ({acc.reviews} reviews)
                </span>
                <span className="listing-price"><strong>${acc.price}</strong> /night</span>
              </div>
            </div>
          </div>
        ))
      )}

      <style>{`
        .container {
          padding: 1rem;
          width: 100%;
          margin: 0 auto;
        }

        .page-title {
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .filter-bar {
          margin-bottom: 1.5rem;
        }

        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .filter-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tag {
          background: #f7f7f7;
          border: 1px solid #ddd;
          border-radius: 999px;
          padding: 0.4rem 1rem;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .tag:hover {
          background: #ebebeb;
        }

        .subheading {
          margin: 1rem 0;
          font-size: 1rem;
          color: #444;
        }

        .listing-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #ddd;
          padding-bottom: 2rem;
          cursor: pointer;
        }

        .listing-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }

        .listing-info {
          flex: 1;
        }

        .listing-type {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .listing-title {
          font-size: 1.3rem;
          margin: 0.3rem 0;
        }

        .listing-details {
          color: #444;
          margin: 0.5rem 0;
          font-size: 0.95rem;
        }

        .listing-amenities {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 0.5rem;
        }

        .listing-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }

        .listing-rating {
          font-size: 0.9rem;
        }

        .listing-price {
          font-size: 1.1rem;
        }

        @media (min-width: 768px) {
          .listing-card {
            flex-direction: row;
          }

          .listing-image {
            width: 250px;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Locations;
