const sampleEvents = [
  {
    name: 'Manali Trip',
    photos: 47,
    people: 8,
    color: 'emerald',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1a2e" />
            <stop offset="55%" stopColor="#162a16" />
            <stop offset="100%" stopColor="#0c160c" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#g1)" />
        <circle cx="165" cy="16" r="9" fill="rgba(255,240,200,0.1)" />
        <circle cx="18" cy="10" r="1.5" fill="rgba(255,255,255,0.5)" />
        <circle cx="52" cy="7" r="1" fill="rgba(255,255,255,0.4)" />
        <circle cx="88" cy="14" r="1" fill="rgba(255,255,255,0.3)" />
        <circle cx="125" cy="6" r="1.5" fill="rgba(255,255,255,0.4)" />
        <polygon points="0,120 0,82 22,56 44,72 65,36 90,58 112,44 136,62 158,32 185,50 200,40 200,120" fill="#1c2e1c" />
        <polygon points="0,120 0,92 16,78 38,90 60,70 85,84 108,68 132,82 155,64 178,76 200,66 200,120" fill="#0f180f" />
        <polygon points="62,36 66,27 70,36" fill="rgba(255,255,255,0.14)" />
        <polygon points="155,32 159,23 163,32" fill="rgba(255,255,255,0.1)" />
      </svg>
    ),
  },
  {
    name: 'The Wedding',
    photos: 213,
    people: 34,
    color: 'orange',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c0f06" />
            <stop offset="100%" stopColor="#0e0806" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#g2)" />
        <ellipse cx="100" cy="42" rx="65" ry="22" fill="rgba(255,160,50,0.05)" />
        <rect x="0" y="110" width="200" height="10" fill="#0a0504" />
        <rect x="84" y="62" width="8" height="48" fill="#0e0808" />
        <circle cx="88" cy="57" r="8" fill="#0e0808" />
        <rect x="100" y="66" width="7" height="44" fill="#0e0808" />
        <circle cx="103" cy="62" r="7" fill="#0e0808" />
        <polygon points="89,78 85,110 93,110 97,78" fill="#0e0808" />
        <path d="M40,110 L40,40 Q40,8 100,8 Q160,8 160,40 L160,110" fill="none" stroke="rgba(255,180,80,0.1)" strokeWidth="1.5" />
        <circle cx="56" cy="24" r="1.5" fill="rgba(255,220,100,0.55)" />
        <circle cx="100" cy="10" r="1.5" fill="rgba(255,220,100,0.6)" />
        <circle cx="144" cy="24" r="1.5" fill="rgba(255,220,100,0.55)" />
      </svg>
    ),
  },
  {
    name: 'Mood Fest',
    photos: 156,
    people: 61,
    color: 'purple',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <rect width="200" height="120" fill="#06040f" />
        <line x1="32" y1="0" x2="62" y2="120" stroke="rgba(168,85,247,0.14)" strokeWidth="28" />
        <line x1="100" y1="0" x2="100" y2="120" stroke="rgba(236,72,153,0.1)" strokeWidth="20" />
        <line x1="168" y1="0" x2="138" y2="120" stroke="rgba(168,85,247,0.12)" strokeWidth="24" />
        <rect x="0" y="94" width="200" height="26" fill="#030208" />
        <circle cx="22" cy="105" r="3" fill="rgba(255,255,255,0.1)" />
        <circle cx="50" cy="109" r="2" fill="rgba(255,255,255,0.07)" />
        <circle cx="80" cy="103" r="3" fill="rgba(255,255,255,0.1)" />
        <circle cx="110" cy="107" r="2" fill="rgba(255,255,255,0.07)" />
        <circle cx="140" cy="104" r="3" fill="rgba(255,255,255,0.1)" />
        <circle cx="170" cy="108" r="2" fill="rgba(255,255,255,0.07)" />
      </svg>
    ),
  },
  {
    name: 'Goa Trip',
    photos: 134,
    people: 12,
    color: 'cyan',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1a2e" />
            <stop offset="65%" stopColor="#162a16" />
            <stop offset="60%" stopColor="#0c160c" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#g4)" />
        <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255,150,80,0.07)" strokeWidth="0.8" />
        <ellipse cx="100" cy="58" rx="42" ry="5" fill="rgba(255,150,50,0.05)" />
        <rect x="0" y="60" width="200" height="60" fill="#050d18" />
        <path d="M0,70 Q26,66 52,70 Q78,74 104,70 Q130,66 156,70 Q178,73 200,70" fill="none" stroke="rgba(100,160,220,0.08)" strokeWidth="1" />
        <polygon points="78,58 82,50 86,58" fill="rgba(0,0,0,0.5)" />
        <rect x="81" y="38" width="1.5" height="20" fill="rgba(0,0,0,0.4)" />
        <rect x="0" y="100" width="200" height="20" fill="#0a0c08" />
      </svg>
    ),
  },
  {
    name: 'Birthday Bash',
    photos: 72,
    people: 18,
    color: 'yellow',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <rect width="200" height="120" fill="#080503" />
        <circle cx="28" cy="20" r="16" fill="rgba(255,180,50,0.06)" />
        <circle cx="100" cy="16" r="20" fill="rgba(255,160,40,0.05)" />
        <circle cx="172" cy="20" r="14" fill="rgba(255,180,50,0.06)" />
        <rect x="52" y="82" width="96" height="34" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <rect x="57" y="70" width="86" height="15" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <rect x="66" y="50" width="5" height="21" fill="rgba(255,255,255,0.1)" />
        <rect x="82" y="46" width="5" height="25" fill="rgba(255,255,255,0.1)" />
        <rect x="98" y="50" width="5" height="21" fill="rgba(255,255,255,0.1)" />
        <rect x="114" y="48" width="5" height="23" fill="rgba(255,255,255,0.1)" />
        <ellipse cx="68" cy="48" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)" />
        <ellipse cx="68" cy="45" rx="2" ry="4" fill="rgba(255,240,150,0.9)" />
        <ellipse cx="84" cy="44" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)" />
        <ellipse cx="84" cy="41" rx="2" ry="4" fill="rgba(255,240,150,0.9)" />
        <ellipse cx="100" cy="48" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)" />
        <ellipse cx="100" cy="45" rx="2" ry="4" fill="rgba(255,240,150,0.9)" />
        <ellipse cx="116" cy="46" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)" />
        <ellipse cx="116" cy="43" rx="2" ry="4" fill="rgba(255,240,150,0.9)" />
        <circle cx="68" cy="48" r="10" fill="rgba(255,180,30,0.07)" />
        <circle cx="84" cy="44" r="10" fill="rgba(255,180,30,0.07)" />
        <circle cx="100" cy="48" r="10" fill="rgba(255,180,30,0.07)" />
        <circle cx="116" cy="46" r="10" fill="rgba(255,180,30,0.07)" />
      </svg>
    ),
  },
  {
    name: 'NYE 2027',
    photos: 89,
    people: 22,
    color: 'pink',
    icon: (
      <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050510" />
            <stop offset="100%" stopColor="#0a0a22" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#g6)" />
        <rect x="16" y="50" width="16" height="70" fill="rgba(255,200,50,0.1)" />
        <rect x="44" y="34" width="20" height="86" fill="rgba(255,200,50,0.08)" />
        <rect x="76" y="20" width="26" height="100" fill="rgba(255,200,50,0.07)" />
        <rect x="118" y="38" width="18" height="82" fill="rgba(255,200,50,0.09)" />
        <rect x="150" y="46" width="16" height="74" fill="rgba(255,200,50,0.1)" />
        <rect x="18" y="52" width="3" height="3" fill="rgba(255,220,100,0.5)" />
        <rect x="46" y="36" width="3" height="3" fill="rgba(255,220,100,0.45)" />
        <rect x="78" y="22" width="3.5" height="3.5" fill="rgba(255,220,100,0.4)" />
        <rect x="86" y="34" width="3" height="3" fill="rgba(255,220,100,0.35)" />
        <rect x="120" y="40" width="3" height="3" fill="rgba(255,220,100,0.45)" />
        <rect x="152" y="48" width="3" height="3" fill="rgba(255,220,100,0.4)" />
        <circle cx="38" cy="12" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="100" cy="8" r="2" fill="rgba(255,255,255,0.5)" />
        <circle cx="160" cy="14" r="1.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="185" cy="8" r="1" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
  },
];

export default sampleEvents;