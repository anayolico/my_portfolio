import React from 'react'
import logo from './ima-and/calebytelogo.png'

export default function Footer(){
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12 py-8 flex items-center justify-center transition-colors duration-300">
        <p className="text-sm text-text-muted transition-colors duration-300 flex items-center gap-2">
          <span>© {new Date().getFullYear()} CaleByte Technologies. All rights reserved.</span>
          <img 
            src={logo} 
            alt="CaleByte Logo" 
            className="h-5 w-auto object-contain inline-block ml-1 opacity-80"
          />
        </p>
      </div>
    </footer>
  )
}
