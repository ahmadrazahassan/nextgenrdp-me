'use client';

import React, { useEffect, useRef, useState, memo, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub, FaDiscord, FaArrowRight } from 'react-icons/fa';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

// Animated gradient text component - memoized
const GradientText = memo(({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x ${className}`}>
    {children}
  </span>
));
GradientText.displayName = 'GradientText';

// Animated pulse dot - memoized
const PulseDot = memo(({ color = "bg-green-500", delay = 0 }) => (
  <span className="relative flex h-2 w-2">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} 
          style={{ animationDelay: `${delay}ms` }}></span>
    <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`}></span>
  </span>
));
PulseDot.displayName = 'PulseDot';

// Modern Footer Section Title
const FooterTitle = memo(({ children }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.5 });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.h3 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      className="text-base font-bold tracking-wide text-white mb-6 flex items-center"
    >
      <div className="w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mr-3"></div>
      {children}
    </motion.h3>
  );
});
FooterTitle.displayName = 'FooterTitle';

// Modern Footer Link
const FooterLink = memo(({ href, children, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.5 });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div 
      ref={ref}
      className="mb-3"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0.5, delay: delay * 0.1, ease: [0.22, 1, 0.36, 1] }
        }
      }}
    >
      <Link 
        href={href} 
        className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
      >
        <span className="w-0 group-hover:w-3 h-[1px] bg-indigo-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
        {children}
      </Link>
    </motion.div>
  );
});
FooterLink.displayName = 'FooterLink';

