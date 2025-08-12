'use client'

import { motion } from 'motion/react'

export default function SmoothScrollProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      style={{ height: '100%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
