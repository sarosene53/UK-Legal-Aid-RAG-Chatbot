import { Message } from 'ai'
import SourceBadge from './SourceBadge'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

// Parses [[Source: title | url]] or standard markdown list links * [Title] (URL) inject by LLM
function parseSourcesFromContent(content: string) {
  const sourceRegex = /\[\[Source:\s*([^|]+)\|([^\]]+)\]\]|^\s*\*\s*\[([^\]]+)\]\s*\(([^)]+)\)/gm
  const sources: { title: string; url: string }[] = []
  
  let cleanContent = content.replace(sourceRegex, (_, titleLegacy, urlLegacy, titleNew, urlNew) => {
    const title = titleLegacy || titleNew
    const url = urlLegacy || urlNew
    
    // avoid duplicates if LLM references same source twice closely
    if (title && url && !sources.find(s => s.url === url.trim())) {
      sources.push({ title: title.trim(), url: url.trim() })
    }
    return ''
  })
  
  // Optionally remove the dangling "Sources:" or "**Sources:**" text 
  // if the list was successfully replaced out of the prose paragraph
  if (sources.length === 0) {
    // If no sources were found, the LLM might have output "Sources: <fallback message>"
    // Strip "Sources:" out entirely so the user just sees the fallback message
    cleanContent = cleanContent.replace(/\*?\*?Sources:\*?\*?\s*/ig, '').trim()
  } else {
    // Otherwise just remove it if it's dangling at the end
    cleanContent = cleanContent.replace(/\*?\*?Sources:\*?\*?\s*$/i, '').trim()
  }

  // Remove markdown bold markers from the assistant text (e.g. **section titles**)
  cleanContent = cleanContent.replace(/\*\*(.+?)\*\*/g, '$1')

  return { cleanContent, sources }
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const { cleanContent, sources } = parseSourcesFromContent(message.content)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] md:max-w-[75%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Avatar & Label (Only for AI to give it a human touch) */}
        {!isUser && (
          <div className="flex items-center gap-1.5 pl-1 mb-0.5">
            <div className="w-5 h-5 bg-custom-navy rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assistant</span>
          </div>
        )}

        {/* Message Box */}
        <div
          className={`rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
            isUser
              ? 'bg-custom-teal text-white rounded-tr-sm'
              : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm ring-1 ring-slate-900/5'
          }`}
        >
          {/* Simple Markdown Rendering (Prose / paragraphs) */}
          <div className="whitespace-pre-wrap breakdown-words">
            {cleanContent}
          </div>
        </div>

        {/* Sources below AI messages */}
        {sources.length > 0 && !isUser && (
          <div className="flex flex-col gap-1.5 mt-1 ml-1 w-full">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest pl-1 mt-1">Sources</span>
            <div className="flex flex-wrap gap-2">
              {sources.map((s, i) => (
                <SourceBadge key={i} title={s.title} url={s.url} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
