import { useSearchParams } from 'react-router-dom';

function Pagination({ pagination }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, pages } = pagination;

  if (pages <= 1) return null;

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
      <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>Previous</button>
      <span>Page {page} of {pages}</span>
      <button disabled={page >= pages} onClick={() => goToPage(page + 1)}>Next</button>
    </div>
  );
}

export default Pagination;