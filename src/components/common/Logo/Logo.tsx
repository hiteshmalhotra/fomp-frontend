interface Props {
  /** Icon square size in px */
  size?: number
  className?: string
}

/**
 * FOMP brand mark — SVG plate/cutlery glyph on the brand blue tile.
 * Replaces the 🍽 emoji (emoji render inconsistently across platforms
 * and are announced literally by screen readers).
 */
const Logo = ({ size = 32, className }: Props) => (
  <span
    className={className}
    role="img"
    aria-label="FOMP logo"
    style={{
      width: size,
      height: size,
      background: '#1e40af',
      borderRadius: Math.round(size / 4),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <svg
      width={size * 0.6}
      height={size * 0.6}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* fork */}
      <path
        d="M6 2v6a2 2 0 0 0 2 2h0V2M8 10v12"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 2v5M8 2v5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
      {/* knife */}
      <path
        d="M17 2c-1.5 2.5-2 5-2 7 0 1.5 1 2 2 2v11"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
)

export default Logo
