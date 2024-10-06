'use client'

import { FaArrowDown, FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBars, FaChrome, FaInstagram, FaLinkedin, FaTimes } from 'react-icons/fa';
import { BiFullscreen, BiTime, BiBook, BiBot, BiMusic, BiPalette, BiSearch, BiSidebar, BiStar } from 'react-icons/bi';
import { MdEmail } from 'react-icons/md';
import Image from 'next/image';



interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imagePath: string;
  isReversed?: boolean;
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

const Feature: React.FC<FeatureProps> = ({ title, description, icon, imagePath, isReversed }) => {
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
      {!desktopModeOpen && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white bg-opacity-90 backdrop-blur-sm shadow-md">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
            <div className="text-2xl sm:text-3xl font-bold text-gradient-purple-pink">
              Learnitab
            </div>
            <button 
              className="md:hidden text-gray-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <ul className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex md:space-x-8 w-full md:w-auto mt-4 md:mt-0`}>
              <li><a href="#features" className="nav-link block py-2">Features</a></li>
              <li><a href="#about" className="nav-link block py-2">About</a></li>
              <li><a href="#get-started" className="nav-link block py-2">Get Started</a></li>
              <li><a href="#contact" className="nav-link block py-2">Contact</a></li>
            </ul>
          </nav>
        </header>
      )}

