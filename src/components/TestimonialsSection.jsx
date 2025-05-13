'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { UserCircleIcon, SparklesIcon, CheckBadgeIcon, HeartIcon } from '@heroicons/react/24/outline';
import { FaQuoteLeft } from 'react-icons/fa';
import Image from 'next/image';

// Enhanced testimonial data with additional details
const testimonials = [
  {
    id: 1,
    quote: "Unbelievable speed, especially with servers in Singapore. NextGenRDP support (Ahmad Raza!) is incredibly responsive and helpful.",
    author: "Hussain Ali.",
    info: "Lahore",
    role: "Digital Marketer",
    avatar: null,
    accentColor: "from-blue-500 to-indigo-600",
    date: "2 weeks ago",
    verified: true,
    likeCount: 24
  },
  {
    id: 2,
    quote: "My website handles traffic spikes flawlessly now. The VPS performance is fantastic value for the price.",
    author: "Amina Tahir.",
    info: "Islamabad",
    role: "Web Developer",
    avatar: null,
    accentColor: "from-emerald-500 to-teal-600",
    date: "1 month ago",
    verified: true,
    likeCount: 18
  },
  {
    id: 3,
    quote: "Finally, a stable Windows RDP for my automation tools. Zero downtime and great resources. Highly recommend!",
    author: "Sana.",
    info: "Lahore",
    role: "Software Engineer",
    avatar: null,
    accentColor: "from-orange-500 to-amber-600",
    date: "3 months ago",
    verified: true,
    likeCount: 31
  }
];

// Performance-optimized particle effect using memo and requestAnimationFrame
const ParticleEffect = React.memo(() => {
  const particlesRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const isInView = useInView(particlesRef, { once: false, amount: 0.1 });
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  
  // Memoized particle generation function to prevent unnecessary recalculations
  const generateParticles = useCallback(() => {
    return Array.from({ length: 20 }, () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      velocity: {
        x: (Math.random() - 0.5) * 0.15,
        y: (Math.random() - 0.5) * 0.15
      },
      opacity: Math.random() * 0.3 + 0.2,
      color: Math.random() > 0.6 ? "rgba(79, 70, 229, 0.2)" : 
             Math.random() > 0.3 ? "rgba(16, 185, 129, 0.2)" : 
             "rgba(249, 115, 22, 0.2)"
    }));
  }, []);
  
  useEffect(() => {
    if (!isInView) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    // Initialize particles only when in view
    setParticles(generateParticles());
    lastTimeRef.current = 0;
    
    // Optimized animation loop with frame skipping for better performance
    const animateParticles = (timestamp) => {
      if (!lastTimeRef.current || timestamp - lastTimeRef.current > 16) { // Limit to ~60fps
        lastTimeRef.current = timestamp;
        
        setParticles(prevParticles => 
          prevParticles.map(particle => {
            let newX = particle.x + particle.velocity.x;
            let newY = particle.y + particle.velocity.y;
            
            // Boundary check with velocity inversion
            if (newX < 0 || newX > 100) particle.velocity.x *= -1;
            if (newY < 0 || newY > 100) particle.velocity.y *= -1;
            
            return {
              ...particle,
              x: newX < 0 ? 0 : newX > 100 ? 100 : newX,
              y: newY < 0 ? 0 : newY > 100 ? 100 : newY
            };
          })
        );
      }
      
      animationRef.current = requestAnimationFrame(animateParticles);
    };
    
    animationRef.current = requestAnimationFrame(animateParticles);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isInView, generateParticles]);
  
  // Render particles only when in view
  if (!isInView) return null;
  
  return (
    <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full will-change-transform"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            backgroundColor: particle.color,
            transform: `translate(-50%, -50%)`,
            transition: 'opacity 0.5s ease'
          }}
      />
    ))}
  </div>
);
});

ParticleEffect.displayName = 'ParticleEffect';

// Dynamic Glowing Border
const GlowingBorder = ({ isHovered, accentColor }) => (
  <div 
    className={`absolute -inset-[1px] bg-gradient-to-r ${accentColor} rounded-xl opacity-0 transition-opacity duration-300 blur-[2px] group-hover:opacity-80`}
    style={{ 
      opacity: isHovered ? 0.8 : 0,
      transition: 'opacity 0.3s ease, blur 0.3s ease',
      willChange: 'opacity, blur'
    }}
  ></div>
);

