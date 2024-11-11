'use client'

import { FaArrowDown, FaGithub, FaEnvelope, FaClock, FaGraduationCap, FaLightbulb, FaBook, FaInfoCircle, FaCheckCircle, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelopeOpen } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBars, FaChrome, FaLinkedin, FaTimes } from 'react-icons/fa';
import { BiFullscreen, BiTime, BiBook, BiBot, BiMusic, BiPalette, BiSearch, BiSidebar, BiStar } from 'react-icons/bi';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import Image from 'next/image';
import { IconType } from 'react-icons';



interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imagePath: string;
  isReversed?: boolean;
  decorativeElement?: React.ReactNode; // Add this line
}

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <motion.p 
      className="text-lg sm:text-xl text-gray-600 mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: index * 0.05 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Feature: React.FC<FeatureProps> = ({ title, description, icon, imagePath, isReversed, decorativeElement }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div 
      ref={ref}
      className={`flex flex-col md:flex-row items-center ${isReversed ? 'md:flex-row-reverse' : ''} mb-16 md:mb-24`}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8 }}
    >
      <div className={`w-full md:w-1/2 ${isReversed ? 'md:pl-8' : 'md:pr-8'} mb-8 md:mb-0`}>
        <div className="text-5xl mb-4 text-purple-600">{icon}</div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="w-full md:w-1/2">
        <div className="image-placeholder rounded-lg shadow-lg overflow-hidden">
          <Image
            src={imagePath}
            alt={title}
            width={600}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedShape: React.FC = () => (
  <svg
    className="absolute top-0 left-0 w-full h-full"
    viewBox="0 0 1000 1000"
    preserveAspectRatio="none"
  >
    <motion.path
      d="M0,1000 C300,800 400,600 500,300 C600,100 800,0 1000,0 L1000,1000 Z"
      fill="url(#gradient)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    />
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(168, 85, 247, 0.2)" />
        <stop offset="100%" stopColor="rgba(236, 72, 153, 0.2)" />
      </linearGradient>
    </defs>
  </svg>
);

const FeatureSection = () => {
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const controls = useAnimation();

  const features = [
    { icon: BiTime, title: "Time Management", color: "#60A5FA", description: "Stay on top of your tasks with our intelligent Todo List and visualize important dates with Countdown Timers." },
    { icon: BiBook, title: "Student Tools", color: "#34D399", description: "Access KBBI, Gramatika, Wikipedia, Scientific Calculator, and Pomodoro Timer all in one place for seamless studying." },
    { icon: BiBot, title: "AI Assistance", color: "#F87171", description: "Get instant help with research, writing, and problem-solving using integrated ChatGPT and Google Gemini." },
    { icon: BiMusic, title: "Spotify Integration", color: "#A78BFA", description: "Access your favorite study playlists without leaving your dashboard, creating the perfect ambiance for productive work." },
    { icon: BiPalette, title: "Personalization", color: "#F472B6", description: "Set the perfect mood for your study sessions with customizable backgrounds and choose between Dark/Light Mode for comfort." },
    { icon: BiSidebar, title: "Dual-Mode Interface", color: "#FBBF24", description: "Choose between Focus Mode for distraction-free work and Explore Opportunity Mode to discover new possibilities and resources." },
  ];

  const scrollToFeature = (index: number) => {
    featuresRef.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="features" className="py-16 md:py-24 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
          Explore the Learnitab Universe
        </h2>
        
        {/* Feature Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              ref={(el: HTMLDivElement | null) => {
                if (el) featuresRef.current[index] = el;
              }}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: feature.color }}>
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <Image
                src={`/images/Learnitab_page-000${index + 1}.jpg`}
                alt={feature.title}
                width={500}
                height={300}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Astronaut */}
      <motion.div
        className="absolute z-30 w-24 h-24"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          top: '10%',
          left: '5%',
        }}
      >
        <Image
          src="/images/astronaut.png"
          alt="Floating Astronaut"
          width={96}
          height={96}
          className="w-full h-auto"
        />
      </motion.div>

      {/* Nebula Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-30 mix-blend-overlay"></div>
    </section>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-40 w-11/12 max-w-7xl transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <nav className={`bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-full px-6 py-3 flex items-center justify-between shadow-lg transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-xl'}`}>
        <div className="flex items-center space-x-8">
          <a href="/" className="flex items-center space-x-2">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaGraduationCap className="text-white text-xl" />
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Learnitab</span>
          </a>
          <ul className="hidden md:flex space-x-6">
            <NavItem href="#features">Features</NavItem>
            <NavItem href="#about">About</NavItem>
            <NavItem href="#get-started">Get Started</NavItem>
            <NavItem href="#contact">Contact</NavItem>
          </ul>
        </div>
        <div className="flex items-center space-x-4">
          <motion.a 
            href="#get-started"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-full hover:shadow-lg transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Now
          </motion.a>
          <a 
            href="https://learnitab.com/app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-white text-purple-600 font-semibold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300"
          >
            Find Opportunity
          </a>
          <button className="text-gray-600 hover:text-purple-600 transition duration-300">
            <FaChrome className="text-2xl" />
          </button>
        </div>
      </nav>

      {/* Floating educational elements */}
      <FloatingElement Icon={FaBook} top="20%" left="5%" delay={0} right={''} />
      <FloatingElement Icon={FaLightbulb} top="70%" left="10%" delay={1} right={''} />
      <FloatingElement Icon={FaClock} top="30%" right="5%" delay={0.5} left={''} />
      <FloatingElement Icon={FaGraduationCap} top="80%" right="10%" delay={1.5} left={''} />

      {/* Blending circles */}
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </header>
  );
};

