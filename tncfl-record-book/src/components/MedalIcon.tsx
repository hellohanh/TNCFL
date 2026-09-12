import { useEffect, useRef } from 'react'

type MedalType = 'gold' | 'silver' | 'bronze' | 'nickel'

const COLORS: Record<MedalType, { face: string; mid: string; edge: string; shine: string; shadow: string }> = {
  gold: { face: '#F5C842', mid: '#D4A017', edge: '#9A6800', shine: '#FFF0A0', shadow: '#7A5000' },
  silver: { face: '#ECECEC', mid: '#C0C0C0', edge: '#707070', shine: '#FFFFFF', shadow: '#404040' },
  bronze: { face: '#E8A96A', mid: '#CD7F32', edge: '#7A4010', shine: '#F8D090', shadow: '#5A2C00' },
  nickel: { face: '#9A9A9A', mid: '#686868', edge: '#303030', shine: '#C8C8C8', shadow: '#181818' },
}
const RIBBON = { a: '#FF4444', b: '#CC1111', c: '#E82222' }
const NUMBERS: Record<MedalType, string> = { gold: '1', silver: '2', bronze: '3', nickel: '4' }

// Ported line-for-line from the old hub's real sumDrawMedal() — a ribbon
// (two gradient triangles) above a 3D-shaded disc (radial gradients for the
// edge bevel, face, and specular highlight) with the finish number stamped
// on it. Not simplified to a flat icon — this is a real, distinctive visual
// asset in the hub, per the "build exactly like the hub" call for this
// milestone.
export default function MedalIcon({ type, size = 18 }: { type: MedalType; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const DPR = window.devicePixelRatio || 1
    const SIZE = size
    const DISC_R = SIZE * 0.36
    const cx = SIZE / 2
    const DISC_Y = SIZE * 0.72
    const discTopY = DISC_Y - DISC_R
    const RW = SIZE * 0.44
    const TOTAL_H = Math.ceil(DISC_Y + DISC_R + 3)
    canvas.width = SIZE * DPR
    canvas.height = TOTAL_H * DPR
    canvas.style.width = SIZE + 'px'
    canvas.style.height = TOTAL_H + 'px'
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(DPR, DPR)
    ctx.clearRect(0, 0, SIZE, TOTAL_H)
    const m = COLORS[type]
    if (!m) return

    const lG = ctx.createLinearGradient(cx - RW, 0, cx, 0)
    lG.addColorStop(0, RIBBON.a)
    lG.addColorStop(0.5, RIBBON.c)
    lG.addColorStop(1, RIBBON.b)
    ctx.beginPath()
    ctx.moveTo(cx - RW, 0)
    ctx.lineTo(cx, 0)
    ctx.lineTo(cx, discTopY)
    ctx.closePath()
    ctx.fillStyle = lG
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx - RW, 0)
    ctx.lineTo(cx, 0)
    ctx.lineTo(cx, 3)
    ctx.lineTo(cx - RW, 3)
    ctx.closePath()
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.fill()

    const rG = ctx.createLinearGradient(cx, 0, cx + RW, 0)
    rG.addColorStop(0, RIBBON.b)
    rG.addColorStop(0.5, RIBBON.c)
    rG.addColorStop(1, RIBBON.a)
    ctx.beginPath()
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx + RW, 0)
    ctx.lineTo(cx, discTopY)
    ctx.closePath()
    ctx.fillStyle = rG
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx + RW, 0)
    ctx.lineTo(cx + RW, 3)
    ctx.lineTo(cx, 3)
    ctx.closePath()
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, discTopY)
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    ctx.lineWidth = 0.8
    ctx.stroke()

    ctx.save()
    ctx.filter = 'blur(3px)'
    ctx.beginPath()
    ctx.arc(cx + 1, DISC_Y + 2, DISC_R, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ctx.fill()
    ctx.filter = 'none'
    ctx.restore()

    const eg = ctx.createRadialGradient(cx - DISC_R * 0.35, DISC_Y - DISC_R * 0.35, 1, cx, DISC_Y, DISC_R)
    eg.addColorStop(0, m.mid)
    eg.addColorStop(0.65, m.edge)
    eg.addColorStop(1, m.shadow)
    ctx.beginPath()
    ctx.arc(cx, DISC_Y, DISC_R, 0, Math.PI * 2)
    ctx.fillStyle = eg
    ctx.fill()

    const fg = ctx.createRadialGradient(cx - DISC_R * 0.3, DISC_Y - DISC_R * 0.3, 1, cx, DISC_Y, DISC_R * 0.9)
    fg.addColorStop(0, m.shine)
    fg.addColorStop(0.28, m.face)
    fg.addColorStop(0.72, m.mid)
    fg.addColorStop(1, m.edge)
    ctx.beginPath()
    ctx.arc(cx, DISC_Y, DISC_R * 0.84, 0, Math.PI * 2)
    ctx.fillStyle = fg
    ctx.fill()

    ctx.beginPath()
    ctx.arc(cx, DISC_Y, DISC_R * 0.68, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    ctx.lineWidth = 0.8
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, DISC_Y, DISC_R * 0.67, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 0.5
    ctx.stroke()

    const hg = ctx.createRadialGradient(
      cx - DISC_R * 0.35,
      DISC_Y - DISC_R * 0.35,
      0,
      cx - DISC_R * 0.18,
      DISC_Y - DISC_R * 0.18,
      DISC_R * 0.52,
    )
    hg.addColorStop(0, 'rgba(255,255,255,0.45)')
    hg.addColorStop(0.5, 'rgba(255,255,255,0.12)')
    hg.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.beginPath()
    ctx.arc(cx, DISC_Y, DISC_R * 0.82, 0, Math.PI * 2)
    ctx.fillStyle = hg
    ctx.fill()

    const fs = Math.max(8, Math.round(DISC_R * 0.78))
    ctx.font = `bold ${fs}px Arial,sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.fillText(NUMBERS[type], cx + 0.5, DISC_Y + 1)
    ctx.fillStyle = m.edge
    ctx.fillText(NUMBERS[type], cx, DISC_Y)
  }, [type, size])

  return <canvas ref={ref} style={{ display: 'block' }} />
}
