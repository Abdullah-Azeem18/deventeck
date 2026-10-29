export default function Logo() {
  return (
    <a className="brand" href="/#top" aria-label="Deventeck home">
      <svg className="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2 28.1 9v14L16 30 3.9 23V9L16 2Z" stroke="var(--accent)" strokeWidth="2" />
        <path d="M11 10h5.2a6 6 0 0 1 0 12H11V10Z" fill="var(--accent)" />
        <circle cx="24" cy="9" r="2.4" fill="var(--accent-2)" />
      </svg>
      Deventeck
    </a>
  );
}