'use client'

import { useChat } from 'ai/react'
import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import { Send, Scale, AlertTriangle, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Citation {
  id: string
  source_title: string
  source_url: string
  publication_date: string
  similarity: number
}

export default function ChatWindow() {
  const [outOfScope, setOutOfScope] = useState<string | null>(null)
  const [messageSources, setMessageSources] = useState<Map<string, Citation[]>>(new Map())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      console.log('API Response received:', response);
      
      // Extract source citations from header (primary source of truth)
      const citationsHeader = response.headers.get('X-Source-Citations')
      if (citationsHeader) {
        try {
          const citations: Citation[] = JSON.parse(citationsHeader)
          console.log('Citations extracted from header:', citations);
          // Store citations indexed by the next assistant message that will be added
          // We'll match it after the message is received
          const currentMessageCount = messages.length
          setMessageSources(prev => new Map(prev).set(`msg_${currentMessageCount}`, citations))
        } catch (e) {
          console.error('Failed to parse citations header:', e)
        }
      }
      
      // Handle out-of-scope / error JSON responses
      const contentType = response.headers.get('content-type') ?? ''
      console.log('Content type:', contentType);
      if (contentType.includes('application/json')) {
        // Only read JSON body for non-streaming responses
        response.json().then(data => {
          console.log('JSON data:', data);
          if (data.error) setOutOfScope(data.message)
        }).catch(() => {
          setOutOfScope(null)
        })
      } else {
        // For streaming responses, don't consume the body
        setOutOfScope(null)
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onFinish: (message) => {
      console.log('Message finished:', message);
    },
  })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, outOfScope])

  const getSourcesForMessage = (messageIndex: number): Citation[] => {
    // Messages alternate: user, assistant, user, assistant...
    // We want the assistant message (even indices after first user)
    if (messages[messageIndex]?.role !== 'assistant') {
      return []
    }
    
    // Try to get sources - they're stored with the approximate message position
    return messageSources.get(`msg_${messageIndex}`) || []
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 flex flex-col h-[650px] overflow-hidden shadow-2xl shadow-custom-navy/10 ring-1 ring-slate-900/5">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="w-16 h-16 bg-custom-sky/20 rounded-2xl flex items-center justify-center border border-custom-sky/30">
                <Scale className="w-8 h-8 text-custom-teal" />
              </div>
              <div className="max-w-sm space-y-2">
                <h3 className="font-semibold text-slate-800">How can I help you?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Ask me about your eligibility for UK civil legal aid, what kind of issues it covers, or how to apply.
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((m, idx) => (
            <MessageBubble 
              key={m.id} 
              message={m} 
              serverCitations={getSourcesForMessage(idx)}
            />
          ))}

          {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="flex justify-start"
             >
               <div className="bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl rounded-tl-sm px-5 py-4 flex flex-row items-center gap-2">
                 <div className="flex space-x-1">
                   <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                 </div>
               </div>
             </motion.div>
          )}

          {outOfScope && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-custom-amber/10 border border-custom-amber/30 rounded-2xl p-5 shadow-sm shadow-custom-amber/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-custom-amber" />
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-custom-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-custom-navy text-sm mb-1">Out of scope</h4>
                  <p className="text-sm text-custom-navy/80 leading-relaxed mb-3">
                    {outOfScope}
                  </p>
                  <div className="flex items-center gap-1.5 text-custom-orange text-xs font-medium bg-custom-amber/20 w-fit px-3 py-1.5 rounded-lg">
                    <span>Use the &quot;Need Human Help?&quot; button below</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-px w-full" />
      </div>

      {/* Input */}
      <div className="p-4 md:p-5 bg-white border-t border-slate-100/80 z-10 relative">
        <form 
          onSubmit={(e) => {
            console.log('Form submitted with input:', input);
            if (!input.trim() || isLoading) {
               e.preventDefault()
               return
            }
            handleSubmit(e)
          }} 
          className="relative flex items-center"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your doubts and queries over here"
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm md:text-base rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal transition-all placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2.5 bg-custom-teal text-white rounded-xl disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 hover:bg-custom-navy hover:shadow-md hover:shadow-custom-teal/20 transition-all active:scale-95"
          >
             <Send className="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-[11px] text-slate-400">
            For emergencies, please escalate to human support.
          </p>
        </div>
      </div>
    </div>
  )
}
