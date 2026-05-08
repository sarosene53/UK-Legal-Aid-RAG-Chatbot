export default function SourceBadge({ 
  title, 
  url,
  isVerified = false,
  similarity = 0,
  publicationDate = ''
}: { 
  title: string; 
  url: string;
  isVerified?: boolean;
  similarity?: number;
  publicationDate?: string;
}) {
  const getRelevanceColor = (sim: number) => {
    if (sim >= 0.85) return 'text-green-600 bg-green-50 border-green-200 hover:border-green-400'
    if (sim >= 0.75) return 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400'
    if (sim >= 0.65) return 'text-amber-600 bg-amber-50 border-amber-200 hover:border-amber-400'
    return 'text-slate-600 bg-slate-50 border-slate-200 hover:border-slate-400'
  }

  const relevanceClass = similarity > 0 ? getRelevanceColor(similarity) : ''
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${title}${publicationDate ? ` (${new Date(publicationDate).toLocaleDateString()})` : ''}${similarity > 0 ? ` - Relevance: ${(similarity * 100).toFixed(0)}%` : ''}`}
      className={`inline-flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 transition border ${
        relevanceClass || 'bg-white border-slate-200 text-slate-500 hover:text-custom-teal hover:border-custom-sky'
      }`}
    >
      <span className="text-sm">{isVerified ? '✓' : '📄'}</span>
      <span className="truncate max-w-[150px]">{title}</span>
      {similarity > 0 && (
        <span className="text-xs opacity-75">({(similarity * 100).toFixed(0)}%)</span>
      )}
    </a>
  )
}
