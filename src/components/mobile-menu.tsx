import { motion, AnimatePresence } from "framer-motion"
import { useRef, useEffect } from "react"

interface MobileMenuProps {
  isOpen: boolean
  children: React.ReactNode
  onHeightChange?: (height: number) => void
}

export default function MobileMenu({
  isOpen,
  children,
  onHeightChange,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (menuRef.current && isOpen) {
      const height = menuRef.current.scrollHeight
      onHeightChange?.(height)
    } else {
      onHeightChange?.(0)
    }
  }, [isOpen, children, onHeightChange])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="absolute top-[calc(100%+0.5rem)] left-0 right-0 glass-card rounded-[16px] overflow-hidden"
        >
          <motion.nav
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4"
          >
            {children}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
