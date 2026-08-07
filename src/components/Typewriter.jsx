import React, { useState, useEffect } from 'react'

export default function Typewriter({
  words = [
    'Full-stack Web & Mobile Developer',
    'SaaS Product Builder & Engineer',
    'React.js & Node.js Architecture Specialist',
    'Python & High-Performance API Developer',
    'UI/UX & Interactive Web Engineer'
  ],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  className = ''
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const targetWord = words[currentWordIndex]

    let timer
    if (!isDeleting && currentText !== targetWord) {
      // Typing characters out
      timer = setTimeout(() => {
        setCurrentText(targetWord.substring(0, currentText.length + 1))
      }, typingSpeed)
    } else if (!isDeleting && currentText === targetWord) {
      // Pause at complete word
      timer = setTimeout(() => {
        setIsDeleting(true)
      }, pauseDuration)
    } else if (isDeleting && currentText !== '') {
      // Deleting characters
      timer = setTimeout(() => {
        setCurrentText(targetWord.substring(0, currentText.length - 1))
      }, deletingSpeed)
    } else if (isDeleting && currentText === '') {
      // Switch to next word
      setIsDeleting(false)
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
    }

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className={`inline-flex items-center min-h-[1.4em] ${className}`}>
      <span className="bg-gradient-to-r from-amber-400 via-accent-teal to-cyan-300 bg-clip-text text-transparent drop-shadow-sm font-semibold">
        {currentText}
      </span>
      {/* Blinking Typing Cursor */}
      <span className="inline-block w-[3px] h-[1em] bg-amber-400 ml-1.5 animate-[ping_1s_infinite] rounded-full" />
    </span>
  )
}
