'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ChatBubbleBottomCenterTextIcon, ExclamationCircleIcon, CheckCircleIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ContactPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    submitted: false,
    loading: false
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Map interaction
  const [mapHovered, setMapHovered] = useState(false);
  
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

  // Form validation
  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email';
        break;
      case 'subject':
        if (!value.trim()) error = 'Subject is required';
        else if (value.trim().length < 5) error = 'Subject must be at least 5 characters';
        break;
      case 'message':
        if (!value.trim()) error = 'Message is required';
        else if (value.trim().length < 10) error = 'Message must be at least 10 characters';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormState({
      ...formState,
      [name]: value
    });
    
    // Validate on change
    setFormErrors({
      ...formErrors,
      [name]: validateField(name, value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      name: validateField('name', formState.name),
      email: validateField('email', formState.email),
      subject: validateField('subject', formState.subject),
      message: validateField('message', formState.message)
    };
    
    setFormErrors(newErrors);
    
    // Check if any errors exist
    if (Object.values(newErrors).some(error => error !== '')) {
      // Don't submit if there are errors
      return;
    }
    
    setFormState({ ...formState, loading: true });
    
    // Simulate form submission
    setTimeout(() => {
      setFormState({
        ...formState,
        submitted: true,
        loading: false
      });
    }, 1500);
  };
  
  // Expand/collapse FAQ items
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };
  
  const faqs = [
    {
      question: "What is the typical response time for support?",
      answer: "We typically respond to all inquiries within 2 hours during business hours (9 AM - 6 PM EST). For urgent issues, our premium support plans offer 24/7 assistance with response times under 30 minutes."
    },
    {
      question: "Can I request a custom plan for my business needs?",
      answer: "Yes! We offer tailored solutions for businesses with specific requirements. Contact our sales team through this form, and we'll work with you to design a custom package that perfectly meets your needs."
    },
    {
      question: "Do you offer refunds if I'm not satisfied?",
      answer: "We stand behind our service quality. If you're not completely satisfied within the first 7 days, we offer a full refund, no questions asked. For details, please review our refund policy."
    },
    {
      question: "How secure are your RDP and VPS services?",
      answer: "Security is our top priority. We implement enterprise-grade encryption, multi-factor authentication, automated backup systems, and continuous security monitoring to ensure your data remains protected."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Absolutely! You can seamlessly upgrade your plan at any time through your account dashboard. The price difference will be prorated for the remainder of your billing cycle."
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      {/* Enhanced Hero Section with Parallax */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 py-24 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
        <motion.div 
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" 
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" 
          style={{ y: y2 }}
        />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 opacity-60 animate-float-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-60 animate-float-medium" />
        <div className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-60 animate-float-fast" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-5">
              <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                <ChatBubbleBottomCenterTextIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Have questions or need assistance? Our team is here to help you find the right solutions for your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="tel:+11234567890" 
                className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium shadow-lg transition duration-300 transform hover:-translate-y-1 flex items-center"
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                Call Us Now
              </Link>
              <Link 
                href="https://wa.link/ty3ydp" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-700 text-white hover:bg-purple-800 px-6 py-3 rounded-lg font-medium shadow-lg transition duration-300 transform hover:-translate-y-1 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                Chat on WhatsApp
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
      
      {/* Contact Options Section */}
      <div className="container mx-auto max-w-6xl py-16 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Multiple Ways to Reach Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you have a question about our services, pricing, need a demo, or anything else, our team is ready to answer all your questions.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="bg-purple-100 p-4 rounded-full inline-flex mb-5">
                <PhoneIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Call Us</h3>
              <p className="text-gray-600 mb-4">Our friendly team is here to help</p>
              <a href="tel:+11234567890" className="text-purple-600 font-medium text-lg">+1 (123) 456-7890</a>
              <p className="text-gray-500 text-sm mt-2">Mon-Fri: 9AM - 6PM EST</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="bg-purple-100 p-4 rounded-full inline-flex mb-5">
                <EnvelopeIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Email Us</h3>
              <p className="text-gray-600 mb-4">We'll respond as soon as possible</p>
              <a href="mailto:support@nextgenrdp.com" className="text-purple-600 font-medium text-lg">support@nextgenrdp.com</a>
              <p className="text-gray-500 text-sm mt-2">For general inquiries</p>
              <a href="mailto:sales@nextgenrdp.com" className="text-purple-600 font-medium mt-2 inline-block">sales@nextgenrdp.com</a>
              <p className="text-gray-500 text-sm mt-1">For sales inquiries</p>
            </div>
            
            <div 
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              onMouseEnter={() => setMapHovered(true)}
              onMouseLeave={() => setMapHovered(false)}
            >
              <div className="bg-purple-100 p-4 rounded-full inline-flex mb-5">
                <MapPinIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Visit Us</h3>
              <p className="text-gray-600 mb-4">Come say hello at our office</p>
              
              <div className="relative h-40 w-full mb-3 overflow-hidden rounded-lg border border-gray-200">
                {/* Interactive map preview */}
                <div className="absolute inset-0 bg-purple-50 flex items-center justify-center">
                  <div className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${mapHovered ? 'opacity-70' : 'opacity-100'}`} style={{backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=San+Francisco,CA&zoom=13&size=600x300&maptype=roadmap&markers=color:purple%7CSan+Francisco,CA&key=YOUR_API_KEY')`}}></div>
                  
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mapHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link 
                      href="https://maps.google.com/?q=123+Tech+Plaza,+Suite+400,+San+Francisco,+CA+94103" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors duration-300"
                    >
                      View on Google Maps
                    </Link>
                  </motion.div>
                </div>
              </div>
              
              <address className="text-purple-600 font-medium not-italic">
                123 Tech Plaza, Suite 400<br />
                San Francisco, CA 94103
              </address>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Contact Form Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
        >
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 bg-gradient-to-b from-purple-600 to-indigo-700 p-8 text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
              
              <motion.div variants={itemVariants} className="relative z-10">
                <h3 className="text-2xl font-bold mb-6">Let's discuss how we can help you</h3>
                <p className="mb-8 text-purple-100 leading-relaxed">
                  Fill out the form and a member of our team will contact you promptly to discuss your needs and how NextGenRDP can provide the perfect solution.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-full mr-3">
                      <EnvelopeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-purple-100">sales@nextgenrdp.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-full mr-3">
                      <PhoneIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-sm text-purple-100">+1 (123) 456-7890</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-full mr-3">
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Live Chat</h4>
                      <p className="text-sm text-purple-100">Available 24/7</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  <Link 
                    href="https://wa.link/ty3ydp" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium transition duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    Chat on WhatsApp
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="md:col-span-3 p-8">
              <AnimatePresence mode="wait">
                {formState.submitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="h-full flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="bg-green-100 p-4 rounded-full inline-flex mb-6">
                      <CheckCircleIcon className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-8 max-w-md">
                      Your message has been sent successfully. We'll get back to you as soon as possible, usually within 2 business hours.
                    </p>
                    <button
                      onClick={() => setFormState({
                        name: '',
                        email: '',
                        subject: '',
                        message: '',
                        submitted: false,
                        loading: false
                      })}
                      className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition duration-300"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    variants={itemVariants} 
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formState.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                              formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="John Doe"
                          />
                          {formErrors.name && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {formErrors.name && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formState.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                              formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="john@example.com"
                          />
                          {formErrors.email && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {formErrors.email && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          value={formState.subject}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                            formErrors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="How can we help you?"
                        />
                        {formErrors.subject && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {formErrors.subject && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.subject}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          value={formState.message}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                            formErrors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Your message here..."
                        ></textarea>
                        {formErrors.message && (
                          <div className="absolute top-3 right-0 flex items-start pr-3">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {formErrors.message && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.message}
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={formState.loading}
                      className={`w-full bg-purple-600 text-white hover:bg-purple-700 px-6 py-4 rounded-lg font-medium transition duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                        formState.loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {formState.loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : 'Send Message'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-gray-50 border-t border-gray-200 py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our services, pricing, and support options.
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className={`bg-white rounded-xl border ${expandedFaq === index ? 'border-purple-300 shadow-md' : 'border-gray-200'} transition-all duration-300`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <h4 className="text-lg font-bold text-gray-800">{faq.question}</h4>
                  <div className={`ml-4 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center border ${expandedFaq === index ? 'bg-purple-100 border-purple-300 rotate-180' : 'bg-gray-50 border-gray-300'} transition-all duration-300`}>
                    <svg className={`h-3 w-3 ${expandedFaq === index ? 'text-purple-600' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedFaq === index ? 'max-h-96 pb-6' : 'max-h-0'
                  }`}
                >
                  <div className="text-gray-600 text-lg leading-relaxed">{faq.answer}</div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link 
              href="/dashboard/support/tickets/new" 
              className="inline-flex items-center bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg font-medium shadow-md transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Open a Support Ticket
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Related Links */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Additional Resources</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group"
            >
              <Link 
                href="/about" 
                className="p-8 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 block h-full"
              >
                <div className="bg-purple-100 p-3 rounded-full inline-flex mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">About Us</h4>
                <p className="text-gray-600">Learn about our company story, mission, team and the technology that powers our services.</p>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group"
            >
              <Link 
                href="/support/help-docs" 
                className="p-8 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 block h-full"
              >
                <div className="bg-purple-100 p-3 rounded-full inline-flex mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">Help Center</h4>
                <p className="text-gray-600">Browse our extensive knowledge base and documentation for answers to technical questions.</p>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group"
            >
              <Link 
                href="/dashboard/support/tickets/new" 
                className="p-8 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 block h-full"
              >
                <div className="bg-purple-100 p-3 rounded-full inline-flex mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                  <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">Submit a Ticket</h4>
                <p className="text-gray-600">Current customers can submit a support ticket here to get personalized assistance from our team.</p>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 