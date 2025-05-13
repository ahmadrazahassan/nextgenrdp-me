'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import {
  BoltIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckBadgeIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  TagIcon,
  CloudIcon,
  CpuChipIcon,
  GlobeAltIcon,
  CommandLineIcon,
  CubeTransparentIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import {
  ArrowRightIcon,
  CheckBadgeIcon as CheckBadgeSolidIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import { FaWhatsapp, FaServer, FaRocket, FaShieldAlt, FaDatabase } from 'react-icons/fa';

// Animated Particle Background with more particles and varied colors
const ParticleBackground = () => {
  // Use client-side only rendering with useEffect
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate particles only on the client side with specific colors
    const newParticles = Array.from({ length: 80 }, () => ({
      width: Math.random() * 8 + 2,
      height: Math.random() * 8 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      xOffset: Math.random() * 20 - 10,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
      // Assign specific colors instead of gradients
      color: Math.random() > 0.66 ? "rgba(14, 165, 233, 0.15)" : 
             Math.random() > 0.33 ? "rgba(34, 197, 94, 0.15)" : 
             "rgba(249, 115, 22, 0.15)"
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: particle.width,
            height: particle.height,
            left: particle.left,
            top: particle.top,
            backgroundColor: particle.color
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Add a new Digital Circuit Animation component
const DigitalCircuitAnimation = () => {
  const [circuits, setCircuits] = useState([]);
  
  useEffect(() => {
    // Generate circuit paths on client side
    const newCircuits = Array.from({ length: 15 }, (_, i) => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const length = 30 + Math.random() * 70;
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const turns = Math.floor(Math.random() * 3);
      
      return {
        id: i,
        startX,
        startY,
        length,
        direction,
        turns,
        color: i % 3 === 0 ? "#0ea5e9" : i % 3 === 1 ? "#22c55e" : "#f97316",
        delay: i * 0.2,
        duration: 1.5 + Math.random() * 2
      };
    });
    
    setCircuits(newCircuits);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {circuits.map((circuit) => {
          // Create path data based on circuit properties
          let pathData = `M ${circuit.startX}% ${circuit.startY}% `;
          let currentX = circuit.startX;
          let currentY = circuit.startY;
          
          if (circuit.direction === 'horizontal') {
            pathData += `h ${circuit.length} `;
            currentX += circuit.length;
          } else {
            pathData += `v ${circuit.length} `;
            currentY += circuit.length;
          }
          
          // Add turns if specified
          for (let i = 0; i < circuit.turns; i++) {
            if (Math.random() > 0.5) {
              const turnLength = 10 + Math.random() * 30;
              pathData += `v ${turnLength} `;
              currentY += turnLength;
            } else {
              const turnLength = 10 + Math.random() * 30;
              pathData += `h ${turnLength} `;
              currentX += turnLength;
            }
          }
          
          return (
            <motion.path
              key={circuit.id}
              d={pathData}
              stroke={circuit.color}
              strokeWidth="1"
              fill="none"
              strokeDasharray="4,4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: [0, 1, 1, 0],
              }}
              transition={{ 
                duration: circuit.duration,
                delay: circuit.delay,
                repeat: Infinity,
                repeatDelay: 3 + Math.random() * 5
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Add a new Data Pulse Animation component
const DataPulseAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(6)].map((_, i) => {
        const size = 40 + i * 20;
        const delay = i * 0.5;
        const color = i % 3 === 0 ? "rgba(14, 165, 233, 0.05)" : 
                     i % 3 === 1 ? "rgba(34, 197, 94, 0.05)" : 
                     "rgba(249, 115, 22, 0.05)";
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
              backgroundColor: color,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 3],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4,
              delay,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        );
      })}
    </div>
  );
};

// Enhanced Server Visualization with more tech elements
const ServerVisualization = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div 
      ref={ref}
      className="relative w-full h-[400px] perspective-1000"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {/* Server rack */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] h-[320px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden"
        animate={{ 
          rotateY: [0, 5, 0, -5, 0],
          rotateX: [0, 2, 0, -2, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {/* Server header */}
        <div className="h-8 bg-slate-700 border-b border-slate-600 flex items-center px-4">
          <div className="flex space-x-1.5">
            <motion.div 
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.div 
              className="w-2 h-2 rounded-full bg-amber-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.3 }}
            />
            <motion.div 
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.6 }}
            />
          </div>
          <div className="ml-auto flex items-center">
            <span className="text-[10px] text-slate-300 font-mono">NextGen RDP</span>
          </div>
        </div>

        {/* Server units */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="mx-3 h-12 my-3 bg-slate-800 rounded-md border border-slate-700 shadow-inner flex items-center px-3"
          >
            {/* Server lights */}
            <div className="flex space-x-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: i % 2 === 0 ? 1.5 : 2, repeat: Infinity }}
              />
              <motion.div 
                className="w-2 h-2 rounded-full bg-sky-500"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: i % 2 === 0 ? 2 : 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </div>
            
            {/* Server details */}
            <div className="ml-auto flex items-center space-x-2">
              <motion.div 
                className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden"
              >
                <motion.div 
                  className={`h-full ${i % 3 === 0 ? 'bg-green-500' : i % 3 === 1 ? 'bg-sky-500' : 'bg-orange-500'}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${(i + 3) * 15}%` }}
                  transition={{ duration: 2, delay: i * 0.2 }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
        
        {/* Data flow visualization */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {[...Array(3)].map((_, i) => (
              <motion.path 
                key={i}
                d={`M40 ${100 + i * 50} L240 ${100 + i * 50}`}
                stroke={i === 0 ? "rgba(56, 189, 248, 0.3)" : i === 1 ? "rgba(74, 222, 128, 0.3)" : "rgba(251, 146, 60, 0.3)"}
                strokeWidth="1.5"
                strokeDasharray="6,6"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: i % 2 === 0 ? [0, 24] : [0, -24] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </svg>
        </div>

        {/* Glowing effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/5 to-sky-500/0"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>

      {/* Orbiting elements */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-12 h-12"
        animate={{ 
          rotate: [0, 360],
          x: [0, 20, 0, -20, 0],
          y: [0, -20, 0, 20, 0]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="relative w-full h-full">
          <motion.div 
            className="absolute inset-0 rounded-full bg-orange-500/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <CloudIcon className="w-full h-full text-orange-500/80" />
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-1/4 left-1/4 w-12 h-12"
        animate={{ 
          rotate: [0, -360],
          x: [0, -20, 0, 20, 0],
          y: [0, 20, 0, -20, 0]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 18, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="relative w-full h-full">
          <motion.div 
            className="absolute inset-0 rounded-full bg-green-500/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <GlobeAltIcon className="w-full h-full text-green-500/80" />
        </div>
      </motion.div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
            <stop offset="50%" stopColor="rgba(56, 189, 248, 0.5)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(74, 222, 128, 0)" />
            <stop offset="50%" stopColor="rgba(74, 222, 128, 0.5)" />
            <stop offset="100%" stopColor="rgba(74, 222, 128, 0)" />
          </linearGradient>
        </defs>
        
        <motion.path 
          d="M140 50 Q 240 100 340 150" 
          stroke="url(#lineGradient1)" 
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6,6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
        />
        
        <motion.path 
          d="M140 350 Q 240 300 340 250" 
          stroke="url(#lineGradient2)" 
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6,6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop", repeatDelay: 1, delay: 0.5 }}
        />
      </svg>
    </motion.div>
  );
};

// Modify the AdminProfile component to have a horizontal layout
const AdminProfile = ({ name, role }) => {
  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-xl opacity-80 blur-md"></div>
      <div className="relative flex flex-col bg-slate-900/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-purple-500/20">
        {/* Profile section - horizontal layout */}
        <div className="flex flex-row items-center gap-4">
          {/* Profile image */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
              <Image 
                src="https://i.imgur.com/Is0qkjw.jpeg" 
                alt={name} 
                width={64} 
                height={64} 
                className="object-cover"
                unoptimized={true}
              />
            </div>
            <motion.div 
              className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          {/* Profile info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-x-1.5">
              <span className="text-lg font-bold text-white">{name}</span>
              <CheckBadgeSolidIcon className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-sm text-slate-200">{role}</span>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center text-xs font-medium text-green-400">
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Online Now
              </span>
            </div>
          </div>
        </div>
        
        {/* Quote section */}
        <div className="mt-3 pt-3 border-t border-purple-500/20 relative px-2">
          <div className="text-indigo-400 absolute -top-2 left-0 text-lg">"</div>
          <p className="text-xs italic text-slate-300 pl-3">
            We are here to provide you Best Solutions to manage complete work load by using our RDP & VPS Services.
          </p>
          <div className="text-indigo-400 absolute bottom-0 right-0 text-lg">"</div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Typed Text with more dramatic effect
const TypedText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    let i = 0;
    let forward = true;
    
    const typingInterval = setInterval(() => {
      if (forward) {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1));
          i++;
        } else {
          // Pause at the end before starting to delete
          setTimeout(() => {
            forward = false;
          }, 3000);
        }
      } else {
        if (i > 0) {
          i--;
          setDisplayText(text.substring(0, i));
        } else {
          // Pause before starting to type again
          setTimeout(() => {
            forward = true;
          }, 500);
        }
      }
      
      setIsTyping(i < text.length && forward);
    }, 80);
    
    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <span className="relative">
      {displayText}
      <motion.span 
        className="inline-block w-1 h-8 ml-1 bg-purple-500"
        animate={{ opacity: isTyping ? [1, 0, 1] : 0 }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  );
};

// Main Hero Section Component
const HeroSection = () => {
  const promoCode = "NEXTGEN30";
  const discount = "30%";
  const startingPrice = 999;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="relative font-sans overflow-hidden isolate min-h-screen flex items-center py-16 md:py-24 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-900"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 -z-5 opacity-[0.05] dark:opacity-[0.08]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4b5563_1px,transparent_1px),linear-gradient(to_bottom,#4b5563_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
      </div>
      
      {/* Add new digital circuit animation */}
      <DigitalCircuitAnimation />
      
      {/* Add new data pulse animation */}
      <DataPulseAnimation />
      
      {/* Enhanced particle background */}
      <ParticleBackground />
      
      {/* Futuristic color orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"></div>
      <div className="absolute top-2/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl"></div>
      
      {/* Admin Profile positioned further at the bottom */}
      <div className="hidden lg:block absolute right-2 bottom-2 z-30 w-[320px]">
        <motion.div
          className="absolute -inset-20 rounded-[30px] bg-gradient-to-bl from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl z-[-1]"
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
            scale: [0.95, 1, 0.95]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <AdminProfile 
          name="Ahmad Raza"
          role="CEO & CFO"
        />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto relative px-4 sm:px-6 lg:px-8 z-10">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text Content - 7 columns on large screens */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Promo Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex mb-6"
            >
              <div className="inline-flex items-center gap-x-2 bg-slate-800/80 backdrop-blur-sm rounded-full p-1 pr-4 border border-slate-700/50 shadow-lg">
                <motion.span 
                  className="flex items-center justify-center h-7 w-7 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <TagIcon className="h-4 w-4 text-white" />
                </motion.span>
                <p className="text-xs font-semibold text-slate-200">
                  Limited Offer: <span className="font-bold text-purple-400">{discount} OFF!</span> Code: <span className="font-bold tracking-wide text-purple-400">{promoCode}</span>
                </p>
              </div>
            </motion.div>
            
            {/* Headline with typing effect */}
            <motion.h1 
              variants={itemVariants}
              className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl !leading-tight"
            >
              <span className="block">
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                  animate={{ 
                    backgroundPosition: ['0% center', '100% center', '0% center'],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  Next Generation
                </motion.span>
              </span>
              <span className="block mt-1">
                <TypedText text="Remote Desktop & VPS" />
              </span>
            </motion.h1>
            
            {/* Subheading */}
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-lg leading-8 text-slate-300 max-w-3xl"
            >
              Experience unparalleled performance with our cutting-edge RDP and VPS solutions. Designed for professionals who demand reliability, speed, and security.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#pricing"
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Plans
                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
              </motion.a>
              
              <motion.a
                href="https://wa.link/ty3ydp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-slate-300 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg hover:bg-slate-700/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsapp className="mr-2 h-5 w-5 text-green-500" />
                Contact Support
              </motion.a>
            </motion.div>
            
            {/* Features Grid */}
            <motion.div 
              variants={itemVariants}
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <FeatureCard 
                icon={ServerStackIcon} 
                color="bg-gradient-to-r from-indigo-600 to-indigo-700"
                title="High-Performance Servers" 
                description="Blazing fast servers with SSD storage and optimized configurations."
                delay={0.1}
              />
              <FeatureCard 
                icon={ShieldCheckIcon} 
                color="bg-gradient-to-r from-purple-600 to-purple-700"
                title="Enterprise Security" 
                description="Advanced security protocols to keep your data safe and secure."
                delay={0.2}
              />
              <FeatureCard 
                icon={BoltIcon} 
                color="bg-gradient-to-r from-pink-600 to-pink-700"
                title="99.9% Uptime" 
                description="Reliable service with guaranteed uptime and minimal disruptions."
                delay={0.3}
              />
              <FeatureCard 
                icon={ChatBubbleLeftEllipsisIcon} 
                color="bg-gradient-to-r from-indigo-600 to-purple-700"
                title="24/7 Expert Support" 
                description="Our technical team is always available to assist you."
                delay={0.4}
              />
            </motion.div>
          </div>
          
          {/* Visual Content - 5 columns on large screens */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Enhanced Server Visualization */}
            <ServerVisualization />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

// Add this component before the HeroSection component

// Feature Card Component
const FeatureCard = ({ icon: Icon, color, title, description, delay = 0 }) => {
  return (
    <motion.div
      className="relative p-5 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-lg overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      {/* Background glow effect */}
      <div className="absolute -inset-1 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl">
        <div className={`absolute inset-0 ${color} rounded-xl`}></div>
      </div>
      
      {/* Icon */}
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      
      {/* Content */}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
      
      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </motion.div>
  );
};