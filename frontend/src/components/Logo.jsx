function Logo({ size = 32, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="2" width="12" height="12" transform="rotate(45 18 8)" stroke={color} strokeWidth="2" fill="none" />
      <rect x="2" y="14" width="14" height="14" transform="rotate(45 9 21)" stroke={color} strokeWidth="2" fill="none" />
      <rect x="18" y="18" width="16" height="16" transform="rotate(45 26 26)" stroke={color} strokeWidth="2" fill="none" />
    </svg>
  );
}

export default Logo;