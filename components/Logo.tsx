// Deventeck logo: the brand icon plus the "Deventeck" wordmark in the site font (Unbounded).
// The icon colours follow the theme: periwinkle D and gold orbit on dark, deeper tones on light.
export default function Logo() {
  return (
    <a className="brand" href="/#top" aria-label="Deventeck home">
      <svg className="brand-mark" viewBox="0 0 512 512" aria-hidden="true">
        <g transform="translate(34 38)">
          <path
            d="M83 72 H231 C353 72 424 147 424 239 C424 334 348 406 229 406 H85 L150 311 H229 C281 311 319 282 319 237 C319 191 284 166 230 166 H151 Z"
            fill="var(--accent)"
          />
          <path
            d="M165 207 H253 C280 207 293 221 293 240 C293 260 276 275 251 275 H123 Z"
            fill="var(--accent)"
            opacity=".73"
          />
          <path d="M72 351 C145 391 329 370 443 231" fill="none" stroke="var(--accent-2)" strokeWidth="17" strokeLinecap="round" />
          <circle cx="421" cy="87" r="17" fill="var(--accent-2)" />
        </g>
      </svg>
      <span className="brand-name">
        Deven<span className="brand-accent">teck</span>
      </span>
    </a>
  );
}