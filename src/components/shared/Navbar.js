import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-[0_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="border-2 border-black bg-white rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="relative w-32 h-11">
              <Image
                src="/image/logo.png"
                alt="Simenu Logo"
                fill
                className="object-contain"
              />
            </div>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/demo" 
              className="text-gray-700 hover:text-[#99BC85] font-medium border-2 border-black bg-white px-4 py-1 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Demo
            </Link>
            <Link 
              href="/owner" 
              className="text-gray-700 hover:text-[#99BC85] font-medium border-2 border-black bg-white px-4 py-1 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Owner
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden border-2 border-black bg-white p-2 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden border-2 border-black bg-white rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/demo"
              className="block px-3 py-2 text-gray-700 hover:text-[#99BC85] font-medium border-2 border-black bg-white rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              href="/owner"
              className="block px-3 py-2 text-gray-700 hover:text-[#99BC85] font-medium border-2 border-black bg-white rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Owner
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 