'use client'

import { Phone, ShieldAlert, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function EscapeHatch() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-custom-orange text-white px-5 py-3.5 rounded-full shadow-xl shadow-custom-orange/20 ring-1 ring-custom-orange hover:bg-custom-amber transition-colors group"
      >
        <ShieldAlert className="w-5 h-5 text-white group-hover:text-white transition-colors" />
        <span className="font-medium text-sm">Need Human Help?</span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8">
                <div className="w-12 h-12 bg-custom-amber/20 rounded-xl flex items-center justify-center mb-6">
                  <ShieldAlert className="w-6 h-6 text-custom-orange" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Speak to a Solicitor</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  If your situation is urgent, complex, or you require specific legal advice rather than general information, please contact Civil Legal Advice directly.
                </p>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <div className="flex items-center gap-4 text-slate-900 mb-4">
                    <div className="bg-custom-navy p-3 rounded-full text-white shadow-sm ring-4 ring-custom-sky/20">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-500">Civil Legal Advice (CLA)</div>
                      <a href="tel:03453454345" className="text-2xl font-bold hover:text-custom-teal transition-colors">
                        0345 345 4 345
                      </a>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-500 space-y-2 mt-6 pt-6 border-t border-slate-200">
                    <p><strong>Monday to Friday:</strong> 9am to 8pm</p>
                    <p><strong>Saturday:</strong> 9am to 12:30pm</p>
                    <p><strong>Sunday & Bank Holidays:</strong> Closed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
