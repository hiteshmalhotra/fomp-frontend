import { useState, useRef, useEffect } from 'react'

export const useRateLimit = () => {
  const [countdown, setCountdown] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = (seconds: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setCountdown(seconds)
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { countdown, start, isLimited: countdown !== null }
}