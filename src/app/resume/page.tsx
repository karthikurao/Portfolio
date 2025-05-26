// src/app/resume/page.tsx
'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamically import ResumeSection with SSR turned off
const ResumeSection = dynamic(
  () => import('@/components/ResumeSection'),
  {
    // This ensures the component is only rendered on the client side
    ssr: false,
    // This provides a fallback UI to show while the component is loading
    loading: () => (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-slate-900">
        <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
        <p className="mt-4 text-lg text-slate-300">Loading Resume...</p>
      </div>
    ),
  }
)

// The page component itself now just returns the dynamically loaded section
export default function ResumePage() {
  return <ResumeSection />
}