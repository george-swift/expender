'use client'

import { ReactLenis } from 'lenis/react'

export default function LenisScrollProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        anchors: { offset: 0 }
      }}
    >
      {children}
    </ReactLenis>
  )
}
