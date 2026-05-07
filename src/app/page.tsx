import ChatWindow from './components/ChatWindow'
import EscapeHatch from './components/EscapeHatch'
import { Scale } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 relative selection:bg-custom-sky/50 selection:text-custom-navy flex flex-col items-center">
      {/* Dynamic Background with Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-custom-sky/20 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] bg-custom-amber/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-custom-teal/10 rounded-full blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-4 py-8 md:py-16 flex flex-col min-h-screen">
        <header className="mb-8 md:mb-10 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-custom-navy rounded-2xl flex items-center justify-center shadow-xl shadow-custom-navy/20 ring-1 ring-white/10">
              <Scale className="w-6 h-6 text-custom-sky" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-custom-navy via-custom-teal to-custom-sky tracking-tight">
              UK Legal Aid Assistant
            </h1>
          </div>
          
          <div className="inline-flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 px-5 py-2.5 rounded-2xl md:rounded-full bg-white/60 backdrop-blur-md border border-slate-200 shadow-sm text-slate-600 text-xs md:text-[13px] font-medium tracking-wide">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-custom-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-custom-orange"></span>
              </span>
              <span className="text-custom-navy font-semibold">Verified Sources</span>
            </div>
            <span className="hidden md:inline text-slate-300">|</span>
            <span>Based on GOV.UK and LAA official guidance. Not legal advice.</span>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col drop-shadow-2xl shadow-slate-200/50">
          <ChatWindow />
        </div>
      </div>

      <EscapeHatch />
    </main>
  )
}
