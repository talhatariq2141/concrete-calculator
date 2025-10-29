import React from 'react'
import Link from 'next/link'

export const Footer = () => {
  return (
    
    <footer className="border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 bg-[#0e1013]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 mb-4">
            &copy; {new Date().getFullYear()} Concrete Calculator Max. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-sm text-slate-500">
            <Link href="/privacy-policy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
            <Link href="/about-us" className="hover:text-teal-400 transition-colors">About Us</Link>
          </div>
        </div>
      </footer>

  )
}
