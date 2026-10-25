import { useRef } from 'react'

/**
 * OtpInput — 6-box numeric OTP input
 * Props:
 *   value      : string  (6-char string, e.g. "123456")
 *   onChange   : (value: string) => void
 *   disabled   : boolean
 *   error      : boolean  (highlights boxes red when true)
 */
export default function OtpInput({ value = '', onChange, disabled = false, error = false }) {
  const refs = useRef([])

  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '')

  function handleChange(index, e) {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) {
      // Backspace / clear
      const next = digits.slice()
      next[index] = ''
      onChange(next.join(''))
      return
    }
    // If user pastes multiple digits into a box
    if (raw.length > 1) {
      const chars = raw.slice(0, 6).split('')
      const next = digits.slice()
      chars.forEach((c, i) => { if (index + i < 6) next[index + i] = c })
      onChange(next.join(''))
      const focusTarget = Math.min(index + chars.length, 5)
      refs.current[focusTarget]?.focus()
      return
    }
    const next = digits.slice()
    next[index] = raw[0]
    onChange(next.join(''))
    if (index < 5) refs.current[index + 1]?.focus()
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = digits.slice()
        next[index] = ''
        onChange(next.join(''))
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) refs.current[index + 1]?.focus()
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...pasted.padEnd(6, '').split('').slice(0, 6)]
    onChange(next.join(''))
    const focusTarget = Math.min(pasted.length, 5)
    refs.current[focusTarget]?.focus()
  }

  const boxBase = [
    'w-10 h-12 xs:w-11 xs:h-14 sm:w-12 sm:h-14 text-center text-lg xs:text-xl font-bold rounded-xl border-2 outline-none transition-all duration-150',
    'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 bg-slate-50 dark:bg-royal-900',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
  ].join(' ')

  const boxBorder = error ? 'border-red-400 text-red-600' : 'border-slate-300 dark:border-royal-700 text-slate-800 dark:text-white'

  return (
    <div className="flex gap-1.5 xs:gap-2 justify-center max-w-full px-1" onPaste={handlePaste} aria-label="OTP input">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className={`${boxBase} ${boxBorder}`}
          aria-label={`OTP digit ${i + 1}`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
}
