'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
import { FaLinkedinIn, FaTwitter, FaGithub } from 'react-icons/fa';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Team members data
const teamMembers = [
  {
    id: 1,
    name: "Ahmad Ch",
    role: "CEO & Founder",
    image: "https://i.imgur.com/i6P7Dci.jpeg",
    bio: "Over 15 years of experience in cloud infrastructure and enterprise security. Previously led engineering teams at AWS and Microsoft.",
    expertise: ["Cloud Architecture", "Enterprise Security", "Strategic Planning"],
    social: {
      linkedin: "https://linkedin.com/in/example",
      twitter: "https://twitter.com/example",
      github: "https://github.com/example"
    },
    accentColor: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    name: "Abdul Rehman Ch",
    role: "Technical Lead",
    image: "https://i.imgur.com/yzodBwQ.jpeg",
    bio: "Experienced Technical Support Lead with a strong background in troubleshooting complex systems, managing support teams, and ensuring high customer satisfaction in IT service environments.",
    expertise: ["Technical Troubleshooting", "Customer Support Management", "IT Service Delivery"],
    social: {
      linkedin: "https://linkedin.com/in/example",
      twitter: "https://twitter.com/example",
      github: "https://github.com/example"
    },
    accentColor: "from-emerald-500 to-cyan-500"
  },
  {
    id: 3,
    name: "Ahmad Ch",
    role: "Head of Security",
    image: "https://i.imgur.com/bLXbW2g.jpg",
    bio: "Security expert with CISSP certification and background in enterprise-level threat detection and prevention.",
    expertise: ["Network Security", "Threat Intelligence", "Compliance"],
    social: {
      linkedin: "https://linkedin.com/in/example",
      twitter: "https://twitter.com/example",
      github: "https://github.com/example"
    },
    accentColor: "from-amber-500 to-orange-600"
  }
];

// Subtle animated background pattern
const BackgroundPattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
      <div className="absolute w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:20px_20px]"></div>
    </div>
  );
};

