import React from 'react'

export default function Footer(){
  return (
    <footer className="w-full border-t border-gray-800 mt-12">
      <div className="container mx-auto px-6 md:px-12 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Anayolico — Built with React, Tailwind & Framer Motion
      </div>
    </footer>
  )
}
