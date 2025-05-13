// src/components/ProductCard.jsx
'use client';

import React, { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  CpuChipIcon, ServerIcon, CircleStackIcon, CheckCircleIcon, WifiIcon,
  ArrowRightIcon, StarIcon, FireIcon, SparklesIcon as SparklesSolid,
  ShieldCheckIcon, ArrowTrendingUpIcon, TagIcon, LockClosedIcon, KeyIcon
} from '@heroicons/react/24/solid';
import { FaWindows, FaShieldAlt, FaTags, FaCrown, FaBolt, FaUserShield, FaLock } from 'react-icons/fa';

// =============== PERFORMANCE OPTIMIZATION ===============
// Simplified particle effect
const FeatureHoverEffect = memo(({ particle }) => (
  <div 
    className="absolute inset-0 opacity-10"
    style={{ 
      backgroundImage: `radial-gradient(circle, ${particle} 10%, transparent 10%)`,
      backgroundSize: '20px 20px'
    }}
  />
));
FeatureHoverEffect.displayName = 'FeatureHoverEffect';

// Simplified static icon
const StaticSpecIcon = memo(({ color, Icon }) => (
  <div className="relative">
    <div 
      className="absolute inset-0 rounded-full opacity-30"
      style={{ backgroundColor: color.particle }}
    />
    <Icon className={`h-5 w-5 ${color.text} relative z-10`} aria-hidden="true"/>
  </div>
));
StaticSpecIcon.displayName = 'StaticSpecIcon';