const NavItem = ({ href, children, dropdown = false, external = false }: { href: string; children: React.ReactNode; dropdown?: boolean; external?: boolean }) => ( <li>
    <a 
      href={href} 
      className="text-gray-600 hover:text-purple-600 transition duration-300 flex items-center"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  </li>
);

const FloatingElement = ({ Icon, top, left, right, delay }: { Icon: IconType; top: string; left: string; right: string; delay: number }) => (
  <motion.div
    className="absolute text-purple-600 opacity-50"
    style={{ top, left, right }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 0.5, y: 0 }}
    transition={{ duration: 1, delay, repeat: Infinity, repeatType: 'reverse' }}
  >
    <Icon className="text-2xl" />
  </motion.div>
);


const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-indigo-900 text-white py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-4">Learnitab</h3>
          <p className="mb-4">Transforming every new tab into a learning opportunity.</p>
          <p className="text-sm">Version 2.5.1 | Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {['Features', 'Support'].map((item) => (
              <li key={item}><a href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-purple-300 transition duration-300">{item}</a></li>
            ))}
            <li>
              <a 
                href="https://learnitab.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-purple-300 transition duration-300"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div className="text-center md:text-right">
          <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
          <div className="flex justify-center md:justify-end space-x-4 mb-4">
            <a href="https://www.instagram.com/learnitab" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-purple-300 transition duration-300">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/learnitab" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-purple-300 transition duration-300">
              <FaLinkedin />
            </a>
            <a href="mailto:learnitab@gmail.com" className="text-2xl hover:text-purple-300 transition duration-300">
              <FaEnvelope />
            </a>
          </div>
          <p className="text-sm">Email: learnitab@gmail.com</p>
          <p className="text-sm">Follow on Instagram: @learnitab</p>
          <p className="text-sm">
            <a href="https://www.linkedin.com/company/learnitab" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition duration-300">
              Connect on LinkedIn: Learnitab
            </a>
          </p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center relative z-10">
        <p>&copy; {new Date().getFullYear()} Learnitab. All rights reserved.</p>
        <p className="mt-2 text-sm">Empowering over 1 million students across 150+ countries.</p>
        <p className="mt-2 text-xs">Learnitab is not affiliated with Google Chrome. Chrome is a trademark of Google LLC.</p>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-16 left-1/2 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </footer>
  );
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopModeOpen, setDesktopModeOpen] = useState(false);
  const [showFeaturesButton, setShowFeaturesButton] = useState(false);

  useEffect(() => {
    // Show the Features button after a delay
    const timer = setTimeout(() => setShowFeaturesButton(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (desktopModeOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [desktopModeOpen]);
  

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Header />

<main className="relative z-10">
<AnimatedSection>
  <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
    {/* 3D Book - Move outside main content */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 perspective-1000 z-10">
      {/* 3D book content */}
    </div>

    {/* Main Content */}
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
      <motion.h1 
        className="text-5xl md:text-7xl font-extrabold mb-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Empower Your Learning Journey
      </motion.h1>
      <motion.p 
        className="text-xl md:text-2xl mb-12 text-center max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Unleash your potential with Learnitab's revolutionary study dashboard
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <a 
          href="https://chromewebstore.google.com/detail/learnitab-your-all-in-one/gpfbhkcbpgghppecgkdnipkmnojaeblj"
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-primary pulse-effect"
        >
          <FaChrome className="inline-block mr-2" />
          <span>Add to Chrome</span>
        </a>
        <a 
          href="https://learnitab.com/app"
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-secondary glow-effect"
        >
          Learnitab Opportunity Portal
        </a>
      </motion.div>
    </div>

    {/* Floating Elements and Background */}
    <div className="absolute inset-0 z-0">
      {[...Array(20)].map((_, index) => (
        <div
          key={index}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-full flex items-center justify-center">
            {index % 4 === 0 && <FaBook className="text-white" />}
            {index % 4 === 1 && <FaGraduationCap className="text-white" />}
            {index % 4 === 2 && <FaLightbulb className="text-white" />}
            {index % 4 === 3 && <FaClock className="text-white" />}
          </div>
        </div>
      ))}
    </div>
  </section>
</AnimatedSection>

  <AnimatedSection>
  <FeatureSection />
</AnimatedSection>
        <AnimatedSection>
  <section id="about" className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
    <div className="max-w-6xl mx-auto px-4 relative z-10">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient-purple-pink">About Learnitab</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            <h3 className="text-2xl font-semibold mb-4 text-purple-600">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To <span className="font-bold">empower global students</span> by providing a comprehensive platform that bridges the gap between academic learning and real-world skills. We aim to <span className="text-pink-600">nurture personal growth</span>, enhance productivity, and create <span className="italic">pathways to opportunities</span>.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-purple-400"></div>
            <h3 className="text-2xl font-semibold mb-4 text-pink-600">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To cultivate a generation of <span className="font-bold text-purple-600">well-prepared</span>, <span className="font-bold text-pink-600">highly skilled</span> graduates who are not just job-ready, but poised to become <span className="italic">innovators and leaders</span> in the global marketplace.
            </p>
          </motion.div>
        </div>
        
        <div className="relative">
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-gradient-purple-pink">Why Learnitab?</h3>
            <ul className="space-y-4">
              {[
                "Centralized study dashboard for enhanced productivity",
                "AI-powered tools for personalized learning assistance",
                "Career development resources and opportunities",
                "Seamless integration of academic and practical skills",
                "Community-driven platform for peer support and collaboration"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-200 rounded-full opacity-50 z-0"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-200 rounded-full opacity-50 z-0"></div>
        </div>
      </div>
      
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Join us in revolutionizing the way students learn, grow, and prepare for their future. With Learnitab, you're not just studying; you're <span className="font-bold text-purple-600">building the foundation</span> for a <span className="font-bold text-pink-600">successful career</span> and <span className="italic">lifelong learning journey</span>.
        </p>
      </motion.div>
    </div>
    
    {/* Background decorative elements */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply opacity-10 animate-blob"></div>
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply opacity-10 animate-blob animation-delay-4000"></div>
    </div>
  </section>
</AnimatedSection>

        <AnimatedSection>
          <section id="get-started" className="py-24 bg-gradient-to-br from-purple-700 via-indigo-800 to-pink-700 text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Transform Your Learning Experience Today
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join thousands of students who've already unlocked their potential with Learnitab. Don't just study - excel, grow, and thrive!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <a 
                  href="https://chromewebstore.google.com/detail/learnitab-your-all-in-one/gpfbhkcbpgghppecgkdnipkmnojaeblj"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-white text-purple-700 font-bold text-lg py-4 px-8 rounded-full hover:bg-purple-100 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaChrome className="inline-block mr-2 text-2xl" />
                  Add Learnitab to Chrome - It's Free!
                </a>
              </motion.div>
              <motion.p
                className="mt-6 text-lg text-purple-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                🚀 Boost productivity • 🧠 Enhance learning • 💼 Unlock opportunities
              </motion.p>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <motion.div 
                className="absolute top-1/4 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-soft-light opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div 
                className="absolute bottom-1/4 right-10 w-80 h-80 bg-pink-500 rounded-full mix-blend-soft-light opacity-50"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -90, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute text-white text-opacity-30 select-none"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 20 + 10}px`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {["📚", "💡", "🎓", "⏰", "🚀"][index]}
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>
        
          <AnimatedSection>
            <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white relative overflow-hidden">
              <div className="max-w-4xl mx-auto px-4 relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">Get in Touch</h2>
                <p className="text-xl text-center mb-12">Have questions or want to collaborate? We'd love to hear from you!</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div 
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-purple-500 rounded-full p-4 inline-block mb-4">
                      <MdEmail className="text-3xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                    <a href="mailto:learnitab@gmail.com" className="text-purple-300 hover:text-white transition-colors duration-300">learnitab@gmail.com</a>
                  </motion.div>
                  <motion.div 
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-purple-500 rounded-full p-4 inline-block mb-4">
                      <FaInstagram className="text-3xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Follow on Instagram</h3>
                    <a href="https://www.instagram.com/learnitab" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white transition-colors duration-300">@learnitab</a>
                  </motion.div>
                  <motion.div 
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-purple-500 rounded-full p-4 inline-block mb-4">
                      <FaLinkedin className="text-3xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Connect on LinkedIn</h3>
                    <a href="https://www.linkedin.com/company/learnitab" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white transition-colors duration-300">Learnitab</a>
                  </motion.div>
                </div>
                <motion.div 
                  className="mt-16 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-2xl font-semibold mb-4">Ready to innovate with us?</p>
                  <a 
                    href="mailto:learnitab@gmail.com" 
                    className="inline-block bg-white text-purple-700 font-bold text-lg py-3 px-8 rounded-full hover:bg-purple-100 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Start a Conversation
                  </a>
                </motion.div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div 
                  className="absolute top-1/4 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-soft-light opacity-30"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div 
                  className="absolute bottom-1/4 right-10 w-80 h-80 bg-pink-500 rounded-full mix-blend-soft-light opacity-30"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </section>
          </AnimatedSection>
        </main>
        <AnimatedSection>
        <section id="featured-on" className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient-purple-pink">Featured On</h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <motion.a 
                href="https://techbasedirectory.com/product/learnitab-6095/?utm_source=featured_embed" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src="https://techbasedirectory.com/api/featured-embed" alt="Learnitab | Techbasedirectory.com" width="200" height="54" className="shadow-lg rounded-lg"/>
              </motion.a>
              <motion.a 
                href="https://www.producthunt.com/posts/learnitab?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-learnitab" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=496388&theme=light" alt="Learnitab - Productivity, Career, Study at Your Fingertips | Product Hunt" width="250" height="54" className="shadow-lg rounded-lg"/>
              </motion.a>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply opacity-10 animate-blob"></div>
            <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply opacity-10 animate-blob animation-delay-2000"></div>
          </div>
        </section>
      </AnimatedSection>
      <footer className="bg-gradient-to-br from-gray-900 to-indigo-900 text-white py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-4">Learnitab</h3>
          <p className="mb-4">Transforming every new tab into a learning opportunity.</p>
          <p className="text-sm">Version 2.5.1 | Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {['Features', 'Support'].map((item) => (
              <li key={item}><a href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-purple-300 transition duration-300">{item}</a></li>
            ))}
            <li>
              <a 
                href="https://learnitab.com/privacy.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-purple-300 transition duration-300"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div className="text-center md:text-right">
          <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
          <div className="flex justify-center md:justify-end space-x-4 mb-4">
            <a href="https://www.instagram.com/learnitab" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-purple-300 transition duration-300">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/learnitab" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-purple-300 transition duration-300">
              <FaLinkedin />
            </a>
            <a href="mailto:learnitab@gmail.com" className="text-2xl hover:text-purple-300 transition duration-300">
              <FaEnvelope />
            </a>
          </div>
          <p className="text-sm">Email: learnitab@gmail.com</p>
          <p className="text-sm">Follow on Instagram: @learnitab</p>
          <p className="text-sm">
            <a href="https://www.linkedin.com/company/learnitab" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition duration-300">
              Connect on LinkedIn: Learnitab
            </a>
          </p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center relative z-10">
        <p>&copy; {new Date().getFullYear()} Learnitab. All rights reserved.</p>
        <p className="mt-2 text-sm">Empowering over 1 million students across 150+ countries.</p>
        <p className="mt-2 text-xs">Learnitab is not affiliated with Google Chrome. Chrome is a trademark of Google LLC.</p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-16 left-1/2 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </footer>
        
        {desktopModeOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
    <div className="absolute top-4 right-4 z-60">
      <button 
        onClick={() => setDesktopModeOpen(false)}
        className="text-white hover:text-gray-200 focus:outline-none"
      >
        <FaTimes size={24} />
      </button>
    </div>
    <iframe
      src="https://learnitab.com/app/"
      className="w-full h-full border-none"
      title="Learnitab Desktop Mode"
    />
  </div>
)}
        </div>
          );
        }