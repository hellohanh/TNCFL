import { getF1CarColors } from '../lib/f1CarColors'

interface F1CarProps {
  managerColor: string
  initial: string
}

// Base geometry ported directly from the old hub's real f1CarSVG() function
// (TNCFL_hub.html) — same tire/side-pod/body-wedge/wingtip/stripe/rear-wing
// path and rect coordinates, in its original horizontal (nose-right)
// orientation, since that's the orientation cars actually race in along the
// bump chart's roughly-horizontal path. Renders as a <g> with no outer
// transform, so a parent can position/scale/rotate it along a race path
// (offset-path + offset-rotate, the same technique used for the hero
// sparkline's spiral pass) without this component needing to know about
// racing at all.
//
// Locked with the user after comparing options: colors are manager-color
// body + 65%-darker accents (not a complementary hue). The number badge
// (white circle + a black capital initial) is fixed at (13, 5), diameter
// 1.8, letter size 3, rotated 270deg — the letter is centered via
// text-anchor/dominant-baseline at that same point, which adapts to each
// letter's own glyph metrics rather than a hardcoded per-letter offset.
export default function F1Car({ managerColor, initial }: F1CarProps) {
  const { primary, dark } = getF1CarColors(managerColor)

  return (
    <g>
      <rect x="2.6" y="-0.8" width="3.8" height="2.7" rx="1.1" fill="#33333a" stroke="#6a6a74" strokeWidth="0.45" />
      <rect x="2.6" y="8.1" width="3.8" height="2.7" rx="1.1" fill="#33333a" stroke="#6a6a74" strokeWidth="0.45" />
      <rect x="11.4" y="-0.4" width="3.2" height="2.5" rx="1.0" fill="#33333a" stroke="#6a6a74" strokeWidth="0.45" />
      <rect x="11.4" y="7.9" width="3.2" height="2.5" rx="1.0" fill="#33333a" stroke="#6a6a74" strokeWidth="0.45" />
      <rect x="0" y="1.2" width="2.6" height="7.6" rx="0.6" fill={dark} />
      <path d="M2.4 3.6 L12.8 2.2 Q15 2.2 16.8 5 Q15 7.8 12.8 7.8 L2.4 6.4 Z" fill={primary} />
      <path d="M16.8 5 L19 4.3 Q19.8 5 19 5.7 Z" fill={dark} />
      <path d="M5 3.9 L12 3 L12 3.9 L5 4.6 Z" fill={dark} opacity="0.9" />
      <ellipse cx="8.6" cy="5" rx="2.1" ry="1.25" fill="#15151a" />
      <ellipse cx="8.6" cy="5" rx="1.0" ry="0.7" fill="rgba(255,255,255,0.18)" />
      <rect x="15.4" y="2.6" width="2.3" height="4.8" rx="0.6" fill={dark} />
      <circle cx="13" cy="5" r="1.8" fill="#fff" />
      <text
        x="13"
        y="5"
        fontSize="3"
        fontWeight="900"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#000"
        transform="rotate(270 13 5)"
      >
        {initial}
      </text>
    </g>
  )
}
