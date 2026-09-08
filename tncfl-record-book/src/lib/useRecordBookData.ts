import { useEffect, useState } from 'react'
import type { RecordBookData } from '../types/data'

// This is the same useState + useEffect data-fetching shape Wanderlog used for
// loading trips from Supabase — just pointed at a static JSON file instead of
// a database call. Three states any fetch needs: "still loading", "it
// failed", and "here's the data" — a component using this hook has to
// explicitly handle all three, which is exactly the point.
//
// This is also the first CUSTOM hook in this project (a plain function whose
// name starts with `use`, that itself calls other hooks). The rule of thumb:
// once two or more components would need the same "fetch + loading + error"
// logic, pull it out into a hook like this rather than copy-pasting the
// useState/useEffect pair into every component.
interface RecordBookDataState {
  data: RecordBookData | null
  loading: boolean
  error: string | null
}

export function useRecordBookData(): RecordBookDataState {
  const [data, setData] = useState<RecordBookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Vite serves anything in /public at the site root — but "site root" means
    // relative to the configured `base` (import.meta.env.BASE_URL), not always
    // literally "/". A hardcoded '/site_data.json' works when base is '/' (dev
    // server, or a username.github.io root repo) but 404s once deployed under a
    // subpath like this repo's real '/TNCFL/' — caught via a real headless-browser
    // check against a `vite preview` build with base set, not assumed safe.
    // Uses string concatenation, not a template literal — verified empirically
    // that BASE_URL doesn't reliably substitute inside a `${...}` template
    // literal in this build setup (produced a literal unprefixed '/site_data.json'
    // even with base set correctly elsewhere), while plain '+' concatenation works.
    fetch(import.meta.env.BASE_URL + 'site_data.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch site_data.json: ${res.status}`)
        }
        return res.json()
      })
      .then((json: RecordBookData) => {
        setData(json)
        setLoading(false)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unknown error loading data')
        setLoading(false)
      })
  }, []) // empty dependency array = run once, on mount — never re-fetch on re-render

  return { data, loading, error }
}
