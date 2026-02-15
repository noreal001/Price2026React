import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

const T = {
  coal:{bg:'#18181a',text:'#e8e8ec',cBg:'#111113',pP:'#0c0c0f',pM:'#17171c',pN:'#222230',pS:'#1a1a22',brd:'rgba(255,255,255,0.06)',dim:'#505060',hBg:'#1c1c22',sBg:'rgba(18,18,20,0.96)',seBg:'#0a0a0e',seA:'#e8e8ec',seT:'#3e3e4c',seTA:'#0a0a0c',bBg:'rgba(255,255,255,0.04)',bBrd:'rgba(255,255,255,0.08)',lBg:'rgba(255,255,255,0.05)',lBrd:'rgba(255,255,255,0.12)',aura:'#fff',panBg:'#141416',gBase:'rgba(255,255,255,0.06)',gBrd:'rgba(255,255,255,0.12)',gShine:'rgba(255,255,255,0.15)'},
  night:{bg:'#09090d',text:'#d8d8e2',cBg:'#06060a',pP:'#04040a',pM:'#0a0a14',pN:'#10101e',pS:'#0c0c16',brd:'rgba(255,255,255,0.08)',dim:'#3c3c50',hBg:'#0e0e16',sBg:'rgba(6,6,10,0.96)',seBg:'#040408',seA:'#d8d8e2',seT:'#2e2e42',seTA:'#040408',bBg:'rgba(255,255,255,0.05)',bBrd:'rgba(255,255,255,0.1)',lBg:'rgba(255,255,255,0.04)',lBrd:'rgba(255,255,255,0.1)',aura:'#e0e0f0',panBg:'#0a0a10',gBase:'rgba(255,255,255,0.05)',gBrd:'rgba(255,255,255,0.1)',gShine:'rgba(255,255,255,0.12)'},
  graphite:{bg:'#1e1e22',text:'#e2e2e8',cBg:'#161618',pP:'#101014',pM:'#1a1a20',pN:'#24242c',pS:'#1c1c24',brd:'rgba(255,255,255,0.07)',dim:'#54545e',hBg:'#222228',sBg:'rgba(22,22,24,0.96)',seBg:'#0c0c10',seA:'#e2e2e8',seT:'#404048',seTA:'#0c0c0e',bBg:'rgba(255,255,255,0.05)',bBrd:'rgba(255,255,255,0.09)',lBg:'rgba(255,255,255,0.05)',lBrd:'rgba(255,255,255,0.12)',aura:'#fff',panBg:'#18181c',gBase:'rgba(255,255,255,0.06)',gBrd:'rgba(255,255,255,0.1)',gShine:'rgba(255,255,255,0.14)'},
  marble:{bg:'#282830',text:'#f0f0f6',cBg:'#1c1c24',pP:'#161620',pM:'#202030',pN:'#2a2a3c',pS:'#22222e',brd:'rgba(255,255,255,0.1)',dim:'#606070',hBg:'#2a2a34',sBg:'rgba(28,28,36,0.96)',seBg:'#121218',seA:'#f0f0f6',seT:'#48485a',seTA:'#0e0e12',bBg:'rgba(255,255,255,0.06)',bBrd:'rgba(255,255,255,0.12)',lBg:'rgba(255,255,255,0.06)',lBrd:'rgba(255,255,255,0.14)',aura:'#fff',panBg:'#202028',gBase:'rgba(255,255,255,0.07)',gBrd:'rgba(255,255,255,0.14)',gShine:'rgba(255,255,255,0.18)'},
  obsidian:{bg:'#0c0c0e',text:'#d0d0da',cBg:'#070709',pP:'#05050a',pM:'#0e0e14',pN:'#16161e',pS:'#0e0e16',brd:'rgba(255,255,255,0.09)',dim:'#3a3a4e',hBg:'#101016',sBg:'rgba(7,7,9,0.96)',seBg:'#050508',seA:'#d0d0da',seT:'#2c2c3e',seTA:'#050508',bBg:'rgba(255,255,255,0.05)',bBrd:'rgba(255,255,255,0.1)',lBg:'rgba(255,255,255,0.04)',lBrd:'rgba(255,255,255,0.1)',aura:'#c8c8d8',panBg:'#0a0a0c',gBase:'rgba(255,255,255,0.04)',gBrd:'rgba(255,255,255,0.09)',gShine:'rgba(255,255,255,0.1)'},
  cloud:{bg:'#f2f2f6',text:'#111116',cBg:'#fafafe',pP:'#e2e2ee',pM:'#eaeaf4',pN:'#f2f2fa',pS:'#e6e6f0',brd:'rgba(0,0,0,0.06)',dim:'#9a9aac',hBg:'#eeeef6',sBg:'rgba(242,242,246,0.96)',seBg:'#d4d4e2',seA:'#111116',seT:'#9999aa',seTA:'#fafafe',bBg:'rgba(0,0,0,0.04)',bBrd:'rgba(0,0,0,0.08)',lBg:'rgba(0,0,0,0.03)',lBrd:'rgba(0,0,0,0.08)',aura:'#111',panBg:'#f8f8fc',gBase:'rgba(255,255,255,0.6)',gBrd:'rgba(0,0,0,0.08)',gShine:'rgba(255,255,255,0.9)'},
  pearl:{bg:'#f6f6f8',text:'#0e0e14',cBg:'#fcfcfe',pP:'#e4e4f0',pM:'#ececf6',pN:'#f4f4fc',pS:'#e8e8f2',brd:'rgba(0,0,0,0.055)',dim:'#a0a0b4',hBg:'#f0f0f8',sBg:'rgba(246,246,248,0.96)',seBg:'#d8d8e6',seA:'#0e0e14',seT:'#9999aa',seTA:'#fcfcfe',bBg:'rgba(0,0,0,0.035)',bBrd:'rgba(0,0,0,0.07)',lBg:'rgba(0,0,0,0.025)',lBrd:'rgba(0,0,0,0.07)',aura:'#111',panBg:'#fafafc',gBase:'rgba(255,255,255,0.65)',gBrd:'rgba(0,0,0,0.07)',gShine:'rgba(255,255,255,0.92)'},
  snow:{bg:'#ffffff',text:'#0c0c12',cBg:'#fefefe',pP:'#e8e8f4',pM:'#f0f0fa',pN:'#f8f8fe',pS:'#ececf6',brd:'rgba(0,0,0,0.05)',dim:'#b0b0c0',hBg:'#f6f6fc',sBg:'rgba(255,255,255,0.96)',seBg:'#dcdcea',seA:'#0c0c12',seT:'#aaaabc',seTA:'#fefefe',bBg:'rgba(0,0,0,0.03)',bBrd:'rgba(0,0,0,0.06)',lBg:'rgba(0,0,0,0.02)',lBrd:'rgba(0,0,0,0.06)',aura:'#111',panBg:'#fefefe',gBase:'rgba(255,255,255,0.7)',gBrd:'rgba(0,0,0,0.06)',gShine:'rgba(255,255,255,0.95)'},
  linen:{bg:'#fafaf8',text:'#0a0a10',cBg:'#fefefe',pP:'#e6e6f0',pM:'#eeeef6',pN:'#f6f6fc',pS:'#e9e9f2',brd:'rgba(0,0,0,0.055)',dim:'#a8a8b8',hBg:'#f4f4fa',sBg:'rgba(250,250,248,0.96)',seBg:'#d6d6e4',seA:'#0a0a10',seT:'#9999aa',seTA:'#fefefe',bBg:'rgba(0,0,0,0.035)',bBrd:'rgba(0,0,0,0.07)',lBg:'rgba(0,0,0,0.025)',lBrd:'rgba(0,0,0,0.07)',aura:'#111',panBg:'#fcfcfa',gBase:'rgba(255,255,255,0.65)',gBrd:'rgba(0,0,0,0.07)',gShine:'rgba(255,255,255,0.9)'},
  cream:{bg:'#fcfcfc',text:'#0b0b12',cBg:'#fefeff',pP:'#e5e5f2',pM:'#eeeff8',pN:'#f6f7fc',pS:'#eaeaf4',brd:'rgba(0,0,0,0.05)',dim:'#b2b2c0',hBg:'#f5f5fc',sBg:'rgba(252,252,252,0.96)',seBg:'#dadae8',seA:'#0b0b12',seT:'#aaaabc',seTA:'#fefeff',bBg:'rgba(0,0,0,0.03)',bBrd:'rgba(0,0,0,0.06)',lBg:'rgba(0,0,0,0.02)',lBrd:'rgba(0,0,0,0.06)',aura:'#111',panBg:'#fefeff',gBase:'rgba(255,255,255,0.68)',gBrd:'rgba(0,0,0,0.06)',gShine:'rgba(255,255,255,0.93)'}
}

