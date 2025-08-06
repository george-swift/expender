import { useRef, useState } from 'react'

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  function trigger() {
    setIsOpen(true)
  }

  function dismiss() {
    setIsOpen(false)
    triggerRef.current?.focus?.()
  }

  return {
    dialogProps: {
      onOpenChange: (open: boolean) => {
        if (open) {
          trigger()
        } else {
          dismiss()
        }
      },
      open: isOpen
    },
    dismiss,
    trigger,
    triggerProps: {
      onClick: trigger,
      ref: triggerRef
    }
  }
}
