import { useState, useCallback, useEffect } from 'react'

const TIP_PRESETS = [15, 18, 20, 25] as const

type Page = 'calculator' | 'terms' | 'privacy'

function TermsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white px-4 py-8 max-w-2xl mx-auto">
      <button onClick={onBack} className="text-brand-600 font-semibold mb-6 hover:underline">&larr; Back</button>
      <h1 className="text-2xl font-bold text-surface-900 mb-4">Terms of Service</h1>
      <p className="text-surface-700 text-sm mb-3">Last updated: February 2026</p>
      <div className="prose prose-sm text-surface-700 space-y-3">
        <p>TipSplit is a free tip calculator tool provided as-is. By using this website, you agree to these terms.</p>
        <h2 className="text-lg font-semibold text-surface-900 mt-4">Use of Service</h2>
        <p>TipSplit performs tip and bill-splitting calculations on your device. All calculations happen locally in your browser. We do not collect, store, or transmit any data you enter.</p>
        <h2 className="text-lg font-semibold text-surface-900 mt-4">No Warranty</h2>
        <p>This tool is provided &ldquo;as is&rdquo; without warranty of any kind. While we strive for accuracy, you should verify important calculations independently.</p>
        <h2 className="text-lg font-semibold text-surface-900 mt-4">Limitation of Liability</h2>
        <p>TipSplit shall not be liable for any damages arising from the use of this service.</p>
      </div>
    </div>
  )
}

function PrivacyPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white px-4 py-8 max-w-2xl mx-auto">
      <button onClick={onBack} className="text-brand-600 font-semibold mb-6 hover:underline">&larr; Back</button>
      <h1 className="text-2xl font-bold text-surface-900 mb-4">Privacy Policy</h1>
      <p className="text-surface-700 text-sm mb-3">Last updated: February 2026</p>
      <div className="prose prose-sm text-surface-700 space-y-3">
        <p>TipSplit respects your privacy. Here is what we collect: <strong>nothing</strong>.</p>
        <h2 className="text-lg font-semibold text-surface-900 mt-4">Data Collection</h2>
        <p>We do not collect any personal information. No accounts, no cookies, no analytics trackers. All calculations happen entirely in your browser.</p>
        <h2 className="text-lg font-semibold text-surface-900 mt-4">Third-Party Services</h2>
        <p>We load the Inter font from Google Fonts. Google may collect standard web request data (IP address, browser type) as part of serving fonts. No other third-party services are used.</p>
        <h2 className="text-lg font-semibold text-surface-900 mt-4">Data Storage</h2>
        <p>No data is stored on any server. Your bill amounts, tip selections, and split calculations exist only in your browser&apos;s memory and are cleared when you close the page.</p>
        <h2 className="text-lg font-semibold text-surface-900 mt-4">Contact</h2>
        <p>For questions about this privacy policy, visit our GitHub repository.</p>
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState<Page>('calculator')
  const [billAmount, setBillAmount] = useState('')
  const [tipPercent, setTipPercent] = useState<number>(18)
  const [customTip, setCustomTip] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [numPeople, setNumPeople] = useState(1)

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      if (hash === '#terms') setPage('terms')
      else if (hash === '#privacy') setPage('privacy')
      else setPage('calculator')
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const navigate = (p: Page) => {
    window.location.hash = p === 'calculator' ? '' : p
    setPage(p)
    window.scrollTo(0, 0)
  }

  if (page === 'terms') return <TermsPage onBack={() => navigate('calculator')} />
  if (page === 'privacy') return <PrivacyPage onBack={() => navigate('calculator')} />

  const activeTip = isCustom ? (parseFloat(customTip) || 0) : tipPercent
  const bill = parseFloat(billAmount) || 0

  // Formula Registry calculations (Phase 2 SSOT)
  const tipAmount = bill * (activeTip / 100)
  const totalWithTip = bill + tipAmount
  const perPerson = numPeople > 0 ? totalWithTip / numPeople : 0
  const tipPerPerson = numPeople > 0 ? tipAmount / numPeople : 0

  const fmt = useCallback((n: number) => {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }, [])

  const handlePreset = (pct: number) => {
    setIsCustom(false)
    setTipPercent(pct)
  }

  const handleCustom = () => {
    setIsCustom(true)
  }

  const decrementPeople = () => setNumPeople(p => Math.max(1, p - 1))
  const incrementPeople = () => setNumPeople(p => p + 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">TS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-surface-900 tracking-tight">TipSplit</h1>
        </div>
        <p className="text-surface-700 text-sm font-medium">Split the bill. Skip the math.</p>
      </header>

      {/* Calculator Card */}
      <main className="flex-1 flex items-start justify-center px-4 pb-8">
        <div className="w-full max-w-md space-y-6">

          {/* Bill Amount */}
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Bill Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-700 font-semibold text-lg">$</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={billAmount}
                onChange={e => setBillAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-4 text-2xl font-bold text-surface-900 bg-white border-2 border-surface-200 rounded-2xl focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Tip Percentage */}
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Tip Percentage</label>
            <div className="grid grid-cols-5 gap-2">
              {TIP_PRESETS.map(pct => (
                <button
                  key={pct}
                  onClick={() => handlePreset(pct)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    !isCustom && tipPercent === pct
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-200'
                      : 'bg-white text-surface-700 border-2 border-surface-200 hover:border-brand-300'
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <button
                onClick={handleCustom}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${
                  isCustom
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-200'
                    : 'bg-white text-surface-700 border-2 border-surface-200 hover:border-brand-300'
                }`}
              >
                Custom
              </button>
            </div>
            {isCustom && (
              <div className="mt-3 relative">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="Enter %"
                  value={customTip}
                  onChange={e => setCustomTip(e.target.value)}
                  className="w-full px-4 py-3 text-lg font-bold text-surface-900 bg-white border-2 border-brand-300 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-700 font-semibold">%</span>
              </div>
            )}
          </div>

          {/* Number of People */}
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Number of People</label>
            <div className="flex items-center gap-4">
              <button
                onClick={decrementPeople}
                disabled={numPeople <= 1}
                className="w-14 h-14 rounded-xl bg-white border-2 border-surface-200 text-2xl font-bold text-surface-700 hover:border-brand-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <span className="text-4xl font-extrabold text-surface-900">{numPeople}</span>
              </div>
              <button
                onClick={incrementPeople}
                className="w-14 h-14 rounded-xl bg-white border-2 border-surface-200 text-2xl font-bold text-surface-700 hover:border-brand-300 transition-all flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-surface-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-brand-300 text-sm font-medium">Tip Amount</p>
                {numPeople > 1 && <p className="text-surface-200 text-xs">/ person</p>}
              </div>
              <div className="text-right">
                <p className="text-white text-2xl font-bold">{fmt(numPeople > 1 ? tipPerPerson : tipAmount)}</p>
                {numPeople > 1 && <p className="text-surface-200 text-xs">total: {fmt(tipAmount)}</p>}
              </div>
            </div>

            <hr className="border-surface-700" />

            <div className="flex justify-between items-center">
              <div>
                <p className="text-brand-300 text-sm font-medium">Total</p>
                {numPeople > 1 && <p className="text-surface-200 text-xs">/ person</p>}
              </div>
              <div className="text-right">
                <p className="text-white text-3xl font-extrabold">{fmt(perPerson)}</p>
                {numPeople > 1 && <p className="text-surface-200 text-xs">total: {fmt(totalWithTip)}</p>}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-1 pt-2">
            <p className="text-xs text-surface-700">Free forever. No ads. No tracking.</p>
            <div className="flex justify-center gap-4 text-xs">
              <button onClick={() => navigate('terms')} className="text-surface-700 hover:text-brand-500 underline">Terms</button>
              <button onClick={() => navigate('privacy')} className="text-surface-700 hover:text-brand-500 underline">Privacy</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
