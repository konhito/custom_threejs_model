export default function WildfireArt() {
  return (
    <svg className="wildfire-banner__art" viewBox="0 0 320 260" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="wildfireBaseGlow" cx="50%" cy="100%" r="65%">
          <stop offset="0%" stopColor="#E8623C" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#E8623C" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#E8623C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wildfireOuterFlame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#5C1E0F" />
          <stop offset="45%" stopColor="#B4381C" />
          <stop offset="100%" stopColor="#E8623C" />
        </linearGradient>
        <linearGradient id="wildfireMidFlame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#B4381C" />
          <stop offset="50%" stopColor="#E8622F" />
          <stop offset="100%" stopColor="#F5A03C" />
        </linearGradient>
        <linearGradient id="wildfireCoreFlame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#F5A03C" />
          <stop offset="60%" stopColor="#FBD36B" />
          <stop offset="100%" stopColor="#FFEFC2" />
        </linearGradient>
      </defs>

      <ellipse className="wildfire-glow" cx="160" cy="228" rx="140" ry="26" fill="url(#wildfireBaseGlow)" />
      <circle className="wildfire-spark wildfire-spark--1" cx="120" cy="185" r="2.6" fill="#FBD36B" />
      <circle className="wildfire-spark wildfire-spark--2" cx="205" cy="180" r="2.2" fill="#F5A03C" />
      <circle className="wildfire-spark wildfire-spark--3" cx="175" cy="190" r="2.4" fill="#FBD36B" />
      <circle className="wildfire-spark wildfire-spark--4" cx="140" cy="188" r="1.8" fill="#E8623C" />

      <g className="wildfire-tongue wildfire-tongue--2">
        <path d="M160 228 C118 212 96 168 108 128 C112 100 126 82 138 66 C128 96 140 112 150 96 C156 130 176 122 172 82 C200 118 206 176 160 228Z" fill="url(#wildfireOuterFlame)" />
      </g>
      <g className="wildfire-tongue wildfire-tongue--4">
        <path d="M160 228 C204 210 220 172 208 134 C206 108 194 92 184 78 C192 106 182 120 174 104 C170 134 152 128 156 90 C130 122 122 176 160 228Z" fill="url(#wildfireOuterFlame)" opacity="0.85" />
      </g>
      <g className="wildfire-tongue wildfire-tongue--1">
        <path d="M160 226 C130 208 118 176 128 142 C130 118 142 100 152 86 C145 110 154 122 161 110 C166 136 182 130 178 96 C200 126 198 172 160 226Z" fill="url(#wildfireMidFlame)" />
      </g>
      <g className="wildfire-tongue wildfire-tongue--3">
        <path d="M160 222 C142 206 136 182 144 158 C146 140 154 128 160 118 C156 136 161 144 166 136 C170 154 180 150 177 128 C192 150 190 180 160 222Z" fill="url(#wildfireCoreFlame)" />
      </g>

      <g className="wildfire-pollinator" transform="translate(150,150)">
        <path d="M0 0 C-10-13-10 5 0 8 C10 5 10-13 0 0Z" fill="#F3EEE2" opacity="0.95" />
        <path d="M0 0 C10-13 10 5 0 8 C-10 5-10-13 0 0Z" fill="#C9A227" opacity="0.9" transform="scale(-1,1)" />
        <line x1="0" y1="-2" x2="0" y2="9" stroke="#0D1712" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
