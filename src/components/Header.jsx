// src/components/Header.jsx
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { ArrowRightCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

// Memoized Logo matching Footer style
const MemoizedLogo = React.memo(({ scrolled }) => {
  return (
    <Link href="/" className="flex items-center group">
      <motion.div 
        className="flex items-center"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <div className="relative h-12 w-12 mr-3">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 opacity-90 blur-[8px] group-hover:blur-[10px] group-hover:scale-110 transition-all duration-300"></div>
          <div className="relative h-full w-full flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 border-2 border-white/30 dark:border-gray-800/30 group-hover:from-violet-500 group-hover:to-indigo-500 transition-all duration-300 shadow-md">
            <motion.div
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }}
              transition={{ 
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="relative"
            >
              <SparklesIcon className="h-6 w-6 text-white" />
            </motion.div>
          </div>
        </div>
        <div>
          <span className="font-sans text-2xl font-extrabold bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent block tracking-wide uppercase leading-none group-hover:from-violet-400 group-hover:to-indigo-400 transition-all duration-300 drop-shadow-md">
            NextGenRDP
          </span>
          <span className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">Premium Remote Desktop Services</span>
        </div>
      </motion.div>
    </Link>
  );
});
MemoizedLogo.displayName = 'MemoizedLogo';

// Memoized navigation link with rounded styles
const NavLink = React.memo(({ href, isActive, children }) => {
  const navItemHover = { 
    hover: { 
      color: '#6d28d9', // purple-700
      transition: { duration: 0.2 }
    } 
  };

  const navLinkBase = "relative px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out rounded-full group";
  const linkClass = `${navLinkBase} ${isActive ? 'text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'}`;
  
  return (
    <motion.div variants={navItemHover} whileHover="hover" className="mx-1">
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    </motion.div>
  );
});
NavLink.displayName = 'NavLink';

// Memoized action button
const ActionButton = React.memo(({ href, variant, onClick, children }) => {
  // Optimized button animations
  const buttonVariants = {
    hover: { 
      scale: 1.03, 
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  // Button styles - pre-computed for efficiency
  const loginButtonClasses = "relative z-10 inline-flex items-center justify-center gap-x-1.5 px-5 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out group";
  
  const registerButtonClasses = "relative z-10 inline-flex items-center justify-center gap-x-1.5 px-5 py-2.5 rounded-full text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out group";
  
  const buttonClass = variant === 'primary' ? loginButtonClasses : registerButtonClasses;
  
  return (
    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
      <Link href={href} className={buttonClass} onClick={onClick}>
        {children}
      </Link>
    </motion.div>
  );
});
ActionButton.displayName = 'ActionButton';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Memoized toggle function
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);
  
  // Optimized scroll handler with throttling
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Header class based on scroll state - memoized
  const headerClass = useMemo(() => {
    return `sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300 font-sans ${
      scrolled ? 'bg-white/95 shadow-md border-purple-100' : 'bg-white/90 shadow-sm border-indigo-100'
    }`;
  }, [scrolled]);

  // Only show the header on the homepage
  if (pathname !== '/') {
    return null;
  }

  return (
    <header className={headerClass}>
      <div className="h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500" />
      
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Logo - Memoized component */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.3 }}
        >
          <MemoizedLogo scrolled={scrolled} />
        </motion.div>
        
        {/* Desktop Menu with optimized links */}
        <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-2">
          <NavLink href="/" isActive={pathname === '/'}>Home</NavLink>
          <NavLink href="/vps" isActive={pathname === '/vps'}>VPS Solutions</NavLink>
          <NavLink href="/rdp" isActive={pathname === '/rdp'}>RDP Solutions</NavLink>
          <NavLink href="/pricing" isActive={pathname === '/pricing'}>Pricing</NavLink>
          <NavLink href="/support" isActive={pathname === '/support'}>Support</NavLink>
        </div>
        
        {/* Action Buttons - Optimized */}
        <motion.div
          initial={{ opacity: 0, x: 10 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.3 }}
            className="hidden md:flex md:items-center md:space-x-3"
        >
          <ActionButton href="/register" variant="secondary">
            <UserPlusIcon className="h-4 w-4 mr-1.5" /> Register
          </ActionButton>
          
          <ActionButton href="/login" variant="primary">
            Client Portal <ArrowRightCircleIcon className="h-5 w-5 ml-1" />
          </ActionButton>
        </motion.div>
        
        {/* Mobile Menu Button - Simplified animations */}
        <div className="md:hidden flex items-center">
          <motion.button 
            onClick={toggleMobileMenu} 
            className="p-2 text-gray-500 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full transition-colors duration-200" 
            aria-controls="mobile-menu" 
            aria-expanded={isMobileMenuOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
               <span className="sr-only">Open menu</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div 
                key={isMobileMenuOpen ? 'close' : 'open'} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.15 }}
              >
                    {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6"/> : <Bars3Icon className="h-6 w-6"/>}
                  </motion.div>
               </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu - Performance optimized */}
      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <motion.div 
            key="mobile-menu" 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-md border-t border-purple-100/60 overflow-hidden"
            id="mobile-menu"
          >
            <nav className="px-6 py-5 space-y-3 relative">
              {/* Mobile Nav Links - Updated with rounded styles */}
              <Link href="/" className={`block relative px-4 py-2 text-sm font-medium rounded-full ${pathname === '/' ? 'text-white bg-gradient-to-r from-violet-600 to-purple-600' : 'text-gray-600 hover:bg-gray-100'}`} onClick={toggleMobileMenu}>Home</Link>
              <Link href="/vps" className={`block relative px-4 py-2 text-sm font-medium rounded-full ${pathname === '/vps' ? 'text-white bg-gradient-to-r from-violet-600 to-purple-600' : 'text-gray-600 hover:bg-gray-100'}`} onClick={toggleMobileMenu}>VPS Solutions</Link>
              <Link href="/rdp" className={`block relative px-4 py-2 text-sm font-medium rounded-full ${pathname === '/rdp' ? 'text-white bg-gradient-to-r from-violet-600 to-purple-600' : 'text-gray-600 hover:bg-gray-100'}`} onClick={toggleMobileMenu}>RDP Solutions</Link>
              <Link href="/pricing" className={`block relative px-4 py-2 text-sm font-medium rounded-full ${pathname === '/pricing' ? 'text-white bg-gradient-to-r from-violet-600 to-purple-600' : 'text-gray-600 hover:bg-gray-100'}`} onClick={toggleMobileMenu}>Pricing</Link>
              <Link href="/support" className={`block relative px-4 py-2 text-sm font-medium rounded-full ${pathname === '/support' ? 'text-white bg-gradient-to-r from-violet-600 to-purple-600' : 'text-gray-600 hover:bg-gray-100'}`} onClick={toggleMobileMenu}>Support</Link>
              
              {/* Mobile Action Buttons */}
              <div className="pt-4 mt-4 border-t border-purple-100/60 space-y-3">
                <Link 
                  href="/register" 
                  className="relative z-10 inline-flex items-center justify-center w-full gap-x-1.5 px-5 py-2.5 rounded-full text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out" 
                  onClick={toggleMobileMenu}
                >
                  <UserPlusIcon className="h-4 w-4 mr-1.5" /> Register
                </Link>
                <Link 
                  href="/login" 
                  className="relative z-10 inline-flex items-center justify-center w-full gap-x-1.5 px-5 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out" 
                  onClick={toggleMobileMenu}
                >
                  Client Portal <ArrowRightCircleIcon className="h-5 w-5 ml-1" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
       </AnimatePresence>
    </header>
  );
};

export default React.memo(Header);