const DARK_IDS = ['coal','night','graphite','marble','obsidian']
const LIGHT_IDS = ['cloud','pearl','snow','linen','cream']
const darkThemes = DARK_IDS.map(id => ({ id, pv: { background: `linear-gradient(135deg,${T[id].bg},${T[id].cBg})` } }))
const lightThemes = LIGHT_IDS.map(id => ({ id, pv: { background: `linear-gradient(135deg,${T[id].bg},${T[id].pP})` } }))

const GENDER_OPTIONS = [{ label: 'ВСЕ', val: 'ВСЕ' }, { label: 'МУЖ', val: 'm' }, { label: 'ЖЕН', val: 'w' }, { label: 'УНИ', val: 'y' }]
const FACTORY_OPTIONS = [{ label: 'ВСЕ', val: 'ВСЕ' }, { label: 'LUZI', val: 'LUZI' }, { label: 'EPS', val: 'EPS' }, { label: 'SELUZ', val: 'SELUZ' }]
const QUALITY_OPTIONS = [{ label: 'ВСЕ', val: 'ВСЕ' }, { label: 'TOP', val: 'TOP' }, { label: 'Q1', val: 'Q1' }, { label: 'Q2', val: 'Q2' }]
const SORT_OPTIONS = [{ label: 'ID', val: 'id' }, { label: 'ЦЕНА', val: 'asc' }, { label: 'ЦЕНА', val: 'desc' }]
const PRICE_LABELS = { p50: '50г', p500: '500г', p1000: '1кг' }
const DATA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtT4zLEY49maKt0VxanZWA2ORKO1h39Mc5wB-XcZclDTmWfroFxQNAPxomg3x0-w/pub?gid=1234145733&single=true&output=csv'