// Advanced glowing accent
const GlowingAccent = ({ color, active }) => {
  return (
    <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} opacity-0 ${active ? 'animate-pulse-slow opacity-20' : ''} rounded-2xl blur-xl transition-opacity duration-1000`}></div>
  );
};

// Expertise Pill Component with animation
const ExpertisePill = ({ skill, delay }) => (
  <motion.span 
    className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    whileHover={{ y: -2, scale: 1.05 }}
  >
    {skill}
  </motion.span>
);

// Social Icon Component with enhanced effects
const SocialIcon = ({ platform, url, delay }) => {
  const getIcon = () => {
    switch (platform) {
      case 'linkedin':
        return <FaLinkedinIn className="h-4 w-4 text-blue-500 group-hover:text-white transition-colors" />;
      case 'twitter':
        return <FaTwitter className="h-4 w-4 text-sky-500 group-hover:text-white transition-colors" />;
      case 'github':
        return <FaGithub className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors" />;
      default:
        return null;
    }
  };
  
  const getHoverColor = () => {
    switch (platform) {
      case 'linkedin':
        return "group-hover:bg-blue-500";
      case 'twitter':
        return "group-hover:bg-sky-500";
      case 'github':
        return "group-hover:bg-gray-700";
      default:
        return "group-hover:bg-blue-500";
    }
  };
  
  return (
    <motion.a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${getHoverColor()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {getIcon()}
    </motion.a>
  );
};

// Minimal progress bar for auto-rotate
const ProgressBar = ({ duration, isPlaying, onComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let timer;
    let startTime;
    
    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(elapsed / (duration * 1000), 1);
      
      setProgress(newProgress);
      
      if (newProgress < 1) {
        timer = requestAnimationFrame(animateProgress);
      } else {
        onComplete();
      }
    };
    
    if (isPlaying) {
      timer = requestAnimationFrame(animateProgress);
    }
    
    return () => {
      if (timer) {
        cancelAnimationFrame(timer);
      }
    };
  }, [duration, isPlaying, onComplete]);
  
  return (
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
        style={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </div>
  );
};

// Team Section Component
const TeamSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);
  
  // Navigation handlers
  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setActiveIndex(prev => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setDirection(1);
    setActiveIndex(prev => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };
  
  // Auto-rotate timer completed handler
  const handleTimerComplete = () => {
    if (isAutoPlaying) {
      goToNext();
    }
  };
  
  // Reset auto-play after user interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [isAutoPlaying]);

  // Card variants
  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 5 : -5
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 5 : -5,
      transition: {
        duration: 0.5
      }
    })
  };

  // Section variants for scroll animation
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.2
      }
    }
  };

  // Children elements variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-white overflow-hidden relative"
    >
      <BackgroundPattern />
      
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Section header */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-sm font-medium mb-4 border border-blue-100 shadow-sm"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            Our Leadership
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Meet the Team
          </h2>
          
          <p className="text-lg text-gray-600">
            Our experts bring decades of combined experience in cloud architecture, 
            security, and infrastructure optimization to deliver industry-leading solutions.
          </p>
        </motion.div>
        
        {/* Team carousel */}
        <motion.div 
          variants={itemVariants}
          className="relative max-w-5xl mx-auto mb-12"
        >
          {/* Auto-rotate progress bar */}
          {isAutoPlaying && (
            <div className="absolute -top-6 left-0 right-0 z-10">
              <ProgressBar duration={5} isPlaying={isAutoPlaying} onComplete={handleTimerComplete} />
            </div>
          )}
        
          {/* Cards */}
          <div className="relative h-[450px] perspective-1000">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 transform-gpu"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col md:flex-row">
                  <GlowingAccent color={teamMembers[activeIndex].accentColor} active={true} />
                  
                  {/* Left section with image */}
                  <div className="md:w-5/12 h-60 md:h-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/20 to-gray-900/0 z-10"></div>
                    <Image
                      src={teamMembers[activeIndex].image}
                      alt={teamMembers[activeIndex].name}
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                    
                    {/* Overlay gradient and name on mobile */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent md:hidden">
                      <h3 className="text-2xl font-bold text-gray-900">{teamMembers[activeIndex].name}</h3>
                      <p className="text-blue-600 font-medium mt-1">{teamMembers[activeIndex].role}</p>
                    </div>
                  </div>
                  
                  {/* Right section with content */}
                  <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-center">
                    {/* Name and role - visible only on desktop */}
                    <div className="hidden md:block mb-4">
                      <motion.h3 
                        className="text-2xl font-bold text-gray-900"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {teamMembers[activeIndex].name}
                      </motion.h3>
                      <motion.div 
                        className="text-lg font-medium mt-0.5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <span className={`bg-gradient-to-r ${teamMembers[activeIndex].accentColor} bg-clip-text text-transparent`}>
                          {teamMembers[activeIndex].role}
                        </span>
                      </motion.div>
                    </div>
                    
                    <motion.p 
                      className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {teamMembers[activeIndex].bio}
                    </motion.p>
                    
                    {/* Expertise */}
                    <div className="mb-4">
                      <motion.h4 
                        className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        Areas of Expertise
                      </motion.h4>
                      <div className="flex flex-wrap gap-1.5">
                        {teamMembers[activeIndex].expertise.map((skill, idx) => (
                          <ExpertisePill key={idx} skill={skill} delay={0.4 + idx * 0.1} />
                        ))}
                      </div>
                    </div>
                    
                    {/* Social Links */}
                    <div>
                      <motion.h4 
                        className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        Connect
                      </motion.h4>
                      <div className="flex space-x-2">
                        <SocialIcon platform="linkedin" url={teamMembers[activeIndex].social.linkedin} delay={0.7} />
                        <SocialIcon platform="twitter" url={teamMembers[activeIndex].social.twitter} delay={0.8} />
                        <SocialIcon platform="github" url={teamMembers[activeIndex].social.github} delay={0.9} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation arrows with enhanced visuals */}
          <motion.button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center z-10 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
          </motion.button>
          
          <motion.button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-6 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center z-10 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-800" />
          </motion.button>
          
          {/* Enhanced indicators */}
          <div className="absolute -bottom-12 left-0 right-0 flex justify-center space-x-3">
            {teamMembers.map((_, index) => (
              <motion.button
                key={index}
                className={`w-12 h-1.5 rounded-full ${
                  index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
                } focus:outline-none`}
                initial={{ opacity: 0.5, scaleX: 0.7 }}
                animate={{ 
                  opacity: index === activeIndex ? 1 : 0.5,
                  scaleX: index === activeIndex ? 1 : 0.7
                }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TeamSection; 