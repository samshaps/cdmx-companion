import { useEffect } from 'react'
import { DEFAULT_SKIN, skinCssVars } from '../../shared/skins'

// Dresses the whole page in a skin (or the original colors for null) for
// as long as the calling screen is shown.
export function useSkin(skin) {
  const key = skin ? `${skin.primary}${skin.accent}${skin.highlight}` : ''
  useEffect(() => {
    const root = document.documentElement
    const apply = (s) => {
      for (const [name, value] of Object.entries(skinCssVars(s))) root.style.setProperty(name, value)
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', (s || DEFAULT_SKIN).primary)
    }
    apply(skin)
    return () => apply(null)
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps -- key captures the skin's colors
}
