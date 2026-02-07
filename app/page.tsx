'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSettings } from '../hooks/useSettings'

export default function Home() {
  const router = useRouter()
  const { settings, isLoaded } = useSettings()

  useEffect(() => {
    if (isLoaded) {
      if (settings) {
        router.replace('/dashboard')
      } else {
        router.replace('/settings')
      }
    }
  }, [isLoaded, settings, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Copilot Usage Dashboard
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Track and analyze GitHub Copilot usage metrics
        </p>
        <div className="mt-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">正在跳转...</p>
        </div>
      </div>
    </main>
  )
}
