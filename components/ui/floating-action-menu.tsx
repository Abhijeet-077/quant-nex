"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Brain, 
  Microscope, 
  Activity, 
  FileText,
  X
} from "lucide-react"
import Link from "next/link"

export function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      icon: <Brain className="h-5 w-5" />,
      label: "Diagnosis",
      href: "/diagnosis",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Microscope className="h-5 w-5" />,
      label: "Prognosis",
      href: "/prognosis", 
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: "Monitoring",
      href: "/monitoring",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Reports",
      href: "/reports",
      color: "from-orange-500 to-red-500"
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <Button
                    size="sm"
                    className={`bg-gradient-to-r ${item.color} hover:opacity-90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[120px] justify-start`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </Button>
      </motion.div>
    </div>
  )
}
