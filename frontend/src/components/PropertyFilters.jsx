import { useSearchParams } from 'react-router-dom';

const PROPERTY_TYPES = ['house', 'apartment', 'townhouse', 'vacant-land', 'commercial', 'industrial', 'farm'];

function PropertyFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearAll = () => setSearchParams({});

  return (
    <div className="filters-bar">
      <select value={searchParams.get('listingType') || ''} onChange={(e) => updateFilter('listingType', e.target.value)}>
        <option value="">For Sale or To Let</option>
        <option value="for-sale">For Sale</option>
        <option value="to-let">To Let</option>
      </select>

      <select value={searchParams.get('propertyType') || ''} onChange={(e) => updateFilter('propertyType', e.target.value)}>
        <option value="">All Property Types</option>
        {PROPERTY_TYPES.map((type) => (
          <option key={type} value={type}>{type.replace('-', ' ')}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="City"
        value={searchParams.get('city') || ''}
        onChange={(e) => updateFilter('city', e.target.value)}
      />

      <input
        type="text"
        placeholder="Suburb"
        value={searchParams.get('suburb') || ''}
        onChange={(e) => updateFilter('suburb', e.target.value)}
      />

      <input
        type="number"
        placeholder="Min Price"
        value={searchParams.get('minPrice') || ''}
        onChange={(e) => updateFilter('minPrice', e.target.value)}
        style={{ width: '110px' }}
      />

      <input
        type="number"
        placeholder="Max Price"
        value={searchParams.get('maxPrice') || ''}
        onChange={(e) => updateFilter('maxPrice', e.target.value)}
        style={{ width: '110px' }}
      />

      <select value={searchParams.get('bedrooms') || ''} onChange={(e) => updateFilter('bedrooms', e.target.value)}>
        <option value="">Any Beds</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}+ beds</option>
        ))}
      </select>

      <button type="button" className="btn btn-secondary" onClick={clearAll}>Clear filters</button>
    </div>
  );
}

export default PropertyFilters;