<main className={`${desktopModeOpen ? 'pt-0' : 'pt-16'} relative z-10`}>
  <AnimatedSection>
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 relative overflow-hidden py-8">
      <AnimatedShape />
      <div className="text-center max-w-4xl mx-auto relative z-10 mt-16"> {/* Increased mt-8 to mt-16 */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Empower Your Student Journey with{' '}
          <span className="text-gradient-purple-pink">
            Learnitab
          </span>
        </motion.h1>
        <TypewriterText text="Your all-in-one productivity dashboard for students. Discover opportunities, access tools, and boost your academic success." />
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
      
        </motion.div>
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a 
            href="https://chromewebstore.google.com/detail/learnitab-your-all-in-one/gpfbhkcbpgghppecgkdnipkmnojaeblj"
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary w-full sm:w-auto"
          >
            <FaChrome className="inline-block mr-2" />
            <span>Add to Chrome</span>
          </a>
          <div className="relative inline-flex items-center">
            <button 
              onClick={() => setDesktopModeOpen(true)}
              className="bg-white text-purple-600 font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-gray-100 w-full sm:w-auto"
            >
              Learnitab desktop mode
            </button>
            <FaInfoCircle 
              className="absolute -right-6 text-purple-600 cursor-pointer" 
              data-tooltip-id="desktop-mode-info"
              data-tooltip-content="Cari mentor, magang, beasiswa, dan info lomba klik disini!"
            />
            <Tooltip id="desktop-mode-info" place="bottom" />
          </div>
        </motion.div>
        </div>
<AnimatePresence>
  {showFeaturesButton && (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="mt-8" // Changed from "mt-12" to "mt-8"
    >
      <a 
        href="#features"
        className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
        aria-label="Scroll to features"
      >
        <FaArrowDown className="text-xl" />
      </a>
    </motion.div>
  )}
</AnimatePresence>
    </section>
  </AnimatedSection>

  <AnimatedSection>
    <section id="features" className="py-16 md:py-24 bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title mb-16">
          Supercharge Your Studies with Learnitab
        </h2>
        <Feature
          title="Dual-Mode Interface: Choose Your Study Vibe"
          description="Switch between Focus Mode for distraction-free work and Explore Opportunity Mode to discover new possibilities and resources."
          icon={<BiFullscreen />}
          imagePath="/images/Learnitab_page-0001.jpg"
        />
        <Feature
          title="Time Management Mastery"
          description="Stay on top of your tasks with our intelligent Todo List and visualize important dates with Countdown Timers."
          icon={<BiTime />}
          imagePath="/images/Learnitab_page-0002.jpg"
          isReversed
        />
        <Feature
          title="Essential Student Tools at Your Fingertips"
          description="Access KBBI, Gramatika, Wikipedia, Scientific Calculator, and Pomodoro Timer all in one place for seamless studying."
          icon={<BiBook />}
          imagePath="/images/Learnitab_page-0003.jpg"
        />
        <Feature
          title="AI-Powered Learning Assistance"
          description="Get instant help with research, writing, and problem-solving using integrated ChatGPT and Google Gemini."
          icon={<BiBot />}
          imagePath="/images/Learnitab_page-0004.jpg"
          isReversed
        />
        <Feature
          title="Study in Style with Spotify Integration"
          description="Access your favorite study playlists without leaving your dashboard, creating the perfect ambiance for productive work."
          icon={<BiMusic />}
          imagePath="/images/Learnitab_page-0005.jpg"
        />
        <Feature
          title="Personalize Your Experience"
          description="Set the perfect mood for your study sessions with customizable backgrounds and choose between Dark/Light Mode for comfort."
          icon={<BiPalette />}
          imagePath="/images/Learnitab_page-0006.jpg"
          isReversed
        />
        <Feature
          title="Efficient Information Retrieval"
          description="Find what you need faster with our Multi-Engine Search feature, searching across various platforms simultaneously."
          icon={<BiSearch />}
          imagePath="/images/Learnitab_page-0007.jpg"
        />
        <Feature
          title="Productivity Sidekick"
          description="Access essential tools like WhatsApp Web and Todoist quickly with our convenient Side Panel feature."
          icon={<BiSidebar />}
          imagePath="/images/Learnitab_page-0008.jpg"
          isReversed
        />
        <Feature
          title="Opportunity Explorer"
          description="Discover internships, scholarships, competitions, and more - all tailored to your interests and academic goals."
          icon={<BiStar />}
          imagePath="/images/Learnitab_page-0009.jpg"
        />
      </div>
    </section>
  </AnimatedSection>
        <AnimatedSection>
  <section id="about" className="py-16 md:py-24 bg-white">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="section-title mb-12">About Learnitab</h2>
      <div className="glass-effect rounded-xl p-8 mb-12 text-center">
        <p className="text-xl text-gray-700 leading-relaxed">
          <span className="font-semibold text-purple-600">Learnitab</span> is an{' '}
          <span className="italic">innovative platform</span> dedicated to{' '}
          <span className="underline">empowering students</span>, helping them achieve their{' '}
          <span className="text-pink-600 font-bold">full potential</span> through a{' '}
          <span className="text-gradient-purple-pink">
            centralized, interactive, and user-friendly
          </span>{' '}
          digital dashboard and workshops.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="glass-effect rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-purple-600">Our Mission</h3>
          <p className="text-gray-700">
            To <span className="font-bold">mitigate the challenges</span> faced by{' '}
            <span className="italic">Indonesian university graduates</span> in entering the job market by providing{' '}
            <span className="underline">early personal development resources</span> and{' '}
            <span className="text-pink-600">opportunities</span>.
          </p>
        </motion.div>
        <motion.div 
          className="glass-effect rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-pink-600">Our Vision</h3>
          <p className="text-gray-700">
            To create a generation of{' '}
            <span className="font-bold text-purple-600">well-prepared</span>,{' '}
            <span className="font-bold text-pink-600">highly skilled</span>{' '}
            <span className="italic">Indonesian graduates</span> ready to{' '}
            <span className="underline">excel in the global job market</span>.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
</AnimatedSection>

        <AnimatedSection>
          <section id="get-started" className="py-16 md:py-24 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Get Learnitab on Your Device Now</h2>
              <p className="text-xl mb-12">Start boosting your productivity and discovering opportunities today!</p>
              <motion.a 
                href="https://chromewebstore.google.com/detail/learnitab-your-all-in-one/gpfbhkcbpgghppecgkdnipkmnojaeblj"
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition duration-300 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                >
                  <FaChrome className="inline-block mr-2" />
                  Add to Chrome
                </motion.a>
              </div>
            </section>
          </AnimatedSection>
        
          <AnimatedSection>
            <section id="contact" className="py-16 md:py-24 bg-white">
              <div className="max-w-4xl mx-auto px-4">
                <h2 className="section-title mb-12">Get in Touch</h2>
                <p className="text-xl text-center mb-12">Have questions or want to collaborate? We'd love to hear from you!</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-purple-100 rounded-full p-6 inline-block mb-4">
                      <MdEmail className="text-4xl text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                    <a href="mailto:learnitab@gmail.com" className="text-purple-600 hover:underline">learnitab@gmail.com</a>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-purple-100 rounded-full p-6 inline-block mb-4">
                      <FaInstagram className="text-4xl text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Follow on Instagram</h3>
                    <a href="https://www.instagram.com/learnitab" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">@learnitab</a>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-purple-100 rounded-full p-6 inline-block mb-4">
                      <FaLinkedin className="text-4xl text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Connect on LinkedIn</h3>
                    <a href="https://www.linkedin.com/company/learnitab" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Learnitab</a>
                  </motion.div>
                </div>
              </div>
            </section>
          </AnimatedSection>
        </main>
        
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2024 Learnitab. All rights reserved.</p>
            <p className="mt-2">Empowering students to achieve their full potential.</p>
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
      src="https://learnitab.vercel.app"
      className="w-full h-full border-none"
      title="Learnitab Desktop Mode"
    />
  </div>
)}
        </div>
          );
        }