import { useEffect, useState } from 'react'

// Hash-adressen (#/projecten/waterfilter?klas=1) werken op GitHub Pages zonder serverinstellingen.
function lees() {
  const h = window.location.hash.replace(/^#\/?/, '')
  const [pad, zoek = ''] = h.split('?')
  return {
    delen: pad.split('/').filter(Boolean).map(decodeURIComponent),
    query: Object.fromEntries(new URLSearchParams(zoek)),
  }
}

export function useRoute() {
  const [route, setRoute] = useState(lees)
  useEffect(() => {
    const bij = () => { setRoute(lees()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', bij)
    return () => window.removeEventListener('hashchange', bij)
  }, [])
  return route
}

export function ga(pad) {
  window.location.hash = pad.startsWith('#') ? pad : '#' + pad
}

export const href = (pad) => '#' + pad
