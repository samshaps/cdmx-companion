import { useState } from 'react'

const QUICK_AMOUNTS = [100, 200, 500, 1000]

export function Converter({ rate }) {
  const [amount, setAmount] = useState('')
  const [direction, setDirection] = useState('usd-to-mxn')

  const isUsdToMxn = direction === 'usd-to-mxn'
  const fromLabel = isUsdToMxn ? 'USD' : 'MXN'
  const toLabel = isUsdToMxn ? 'MXN' : 'USD'
  const fromSymbol = isUsdToMxn ? '$' : 'MX$'
  const toSymbol = isUsdToMxn ? 'MX$' : '$'

  const numericAmount = parseFloat(amount) || 0
  const converted = rate
    ? isUsdToMxn
      ? numericAmount * rate
      : numericAmount / rate
    : null

  function handleSwap() {
    setDirection(d => d === 'usd-to-mxn' ? 'mxn-to-usd' : 'usd-to-mxn')
  }

  function handleAmountChange(e) {
    const val = e.target.value
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setAmount(val)
    }
  }

  function handleQuickAmount(value) {
    setAmount(String(value))
    setDirection('mxn-to-usd')
  }

  const disabled = !rate

  return (
    <div className="flex flex-col items-center gap-4">
      {/* From section */}
      <div className="w-full text-center">
        <p className="text-sm text-charcoal/60 mb-1">{fromLabel}</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl text-charcoal/40">{fromSymbol}</span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            disabled={disabled}
            className="text-4xl font-bold text-charcoal text-center bg-transparent outline-none w-48 placeholder:text-charcoal/20 disabled:opacity-40"
          />
        </div>
      </div>

      {/* Swap button */}
      <button
        onClick={handleSwap}
        disabled={disabled}
        className="w-12 h-12 rounded-full bg-teal text-white text-xl flex items-center justify-center active:scale-[0.95] transition-transform disabled:opacity-40"
        aria-label="Swap currency direction"
      >
        ⇅
      </button>

      {/* To section */}
      <div className="w-full text-center">
        <p className="text-sm text-charcoal/60 mb-1">{toLabel}</p>
        <p className="text-4xl font-bold text-charcoal">
          {disabled
            ? <span className="text-charcoal/20">&mdash;</span>
            : converted !== null && amount
              ? `${toSymbol} ${converted.toFixed(2)}`
              : <span className="text-charcoal/20">{toSymbol} 0.00</span>
          }
        </p>
      </div>

      {/* Quick amount buttons */}
      <div className="flex gap-2 justify-center mt-4">
        {QUICK_AMOUNTS.map(val => {
          const isActive = direction === 'mxn-to-usd' && amount === String(val)
          return (
            <button
              key={val}
              onClick={() => handleQuickAmount(val)}
              disabled={disabled}
              className={`px-4 py-2 rounded-full text-sm font-medium min-h-[44px] active:scale-[0.98] transition-all disabled:opacity-40 ${
                isActive
                  ? 'bg-teal text-white'
                  : 'bg-warm-gray text-charcoal'
              }`}
            >
              ${val.toLocaleString()}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-charcoal/40">Common peso amounts</p>
    </div>
  )
}
