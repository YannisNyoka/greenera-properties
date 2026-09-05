import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSearch() {
  const [listingType, setListingType] = useState('for-sale');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ listingType });
    if (city) params.set('city', city);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="hero-search"
    >
      <select value={listingType} onChange={(e) => setListingType(e.target.value)}>
        <option value="for-sale">For Sale</option>
        <option value="to-let">To Let</option>
      </select>
      <input
        type="text"
        placeholder="City or suburb..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ flex: 1 }}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default HeroSearch;