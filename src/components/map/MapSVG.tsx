import { forwardRef } from 'react';

interface MapSVGProps {
  /** Stop markers and truck marker rendered by RouteMap */
  children?: React.ReactNode;
}

/**
 * MapSVG — illustrated background of the route map.
 *
 * viewBox: 1400 × 1044
 *
 * The ref is forwarded to the route <path> element so RouteMap can call
 * pathEl.getTotalLength() and pathEl.getPointAtLength() for truck positioning.
 *
 * Route path (matches stop coordinates below):
 * M1090 248 → Mineral Point, WI
 * → Dubuque, IA → Cedar Rapids, IA → Des Moines, IA
 * → Kansas City, MO → Topeka, KS → Manhattan, KS → Salina, KS (456, 838)
 */
const MapSVG = forwardRef<SVGPathElement, MapSVGProps>(function MapSVG(
  { children },
  routePathRef,
) {
  const routeD =
    'M1090 248L1018 346L950 414L782 414L748 465L748 585L708 633L662 725L564 812L456 838';

  return (
    <svg
      viewBox="0 0 1400 1044"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustrated Shark Tunnel Tracker route map from Mineral Point to Salina, Kansas"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id="landLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ead7b8" />
          <stop offset="100%" stopColor="#efe1b4" />
        </linearGradient>
        <linearGradient id="landRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cce4a4" />
          <stop offset="100%" stopColor="#bad88f" />
        </linearGradient>
        <linearGradient id="routeFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3c8fd2" />
          <stop offset="100%" stopColor="#2e73b7" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#25342e" floodOpacity="0.18" />
        </filter>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#25342e" floodOpacity="0.12" />
        </filter>
      </defs>

      <rect width="1400" height="1044" fill="url(#landRight)" />
      <rect x="0" y="0" width="460" height="1044" fill="url(#landLeft)" opacity="0.95" />
      <rect x="460" y="0" width="940" height="1044" fill="url(#landRight)" opacity="0.9" />

      <g id="state-lines" stroke="#444" strokeOpacity="0.45" strokeWidth="2" fill="none">
        <line x1="460" y1="0" x2="460" y2="1044" />
        <line x1="0" y1="340" x2="1400" y2="340" />
        <line x1="0" y1="594" x2="1400" y2="594" />
        <line x1="707" y1="0" x2="707" y2="1044" opacity="0.35" />
        <line x1="1006" y1="0" x2="1006" y2="1044" opacity="0.28" />
      </g>

      <g id="rivers" fill="none" strokeLinecap="round">
        <path d="M1013 0C1010 53 1020 112 1002 170C988 216 960 260 965 319C970 380 959 437 944 494C933 539 927 587 933 653C939 715 924 780 889 850" stroke="#63b6d7" strokeWidth="7" />
        <path d="M1013 0C1010 53 1020 112 1002 170C988 216 960 260 965 319C970 380 959 437 944 494C933 539 927 587 933 653C939 715 924 780 889 850" stroke="#d9f7ff" strokeWidth="2.3" opacity="0.75" />
        <path d="M95 0C120 35 145 66 160 106C178 154 181 210 152 253C124 294 95 321 78 357" stroke="#63b6d7" strokeWidth="5" opacity="0.75" />
      </g>

      <g id="background-roads" stroke="#6f8d97" strokeOpacity="0.5" strokeWidth="2" fill="none">
        <path d="M1045 248C1135 248 1210 246 1296 245" />
        <path d="M1005 345C1122 345 1230 344 1380 345" />
        <path d="M950 414C1086 414 1200 414 1390 414" />
        <path d="M745 465C850 465 920 465 1003 465" />
        <path d="M708 633C806 634 886 636 980 636" />
        <path d="M454 838C544 838 620 836 708 834" />
        <path d="M460 808C412 808 365 808 315 808" />
      </g>

      <g id="terrain" opacity="0.95">
        <g fill="#618d46" stroke="#38532b" strokeWidth="2">
          <path d="M1100 120C1130 88 1188 78 1229 97C1262 112 1289 143 1306 171C1268 167 1226 176 1191 171C1149 165 1122 146 1100 120Z" />
          <path d="M1164 179C1201 155 1248 154 1288 176C1238 188 1201 196 1164 179Z" />
          <path d="M1040 889C1088 848 1150 851 1203 888C1135 900 1090 905 1040 889Z" />
          <path d="M1170 926C1214 892 1275 897 1333 929C1260 938 1217 941 1170 926Z" />
          <path d="M905 862C946 832 997 833 1047 862C987 874 948 876 905 862Z" />
        </g>

        <g fill="#6d9c50" stroke="#426234" strokeWidth="2">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={`trees-top-${i}`} transform={`translate(${1035 + i * 36} ${70 + (i % 2) * 8})`}>
              <path d="M0 28L14 0L28 28Z" />
              <path d="M4 18L14 2L24 18Z" fill="#7cad5a" stroke="none" />
              <rect x="12" y="28" width="4" height="16" fill="#765537" stroke="none" />
            </g>
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={`trees-right-${i}`} transform={`translate(${1234 + i * 28} ${114 + (i % 3) * 6})`}>
              <path d="M0 24L12 0L24 24Z" />
              <rect x="10" y="24" width="4" height="12" fill="#765537" stroke="none" />
            </g>
          ))}
        </g>

        <g fill="#7a9f46" stroke="#4e6d31" strokeWidth="2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <path
              key={`grass-left-${i}`}
              d={`M${18 + i * 58} ${337 + (i % 3) * 118}c4-16 8-22 14-34m-2 34c2-14 2-22 0-36m2 36c6-14 12-22 22-32`}
              fill="none"
            />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path
              key={`grass-kansas-${i}`}
              d={`M${55 + i * 92} ${880 + (i % 3) * 74}c4-16 8-22 14-34m-2 34c2-14 2-22 0-36m2 36c6-14 12-22 22-32`}
              fill="none"
            />
          ))}
        </g>
      </g>

      <g id="cornfields" transform="translate(575 510)" fill="none" stroke="#5d7d2f" strokeWidth="3" strokeLinecap="round">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <g key={`corn-1-${i}`} transform={`translate(${i * 42} 0)`}>
            <path d="M14 0V72" />
            <path d="M14 24C0 30 0 48 14 54" />
            <path d="M14 20C28 26 28 44 14 50" />
            <path d="M10 -2L14 -12L18 -2" stroke="#d3b24b" />
          </g>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`corn-2-${i}`} transform={`translate(${310 + i * 42} 2)`}>
            <path d="M14 0V72" />
            <path d="M14 24C0 30 0 48 14 54" />
            <path d="M14 20C28 26 28 44 14 50" />
            <path d="M10 -2L14 -12L18 -2" stroke="#d3b24b" />
          </g>
        ))}
      </g>

      <g id="state-labels" fill="#1e1e1e" style={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 700 }}>
        <text x="46" y="86" fontSize="28">SOUTH</text>
        <text x="34" y="118" fontSize="28">DAKOTA</text>
        <text x="550" y="64" fontSize="24">MINNESOTA</text>
        <text x="1120" y="42" fontSize="24">WISCONSIN</text>
        <text x="112" y="484" fontSize="24">NEBRASKA</text>
        <text x="742" y="416" fontSize="24">IOWA</text>
        <text x="1120" y="650" fontSize="24">ILLINOIS</text>
        <text x="810" y="904" fontSize="24">MISSOURI</text>
        <text x="226" y="876" fontSize="24">KANSAS</text>
        <text x="474" y="108" fontSize="10" opacity="0.7">Rochester</text>
        <text x="433" y="200" fontSize="10" opacity="0.7">Sioux Falls</text>
        <text x="437" y="341" fontSize="10" opacity="0.7">Sioux City</text>
        <text x="513" y="512" fontSize="10" opacity="0.7">Omaha</text>
        <text x="1077" y="270" fontSize="10" opacity="0.7">Madison</text>
        <text x="1116" y="367" fontSize="10" opacity="0.7">Rockford</text>
        <text x="1180" y="430" fontSize="10" opacity="0.7">Chicago</text>
        <text x="1108" y="594" fontSize="10" opacity="0.7">Peoria</text>
        <text x="1140" y="838" fontSize="10" opacity="0.7">St. Louis</text>
      </g>

      <g id="route" filter="url(#softShadow)">
        <path
          d={routeD}
          stroke="#17304a"
          strokeWidth="17"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d={routeD}
          stroke="url(#routeFill)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Ghost path — ref target for getPointAtLength() */}
        <path
          ref={routePathRef}
          d={routeD}
          stroke="transparent"
          strokeWidth="1"
          fill="none"
        />
      </g>

      <g id="landmarks" filter="url(#shadow)">
        <g id="start-house" transform="translate(1045 214)">
          <rect x="0" y="22" width="38" height="28" rx="2" fill="#f5e6ca" stroke="#7e4f2c" strokeWidth="2" />
          <path d="M-4 24L18 8L42 24" fill="#d3693f" stroke="#7e4f2c" strokeWidth="2" />
          <rect x="13" y="32" width="8" height="18" fill="#7cc6e8" stroke="#7e4f2c" strokeWidth="2" />
          <rect x="27" y="30" width="7" height="20" fill="#7cc6e8" stroke="#7e4f2c" strokeWidth="2" />
          <ellipse cx="49" cy="6" rx="24" ry="18" fill="#e8f1f6" stroke="#4a4a4a" strokeWidth="2" />
          <text x="35" y="11" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: 12, fontWeight: 700, fill: '#333' }}>START</text>
        </g>

        <g id="boat" transform="translate(892 292)">
          <path d="M0 22H54L46 36H12Z" fill="#b44b3f" stroke="#4d3025" strokeWidth="2" />
          <rect x="16" y="8" width="20" height="12" fill="#f2e6c8" stroke="#4d3025" strokeWidth="2" />
          <rect x="20" y="0" width="8" height="10" fill="#f2e6c8" stroke="#4d3025" strokeWidth="2" />
          <line x1="40" y1="4" x2="40" y2="22" stroke="#4d3025" strokeWidth="2" />
          <path d="M40 8c7-6 11-6 18 0" fill="none" stroke="#d7d7d7" strokeWidth="3" strokeLinecap="round" />
          <circle cx="18" cy="28" r="2.5" fill="#fff" />
          <circle cx="30" cy="28" r="2.5" fill="#fff" />
        </g>

        <g id="silo" transform="translate(872 334)">
          <rect x="0" y="0" width="24" height="50" rx="12" fill="#d6d8d8" stroke="#6b6d6e" strokeWidth="2" />
          <path d="M0 12H24" stroke="#b7b9bb" strokeWidth="2" />
          <path d="M32 50L40 24L48 50" fill="#e8c96a" stroke="#8e7a38" strokeWidth="2" />
          <circle cx="63" cy="40" r="10" fill="#90ba69" stroke="#5b7b42" strokeWidth="2" />
          <circle cx="80" cy="40" r="10" fill="#90ba69" stroke="#5b7b42" strokeWidth="2" />
        </g>

        <g id="des-moines-capitol" transform="translate(658 404)">
          <rect x="0" y="28" width="52" height="24" fill="#f2e9d5" stroke="#555" strokeWidth="2" />
          <rect x="16" y="12" width="20" height="18" fill="#f2e9d5" stroke="#555" strokeWidth="2" />
          <path d="M26 0C33 0 39 6 39 14C39 21 33 27 26 27C19 27 13 21 13 14C13 6 19 0 26 0Z" fill="#d8d8d8" stroke="#555" strokeWidth="2" />
          <path d="M6 52H46" stroke="#555" strokeWidth="2" />
        </g>

        <g id="hiker" transform="translate(635 542)">
          <circle cx="18" cy="18" r="15" fill="#f4c89f" stroke="#4a362a" strokeWidth="2" />
          <path d="M2 70L18 34L36 68" fill="#d8a057" stroke="#4a362a" strokeWidth="2" />
          <path d="M18 36V72" stroke="#4a362a" strokeWidth="3" />
          <path d="M18 48L3 58" stroke="#4a362a" strokeWidth="3" />
          <path d="M18 50L34 43" stroke="#4a362a" strokeWidth="3" />
          <path d="M18 72L6 92" stroke="#4a362a" strokeWidth="3" />
          <path d="M18 72L31 92" stroke="#4a362a" strokeWidth="3" />
          <rect x="4" y="38" width="10" height="18" rx="3" fill="#6582b8" stroke="#4a362a" strokeWidth="2" />
          <path d="M2 12C8 2 27 0 34 10" fill="#9b6b36" stroke="#4a362a" strokeWidth="2" />
        </g>

        <g id="kansas-city-skyline" transform="translate(748 752)">
          <rect x="0" y="24" width="14" height="40" fill="#7ea0d3" stroke="#42516a" strokeWidth="2" />
          <rect x="20" y="10" width="17" height="54" fill="#9bb7df" stroke="#42516a" strokeWidth="2" />
          <rect x="42" y="18" width="15" height="46" fill="#e5a655" stroke="#42516a" strokeWidth="2" />
          <rect x="62" y="0" width="16" height="64" fill="#6b8ec0" stroke="#42516a" strokeWidth="2" />
          <rect x="84" y="16" width="14" height="48" fill="#8eb0e0" stroke="#42516a" strokeWidth="2" />
          <rect x="104" y="28" width="14" height="36" fill="#d28d56" stroke="#42516a" strokeWidth="2" />
        </g>

        <g id="bbq" transform="translate(687 804)">
          <ellipse cx="20" cy="12" rx="20" ry="12" fill="#7f2f22" stroke="#3f1a15" strokeWidth="2" />
          <text x="7" y="16" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: 10, fontWeight: 700, fill: '#f0d7a7' }}>BBQ</text>
          <path d="M8 24L4 44M32 24L36 44" stroke="#3f1a15" strokeWidth="3" />
          <path d="M18 -10c-4-8 4-10 0-18M26 -8c-4-8 4-10 0-18" stroke="#a9a9a9" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g id="camera" transform="translate(450 780)">
          <rect x="0" y="10" width="44" height="28" rx="4" fill="#d49361" stroke="#4a362a" strokeWidth="2" />
          <rect x="8" y="0" width="12" height="10" rx="2" fill="#6f7f90" stroke="#4a362a" strokeWidth="2" />
          <circle cx="24" cy="24" r="8" fill="#7cc6e8" stroke="#4a362a" strokeWidth="2" />
        </g>

        <g id="finish-flag" transform="translate(300 734)">
          <line x1="0" y1="0" x2="0" y2="86" stroke="#333" strokeWidth="4" />
          <path d="M0 0L54 12L54 44L0 30Z" fill="#2d2d2d" stroke="#333" strokeWidth="2" />
          <text x="9" y="32" transform="rotate(-11 9 32)" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: 12, fontWeight: 800, fill: '#fff' }}>FINISH</text>
        </g>
      </g>

      {/* Stop markers + truck — rendered by RouteMap as children */}
      {children}
    </svg>
  );
});

export { MapSVG };
