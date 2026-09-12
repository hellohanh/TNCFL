import type { Recap } from '../types/data'
import styles from './RecapBody.module.css'

interface RecapBodyProps {
  recap: Recap
}

// The recap's body is HAND-WRITTEN PROSE, authored with real inline HTML
// (<b> for emphasis) already baked into the strings — e.g. "Bao <b>seized
// first place</b> in Week 9". `dangerouslySetInnerHTML` is React's escape
// hatch for rendering a string AS markup instead of as literal escaped text
// (which is React's default — normally `{someString}` would print the
// literal characters "<b>" rather than making it bold). It's named
// "dangerous" because doing this with user-submitted content would be a
// real security hole (XSS) — but this content is the project's own trusted,
// hand-authored data file, not something a visitor typed in, so it's safe
// here. Never reach for this with anything that came from a user input.
export default function RecapBody({ recap }: RecapBodyProps) {
  return (
    <div className={styles.body}>
      {recap.body.map((paragraph, i) => (
        <p key={i} className={styles.paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </div>
  )
}