const getSex = g => ({ m: 'МУЖ', w: 'ЖЕН', y: 'УНИ' }[g] || '—')

function parseCSV(data) {
  try {
    return data.split(/\r?\n/).filter(l => l.trim()).map(row => {
      const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(x => x.replace(/^"|"$/g, '').trim())
      if (!c[0] || isNaN(parseInt(c[0])) || !c[2]) return null
      const g = c[4] ? c[4].toLowerCase().trim() : ''
      const fG = (g === 'm' || g === 'м' || g.includes('муж')) ? 'm' : (g === 'w' || g === 'ж' || g.includes('жен')) ? 'w' : (g === 'y' || g === 'у' || g.includes('уни')) ? 'y' : ''
      const st = c[10] ? c[10].trim() : ''
      return {
        id: c[0], link: c[1] || '', brand: c[2] || '', name: c[3] || '',
        gender: fG, factory: c[5] || '', quality: c[6] || '',
        p50: parseInt(c[7]) || 0, p500: parseInt(c[8]) || 0, p1000: parseInt(c[9]) || 0,
        status: st, hasPlus: st.includes('+'), hasStar: st.includes('*'), isOut: st.includes('-'),
        sales6m: parseFloat(c[11]) || 0, salesAll: parseFloat(c[12]) || 0
      }
    }).filter(Boolean)
  } catch { return [] }
}

function calcPopup(el, pw = 280) {
  if (!el) return {}
  const b = el.getBoundingClientRect()
  const vw = window.innerWidth
  if (vw <= 900) return { position: 'fixed', top: (b.bottom + 6) + 'px', left: '12px', width: (vw - 24) + 'px', zIndex: 9999 }
  let l = b.left + b.width / 2 - pw / 2
  if (l + pw > vw - 12) l = vw - pw - 12
  if (l < 12) l = 12
  return { position: 'fixed', top: (b.bottom + 6) + 'px', left: l + 'px', width: pw + 'px', zIndex: 9999 }
}

