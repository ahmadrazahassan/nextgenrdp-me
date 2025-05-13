'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useAnimation } from 'framer-motion';
import { UserGroupIcon, RocketLaunchIcon, GlobeAltIcon, ShieldCheckIcon, ServerIcon, ChartBarIcon, BuildingOffice2Icon, GlobeAmericasIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
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

  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300, 500], [1, 0.5, 0]);

  // Animated counter for statistics
  const [statistics, setStatistics] = useState([
    { label: 'Happy Clients', value: 0, target: 5000, icon: UserGroupIcon },
    { label: 'Servers Deployed', value: 0, target: 12500, icon: ServerIcon },
    { label: 'Countries Served', value: 0, target: 120, icon: GlobeAmericasIcon },
    { label: 'Uptime', value: 0, target: 99.9, icon: ChartBarIcon, suffix: '%' },
  ]);

  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const statsControls = useAnimation();

  useEffect(() => {
    if (isStatsInView) {
      statsControls.start("visible");
      
      const interval = setInterval(() => {
        setStatistics(prev => 
          prev.map(stat => ({
            ...stat,
            value: stat.value < stat.target 
              ? (stat.target > 100 
                  ? Math.min(stat.value + Math.ceil(stat.target / 50), stat.target)
                  : Math.min(stat.value + (stat.target / 50), stat.target))
              : stat.target
          }))
        );
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [isStatsInView, statsControls]);

  const teamMembers = [
    {
      name: 'Alex Johnson',
      position: 'CEO & Founder',
      bio: 'Alex has over 15 years of experience in IT infrastructure and cloud computing. Prior to founding NextGenRDP, Alex led cloud infrastructure teams at major tech companies.',
      imageUrl: '/images/team-placeholder.png'
    },
    {
      name: 'Sarah Chen',
      position: 'CTO',
      bio: 'With a background in cybersecurity and system architecture, Sarah oversees our technical operations and ensures our infrastructure meets the highest standards of reliability and security.',
      imageUrl: '/images/team-placeholder.png'
    },
    {
      name: 'Marcus Williams',
      position: 'Head of Customer Support',
      bio: 'Marcus is passionate about delivering exceptional customer experiences. He leads our support team and works tirelessly to ensure our clients receive prompt and effective assistance.',
      imageUrl: '/images/team-placeholder.png'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      {/* Enhanced Hero Section with Parallax */}
      <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
        <motion.div 
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" 
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" 
          style={{ y: y2 }}
        />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-60 animate-float-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 opacity-60 animate-float-medium" />
        <div className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-300 to-teal-300 opacity-60 animate-float-fast" />
        
        <div className="container mx-auto max-w-5xl text-center relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                <UserGroupIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-8 tracking-tight">
              About NextGenRDP
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              Pioneering the future of remote desktop and virtual server solutions with reliability, security, and performance at our core.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact" 
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg font-medium shadow-lg transition duration-300 transform hover:-translate-y-1"
              >
                Get in Touch
              </Link>
              <Link 
                href="/plans" 
                className="bg-emerald-700 text-white hover:bg-emerald-800 px-8 py-4 rounded-lg font-medium shadow-lg transition duration-300 transform hover:-translate-y-1"
              >
                Explore Our Plans
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom curved shape */}
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <svg className="w-full h-full" viewBox="0 0 1440 65" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 64H1440V0C1440 0 1144 64 720 64C296 64 0 0 0 0V64Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div 
          ref={statsRef} 
          className="container mx-auto max-w-6xl px-4"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            animate={statsControls}
            className="grid md:grid-cols-4 gap-8"
          >
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
                className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center transform transition-transform duration-300 hover:shadow-lg hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
                  {React.createElement(stat.icon, { className: "h-8 w-8 text-emerald-600" })}
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">
                  {stat.value.toLocaleString()}{stat.suffix || ''}
                </h3>
                <p className="text-emerald-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="prose prose-lg max-w-none"
        >
          {/* Our Story Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-2 rounded-full mr-3">
                <RocketLaunchIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
            </div>
            
            <div className="space-y-6 pl-12">
              <p className="text-gray-700">
                NextGenRDP was founded in 2022 with a clear mission: to make high-performance remote desktop and virtual server solutions accessible to businesses of all sizes. What began as a small team of passionate engineers has grown into a trusted provider serving clients worldwide.
              </p>
              <p className="text-gray-700">
                We recognized that the existing RDP and VPS solutions in the market often forced customers to choose between affordability, performance, or security. We set out to build a service that excels in all three areas, leveraging cutting-edge technologies and innovative approaches to infrastructure management.
              </p>
              <p className="text-gray-700">
                Today, we continue to innovate and expand our offerings, but our core commitment remains the same: providing reliable, secure, and powerful remote computing solutions backed by exceptional customer support.
              </p>
            </div>
          </motion.section>
          
          {/* Our Mission Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-2 rounded-full mr-3">
                <GlobeAltIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            </div>
            
            <div className="space-y-6 pl-12">
              <p className="text-gray-700">
                Our mission is to empower businesses and individuals with secure, high-performance remote computing solutions that enable productivity from anywhere in the world. We believe that location should never be a barrier to accessing powerful computing resources.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-emerald-600 mb-3">
                    <ServerIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Performance</h3>
                  <p className="text-gray-600">Delivering lightning-fast connections and powerful computing resources that enhance productivity.</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-emerald-600 mb-3">
                    <ShieldCheckIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Security</h3>
                  <p className="text-gray-600">Implementing advanced security measures to keep your data and connections safe at all times.</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-emerald-600 mb-3">
                    <UserGroupIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Support</h3>
                  <p className="text-gray-600">Providing responsive, knowledgeable support to ensure your success with our services.</p>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* Our Team Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-2 rounded-full mr-3">
                <UserGroupIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Team</h2>
            </div>
            
            <div className="space-y-6 pl-12">
              <p className="text-gray-700">
                The strength of NextGenRDP lies in our diverse and talented team of professionals who are passionate about technology and dedicated to providing exceptional service.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm group hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
                    <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 overflow-hidden">
                      <div className="h-48 w-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        {/* Placeholder for actual team photos */}
                        <UserGroupIcon className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                      <p className="text-emerald-600 text-sm mb-3">{member.position}</p>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
          
          {/* Technology Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-2 rounded-full mr-3">
                <ServerIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Technology</h2>
            </div>
            
            <div className="space-y-6 pl-12">
              <p className="text-gray-700">
                At NextGenRDP, we leverage cutting-edge technology to deliver a superior remote computing experience. Our infrastructure is built on a foundation of enterprise-grade hardware, optimized networking, and advanced security protocols.
              </p>
              <p className="text-gray-700">
                We continuously invest in research and development to enhance our services, implementing the latest advancements in virtualization, networking, and security to ensure our platform remains at the forefront of the industry.
              </p>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-100 mt-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Our Infrastructure Highlights:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span> 
                    <span>High-performance SSD storage for lightning-fast data access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span> 
                    <span>Advanced DDOS protection and intrusion prevention systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span> 
                    <span>Multiple redundant data centers across strategic global locations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span> 
                    <span>99.9% uptime guarantee with comprehensive failover systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span> 
                    <span>End-to-end encryption for all connections and data transfers</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Milestones/Timeline Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-2 rounded-full mr-3">
                <ChartBarIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Journey</h2>
            </div>
            
            <div className="space-y-6 pl-12">
              <p className="text-gray-700 mb-8">
                Since our founding, we've reached important milestones that have shaped our growth and established our reputation as an industry leader.
              </p>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-200 ml-3"></div>
                
                {/* Timeline items */}
                <div className="space-y-12">
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-emerald-100 z-10">
                      <span className="text-white font-bold text-xs">1</span>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-emerald-600 font-semibold mb-1">January 2022</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Company Founded</h3>
                      <p className="text-gray-600">
                        NextGenRDP was established with a mission to revolutionize remote desktop solutions for businesses of all sizes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-emerald-100 z-10">
                      <span className="text-white font-bold text-xs">2</span>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-emerald-600 font-semibold mb-1">June 2022</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">First 1,000 Customers</h3>
                      <p className="text-gray-600">
                        We reached our first major customer milestone, demonstrating the strong market demand for our solutions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-emerald-100 z-10">
                      <span className="text-white font-bold text-xs">3</span>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-emerald-600 font-semibold mb-1">November 2022</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">European Data Center Launch</h3>
                      <p className="text-gray-600">
                        We expanded our infrastructure with a new European data center, improving service for our international clients.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-emerald-100 z-10">
                      <span className="text-white font-bold text-xs">4</span>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-emerald-600 font-semibold mb-1">March 2023</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Enterprise Solution Launch</h3>
                      <p className="text-gray-600">
                        We introduced our enterprise-grade solutions with enhanced security features and dedicated support.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-emerald-100 z-10">
                      <span className="text-white font-bold text-xs">5</span>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-emerald-600 font-semibold mb-1">Present</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Global Expansion</h3>
                      <p className="text-gray-600">
                        Today, we continue to grow our team and infrastructure, serving clients in over 120 countries with unmatched performance and reliability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* Testimonials Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-2 rounded-full mr-3">
                <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">What Our Clients Say</h2>
            </div>
            
            <div className="space-y-6 pl-12">
              <p className="text-gray-700 mb-8">
                Don't just take our word for it. Here's what some of our customers have to say about their experience with NextGenRDP.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.3 12.2C9.8 13.2 9 14.5 9 16c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.8-2.9-2.3-3.8-.5-.3-.6-1-.2-1.5.3-.5 1-.6 1.5-.2C17.9 11.9 19 13.8 19 16c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-2.2 1.1-4.1 3-5.3.5-.3 1.2-.2 1.5.3.3.5.2 1.2-.2 1.2zm-1 0C8.8 13.2 8 14.5 8 16c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.8-2.9-2.3-3.8-.5-.3-.6-1-.2-1.5.3-.5 1-.6 1.5-.2C16.9 11.9 18 13.8 18 16c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-2.2 1.1-4.1 3-5.3.5-.3 1.2-.2 1.5.3.3.5.2 1.2-.2 1.2z"/>
                    </svg>
                  </div>
                  <blockquote className="text-gray-700 mb-4 italic">
                    "NextGenRDP has transformed how our remote teams collaborate. The performance is outstanding, and the security features give us peace of mind when handling sensitive client data."
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-emerald-600 font-bold">
                      JD
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">James Davis</div>
                      <div className="text-sm text-gray-500">CTO, TechSolutions Inc.</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.3 12.2C9.8 13.2 9 14.5 9 16c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.8-2.9-2.3-3.8-.5-.3-.6-1-.2-1.5.3-.5 1-.6 1.5-.2C17.9 11.9 19 13.8 19 16c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-2.2 1.1-4.1 3-5.3.5-.3 1.2-.2 1.5.3.3.5.2 1.2-.2 1.2zm-1 0C8.8 13.2 8 14.5 8 16c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.8-2.9-2.3-3.8-.5-.3-.6-1-.2-1.5.3-.5 1-.6 1.5-.2C16.9 11.9 18 13.8 18 16c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-2.2 1.1-4.1 3-5.3.5-.3 1.2-.2 1.5.3.3.5.2 1.2-.2 1.2z"/>
                    </svg>
                  </div>
                  <blockquote className="text-gray-700 mb-4 italic">
                    "As a small business owner, I needed a reliable RDP solution that wouldn't break the bank. NextGenRDP delivered exactly that, with exceptional customer support that has exceeded my expectations."
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-emerald-600 font-bold">
                      SL
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Sarah Lin</div>
                      <div className="text-sm text-gray-500">Founder, DesignHub Creative</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.3 12.2C9.8 13.2 9 14.5 9 16c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.8-2.9-2.3-3.8-.5-.3-.6-1-.2-1.5.3-.5 1-.6 1.5-.2C17.9 11.9 19 13.8 19 16c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-2.2 1.1-4.1 3-5.3.5-.3 1.2-.2 1.5.3.3.5.2 1.2-.2 1.2zm-1 0C8.8 13.2 8 14.5 8 16c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.8-2.9-2.3-3.8-.5-.3-.6-1-.2-1.5.3-.5 1-.6 1.5-.2C16.9 11.9 18 13.8 18 16c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-2.2 1.1-4.1 3-5.3.5-.3 1.2-.2 1.5.3.3.5.2 1.2-.2 1.2z"/>
                    </svg>
                  </div>
                  <blockquote className="text-gray-700 mb-4 italic">
                    "We've tried several VPS providers before finding NextGenRDP. The difference in performance and reliability is night and day. Our development team is more productive, and our infrastructure costs have decreased."
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-emerald-600 font-bold">
                      MR
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Michael Rodriguez</div>
                      <div className="text-sm text-gray-500">Lead Developer, WebApp Global</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.3 12.2C9.8 13.2 9 14.5 9 16c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.8-2.9-2.3-3.8-.5-.3-.6-1-.2-1.5.3-.5 1-.6 1.5-.2C17.9 11.9 19 13.8 19 16c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-2.2 1.1-4.1 3-5.3.5-.3 1.2-.2 1.5.3.3.5.2 1.2-.2 1.2zm-1 0C8.8 13.2 8 14.5 8 16c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.8-2.9-2.3-3.8-.5-.3-.6-1-.2-1.5.3-.5 1-.6 1.5-.2C16.9 11.9 18 13.8 18 16c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-2.2 1.1-4.1 3-5.3.5-.3 1.2-.2 1.5.3.3.5.2 1.2-.2 1.2z"/>
                    </svg>
                  </div>
                  <blockquote className="text-gray-700 mb-4 italic">
                    "The security features of NextGenRDP have been crucial for our compliance requirements. Their team was extremely helpful in setting up our custom security protocols and ensuring our data is protected."
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-emerald-600 font-bold">
                      AK
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Amanda Kim</div>
                      <div className="text-sm text-gray-500">Security Director, FinSecure Ltd.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ready to experience NextGenRDP?</h2>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied customers who trust us for their remote desktop and virtual server needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/plans" 
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-medium shadow-sm transition duration-300"
              >
                View Our Plans
              </Link>
              <Link 
                href="/contact" 
                className="bg-emerald-700 text-white hover:bg-emerald-800 px-6 py-3 rounded-lg font-medium shadow-sm transition duration-300"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Related Links */}
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Learn More</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link 
              href="/terms" 
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">Terms of Service</h4>
              <p className="text-gray-600">Our commitment to transparent business practices.</p>
            </Link>
            <Link 
              href="/privacy" 
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">Privacy Policy</h4>
              <p className="text-gray-600">How we protect and handle your personal information.</p>
            </Link>
            <Link 
              href="/contact" 
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">Contact Us</h4>
              <p className="text-gray-600">Reach out with questions or to schedule a consultation.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 