import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function ViewCount({ slug }) {
  const [views,  setViews]  = useState(null)
  const counted = useRef(false)

  useEffect(() => {
    if (counted.current) return
    counted.current = true

    supabase.rpc('increment_views', { post_slug: slug })
      .then(({ data }) => { if (data != null) setViews(data) })
  }, [slug])

  if (views === null) return null

  return (
    <span className="text-xs text-hp-muted">
      {views.toLocaleString()} {views === 1 ? 'view' : 'views'}
    </span>
  )
}