// Digital circuit animation component - optimized and memoized
const DigitalCircuit = memo(() => {
  const pathsRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    if (!pathsRef.current) {
      pathsRef.current = Array(5).fill(0).map(() => ({
        path: `M${Math.random() * 100} ${Math.random() * 100} Q ${Math.random() * 200 + 100} ${Math.random() * 200}, ${Math.random() * 100 + 200} ${Math.random() * 100 + 100}`,
        stroke: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 255)}, 0.4)`,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 2
      }));
    }
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 select-none will-change-transform">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {pathsRef.current?.map((pathData, i) => (
          <motion.path
            key={i}
            d={pathData.path}
            stroke={pathData.stroke}
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0, 0.5, 0],
            }}
            transition={{ 
              duration: pathData.duration, 
              repeat: Infinity, 
              repeatType: "loop", 
              ease: "linear",
              delay: pathData.delay,
              repeatDelay: 1
            }}
          />
        ))}
      </svg>
    </div>
  );
});
DigitalCircuit.displayName = 'DigitalCircuit';

// Modern Social Icon
const SocialIcon = memo(({ icon: Icon, href, name, color }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 ease-out hover:bg-gray-700"
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="sr-only">{name}</span>
      <Icon className={`h-5 w-5 ${color} transition-transform duration-300 group-hover:scale-110`} />
    </motion.a>
  );
});
SocialIcon.displayName = 'SocialIcon';

// Newsletter Form
const NewsletterForm = memo(() => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
  }, [email]);
  
  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="relative z-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm p-1">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl"></div>
        
        <div className="relative flex">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            className="w-full px-4 py-3 bg-transparent text-white placeholder:text-gray-400 rounded-l-xl border-0 focus:ring-0 focus:outline-none"
            required
          />
          <motion.button 
            type="submit"
            className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-r-xl whitespace-nowrap flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Subscribe <FaArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">Join 2,000+ subscribers receiving updates</p>
    </motion.form>
  );
});
NewsletterForm.displayName = 'NewsletterForm';

// Contact Info Item 
const ContactItem = memo(({ icon: Icon, children, color = "from-indigo-500 to-purple-500" }) => (
  <motion.div 
    className="flex items-start gap-3 mb-5"
    whileHover={{ x: 3 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="rounded-lg p-2.5 bg-gray-800">
      <div className={`bg-gradient-to-r ${color} bg-clip-text`}>
        <Icon className="h-5 w-5 text-transparent" />
      </div>
    </div>
    <div className="text-gray-300">
      {children}
    </div>
  </motion.div>
));
ContactItem.displayName = 'ContactItem';

// Main Footer Component - completely redesigned
const Footer = () => {
    const currentYear = new Date().getFullYear();
    const whatsappLink = "https://wa.link/ty3ydp";
    const adminImageUrl = "https://i.imgur.com/Is0qkjw.jpeg";
    const sectionRef = useRef(null);
    
    // Memoize social links to prevent unnecessary re-renders
    const socialLinks = useMemo(() => [
      { name: 'WhatsApp', href: whatsappLink, icon: FaWhatsapp, color: 'text-green-500' },
      { name: 'Facebook', href: '#', icon: FaFacebookF, color: 'text-blue-500' },
      { name: 'Twitter', href: '#', icon: FaTwitter, color: 'text-sky-500' },
      { name: 'LinkedIn', href: '#', icon: FaLinkedinIn, color: 'text-blue-700' },
      { name: 'GitHub', href: '#', icon: FaGithub, color: 'text-gray-400' },
      { name: 'Discord', href: '#', icon: FaDiscord, color: 'text-indigo-500' },
    ], [whatsappLink]);
    
    // Memoize footer link sections
    const companyLinks = useMemo(() => [
      { text: 'Features', href: '/#features' },
      { text: 'Pricing', href: '/pricing' },
      { text: 'Terms of Service', href: '/terms' },
      { text: 'Privacy Policy', href: '/privacy' },
      { text: 'About Us', href: '/about' },
    ], []);
    
    const productLinks = useMemo(() => [
      { text: 'Windows RDP', href: '/rdp' },
      { text: 'Linux VPS', href: '/vps' },
      { text: 'Enterprise Solutions', href: '/enterprise' },
      { text: 'Pricing Plans', href: '/pricing' },
      { text: 'API Access', href: '/api' },
    ], []);
    
    const supportLinks = useMemo(() => [
      { text: 'Contact Us', href: '/contact' },
      { text: 'Submit Ticket', href: '/support' },
      { text: 'FAQ', href: '/faq' },
      { text: 'Documentation', href: '/documentation' },
      { text: 'System Status', href: '/status' },
    ], []);
    
    // Optimize intersection observer
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

    // Animation variants
    const containerVariants = useMemo(() => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    }), []);

    return (
      <footer 
        ref={sectionRef}
        className="relative bg-gray-900 text-white overflow-hidden mt-20"
      >
        {/* Animated gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        {/* Animated background particles */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/images/grid.svg')] bg-repeat opacity-5"></div>
        {isInView && <DigitalCircuit />}
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-900/20 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-900/20 blur-[100px]"></div>
        
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Column 1: Brand & Newsletter */}
            <div className="md:col-span-6 lg:col-span-5 space-y-8">
              <div>
                <Link href="/" className="inline-block mb-6">
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div className="relative h-14 w-14 mr-3">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 opacity-90 blur-[12px] group-hover:blur-[14px] group-hover:scale-110 transition-all duration-300"></div>
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
                          <SparklesIcon className="h-7 w-7 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div>
                      <span className="font-serif text-2xl font-semibold bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent block tracking-wider uppercase leading-tight group-hover:from-violet-400 group-hover:to-indigo-400 transition-all duration-300 drop-shadow-sm">
                        NextGenRDP
                      </span>
                      <span className="text-xs text-gray-400 tracking-widest uppercase">Premium Remote Desktop Services</span>
                    </div>
                  </motion.div>
                </Link>
                
                <p className="text-gray-400 text-base max-w-md">
                  Elevating your digital experience with high-performance RDP & VPS, 
                  powered by expert support and cutting-edge infrastructure.
                </p>
              </div>
              
              <div className="space-y-5">
                <h3 className="text-xl font-bold">Subscribe to our newsletter</h3>
                <p className="text-gray-400">Get the latest news, updates and offers straight to your inbox.</p>
                <NewsletterForm />
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                {socialLinks.map((item) => (
                  <SocialIcon 
                    key={item.name}
                    icon={item.icon}
                    href={item.href}
                    name={item.name}
                    color={item.color}
                  />
                ))}
              </div>
            </div>
            
            {/* Divider for mobile */}
            <div className="md:hidden w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            
            {/* Column 2: Links Grid */}
            <div className="md:col-span-6 lg:col-span-4">
              <div className="grid grid-cols-2 gap-8">
                {/* Company Links */}
                <div>
                  <FooterTitle>Company</FooterTitle>
                  <div className="space-y-3">
                    {companyLinks.map((link, index) => (
                      <FooterLink key={link.href} href={link.href} delay={index}>
                        {link.text}
                      </FooterLink>
                    ))}
                  </div>
                </div>
                
                {/* Support Links */}
                <div>
                  <FooterTitle>Support</FooterTitle>
                  <div className="space-y-3">
                    {supportLinks.map((link, index) => (
                      <FooterLink key={link.href} href={link.href} delay={index}>
                        {link.text}
                      </FooterLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Column 3: Contact Info */}
            <div className="md:col-span-12 lg:col-span-3">
              <FooterTitle>Contact Us</FooterTitle>
              
              <div className="space-y-4">
                <ContactItem 
                  icon={MapPinIcon} 
                  color="from-blue-500 to-sky-500"
                >
                  <p>New York , USA
                  </p>
                </ContactItem>
                
                <ContactItem 
                  icon={EnvelopeIcon}
                  color="from-purple-500 to-pink-500"
                >
                  <a 
                    href="mailto:nextgenrdp@gmail.com" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    nextgenrdp@gmail.com

                  </a>
                </ContactItem>
                
                <ContactItem 
                  icon={FaWhatsapp}
                  color="from-green-500 to-emerald-500"
                >
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Chat via WhatsApp
                    <PulseDot color="bg-green-500" delay={300} />
                  </a>
                </ContactItem>
                
                {/* Admin Chat */}
                <motion.div
                  className="mt-6 p-4 bg-gray-800/70 rounded-xl backdrop-blur-sm border border-gray-700 overflow-hidden group relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 opacity-75 blur-sm group-hover:animate-spin-slow"></div>
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-gray-700">
                        <Image 
                          src={adminImageUrl} 
                          alt="Ahmad Raza" 
                          width={48} 
                          height={48}
                          className="object-cover"
                          unoptimized={true}
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">Ahmad Raza</h4>
                        <span className="text-[10px] bg-indigo-900/50 px-2 py-0.5 rounded-full text-indigo-300 border border-indigo-700/50">
                          Founder
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">CEO & CFO</p>
                      <a 
                        href={whatsappLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium"
                      >
                        <FaWhatsapp className="h-3.5 w-3.5" />
                        <span>Chat Now</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.p 
                className="text-sm text-gray-500 mb-4 md:mb-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                &copy; {currentYear} <span className="text-gray-400">NextGenRDP</span>. All rights reserved.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap items-center gap-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy</Link>
                <Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Cookies</Link>
                <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                  <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-1.5" />
                  <span className="text-xs text-gray-300">Secure Payments</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </footer>
    );
};

export default Footer; 