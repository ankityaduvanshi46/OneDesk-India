import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-brand-primary"
      />
      <div className="flex gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-saffron-500 animate-bounce" />
        <span className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
        <span className="w-2.5 h-2.5 rounded-full bg-india-green animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  )
}
