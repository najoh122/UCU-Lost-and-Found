import "./LostFoundScene.css";

export default function LostFoundScene() {
  return (
    <section className="lfs">
      <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-label="A student hands found keys to their owner">
        <defs>
          <linearGradient id="lfsSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cfe0ff" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
          <radialGradient id="lfsGlow">
            <stop offset="0" stopColor="#ffb85c" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffb85c" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="800" height="300" fill="url(#lfsSky)" />
        <circle cx="690" cy="55" r="26" fill="#f5a623" />
        <ellipse cx="140" cy="60" rx="46" ry="14" fill="#fff" />
        <ellipse cx="330" cy="40" rx="38" ry="11" fill="#fff" />
        <rect y="245" width="800" height="55" fill="#1e3a8a" />
        <rect y="245" width="800" height="6" fill="#f5a623" />

        <g transform="rotate(-12 95 225)">
          <rect x="70" y="205" width="36" height="60" rx="6" fill="#334155" />
          <rect x="75" y="212" width="26" height="40" rx="3" fill="#7dd3fc" />
        </g>
        <rect x="130" y="228" width="52" height="34" rx="6" fill="#f5a623" />
        <rect x="130" y="238" width="52" height="5" fill="#c77d0a" />
        <text x="62" y="190" fontSize="30" fill="#1e3a8a" fontWeight="700">?</text>
        <text x="175" y="205" fontSize="22" fill="#f5a623" fontWeight="700">?</text>

        <path d="M650 262 L650 205 Q650 165 695 165 Q740 165 740 205 Z" fill="#f5a623" />
        <rect x="693" y="205" width="4" height="55" fill="#475569" />
        <rect x="715" y="238" width="58" height="36" rx="5" fill="#fff" stroke="#94a3b8" strokeWidth="2" transform="rotate(8 745 256)" />
        <circle cx="730" cy="252" r="7" fill="#1e3a8a" transform="rotate(8 745 256)" />
        <text x="760" y="185" fontSize="30" fill="#1e3a8a" fontWeight="700">?</text>

        <circle cx="385" cy="150" r="62" fill="url(#lfsGlow)" />

        <rect x="236" y="215" width="16" height="36" rx="6" fill="#0f172a" />
        <rect x="262" y="215" width="16" height="36" rx="6" fill="#0f172a" />
        <rect x="226" y="150" width="62" height="85" rx="24" fill="#1e3a8a" />
        <circle cx="257" cy="122" r="27" fill="#f1c27d" />
        <path d="M230 118 Q232 90 258 92 Q286 92 284 118 Q270 104 230 118 Z" fill="#3b2412" />
        <circle cx="248" cy="124" r="3" fill="#1f2937" />
        <circle cx="267" cy="124" r="3" fill="#1f2937" />
        <path d="M247 135 Q257 144 268 135" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
        <line x1="284" y1="172" x2="345" y2="150" stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />
        <circle cx="348" cy="148" r="9" fill="#f1c27d" />

        <rect x="520" y="215" width="16" height="36" rx="6" fill="#0f172a" />
        <rect x="546" y="215" width="16" height="36" rx="6" fill="#0f172a" />
        <rect x="566" y="158" width="32" height="62" rx="10" fill="#1e3a8a" />
        <rect x="510" y="150" width="62" height="85" rx="24" fill="#f5a623" />
        <circle cx="541" cy="122" r="27" fill="#d9a066" />
        <path d="M514 120 Q514 92 542 92 Q570 92 568 120 Q556 100 514 120 Z" fill="#111827" />
        <circle cx="532" cy="124" r="3" fill="#1f2937" />
        <circle cx="551" cy="124" r="3" fill="#1f2937" />
        <path d="M530 135 Q541 146 553 135" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
        <line x1="516" y1="172" x2="428" y2="150" stroke="#f5a623" strokeWidth="14" strokeLinecap="round" />
        <circle cx="424" cy="148" r="9" fill="#d9a066" />

        <g transform="translate(385 138)">
          <circle cx="0" cy="0" r="11" fill="none" stroke="#f59e0b" strokeWidth="5" />
          <line x1="8" y1="8" x2="30" y2="30" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
          <line x1="22" y1="22" x2="30" y2="14" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
          <line x1="14" y1="14" x2="20" y2="8" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
        </g>

        <circle cx="400" cy="62" r="22" fill="#1e3a8a" />
        <path d="M389 62 l8 8 l15 -16" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="lfs-text">
        <h2>Found it! Back with its owner.</h2>
        <p>Students report what they find, owners claim what they lost, and an admin approves every return.</p>
      </div>
    </section>
  );
}