// Card Badge Component
const VerifiedBadge = React.memo(() => (
  <motion.div 
    className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 border border-green-100 dark:border-green-800/30 shadow-sm"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3, duration: 0.2 }}
  >
    <CheckBadgeIcon className="h-3.5 w-3.5 text-green-500" />
    <span className="text-xs font-medium text-green-700 dark:text-green-500">Verified</span>
  </motion.div>
));

VerifiedBadge.displayName = 'VerifiedBadge';

// Like Button Component with interaction - optimized with useCallback
const LikeButton = ({ count: initialCount }) => {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  
  const handleLike = useCallback(() => {
    if (!liked) {
      setCount(prev => prev + 1);
      setLiked(true);
    } else {
      setCount(prev => prev - 1);
      setLiked(false);
    }
  }, [liked]);
  
  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
        liked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
      } transition-colors`}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <HeartIcon className={`h-3.5 w-3.5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
      <span className="text-xs font-medium">{count}</span>
    </button>
  );
};

// Advanced Testimonial Card Component
const TestimonialCard = React.memo(({ testimonial, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2, margin: "100px 0px" });
  const controls = useAnimation();
  
  // Optimized mouse tracking with useCallback
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !isHovered) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const posX = (e.clientX - centerX) / 15; // Reduced for more subtle effect
    const posY = (e.clientY - centerY) / 15; // Reduced for more subtle effect
    
    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${-posY}deg) rotateY(${posX}deg) scale3d(1.01, 1.01, 1.01)`;
      }
    });
  }, [isHovered]);
  
  const resetCardTransform = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  }, []);
  
  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { 
          type: 'spring', 
          stiffness: 50, 
          damping: 15,
          delay: index * 0.15
        }
      });
    }
  }, [controls, isInView, index]);
  
  // Memoized background gradient style for better performance
  const gradientStyle = useMemo(() => ({
    background: `linear-gradient(to bottom right, var(--${testimonial.accentColor.split('-')[1]}), var(--${testimonial.accentColor.split('-')[2].split(' ')[0]}))`
  }), [testimonial.accentColor]);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={controls}
      className="relative h-full"
      style={{ 
        transformStyle: 'preserve-3d', 
        transition: 'transform 0.15s ease-out',
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetCardTransform();
      }}
    >
      {/* Glass effect border */}
      <GlowingBorder isHovered={isHovered} accentColor={testimonial.accentColor} />
      
      <div className="relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100/80 dark:border-gray-700/80 overflow-hidden group cursor-default will-change-transform">
        {/* Decorative header band */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${testimonial.accentColor}`}></div>
        
        {testimonial.verified && <VerifiedBadge />}
        
        {/* Quote Icon with optimized animation */}
        <motion.div
          className="absolute top-4 right-4 z-0"
          initial={{ opacity: 0.02, rotate: -10, scale: 1 }}
          animate={{ 
            opacity: [0.05, 0.07, 0.05], 
            rotate: [-5, 0, -5],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror"
          }}
        >
          <FaQuoteLeft
            className={`h-16 w-16 bg-gradient-to-br ${testimonial.accentColor} bg-clip-text text-transparent opacity-20`}
            aria-hidden="true"
          />
        </motion.div>

        {/* Testimonial Content with improved layout */}
        <div className="flex flex-col flex-grow p-6 sm:p-8 relative z-10">
          <div className="flex justify-start items-center mb-6">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
              <motion.div 
                className="relative w-2 h-2"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></span>
                <motion.span
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{ 
                    duration: 3,
                    ease: "easeInOut", 
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 2
                  }}
                />
              </motion.div>
              {testimonial.date}
            </span>
          </div>

          <blockquote className="flex-grow mb-8">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              "{testimonial.quote}"
            </p>
          </blockquote>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-4"></div>

          {/* Author Info with improved layout */}
          <div className="flex justify-between items-center mt-auto pt-2">
            <div className="flex items-center gap-x-3">
              <div className="flex-shrink-0 relative group">
                {testimonial.avatar ? (
                  <Image
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${testimonial.accentColor} flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-lg`}>
                    <motion.span 
                      className="text-sm font-bold text-white"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                    >
                      {testimonial.author.charAt(0)}
                    </motion.span>
                  </div>
                )}
                <motion.div 
                  className={`absolute -inset-1 rounded-full bg-gradient-to-r ${testimonial.accentColor} opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-70`}
                  style={{ zIndex: -1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{testimonial.author}</p>
                <div className="flex items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.info}</p>
                  <span className="mx-1.5 h-0.5 w-0.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
            <LikeButton count={testimonial.likeCount} />
          </div>
        </div>

        {/* Optimized radial hover effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isHovered ? 
              'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)' : 
              'transparent',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            willChange: 'opacity'
          }}
        />
      </div>
    </motion.div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

// Lazy-loaded section divider for better performance
const SectionDivider = React.memo(() => (
  <div className="relative flex items-center py-5 my-8">
    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
    <span className="flex-shrink mx-4">
      <SparklesIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
    </span>
    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
  </div>
));

SectionDivider.displayName = 'SectionDivider';

// Dynamic Background Component
const AnimatedBackground = React.memo(({ scrollYProgress }) => {
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  return (
    <>
      <motion.div
        className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-orange-100/30 via-sky-100/20 to-green-100/40 opacity-70 dark:opacity-10 dark:from-orange-900/10 dark:via-sky-900/5 dark:to-green-900/10"
        style={{ 
          y: backgroundY, 
          backgroundSize: '400% 400%',
          willChange: 'background-position, transform'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 100%', '100% 0%', '0% 0%']
        }}
        transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
      />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#2d3748_1px,transparent_1px),linear-gradient(to_bottom,#2d3748_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]"></div>
    </>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

// Main Section with advanced performance optimizations
const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1, margin: "100px 0px" });
  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const { scrollYProgress } = useScroll({ 
    target: sectionRef,
    offset: ["start end", "end start"] 
  });
  
  // Parallax effect
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  
  // Custom heading animation
  const titleControls = useAnimation();
  
  useEffect(() => {
    if (headerInView) {
      titleControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
      });
    }
  }, [headerInView, titleControls]);
  
  // Intersection observer for lazy loading
  const [shouldRenderParticles, setShouldRenderParticles] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      // Delay heavy particle rendering for better initial load performance
      const timer = setTimeout(() => {
        setShouldRenderParticles(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShouldRenderParticles(false);
    }
  }, [isInView]);
  
  // Handle mouse tracking for cards
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX / window.innerWidth * 100}%`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY / window.innerHeight * 100}%`);
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="py-24 sm:py-32 bg-white dark:bg-gray-900 font-sans relative overflow-hidden isolate"
    >
      {/* Conditionally rendered background elements */}
      <AnimatedBackground scrollYProgress={scrollYProgress} />
      
      {/* Conditionally render particles only when in view for better performance */}
      {shouldRenderParticles && <ParticleEffect />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with parallax effect */}
        <motion.div
          ref={headerRef}
          className="text-center max-w-3xl mx-auto mb-20"
          style={{ y: textY }}
        >
          <motion.span
            className="inline-flex items-center rounded-full px-4 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 ring-1 ring-inset ring-orange-300/20 dark:ring-orange-700/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            Client Feedback
            <motion.span 
              className="ml-1.5"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <SparklesIcon className="h-4 w-4 text-orange-500 dark:text-orange-400" />
            </motion.span>
          </motion.span>
          
          <motion.h2
            className="font-heading text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={titleControls}
          >
            <span className="block">Trusted Performance,</span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-600 dark:from-blue-400 dark:via-indigo-400 dark:to-orange-400 bg-clip-text text-transparent">
              Proven Results
            </span>
          </motion.h2>
          
          <motion.p
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Hear directly from users leveraging NextGenRDP for speed, reliability,
            and growth.
          </motion.p>
        </motion.div>

        {/* Advanced card grid layout with gap animation */}
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </motion.div>
        
        {/* Additional call to action - conditionally rendered */}
        <AnimatePresence>
          {isInView && (
            <motion.div
              className="mt-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <SectionDivider />
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join thousands of satisfied customers worldwide
              </p>
              <motion.button
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-600/30 transition-all"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.25)" }}
                whileTap={{ scale: 0.98 }}
              >
                View All Reviews
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TestimonialsSection;