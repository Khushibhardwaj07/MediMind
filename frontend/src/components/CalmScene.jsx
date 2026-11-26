// A calm landscape drawn in SVG (no image file to download).
// It is decoration only, so screen readers skip it (aria-hidden).
export default function CalmScene() {
  return (
    <svg
      viewBox="0 0 800 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe7df" />
          <stop offset="0.55" stopColor="#eaf2e6" />
          <stop offset="1" stopColor="#f6e9df" />
        </linearGradient>
        <radialGradient id="sun">
          <stop offset="0" stopColor="#fff4e0" />
          <stop offset="1" stopColor="#f6c99c" />
        </radialGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#fff4e0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff4e0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="900" fill="url(#sky)" />
      <circle cx="580" cy="330" r="170" fill="url(#glow)" />
      <circle cx="580" cy="330" r="64" fill="url(#sun)" />

      <g fill="#ffffff" opacity="0.75">
        <ellipse cx="170" cy="270" rx="80" ry="22" />
        <ellipse cx="225" cy="252" rx="52" ry="22" />
        <ellipse cx="660" cy="470" rx="70" ry="18" />
        <ellipse cx="705" cy="455" rx="42" ry="18" />
      </g>

      <path
        d="M0 560 C 150 480, 300 540, 450 500 C 600 460, 700 520, 800 490 L800 900 L0 900 Z"
        fill="#b3d6cb"
      />
      <g fill="#9cc8bb">
        <ellipse cx="130" cy="515" rx="38" ry="30" />
        <ellipse cx="165" cy="522" rx="30" ry="24" />
        <ellipse cx="610" cy="478" rx="40" ry="30" />
        <ellipse cx="648" cy="486" rx="30" ry="24" />
      </g>

      <path
        d="M0 650 C 120 580, 280 640, 420 600 C 560 560, 680 620, 800 590 L800 900 L0 900 Z"
        fill="#86bbad"
      />
      <g fill="#6fab9c">
        <ellipse cx="300" cy="610" rx="44" ry="34" />
        <ellipse cx="340" cy="618" rx="32" ry="26" />
        <ellipse cx="90" cy="610" rx="36" ry="28" />
      </g>

      <path
        d="M0 740 C 160 690, 300 750, 460 710 C 600 675, 720 725, 800 700 L800 900 L0 900 Z"
        fill="#549d8e"
      />
      <path
        d="M0 820 C 200 780, 380 840, 560 800 C 680 775, 750 800, 800 790 L800 900 L0 900 Z"
        fill="#2e6f68"
      />

      <g transform="translate(110 430) rotate(-20)">
        <g className="float">
          <path d="M0 0 C 10 -14, 28 -14, 36 0 C 28 14, 10 14, 0 0 Z" fill="#6fae9f" opacity="0.9" />
        </g>
      </g>
      <g transform="translate(430 380) rotate(25)">
        <g className="float float-2">
          <path d="M0 0 C 10 -14, 28 -14, 36 0 C 28 14, 10 14, 0 0 Z" fill="#8cc4b5" opacity="0.85" />
        </g>
      </g>
      <g transform="translate(690 600) rotate(-35)">
        <g className="float float-3">
          <path d="M0 0 C 10 -14, 28 -14, 36 0 C 28 14, 10 14, 0 0 Z" fill="#6fae9f" opacity="0.8" />
        </g>
      </g>
    </svg>
  );
}