// =============== SIMPLIFIED DESIGN COMPONENTS ===============
// Static SpecItem with tooltips but no animations
const SpecItem = memo(({ icon: Icon, color, text, label }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  
  // Use callbacks to avoid recreation of functions on re-render
  const handleMouseEnter = useCallback(() => setShowTooltip(true), []);
  const handleMouseLeave = useCallback(() => setShowTooltip(false), []);
  
  // Close tooltip on escape key for accessibility
  useEffect(() => {
    if (!showTooltip) return;
    
    const handleEscKey = (e) => {
      if (e.key === 'Escape') setShowTooltip(false);
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [showTooltip]);

  return (
    <li 
      className="flex items-center gap-x-3 relative group/spec py-1.5 hover:translate-x-1 transition-transform"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="button"
      aria-expanded={showTooltip}
      aria-describedby={showTooltip ? `tooltip-${label}` : undefined}
    >
      <StaticSpecIcon color={color} Icon={Icon} />
      
      <div className="flex flex-col">
        <span className="text-slate-800 font-medium">{text}</span>
        {label && (
          <span className="text-xs text-slate-500">{label}</span>
        )}
      </div>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            id={`tooltip-${label}`}
            ref={tooltipRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 -top-2 transform -translate-y-full px-3 py-2 bg-slate-800 text-white text-xs rounded shadow-lg z-50 w-auto whitespace-nowrap"
            style={{ maxWidth: '200px' }}
            role="tooltip"
          >
            {getSpecDescription(Icon, text)}
            <div className="absolute w-2 h-2 bg-slate-800 transform rotate-45 left-4 -bottom-1"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
});
SpecItem.displayName = 'SpecItem';

// Simplified UseCase without animations
const UseCase = memo(({ useCase, theme }) => (
  <li className="flex items-center gap-x-2 text-xs text-slate-700 font-medium font-sans py-1 hover:translate-x-1 transition-transform">
    <div className={`h-5 w-5 flex items-center justify-center rounded-full ${theme.bgLight}`}>
      <CheckCircleIcon className={`h-4 w-4 ${theme.text} flex-shrink-0`} aria-hidden="true"/>
    </div>
    <span>{useCase}</span>
  </li>
));
UseCase.displayName = 'UseCase';

// Simplified badge
const PromoBadge = memo(({ promo, theme }) => {
  if (!promo) return null;
  
  return (
    <div
      className={`absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 ${theme.badgeBg} px-3 py-1 rounded-full shadow-lg border ${theme.badgeBorder}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-x-1">
        <TagIcon className={`h-3.5 w-3.5 ${theme.badgeIcon}`} aria-hidden="true"/>
        <span className="text-xs font-bold whitespace-nowrap">{promo}</span>
      </div>
    </div>
  );
});
PromoBadge.displayName = 'PromoBadge';

// Static category badge
const PlanCategory = memo(({ category, theme }) => {
  if (!category) return null;
  
  return (
    <div
      className={`inline-flex items-center gap-x-1 px-2 py-1 rounded-md ${theme.categoryBg} ${theme.text} text-xs font-medium mb-2`}
    >
      <FaTags className="h-3 w-3" aria-hidden="true" />
      <span>{category}</span>
    </div>
  );
});
PlanCategory.displayName = 'PlanCategory';

// Static feature badge
const FeatureBadge = memo(({ feature, theme }) => {
  if (!feature) return null;

  return (
    <div
      className={`inline-flex items-center gap-x-1 px-2 py-0.5 rounded-full ${theme.featureBg} ${theme.featureText} text-2xs font-semibold border ${theme.featureBorder} ml-2`}
    >
      <FaBolt className="h-2.5 w-2.5" aria-hidden="true" />
      <span className="uppercase tracking-wide">{feature}</span>
    </div>
  );
});
FeatureBadge.displayName = 'FeatureBadge';

// Simplified access badge
const AccessBadge = memo(({ type, theme, tooltipContent }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Determine icon and styles based on access type
  const config = useMemo(() => {
    switch(type) {
      case 'admin':
        return {
          icon: FaUserShield,
          label: 'Admin Access',
          bg: `${theme.adminBg}`,
          text: `${theme.adminText}`,
          border: `${theme.adminBorder}`
        };
      case 'private':
        return {
          icon: FaLock,
          label: 'Private Access',
          bg: `${theme.privateBg}`,
          text: `${theme.privateText}`,
          border: `${theme.privateBorder}`
        };
      default:
        return null;
    }
  }, [type, theme]);
  
  if (!config) return null;
  
  const Icon = config.icon;
  
  return (
    <div
      className={`relative flex items-center gap-x-1 px-2 py-1 rounded-md ${config.bg} ${config.text} text-xs font-medium border ${config.border} shadow-sm mb-2`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{config.label}</span>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 -bottom-[5rem] px-3 py-2 bg-slate-800 text-white text-xs rounded shadow-xl z-50 w-48"
            role="tooltip"
          >
            <div className="font-semibold mb-1 border-b border-slate-700 pb-1">{config.label}</div>
            <p>{tooltipContent}</p>
            <div className="absolute w-2 h-2 bg-slate-800 transform rotate-45 left-4 -top-1"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
AccessBadge.displayName = 'AccessBadge';

// =============== HELPER FUNCTIONS & UTILITIES ===============
// Spec tool tip descriptions
function getSpecDescription(Icon, text) {
  if (Icon === CpuChipIcon) return `CPU: ${text} - Processing power for your applications`;
  if (Icon === ServerIcon) return `RAM: ${text} - Memory for running your applications`;
  if (Icon === CircleStackIcon) return `Storage: ${text} - Space for your files and data`;
  if (Icon === WifiIcon) return `Bandwidth: ${text} - Monthly data transfer limit`;
  if (Icon === ShieldCheckIcon) return `Protection: ${text} - Advanced security features`;
  return text;
}

// Plan label data extraction with memoization
const getLabelInfo = (label) => {
  const lowerLabel = label?.toLowerCase();
  switch (lowerLabel) {
    case 'recommended':
      return { 
        styles: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200', 
        icon: StarIcon, 
        border: 'border-green-500'
      };
    case 'most selling':
    case 'best seller':
      return { 
        styles: 'bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-200', 
        icon: FireIcon, 
        border: 'border-orange-500'
      };
    case 'high end':
    case 'premium':
      return { 
        styles: 'bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200', 
        icon: SparklesSolid, 
        border: 'border-sky-500'
      };
    case 'enterprise':
      return { 
        styles: 'bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-200', 
        icon: FaCrown, 
        border: 'border-purple-500'
      };
    default:
      return null;
  }
};

// =============== MAIN COMPONENT ===============
const ProductCard = memo(({ plan, isFirstInView = false }) => {
  // Extract plan data with defaults for resilience
  const {
    id = Math.random().toString(36).substr(2, 9),
    name = 'Plan Name',
    cpu = 'N/A',
    ram = 'N/A',
    storage = 'N/A',
    bandwidth = 'N/A',
    os = 'Windows Server',
    price = 0,
    orderLink = '#',
    label = null,
    useCases = [],
    themeColor = 'sky',
    category = null,
    feature = null,
    security = 'Fully Admin Access',
    promo = null,
    adminAccess = false,
    privateAccess = false,
    adminAccessDetails = 'Full administrator privileges with root-level system access and advanced security management capabilities.',
    privateAccessDetails = 'Enhanced privacy with dedicated resources, isolated networking, and encrypted data protection.'
  } = plan || {};

  // Component state with more efficient management
  const [showDetails, setShowDetails] = useState(false);
  
  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion();
  
  // Add lazy loading with InView detection
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.1 });
  
  // Optimized event handlers with useCallback
  const handleToggleDetails = useCallback(() => setShowDetails(prev => !prev), []);
  
  // Add keyboard navigation support
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowDetails(prev => !prev);
    }
  }, []);

  // Use useMemo for computed values to prevent recalculation on re-renders
  const labelInfo = useMemo(() => getLabelInfo(label), [label]);
  const cardBorderClass = useMemo(() => labelInfo ? labelInfo.border : 'border-slate-200/70', [labelInfo]);
  
  // Advanced theme system with composite objects
  const themeStyles = useMemo(() => {
    const colorMap = {
      green: {
        gradient: 'from-green-50 to-emerald-100',
        button: 'bg-emerald-600 hover:bg-emerald-700',
        buttonText: 'text-white',
        text: 'text-emerald-600',
        particle: '#10b981',
        bgLight: 'bg-emerald-50',
        bgMedium: 'bg-emerald-100',
        border: 'border-emerald-200',
        badgeBg: 'bg-emerald-500',
        badgeBorder: 'border-emerald-600',
        badgeIcon: 'text-white',
        categoryBg: 'bg-emerald-50',
        featureBg: 'bg-white',
        featureText: 'text-emerald-700',
        featureBorder: 'border-emerald-200',
        highlight: 'bg-emerald-50',
        adminBg: 'bg-green-50',
        adminText: 'text-green-800',
        adminBorder: 'border-green-200',
        privateBg: 'bg-green-50',
        privateText: 'text-green-800',
        privateBorder: 'border-green-200',
      },
      orange: {
        gradient: 'from-orange-50 to-amber-100',
        button: 'bg-orange-600 hover:bg-orange-700',
        buttonText: 'text-white',
        text: 'text-orange-600',
        particle: '#f97316',
        bgLight: 'bg-orange-50',
        bgMedium: 'bg-orange-100',
        border: 'border-orange-200',
        badgeBg: 'bg-orange-500',
        badgeBorder: 'border-orange-600',
        badgeIcon: 'text-white',
        categoryBg: 'bg-orange-50',
        featureBg: 'bg-white',
        featureText: 'text-orange-700',
        featureBorder: 'border-orange-200',
        highlight: 'bg-orange-50',
        adminBg: 'bg-orange-50',
        adminText: 'text-orange-800',
        adminBorder: 'border-orange-200',
        privateBg: 'bg-orange-50',
        privateText: 'text-orange-800',
        privateBorder: 'border-orange-200',
      },
      sky: {
        gradient: 'from-sky-50 to-blue-100',
        button: 'bg-sky-600 hover:bg-sky-700',
        buttonText: 'text-white',
        text: 'text-sky-600',
        particle: '#0ea5e9',
        bgLight: 'bg-sky-50',
        bgMedium: 'bg-sky-100',
        border: 'border-sky-200',
        badgeBg: 'bg-sky-500',
        badgeBorder: 'border-sky-600',
        badgeIcon: 'text-white',
        categoryBg: 'bg-sky-50',
        featureBg: 'bg-white',
        featureText: 'text-sky-700',
        featureBorder: 'border-sky-200',
        highlight: 'bg-sky-50',
        adminBg: 'bg-sky-50',
        adminText: 'text-sky-800',
        adminBorder: 'border-sky-200',
        privateBg: 'bg-sky-50',
        privateText: 'text-sky-800',
        privateBorder: 'border-sky-200',
      },
      purple: {
        gradient: 'from-purple-50 to-indigo-100',
        button: 'bg-purple-600 hover:bg-purple-700',
        buttonText: 'text-white',
        text: 'text-purple-600',
        particle: '#9333ea',
        bgLight: 'bg-purple-50',
        bgMedium: 'bg-purple-100',
        border: 'border-purple-200',
        badgeBg: 'bg-purple-500',
        badgeBorder: 'border-purple-600',
        badgeIcon: 'text-white',
        categoryBg: 'bg-purple-50',
        featureBg: 'bg-white',
        featureText: 'text-purple-700',
        featureBorder: 'border-purple-200',
        highlight: 'bg-purple-50',
        adminBg: 'bg-purple-50',
        adminText: 'text-purple-800',
        adminBorder: 'border-purple-200',
        privateBg: 'bg-purple-50',
        privateText: 'text-purple-800',
        privateBorder: 'border-purple-200',
      }
    };
    return colorMap[themeColor] || colorMap.sky;
  }, [themeColor]);

  // Identify spec colors by type for semantic color coding
  const specColors = useMemo(() => ({
    cpu: { text: 'text-orange-500', particle: '#f97316' },
    ram: { text: 'text-sky-500', particle: '#0ea5e9' },
    storage: { text: 'text-green-500', particle: '#10b981' },
    bandwidth: { text: 'text-amber-500', particle: '#f59e0b' },
    security: { text: 'text-purple-500', particle: '#9333ea' }
  }), []);

  // Return null with error handling for invalid props
  if (!plan || typeof plan !== 'object') {
    console.error("ProductCard received invalid plan prop:", plan);
    return null;
  }

  return (
    <div
      ref={cardRef}
      className={`group relative font-sans flex flex-col h-full rounded-xl overflow-hidden bg-white border ${cardBorderClass} border-t-4 shadow-lg hover:shadow-xl transition-all duration-300`}
      role="article"
      aria-labelledby={`plan-name-${id}`}
    >
      {/* Promotional badge - positioned above the card */}
      <PromoBadge promo={promo} theme={themeStyles} />
      
      {/* Simplified background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white opacity-50 z-0"></div>
      
      {/* Enhanced Label Badge with simplified styling */}
      {labelInfo && (
        <div 
          className={`absolute top-2.5 right-2.5 z-10 ${labelInfo.styles} px-2.5 py-1 rounded-full flex items-center gap-x-1.5 shadow-md`}
          aria-label={`${label} plan`}
        >
          <labelInfo.icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-xs font-bold tracking-wide uppercase">{label}</span>
        </div>
      )}

      {/* Card Body with simplified structure */}
      <div className="flex flex-col flex-grow p-6 text-slate-800 relative z-1">
        {/* Plan Category badge */}
        <PlanCategory category={category} theme={themeStyles} />
        
        {/* Access Badges - New section */}
        <div className="flex flex-wrap gap-2 mb-3">
          {adminAccess && (
            <AccessBadge 
              type="admin" 
              theme={themeStyles} 
              tooltipContent={adminAccessDetails} 
            />
          )}
          {privateAccess && (
            <AccessBadge 
              type="private" 
              theme={themeStyles} 
              tooltipContent={privateAccessDetails} 
            />
          )}
        </div>
        
        {/* Plan Name & OS Icon with simplified design */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center">
            <h3 
              id={`plan-name-${id}`}
              className="font-heading text-xl font-bold text-slate-800 pt-1 pr-2"
            >
              {name}
            </h3>
            <FeatureBadge feature={feature} theme={themeStyles} />
          </div>
          <div 
            className={`p-1.5 mt-1 border ${themeStyles.border} rounded-md shadow-sm flex-shrink-0 relative overflow-hidden ${themeStyles.bgLight}`} 
            title={os}
            role="img"
            aria-label={`Operating System: ${os}`}
          >
            <FaWindows className="h-4 w-4 text-blue-600 relative z-10" />
          </div>
        </div>
        
        {/* Vertical spacing adjustment for consistent heights */}
        <div className={`${labelInfo || promo ? "h-1" : "h-6"}`}></div>

        {/* Enhanced Specs List with semantic grouping */}
        <ul 
          className="space-y-0.5 text-sm text-slate-600 mb-5 font-sans border-t border-slate-100 pt-4 flex-grow"
          aria-label="Plan specifications"
        >
          <div className="grid grid-cols-1 gap-1">
            <SpecItem icon={CpuChipIcon} color={specColors.cpu} text={cpu} label="CPU" />
            <SpecItem icon={ServerIcon} color={specColors.ram} text={ram} label="Memory" />
            <SpecItem icon={CircleStackIcon} color={specColors.storage} text={storage} label="Storage" />
            <SpecItem icon={WifiIcon} color={specColors.bandwidth} text={bandwidth} label="Data Transfer" />
            <SpecItem icon={ShieldCheckIcon} color={specColors.security} text={security} label="Security" />
          </div>
        </ul>

        {/* Use Cases Section with simplified rendering */}
        {useCases && useCases.length > 0 && (
          <div className="mb-6 border-t border-slate-100 pt-4">
            <div className="flex items-center mb-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ideal For:</h4>
              <div className={`ml-2 h-px flex-grow ${themeStyles.bgMedium}`} />
            </div>
            <ul className="space-y-0.5" aria-label="Recommended use cases">
              {useCases.slice(0, 3).map((useCase, index) => (
                <UseCase 
                  key={`${id}-usecase-${index}`} 
                  useCase={useCase} 
                  theme={themeStyles}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Price Display with simplified styling */}
        <div className="mt-auto">
          <div className={`mx-auto w-full rounded-xl bg-gradient-to-br ${themeStyles.gradient} px-4 py-5 text-center shadow-md relative overflow-hidden border ${themeStyles.border}`}>
            {isInView && !prefersReducedMotion && <FeatureHoverEffect particle={themeStyles.particle} />}
            
            {/* Simple price display */}
            <div className="relative z-10">
              <div className="flex justify-center items-baseline mb-1">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mr-2">Monthly Price</p>
                <div className={`px-1.5 py-0.5 rounded-md ${themeStyles.bgLight} ${themeStyles.text} text-xs font-semibold`}>
                  Best Value
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-lg font-medium text-slate-700 mr-1">RS.</span>
                <span className={`text-5xl font-bold font-heading ${themeStyles.text}`}>
                  {price.toLocaleString()}
                </span>
                <span className="text-lg font-medium text-slate-700 ml-1">/mo</span>
              </div>
            </div>
          </div>
          
          {/* Simplified Order Button */}
          <div className="mt-5 text-center">
            <Link 
              href={orderLink} 
              className={`inline-flex items-center justify-center w-full px-5 py-3 rounded-lg ${themeStyles.button} ${themeStyles.buttonText} font-medium transition-colors shadow-lg hover:shadow-xl`}
              role="button"
              aria-label={`Order ${name} plan`}
            >
              <span>Order Now</span>
              <ArrowRightIcon className="h-4 w-4 ml-2" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* "Compare Plans" button toggle for detailed information */}
        <button
          onClick={handleToggleDetails}
          onKeyDown={handleKeyDown}
          className={`mt-3 text-xs font-medium ${themeStyles.text} flex items-center justify-center gap-x-1 w-full`}
          aria-expanded={showDetails}
          aria-controls={`details-${id}`}
        >
          {showDetails ? 'Hide Details' : 'Compare Plans'}
          <ArrowTrendingUpIcon className={`h-3 w-3 ml-1 ${showDetails ? 'rotate-180' : ''} transition-transform`} aria-hidden="true" />
        </button>
      </div>

      {/* Expandable Details Panel */}
      {showDetails && (
        <div
          id={`details-${id}`}
          className={`px-6 py-4 bg-slate-50 border-t ${themeStyles.border}`}
        >
          <h4 className="text-sm font-semibold mb-2 text-slate-700">Plan Comparison</h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex justify-between">
              <span>Setup Fee</span>
              <span className="font-medium text-slate-800">Free</span>
            </li>
            <li className="flex justify-between">
              <span>Deployment Time</span>
              <span className="font-medium text-slate-800">2-4 Hours</span>
            </li>
            <li className="flex justify-between">
              <span>Dedicated IP</span>
              <span className="font-medium text-slate-800">Yes</span>
            </li>
            <li className="flex justify-between">
              <span>Admin Access</span>
              <span className="font-medium text-slate-800">{adminAccess ? 'Yes' : 'No'}</span>
            </li>
            <li className="flex justify-between">
              <span>Private Access</span>
              <span className="font-medium text-slate-800">{privateAccess ? 'Yes' : 'No'}</span>
            </li>
            <li className="flex justify-between">
              <span>24/7 Support</span>
              <span className="font-medium text-slate-800">Yes</span>
            </li>
            <li className="flex justify-between">
              <span>Minimum Contract</span>
              <span className="font-medium text-slate-800">1 Month</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;