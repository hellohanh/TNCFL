// The one phone breakpoint, shared by every JS check. Must match the CSS
// media queries: @media (max-width: 820px), (pointer: coarse) and (max-width: 1199px)
// Entry 120 (Hanh): touch screens up to 1199px wide (Galaxy Z Fold 8 opened,
// ~880 portrait / ~1170 landscape) get the phone layout too. Mouse/trackpad
// screens keep the desktop layout above 820px.
export const PHONE_QUERY = '(max-width: 820px), (pointer: coarse) and (max-width: 1199px)'
// Flipped (sideways) panels stay phone-only (<=820px): the opened Fold is
// already wider than a phone turned sideways, so its panels stay upright and
// wide tables swipe inside their panel.
export const PHONE_UPRIGHT_QUERY =
  '(max-width: 820px) and (orientation: portrait)'
