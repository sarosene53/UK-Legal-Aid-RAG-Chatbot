import { Message } from 'ai'
import SourceBadge from './SourceBadge'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export interface ServerCitation {
  id: string
  source_title: string
  source_url: string
  publication_date: string
  similarity: number
}

// Parses [[Source: title | url]] or standard markdown list links * [Title] (URL) inject by LLM, server citations are primary source of truth
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
 
  if (sources.length === 0) {

    cleanContent = cleanContent.replace(/\*?\*?Sources:\*?\*?\s*/ig, '').trim()
  } else {
    cleanContent = cleanContent.replace(/\*?\*?Sources:\*?\*?\s*$/i, '').trim()
  }

  cleanContent = cleanContent.replace(/\*\*(.+?)\*\*/g, '$1')

  return { cleanContent, sources }
}

export default function MessageBubble({ 
  message, 
  serverCitations = []
}: { 
  message: Message
  serverCitations?: ServerCitation[]
}) {
  const isUser = message.role === 'user'
  const { cleanContent, sources: parsedSources } = parseSourcesFromContent(message.content)

  // Use server citations as primary source of truth
  // Only fall back to parsed sources if no server citations available
  const finalSources = serverCitations.length > 0 
    ? serverCitations.map(c => ({
        title: c.source_title,
        url: c.source_url,
        similarity: c.similarity,
        isVerified: true,
        publicationDate: c.publication_date
      }))
    : parsedSources.map(s => ({
        title: s.title,
        url: s.url,
        isVerified: false, // Parsed from LLM output, not verified
        similarity: 0,
        publicationDate: undefined
      }))

  // Check if parsed sources match any server citations (validation)
  const validatedSources = finalSources.map(source => {
    if (!source.isVerified && serverCitations.length > 0) {
      // If we have server citations but this source was parsed, check if it matches
      const matched = serverCitations.find(sc => 
        sc.source_url === source.url || 
        sc.source_title.toLowerCase() === source.title.toLowerCase()
      )
      if (matched) {
        source.isVerified = true
      }
    }
    return source
  })

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
        {validatedSources.length > 0 && !isUser && (
          <div className="flex flex-col gap-2 mt-2 ml-1 w-full">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                {serverCitations.length > 0 ? '✓ Verified Sources' : 'Sources (from response)'}
              </span>
              {serverCitations.length === 0 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-custom-amber/20 text-custom-orange rounded font-semibold">
                  Parsed
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {validatedSources.map((s, i) => (
                <SourceBadge 
                  key={i} 
                  title={s.title} 
                  url={s.url}
                  isVerified={s.isVerified}
                  similarity={s.similarity}
                  publicationDate={s.publicationDate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Show warning if no sources available */}
        {finalSources.length === 0 && !isUser && serverCitations.length === 0 && parsedSources.length === 0 && (
          <div className="text-[12px] text-custom-orange mt-2 ml-1 bg-custom-amber/20 px-3 py-1.5 rounded">
            ⚠️ No sources available for this response
          </div>
        )}
      </div>
    </motion.div>
  )
}