function Popup({ show, style, pVars, className, children }) {
  if (!show) return null
  return createPortal(
    <div
      className={`popup-teleport ${className || ''}`}
      style={{ ...style, ...pVars, opacity: show ? 1 : 0, transform: show ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(.97)', transition: 'all .18s cubic-bezier(.16,1,.3,1)' }}
    >
      {children}
    </div>,
    document.body
  )
}

export default function App() {
  const [curTheme, setCurTheme] = useState('coal')
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [products, setProducts] = useState([])
  const [showDash, setShowDash] = useState(false)
  const [statsMode, setStatsMode] = useState('6m')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [tempBrandInput, setTempBrandInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPlus, setFilterPlus] = useState(false)
  const [filterStar, setFilterStar] = useState(false)
  const [showOut, setShowOut] = useState(false)
  const [activeGender, setActiveGender] = useState('ВСЕ')
  const [activeQuality, setActiveQuality] = useState('ВСЕ')
  const [activeFactory, setActiveFactory] = useState('ВСЕ')
  const [sortBy, setSortBy] = useState('id')
  const [showPrices, setShowPrices] = useState({ p50: true, p500: true, p1000: true })
  const [autoHighlightId, setAutoHighlightId] = useState(null)

  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showBrandMenu, setShowBrandMenu] = useState(false)
  const [showNewMenu, setShowNewMenu] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [themeMenuStyle, setThemeMenuStyle] = useState({})
  const [brandMenuStyle, setBrandMenuStyle] = useState({})
  const [statusMenuStyle, setStatusMenuStyle] = useState({})
  const [filterMenuStyle, setFilterMenuStyle] = useState({})

  const [thumbTop, setThumbTop] = useState(0)
  const [thumbHeight, setThumbHeight] = useState(10)

  const themeBtnRef = useRef(null)
  const brandBtnRef = useRef(null)
  const statusBtnRef = useRef(null)
  const filterBtnRef = useRef(null)
  const scrollTrackRef = useRef(null)
  const isDraggingRef = useRef(false)
  const hlIntervalRef = useRef(null)

  const activePriceCount = useMemo(() => Object.values(showPrices).filter(Boolean).length, [showPrices])

  const t = T[curTheme] || T.coal
  const themeVars = useMemo(() => ({
    '--bg': t.bg, '--text': t.text, '--card-bg': t.cBg, '--pill-price': t.pP, '--pill-meta': t.pM,
    '--pill-name': t.pN, '--pill-search': t.pS, '--border': t.brd, '--card-border': t.brd,
    '--dim': t.dim, '--hover-bg': t.hBg, '--sticky-bg': t.sBg, '--seg-bg': t.seBg,
    '--seg-active': t.seA, '--seg-txt': t.seT, '--seg-txt-active': t.seTA, '--btn-bg': t.bBg,
    '--btn-brd': t.bBrd, '--liquid-bg': t.lBg, '--liquid-brd': t.lBrd, '--aura-text': t.aura,
    '--panel-bg': t.panBg, '--glass-base': t.gBase, '--glass-brd': t.gBrd, '--glass-shine': t.gShine,
    '--p-cols': activePriceCount
  }), [t, activePriceCount])

  const pVars = useMemo(() => ({
    '--panel-bg': t.panBg, '--border': t.brd, '--text': t.text, '--dim': t.dim,
    '--seg-bg': t.seBg, '--seg-active': t.seA, '--seg-txt': t.seT, '--seg-txt-active': t.seTA,
    '--bg': t.bg, color: t.text
  }), [t])

  const psg = useMemo(() => ({ gridTemplateColumns: `repeat(${activePriceCount},1fr)` }), [activePriceCount])

  const anyMenuOpen = showBrandMenu || showNewMenu || showFilters || showThemeMenu

  const closeAllMenus = useCallback(() => {
    setShowThemeMenu(false)
    setShowBrandMenu(false)
    setShowNewMenu(false)
    setShowFilters(false)
  }, [])

  const toggleThemeMenu = useCallback(() => {
    if (showThemeMenu) { closeAllMenus(); return }
    closeAllMenus()
    setTimeout(() => { setThemeMenuStyle(calcPopup(themeBtnRef.current, 260)); setShowThemeMenu(true) }, 0)
  }, [showThemeMenu, closeAllMenus])

  const toggleBrandMenu = useCallback(() => {
    if (showBrandMenu) { closeAllMenus(); return }
    closeAllMenus()
    setTempBrandInput('')
    setTimeout(() => { setBrandMenuStyle(calcPopup(brandBtnRef.current)); setShowBrandMenu(true) }, 0)
  }, [showBrandMenu, closeAllMenus])

  const toggleNewMenu = useCallback(() => {
    if (showNewMenu) { closeAllMenus(); return }
    closeAllMenus()
    setTimeout(() => { setStatusMenuStyle(calcPopup(statusBtnRef.current)); setShowNewMenu(true) }, 0)
  }, [showNewMenu, closeAllMenus])

  const toggleFilterMenu = useCallback(() => {
    if (showFilters) { closeAllMenus(); return }
    closeAllMenus()
    setTimeout(() => { setFilterMenuStyle(calcPopup(filterBtnRef.current)); setShowFilters(true) }, 0)
  }, [showFilters, closeAllMenus])

  const togglePrice = useCallback((key) => {
    setShowPrices(prev => {
      if (prev[key] && Object.values(prev).filter(Boolean).length === 1) return prev
      return { ...prev, [key]: !prev[key] }
    })
  }, [])

  const toggleBrandSelection = useCallback((b) => {
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])
    closeAllMenus()
  }, [closeAllMenus])

  const clearBrands = useCallback(() => { setSelectedBrands([]); closeAllMenus() }, [closeAllMenus])

  const brandLabel = useMemo(() => {
    const n = selectedBrands.length
    return n === 0 ? 'БРЕНДЫ' : `${n} БРЕНД${n > 1 ? 'А' : ''}`
  }, [selectedBrands])

  const uniqueBrands = useMemo(() => {
    const s = new Set()
    products.forEach(p => p.brand && s.add(p.brand))
    return Array.from(s).sort()
  }, [products])

  const filteredBrandsDropdown = useMemo(() => {
    const q = tempBrandInput.toLowerCase()
    return q ? uniqueBrands.filter(b => b.toLowerCase().includes(q)) : uniqueBrands
  }, [uniqueBrands, tempBrandInput])

  const filteredProducts = useMemo(() => products.filter(p => {
    if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false
    const q = searchQuery.toLowerCase()
    if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false
    if (activeGender !== 'ВСЕ' && p.gender !== activeGender) return false
    if (activeQuality !== 'ВСЕ' && p.quality !== activeQuality) return false
    if (activeFactory !== 'ВСЕ' && !p.factory.toUpperCase().includes(activeFactory)) return false
    if (filterPlus && !p.hasPlus) return false
    if (filterStar && !p.hasStar) return false
    if (!showOut && p.isOut) return false
    return true
  }), [products, selectedBrands, searchQuery, activeGender, activeQuality, activeFactory, filterPlus, filterStar, showOut])

  const sortedProducts = useMemo(() => {
    const l = [...filteredProducts]
    if (sortBy === 'asc') l.sort((a, b) => a.p1000 - b.p1000)
    else if (sortBy === 'desc') l.sort((a, b) => b.p1000 - a.p1000)
    else l.sort((a, b) => a.id - b.id)
    return l
  }, [filteredProducts, sortBy])

  const stats = useMemo(() => {
    const all = products.filter(p => {
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false
      const q = searchQuery.toLowerCase()
      if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false
      if (activeGender !== 'ВСЕ' && p.gender !== activeGender) return false
      if (activeQuality !== 'ВСЕ' && p.quality !== activeQuality) return false
      if (activeFactory !== 'ВСЕ' && !p.factory.toUpperCase().includes(activeFactory)) return false
      if (filterPlus && !p.hasPlus) return false
      if (filterStar && !p.hasStar) return false
      return true
    })
    const n = all.length || 1
    let s50 = 0, s500 = 0, s1000 = 0, av = 0, ou = 0
    const ql = { TOP: 0, Q1: 0, Q2: 0 }, fc = { LUZI: 0, EPS: 0, SELUZ: 0 }
    all.forEach(i => {
      if (ql[i.quality] !== undefined) ql[i.quality]++
      if (!i.isOut) av++; else ou++
      s50 += i.p50; s500 += i.p500; s1000 += i.p1000
      const f = i.factory.toUpperCase()
      if (f.includes('LUZI')) fc.LUZI++
      else if (f.includes('EPS')) fc.EPS++
      else if (f.includes('SELUZ')) fc.SELUZ++
    })
    const tl = [...all].sort((a, b) => statsMode === '6m' ? b.sales6m - a.sales6m : b.salesAll - a.salesAll).slice(0, 50)
    return {
      total: all.length, countAvail: av, countOut: ou, availability: Math.round(av / n * 100),
      avg50: Math.round(s50 / n), avg500: Math.round(s500 / n), avg1000: Math.round(s1000 / n),
      qualityPerc: { TOP: Math.round(ql.TOP / n * 100), Q1: Math.round(ql.Q1 / n * 100), Q2: Math.round(ql.Q2 / n * 100) },
      factoryPerc: { LUZI: Math.round(fc.LUZI / n * 100), EPS: Math.round(fc.EPS / n * 100), SELUZ: Math.round(fc.SELUZ / n * 100) },
      topListFull: tl
    }
  }, [products, selectedBrands, searchQuery, activeGender, activeQuality, activeFactory, filterPlus, filterStar, statsMode])

  // Data loading
  const loadData = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const r = await fetch(DATA_URL)
      if (!r.ok) throw new Error()
      const parsed = parseCSV(await r.text())
      if (!parsed.length) throw new Error()
      setProducts(parsed)
      setTimeout(() => setLoading(false), 1500)
    } catch {
      setErrorMsg('Не удалось подключиться к базе данных.')
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Auto highlight
  useEffect(() => {
    if (loading || errorMsg) return
    hlIntervalRef.current = setInterval(() => {
      const list = sortedProducts
      if (list.length) {
        const p = list[Math.floor(Math.random() * list.length)]
        if (p) {
          setAutoHighlightId(p.id)
          setTimeout(() => setAutoHighlightId(null), 2000)
        }
      }
    }, 5000)
    return () => clearInterval(hlIntervalRef.current)
  }, [loading, errorMsg, sortedProducts])

  // Scroll tracking
  const updateThumb = useCallback(() => {
    const wH = window.innerHeight
    const dH = document.documentElement.scrollHeight
    const sY = window.scrollY
    setThumbHeight(Math.max((wH / dH) * 100, 5))
    const mx = dH - wH
    setThumbTop(mx <= 0 ? 0 : (sY / mx) * (100 - Math.max((wH / dH) * 100, 5)))
  }, [])

  const handleDrag = useCallback((y) => {
    const tr = scrollTrackRef.current
    if (!tr) return
    const r = tr.getBoundingClientRect()
    const p = Math.min(Math.max((y - r.top) / r.height, 0), 1)
    window.scrollTo({ top: p * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'auto' })
  }, [])

  useEffect(() => {
    const onScroll = () => updateThumb()
    const onResize = () => {
      updateThumb()
      if (showBrandMenu) setBrandMenuStyle(calcPopup(brandBtnRef.current))
      if (showNewMenu) setStatusMenuStyle(calcPopup(statusBtnRef.current))
      if (showFilters) setFilterMenuStyle(calcPopup(filterBtnRef.current))
      if (showThemeMenu) setThemeMenuStyle(calcPopup(themeBtnRef.current, 260))
    }
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [updateThumb, showBrandMenu, showNewMenu, showFilters, showThemeMenu])

  // Drag handlers
  useEffect(() => {
    const onMM = (e) => { if (isDraggingRef.current) handleDrag(e.clientY) }
    const onTM = (e) => { if (isDraggingRef.current) { e.preventDefault(); handleDrag(e.touches[0].clientY) } }
    const stopDrag = () => { isDraggingRef.current = false }
    window.addEventListener('mousemove', onMM)
    window.addEventListener('touchmove', onTM, { passive: false })
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchend', stopDrag)
    return () => {
      window.removeEventListener('mousemove', onMM)
      window.removeEventListener('touchmove', onTM)
      window.removeEventListener('mouseup', stopDrag)
      window.removeEventListener('touchend', stopDrag)
    }
  }, [handleDrag])

  const startDrag = (e) => {
    isDraggingRef.current = true
    handleDrag(e.touches ? e.touches[0].clientY : e.clientY)
  }

  const openLink = (u) => window.open(u.startsWith('http') ? u : `https://${u}`, '_blank')

  return (
    <div className="bahur-terminal" style={themeVars}>
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="glass-distort" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="2" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="sN" />
            <feDisplacementMap in="SourceGraphic" in2="sN" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="container">
        {/* Header */}
        <header className="header-bar">
          <button onClick={() => setShowDash(!showDash)} className={`glass-pill ${showDash ? 'active' : ''}`}>
            <span className="gpi"><span className="gpt main-font">СТАТИСТИКА</span></span>
          </button>
          <div className="logo kollektif">BAHUR</div>
          <button ref={themeBtnRef} onClick={toggleThemeMenu} className={`glass-pill ${showThemeMenu ? 'active' : ''}`}>
            <span className="gpi"><span className="gpt main-font">ДИЗАЙН</span></span>
          </button>
        </header>

        {/* Theme Menu */}
        <Popup show={showThemeMenu} style={themeMenuStyle} pVars={pVars} className="dpop">
          <div className="drow">
            {darkThemes.map(th => (
              <button key={th.id} onClick={() => setCurTheme(th.id)} className={`sw ${curTheme === th.id ? 'active' : ''}`} style={th.pv} />
            ))}
          </div>
          <div className="dsep" />
          <div className="drow">
            {lightThemes.map(th => (
              <button key={th.id} onClick={() => setCurTheme(th.id)} className={`sw ${curTheme === th.id ? 'active' : ''}`} style={th.pv} />
            ))}
          </div>
        </Popup>

        {/* Loading */}
        {loading && (
          <div className="lo">
            <div className="lo-bg" />
            <div className="lo-c"><span className="lo-t main-font">BAHUR</span></div>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="ez">
            <div className="eb">
              <div style={{ fontSize: 30, marginBottom: 15, opacity: .8 }}>✕</div>
              <h3 className="mono" style={{ fontSize: 14, marginBottom: 10, letterSpacing: 1 }}>ОШИБКА ПОДКЛЮЧЕНИЯ</h3>
              <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 25 }}>{errorMsg}</p>
              <button onClick={loadData} className="mono" style={{ background: 'var(--text)', border: 'none', color: 'var(--bg)', padding: '12px 24px', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>ПОВТОРИТЬ</button>
            </div>
          </div>
        )}

        {/* Main content */}
        {!loading && !errorMsg && (
          <>
            {/* Dashboard */}
            <div className={`dw ${showDash ? 'open' : ''}`}>
              <div className="dc">
                <section className="dg">
                  <div className="sc">
                    <label className="sl">АРОМАТЫ</label>
                    <div className="sv mono">{stats.total}</div>
                    <div className="ss"><span>Есть: <b className="mono">{stats.countAvail}</b></span><span>Нет: <b className="mono">{stats.countOut}</b></span></div>
                  </div>
                  <div className="sc">
                    <label className="sl">СКЛАД</label>
                    <div className="sv mono">{stats.availability}%</div>
                    <div className="bt"><div className="bf" style={{ width: stats.availability + '%' }} /></div>
                  </div>
                  <div className="sc">
                    <label className="sl">СРЕДНЯЯ ЦЕНА</label>
                    <div className="sp2">
                      {showPrices.p50 && <div className="sp3">50г: <span className="mono">{stats.avg50}₽</span></div>}
                      {showPrices.p500 && <div className="sp3">500г: <span className="mono">{stats.avg500}₽</span></div>}
                      {showPrices.p1000 && <div className="sp3">1кг: <span className="mono">{stats.avg1000}₽</span></div>}
                    </div>
                  </div>
                  <div className="sc">
                    <label className="sl">ФАБРИКИ</label>
                    {['LUZI', 'EPS', 'SELUZ'].map(f => (
                      <div key={f} className="br">
                        <div className="bm"><span className="mono">{f}</span><span className="mono">{stats.factoryPerc[f]}%</span></div>
                        <div className="bn"><div className="bf" style={{ width: stats.factoryPerc[f] + '%' }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="sc">
                    <label className="sl">КАЧЕСТВО</label>
                    {['TOP', 'Q1', 'Q2'].map(q => (
                      <div key={q} className="br">
                        <div className="bm"><span className="mono">{q}</span><span className="mono">{stats.qualityPerc[q]}%</span></div>
                        <div className="bn"><div className="bf" style={{ width: stats.qualityPerc[q] + '%' }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="sc sw2">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                      <button onClick={() => setStatsMode(m => m === '6m' ? 'all' : '6m')} className="tsw main-font">
                        <span style={{ color: 'var(--dim)' }}>РЕЙТИНГ:</span> {statsMode === '6m' ? '6 МЕС' : 'ВСЕ ВРЕМЯ'} ⇄
                      </button>
                    </div>
                    <div className="tsc">
                      {stats.topListFull.map((item, idx) => (
                        <div key={idx} className="tr2">
                          <div className="tl">
                            <span className="tn mono">{idx + 1}.</span>
                            <span className="tname kollektif">{item.name}</span>
                          </div>
                          <div className="tb2">
                            <div className="tbd">{item.factory}</div>
                            <div className="tbd">{item.quality}</div>
                            <div className="tbd tbh">{statsMode === '6m' ? item.sales6m : item.salesAll}%</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="bn"><div className="bf" style={{ width: (statsMode === '6m' ? item.sales6m : item.salesAll) + '%' }} /></div>
                          </div>
                        </div>
                      ))}
                      {!stats.topListFull.length && <div className="mono" style={{ fontSize: 10, opacity: .5 }}>НЕТ ДАННЫХ</div>}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Overlay for menus */}
            {anyMenuOpen && <div className="co" onClick={closeAllMenus} />}

            <div className="tf">
              {/* Sticky nav */}
              <div className="sn">
                <section className="ni">
                  <div className="ntr">
                    <div className="srw">
                      <svg className="si2" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>
                      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="search" inputMode="search" enterKeyHint="search" placeholder="ПОИСК…" className="sinp kollektif" />
                      {searchQuery && <button onClick={() => setSearchQuery('')} className="sclr">✕</button>}
                    </div>
                    <div className="cb">
                      <div ref={brandBtnRef}>
                        <button onClick={toggleBrandMenu} className={`glass-pill compact ${showBrandMenu || selectedBrands.length > 0 ? 'active' : ''}`}>
                          <span className="gpi"><span className="gpt main-font">{brandLabel}</span></span>
                        </button>
                      </div>
                      <div ref={statusBtnRef}>
                        <button onClick={toggleNewMenu} className={`glass-pill compact ${showNewMenu || filterPlus || filterStar || showOut ? 'active' : ''}`}>
                          <span className="gpi"><span className="gpt main-font">НОВИНКИ</span></span>
                        </button>
                      </div>
                      <div ref={filterBtnRef}>
                        <button onClick={toggleFilterMenu} className={`glass-pill compact ${showFilters ? 'active' : ''}`}>
                          <span className="gpi"><span className="gpt main-font">{showFilters ? 'ЗАКРЫТЬ' : 'ФИЛЬТРЫ'}</span></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Table header */}
                <div className="th">
                  <div className="hid" />
                  <div className="hn"><span className="hp nhp kollektif">АРОМАТ</span></div>
                  <div className="hpl do"><span className="hp mhp kollektif">ПОЛ</span></div>
                  <div className="hpl do"><span className="hp mhp kollektif">ФАБРИКА</span></div>
                  <div className="hpl do"><span className="hp mhp kollektif">КАЧЕСТВО</span></div>
                  <div className="hpr" style={psg}>
                    {showPrices.p50 && <div className="hpl"><span className="hp php mono">50г</span></div>}
                    {showPrices.p500 && <div className="hpl"><span className="hp php mono">500г</span></div>}
                    {showPrices.p1000 && <div className="hpl"><span className="hp php mono">1кг</span></div>}
                  </div>
                </div>
              </div>

              {/* Brand Menu */}
              <Popup show={showBrandMenu} style={brandMenuStyle} pVars={pVars}>
                <div style={{ width: '100%' }}>
                  <input value={tempBrandInput} onChange={e => setTempBrandInput(e.target.value)} type="search" inputMode="search" enterKeyHint="search" placeholder="ПОИСК БРЕНДА…" className="pinp main-font" />
                </div>
                <div className="bsc">
                  <button onClick={clearBrands} className="bbtn ab main-font">
                    <svg style={{ width: 14, height: 14, flexShrink: 0 }} viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg>
                    <span>ВСЕ</span>
                  </button>
                  {filteredBrandsDropdown.map(b => (
                    <button key={b} onClick={() => toggleBrandSelection(b)} className="bbtn main-font">
                      <span className="btx">{b}</span>
                      {selectedBrands.includes(b) && <svg style={{ width: 13, height: 13 }} viewBox="0 0 24 24"><path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /></svg>}
                    </button>
                  ))}
                  {!filteredBrandsDropdown.length && <div style={{ fontSize: 10, color: 'var(--dim)', padding: '6px 10px' }} className="main-font">НЕТ СОВПАДЕНИЙ</div>}
                </div>
              </Popup>

              {/* Status Menu */}
              <Popup show={showNewMenu} style={statusMenuStyle} pVars={pVars}>
                <div className="tgr" onClick={() => setFilterPlus(!filterPlus)}>
                  <span className="tgl main-font">НОВИНКИ <span className="ch chp">+</span></span>
                  <div className={`tg ${filterPlus ? 'on' : ''}`}><div className="tgt" /></div>
                </div>
                <div className="tgr" onClick={() => setFilterStar(!filterStar)}>
                  <span className="tgl main-font">ВЕРСИИ <span className="ch chs">*</span></span>
                  <div className={`tg ${filterStar ? 'on' : ''}`}><div className="tgt" /></div>
                </div>
                <div className="tgr" onClick={() => setShowOut(!showOut)}>
                  <span className="tgl main-font">НЕТ <span className="ch chm">-</span></span>
                  <div className={`tg ${showOut ? 'on' : ''}`}><div className="tgt" /></div>
                </div>
              </Popup>

              {/* Filters Menu */}
              <Popup show={showFilters} style={filterMenuStyle} pVars={pVars}>
                <div className="ps">
                  <span className="pl main-font">ПОЛ</span>
                  <div className="sg">
                    {GENDER_OPTIONS.map(g => (
                      <button key={g.val} onClick={() => setActiveGender(g.val)} className={`sgb main-font ${activeGender === g.val ? 'active' : ''}`}>{g.label}</button>
                    ))}
                  </div>
                </div>
                <div className="ps">
                  <span className="pl main-font">ФАБРИКА</span>
                  <div className="sg">
                    {FACTORY_OPTIONS.map(f => (
                      <button key={f.val} onClick={() => setActiveFactory(f.val)} className={`sgb main-font ${activeFactory === f.val ? 'active' : ''}`}>{f.label}</button>
                    ))}
                  </div>
                </div>
                <div className="ps">
                  <span className="pl main-font">КАЧЕСТВО</span>
                  <div className="sg">
                    {QUALITY_OPTIONS.map(q => (
                      <button key={q.val} onClick={() => setActiveQuality(q.val)} className={`sgb main-font ${activeQuality === q.val ? 'active' : ''}`}>{q.label}</button>
                    ))}
                  </div>
                </div>
                <div className="ps">
                  <span className="pl main-font">ЦЕНА</span>
                  <div className="sg">
                    {SORT_OPTIONS.map(s => (
                      <button key={s.val} onClick={() => setSortBy(s.val)} className={`sgb main-font ${sortBy === s.val ? 'active' : ''}`}>
                        {s.val === 'id' ? 'ID' : <>{s.label}{s.val === 'asc' ? '▲' : '▼'}</>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ps">
                  <span className="pl main-font">СТОЛБЦЫ</span>
                  <div className="sg">
                    {Object.entries(PRICE_LABELS).map(([key, val]) => (
                      <button key={key} onClick={() => togglePrice(key)} className={`sgb main-font ${showPrices[key] ? 'active' : ''}`}>{val}</button>
                    ))}
                  </div>
                </div>
              </Popup>

              {/* Products */}
              <div className="gt">
                {sortedProducts.map((p, index) => (
                  <div
                    key={p.id + '-' + index}
                    className={`row cr ${p.isOut ? 'out' : ''} ${autoHighlightId === p.id ? 'sh' : ''}`}
                    onClick={() => p.link && p.link.length > 5 ? openLink(p.link) : null}
                  >
                    <div className="rc">
                      <div className="cid center">
                        <div className="idn mono">{p.id}</div>
                        <div className="ids mono">
                          {p.isOut ? <span style={{ color: '#fd4659' }}>-</span>
                            : p.hasPlus ? <span style={{ color: '#00a86b' }}>+</span>
                            : p.hasStar ? <span style={{ color: '#a020f0' }}>*</span>
                            : null}
                        </div>
                      </div>
                      <div className="cn">
                        <div className="pn">
                          <span className="bc kollektif">{p.brand}</span>
                          <span className="st2 kollektif">{p.name}</span>
                          <div className="mm">
                            <span className="mb kollektif">{getSex(p.gender)}</span>
                            <span className="mb kollektif">{p.factory}</span>
                            <span className="mb kollektif">{p.quality}</span>
                          </div>
                        </div>
                      </div>
                      <div className="cm do center"><div className="pm kollektif">{getSex(p.gender)}</div></div>
                      <div className="cm do center"><div className="pm kollektif">{p.factory}</div></div>
                      <div className="cm do center"><div className="pm kollektif">{p.quality}</div></div>
                      <div className="cp" style={psg}>
                        {showPrices.p50 && <div className="pp mono">{p.p50}₽</div>}
                        {showPrices.p500 && <div className="pp mono">{p.p500}₽</div>}
                        {showPrices.p1000 && <div className="pp mono fw8">{p.p1000}₽</div>}
                      </div>
                    </div>
                    <div className="ao"><span className="at kollektif">ПЕРЕЙТИ К АРОМАТУ</span></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Scroll Track */}
      {!loading && !errorMsg && (
        <div className="strack" ref={scrollTrackRef} onMouseDown={startDrag} onTouchStart={startDrag} onClick={e => handleDrag(e.clientY)}>
          <div className="sthumb" style={{ top: thumbTop + '%', height: thumbHeight + '%' }} />
        </div>
      )}
    </div>
  )
}
