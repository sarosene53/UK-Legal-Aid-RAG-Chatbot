export default function SourceBadge({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs bg-white border border-slate-200 text-slate-500 hover:text-custom-teal hover:border-custom-sky rounded-full px-2.5 py-0.5 transition"
    >
      <span>📄</span> {title}
    </a>
  )
}
