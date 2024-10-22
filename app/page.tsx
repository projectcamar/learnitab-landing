'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useAnimation, Variants } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { FaCog, FaWrench, FaRuler, FaDraftingCompass, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FaCalendarAlt, FaUsers, FaTrophy, FaNetworkWired, FaComments, FaChalkboardTeacher } from 'react-icons/fa';
import { FaUserTie, FaShareAlt, FaFemale, FaUserGraduate, FaVenusMars, FaGlobeAsia, FaLightbulb, FaChartLine, FaGraduationCap, FaGlobeAmericas } from 'react-icons/fa';

// Engineering Icons Component
const EngineeringIcons = () => {
  const icons = [
    { name: 'gear', path: 'M12 8v-2h-2V4H8v2H6v2h2v2H6v2h2v2h2v-2h2v2h8v-2h-8v-2h2V8h-2zm-4 4v-4h4v4H8z' },
    { name: 'wrench', path: 'M13.7 15.3a1 1 0 0 1-1.4 1.4l-2.3-2.3a1 1 0 0 1 1.4-1.4l2.3 2.3zm.2-9.9l-1.1 1.1a3.8 3.8 0 0 1 1.7 5.3L17.7 15A5.1 5.1 0 0 0 18 13.5C18 10.5 15.5 8 12.5 8c-1.9 0-3.5.9-4.5 2.3L6.8 9.1A6.5 6.5 0 0 1 14 5.4zm-8.4 8.4a3.8 3.8 0 0 0 5.3 1.7l1.1 1.1a5.1 5.1 0 0 1-6.4-6.4l1.1 1.1a3.8 3.8 0 0 0-1.1 2.5z' },
    { name: 'ruler', path: 'M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm16 14H5V5h14v14zM7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z' },
    { name: 'blueprint', path: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11 8 15.01z' },
  ];

  return (
    <div className="engineering-icons">
      {icons.map((icon, index) => (
        <svg key={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
          <path d={icon.path} />
        </svg>
      ))}
    </div>
  );
};

// 3D Model Component

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-teal-600 text-white">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-abril">Kartika.id</div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
        <ul className={`md:flex space-y-4 md:space-y-0 md:space-x-6 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <li><a href="#about" className="hover:text-yellow-300 transition-colors duration-300">About</a></li>
          <li><a href="#background" className="hover:text-yellow-300 transition-colors duration-300">Background</a></li>
          <li><a href="#programs" className="hover:text-yellow-300 transition-colors duration-300">Programs</a></li>
          <li><a href="#team" className="hover:text-yellow-300 transition-colors duration-300">Team</a></li>
          <li><a href="#join" className="bg-yellow-400 text-purple-800 px-4 py-2 rounded-full hover:bg-yellow-300 transition-colors duration-300">Join Now</a></li>
        </ul>
      </nav>
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/female engineering.jpeg"
          alt="Female Engineering"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-blue-600 opacity-50"></div>
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-10">
          <FaCog className="absolute right-0 bottom-0 text-9xl" />
          <FaWrench className="absolute right-1/4 bottom-1/4 text-8xl" />
          <FaRuler className="absolute right-1/2 bottom-1/2 text-7xl" />
          <FaDraftingCompass className="absolute right-3/4 bottom-3/4 text-6xl" />
        </div>
      </div>
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center relative z-10">
        <div className="md:w-1/2">
          <motion.h1 
            className="text-5xl md:text-6xl mb-6 font-abril leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Empowering Women,<br />Engineering Futures
          </motion.h1>
          <motion.p 
            className="text-xl mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Kartini Teknik Berdaya: Shaping the future of female engineers at Universitas Hasanuddin and beyond.
          </motion.p>
          <motion.button 
            className="bg-yellow-400 text-purple-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join Our Community
          </motion.button>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 relative">
          <div className="w-full h-full bg-white bg-opacity-10 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <FaCog className="text-9xl absolute top-0 left-0 text-yellow-300 opacity-50" />
          <FaWrench className="text-8xl absolute bottom-0 right-0 text-teal-300 opacity-50" />
          <FaRuler className="text-7xl absolute top-1/4 right-1/4 text-purple-300 opacity-50" />
          <FaDraftingCompass className="text-6xl absolute bottom-1/4 left-1/4 text-pink-300 opacity-50" />
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl mb-12 text-center text-teal-800 font-abril">About Kartika.id</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-coral rounded-lg p-8 shadow-lg relative z-10">
              <p className="text-lg mb-6">
                Greetings Future Female Engineer! I'm Ugi Fitri Syawalyani, the Founder and CEO of Kartika.id and also an
                active engineering student from Universitas Hasanuddin.
              </p>
              <p className="text-lg mb-6">
                Kartika.id is a pioneering community dedicated to empowering female engineering students specially at Unhas. 
                We provide insightful sharing sessions, mentorship, and networking opportunities to help you discover and 
                pursue your career goals in engineering.
              </p>
              <p className="text-lg">
                Join us on this exciting journey and become an integral part of the Kartika.id family. Together, let's shape 
                a future where women in engineering can thrive, connect, and achieve their dreams.
              </p>
            </div>
            <div className="absolute top-4 left-4 w-full h-full bg-teal-600 rounded-lg -z-10"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <FaCog className="text-5xl text-teal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p>Fostering creative solutions in engineering</p>
                </div>
                <div className="text-center">
                  <FaLightbulb className="text-5xl text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
                  <p>Building confidence in female engineers</p>
                </div>
                <div className="text-center">
                  <FaUsers className="text-5xl text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p>Creating a supportive network</p>
                </div>
                <div className="text-center">
                  <FaGraduationCap className="text-5xl text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Education</h3>
                  <p>Continuous learning and growth</p>
                </div>
              </div>
            </div>
            <div className="absolute top-4 left-4 w-full h-full bg-yellow-300 rounded-lg -z-10"></div>
          </motion.div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-teal-200 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-yellow-200 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/3"></div>
    </section>
  );
};


// Background Section
const BackgroundSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const controls = useAnimation();

  const facts = [
    { title: "Career Goal Clarity", percentage: 70, description: "Female engineering students at Unhas lack clarity in career goals due to insufficient guidance and resources", icon: <FaChartLine /> },
    { title: "Leadership Representation", percentage: 75, description: "Female engineering students at UNHAS underrepresented in leadership positions", icon: <FaUserGraduate /> },
    { title: "STEM Participation", value: "3 out of 10", description: "Female Participation Rate in STEM: Only 3 out of 10 Indonesian women choose careers in STEM fields", icon: <FaVenusMars /> },
    { title: "Engineering Career Interest", percentage: 25.4, description: "25.4% of girls would consider a career in engineering, compared to 51.9% of boys", icon: <FaGlobeAsia /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % facts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [activeIndex]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      controls.start({ pathLength: scrollPercentage / 100 });
    }
  };

  return (
    <section id="background" className="py-20 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10" ref={containerRef} onScroll={handleScroll}>
        <h2 className="text-4xl mb-12 text-center text-teal-800 font-abril">Our Background</h2>
        <div className="relative">
          <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: -1 }}>
            <motion.path
              d="M0,100 Q50,0 100,100 T200,100 T300,100 T400,100"
              stroke="#2C7A7B"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={controls}
            />
          </svg>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facts.map((fact, index) => (
              <motion.div
                key={index}
                className={`bg-white p-6 rounded-lg shadow-lg relative overflow-hidden ${
                  index === activeIndex ? 'ring-4 ring-yellow-400' : ''
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-600 rounded-full -mr-12 -mt-12 flex items-center justify-center text-white text-4xl transform rotate-12">
                  {fact.icon}
                </div>
                <h4 className="text-2xl mb-4 font-abril pr-16">{fact.title}</h4>
                <p className="text-4xl mb-4 text-teal-600 font-bold">
                  {fact.percentage ? `${fact.percentage}%` : fact.value}
                </p>
                <p className="text-lg">{fact.description}</p>
                {index === activeIndex && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          className="mt-12 p-6 bg-teal-700 text-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl mb-4 font-abril">Our Commitment</h3>
          <p className="text-lg">
            At Kartika.id, we're committed to bridging the gender gap in engineering and empowering female students to pursue successful careers in STEM fields. Through mentorship, networking, and skill development programs, we aim to increase career goal clarity, boost leadership representation, and inspire more women to choose engineering as their profession.
          </p>
        </motion.div>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-teal-200 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-yellow-200 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/3"></div>
    </section>
  );
};

// Solutions Section
const SolutionsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const solutions = [
    {
      title: "Kartinection",
      description: "Networking for female engineering students. Connect with professionals, alumni, and peers to expand your professional network and gain industry insights.",
      icon: <FaNetworkWired />,
      color: "bg-blue-500",
    },
    {
      title: "Kartishare",
      description: "Knowledge sharing sessions with expert women speakers from various engineering fields. Gain valuable information and inspiration to understand your potential career paths.",
      icon: <FaShareAlt />,
      color: "bg-purple-500",
    },
    {
      title: "Kartiship",
      description: "Mentorship program providing ongoing support and guidance. Get paired with mentors in your field of focus to navigate your career path and overcome challenges.",
      icon: <FaUserGraduate />,
      color: "bg-yellow-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % solutions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-800 relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-5xl mb-16 text-center text-white font-abril">Our Solutions</h2>
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-4xl h-96 mb-12">
            {solutions.map((solution, index) => (
              <AnimatePresence key={solution.title}>
                {activeIndex === index && (
                  <motion.div
                    className={`absolute inset-0 ${solution.color} rounded-3xl shadow-2xl overflow-hidden`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-30" />
                    <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-8">
                      <motion.div
                        className="text-8xl mb-6"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {solution.icon}
                      </motion.div>
                      <motion.h3
                        className="text-4xl font-bold mb-4"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {solution.title}
                      </motion.h3>
                      <motion.p
                        className="text-lg text-center max-w-2xl"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {solution.description}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
          <div className="flex justify-center space-x-4">
            {solutions.map((_, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-white scale-125' : 'bg-gray-400 scale-100'
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-purple-300 to-yellow-300" />
        <svg className="absolute bottom-0 left-0 w-full h-auto" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#008080" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

// Missions Section
const MissionsSection = () => {
  const [activeMission, setActiveMission] = useState(0);

  const missions = [
    {
      title: "Women Empowerment",
      description: "Breaking barriers and providing tools for female engineering students to thrive in a male-dominated field.",
      icon: <FaFemale />,
      color: "bg-pink-400",
    },
    {
      title: "Development",
      description: "Offering comprehensive programs for holistic growth, both professionally and personally.",
      icon: <FaChartLine />,
      color: "bg-purple-400",
    },
    {
      title: "Networking",
      description: "Facilitating valuable connections with industry professionals, alumni, and peers.",
      icon: <FaNetworkWired />,
      color: "bg-blue-400",
    },
  ];

  return (
    <section id="missions" className="py-20 bg-cream relative overflow-hidden min-h-screen flex items-center">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl mb-12 text-center text-teal-800 font-abril">Our Missions</h2>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            {missions.map((mission, index) => (
              <motion.button
                key={index}
                className={`w-full text-left p-4 mb-4 rounded-lg transition-all ${
                  activeMission === index ? `${mission.color} text-white` : 'bg-white'
                }`}
                onClick={() => setActiveMission(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center">
                  <div className={`mr-4 text-2xl ${activeMission === index ? 'text-white' : mission.color}`}>
                    {mission.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{mission.title}</h3>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="w-full md:w-2/3 md:pl-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMission}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg relative"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${missions[activeMission].color} rounded-full -mr-16 -mt-16 flex items-center justify-center text-white text-6xl transform rotate-12`}>
                  {missions[activeMission].icon}
                </div>
                <h3 className="text-3xl mb-4 font-abril">{missions[activeMission].title}</h3>
                <p className="text-lg leading-relaxed">{missions[activeMission].description}</p>
                <div className="mt-8">
                  <h4 className="text-xl mb-4 font-semibold">How we achieve this:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Mentorship programs connecting students with industry leaders</li>
                    <li>Workshops and seminars focused on skill development</li>
                    <li>Networking events and industry partnerships</li>
                    <li>Collaborative projects and challenges</li>
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300"></div>
        <svg className="absolute bottom-0 left-0 w-full h-auto" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#008080" fillOpacity="0.2" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

// Team Section
const TeamSection = () => {
  const [activeTeam, setActiveTeam] = useState('core');

  const coreTeam = [
    { name: "Ugi Fitri Syawalyani", role: "Founder & CEO", image: "/ugi.jpg" },
    { name: "Marwany Sukma Dewi", role: "Director of Curriculum", image: "/marwany.jpg" },
    { name: "Jessica Evangeline", role: "Director of Human Resources", image: "/jessica.jpg" },
    { name: "Nurunnisa Fathanah", role: "Director of Programs", image: "/nurunnisa.jpg" },
    { name: "Artih Nuraniah", role: "Director of Strategy and Partnership", image: "/artih.jpg" },
    { name: "Fidyah Adelia Fitri", role: "Director of Creative Marketing", image: "/fidyah.jpg" },
  ];

  const mentors = [
    { name: "Ghauzyla Aribqa", role: "Mentor of Zaha Group", university: "Urban Planning FT-UH" },
    { name: "Nurul Sofia Dewi", role: "Mentor of Ada Lovelace Group", university: "Institut Teknologi Bandung" },
    { name: "Faysa Ryestitha", role: "Mentor of Ada Lovelace Group", university: "Institut Teknologi Bandung" },
    { name: "Etsuko Karina", role: "Mentor of Marie Group", university: "Universitas Hasanuddin" },
    { name: "Aerielle Chrisadna", role: "Mentor of Marie Group", university: "Universitas Hasanuddin" },
    { name: "Marchia Sri Winda", role: "Mentor of Raye Group", university: "ITS" },
    { name: "Salsabila Budyana", role: "Mentor of Raye Group", university: "Universitas Hasanuddin" },
    { name: "Madeline Abigail", role: "Mentor of Zaha Group", university: "ITB" },
    { name: "Yvonne Kusumasanti", role: "Mentor of Emily Warren Group", university: "Universitas Hasanuddin" },
    { name: "Loretha Srikandi", role: "Mentor of Emily Warren Group", university: "Universitas Hasanuddin" },
    { name: "Putri Aminiah", role: "Mentor of Lillian Group", university: "Universitas Indonesia" },
    { name: "Alkhaer Abigail Naomi", role: "Mentor of Lillian Group", university: "Universitas Indonesia" },
  ];

  const TeamToggle = () => (
    <div className="flex justify-center mb-12">
      <button
        className={`px-6 py-2 rounded-l-full ${activeTeam === 'core' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600'}`}
        onClick={() => setActiveTeam('core')}
      >
        Core Team
      </button>
      <button
        className={`px-6 py-2 rounded-r-full ${activeTeam === 'mentors' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600'}`}
        onClick={() => setActiveTeam('mentors')}
      >
        Mentors
      </button>
    </div>
  );

  return (
    <section id="team" className="py-20 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl mb-12 text-center text-teal-800 font-abril">Our Team</h2>
        <TeamToggle />
        <AnimatePresence mode="wait">
          {activeTeam === 'core' ? (
            <motion.div
              key="core"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {coreTeam.map((member, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 transform skew-y-6 group-hover:skew-y-3 transition-all duration-300"></div>
                  <div className="relative bg-white p-6 shadow-lg">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-xl mb-2 font-abril text-center">{member.name}</h3>
                    <p className="text-teal-800 text-center">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="mentors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {mentors.map((mentor, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 transform -skew-y-6 group-hover:-skew-y-3 transition-all duration-300"></div>
                  <div className="relative bg-white p-6 shadow-lg">
                    <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                      {mentor.name.charAt(0)}
                    </div>
                    <h3 className="text-xl mb-2 font-abril text-center">{mentor.name}</h3>
                    <p className="text-teal-800 text-center mb-2">{mentor.role}</p>
                    <p className="text-sm text-gray-600 text-center">{mentor.university}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-64 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </section>
  );
};

// Organization Structure Section
const OrganizationStructureSection = () => {
  const [activeRole, setActiveRole] = useState(null);

  const structure = {
    CEO: {
      title: "Chief Executive Officer (CEO)",
      description: "Occupies the top leadership role, establishes strategic direction, makes significant decisions, and ensures the organization's success.",
      color: "bg-coral-500",
      icon: <FaUserTie />,
      children: [
        "Programs Director",
        "Curriculum Director",
        "Human Resources Director",
        "Creative Marketing Director",
        "Strategy and Partnership Director"
      ]
    },
    DepartmentLead: {
      title: "Department Lead",
      description: "Oversees respective departments, ensures effective execution of plans, and provides guidance.",
      color: "bg-blue-400",
      icon: <FaUsers />,
      children: [
        "Manager Kartishare",
        "Manager Kartinection",
        "Manager Program Curriculum",
        "Manager of Mentor",
        "Manager Recruitment",
        "Manager Organization Development",
        "Manager Graphic Designer",
        "Manager Video Marketing",
        "Manager Media Partner",
        "Manager Sponsorship"
      ]
    },
    DivisionLead: {
      title: "Division Lead",
      description: "Holds second-in-command position within their department, manages personnel, executes tasks, and ensures quality control.",
      color: "bg-green-400",
      icon: <FaUserGraduate />
    },
    Mentor: {
      title: "Mentor (Kakak Asuh)",
      description: "Assists participants, provides advice and feedback, and ensures engagement in all activities.",
      color: "bg-yellow-400",
      icon: <FaChalkboardTeacher />,
      children: [
        "Zaha Group (Architecture, Urban Planning)",
        "Emily Warren Group (Civil Engineering, Environmental Engineering)",
        "Lillian Group (Mechanical Engineering, Industrial Engineering)",
        "Ada Lovelace Group (Electrical Engineering, Informatics Engineering)",
        "Marie Group (Chemical Engineering, Mining Engineering)",
        "Raye Group (Naval Engineering, Ocean Engineering)"
      ]
    }
  };

  return (
    <section id="organization" className="py-20 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl mb-12 text-center text-teal-800 font-abril">Structure Organization</h2>
        <div className="relative">
          {/* Organizational chart */}
          <div className="grid gap-8">
            {Object.entries(structure).map(([key, role], index) => (
              <motion.div
                key={key}
                className={`${role.color} p-6 rounded-lg shadow-lg text-white cursor-pointer`}
                onClick={() => setActiveRole(activeRole === key ? null : key as unknown as null)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{role.icon}</div>
                  <h3 className="text-2xl font-bold">{role.title}</h3>
                </div>
                <AnimatePresence>
                  {activeRole === key && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p className="text-sm mb-4">{role.description}</p>
                      {('children' in role) && (
                        <div className="grid grid-cols-2 gap-2">
                          {role.children.map((child, childIndex) => (
                            <div key={childIndex} className="bg-white bg-opacity-20 p-2 rounded">
                              {child}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full opacity-10">
          <path fill="#2C7A7B" d="M39.9,-65.7C51.1,-59.3,59.2,-47.7,65.8,-35.1C72.4,-22.4,77.5,-8.7,76.5,4.6C75.5,17.9,68.4,30.8,59.1,41.3C49.8,51.8,38.3,59.9,25.5,64.8C12.7,69.7,-1.4,71.4,-15.4,69.1C-29.3,66.8,-43.1,60.6,-54.4,50.8C-65.7,41,-74.5,27.7,-77.6,12.9C-80.7,-1.9,-78,-18.2,-71.1,-32C-64.2,-45.8,-53,-57.1,-40,-64C-27,-70.9,-13.5,-73.4,0.2,-73.7C13.8,-74,27.7,-72.1,39.9,-65.7Z" transform="translate(100 100)" />
        </svg>
      </div>
    </section>
  );
};

// Program Schedule Section
const ProgramScheduleSection = () => {
  const schedule = [
    { date: "June 24 - July 1", event: "Open Recruitment", icon: <FaUsers />, color: "bg-blue-500" },
    { date: "July 2", event: "Announcement", icon: <FaTrophy />, color: "bg-green-500" },
    { date: "July 3", event: "Kick Off Session", icon: <FaCalendarAlt />, color: "bg-purple-500" },
    { date: "July 3 - July 20", event: "Kartiship", icon: <FaChalkboardTeacher />, color: "bg-pink-500" },
    { date: "July 6", event: "#1 Kartinection", icon: <FaNetworkWired />, color: "bg-yellow-500" },
    { date: "July 7", event: "#2 Kartinection", icon: <FaNetworkWired />, color: "bg-yellow-500" },
    { date: "July 11", event: "#2 Kartishare", icon: <FaComments />, color: "bg-red-500" },
    { date: "July 13", event: "#3 Kartishare", icon: <FaComments />, color: "bg-red-500" },
    { date: "July 14", event: "Mid Program Review", icon: <FaCalendarAlt />, color: "bg-indigo-500" },
    { date: "July 19", event: "#1 Kartishare", icon: <FaComments />, color: "bg-red-500" },
  ];

  return (
    <section id="schedule" className="py-20 bg-mint">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl mb-12 text-center text-teal-800 font-abril">Kartika.id's First-Month Schedule</h2>
        <div className="overflow-x-auto">
          <div className="inline-flex space-x-4 pb-8">
            {schedule.map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`w-40 h-4 ${item.color} rounded-t-lg`}></div>
                <div className="w-40 bg-white p-4 rounded-b-lg shadow-lg">
                  <div className="text-3xl mb-2 text-teal-600">{item.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.event}</h3>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl mb-4 font-abril text-teal-800">Notes:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Events marked with (*) may have schedule changes.</li>
            <li>All programs will be conducted fully online.</li>
            <li>Kartishare (career sharing session) and Kartinection (networking event) will be conducted via Zoom Meeting with an invited speaker and facilitator.</li>
            <li>Kartiship (mentorship) will be provided via a WhatsApp group (community) between the mentor and mentee. The mentoring method will be adjusted according to the mentor's mechanism and the availability schedule of the mentor and mentee.</li>
            <li>After the mid-program review, Kartiship activities will continue to be carried out.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

const ProgramOutcomesSection = () => {
  const outcomes = [
    { title: "Enhanced Career Clarity", description: "Participants gain a clearer understanding of their career goals in engineering through mentorship and sharing sessions.", icon: <FaLightbulb />, color: "bg-yellow-400" },
    { title: "Increased Confidence and Skills", description: "Improved self-confidence and professional skills, enabling participants to better navigate the engineering field.", icon: <FaChartLine />, color: "bg-green-400" },
    { title: "Strong Professional Networks", description: "Development of a robust network of peers, mentors, expert women speaker and young professional alumni, fostering collaboration and networking related to engineering.", icon: <FaNetworkWired />, color: "bg-blue-400" },
    { title: "Enhanced National/International Exposure", description: "Participants gain increased visibility and opportunities through networking events, partnerships, and exposure to global/national engineering.", icon: <FaGlobeAmericas />, color: "bg-purple-400" },
  ];

  return (
    <section id="outcomes" className="py-20 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl mb-12 text-center text-teal-800 font-abril">Program Outcomes</h2>
        <p className="text-lg mb-12 text-center max-w-2xl mx-auto">As a member, you're in for a treat with these awesome benefits:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={index}
              className={`bg-white p-6 rounded-lg shadow-lg relative overflow-hidden ${index % 2 === 0 ? 'md:translate-y-8' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${outcome.color} rounded-full -mr-12 -mt-12 flex items-center justify-center text-white text-4xl transform rotate-12`}>
                {outcome.icon}
              </div>
              <h3 className="text-2xl mb-4 font-abril pr-16">{outcome.title}</h3>
              <p className="text-lg">{outcome.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-5">
          <path fill="#008080" d="M44.7,-76.4C58.8,-69.2,71.8,-59,79.6,-45.8C87.4,-32.6,90,-16.3,89.1,-0.5C88.2,15.3,83.8,30.6,75.6,43.9C67.4,57.1,55.4,68.3,41.6,76.3C27.9,84.3,13.9,89.1,-0.4,89.8C-14.7,90.5,-29.4,87,-42.3,79.7C-55.2,72.4,-66.3,61.3,-74.7,48C-83.1,34.7,-88.7,17.3,-89.9,-0.7C-91.1,-18.7,-87.8,-37.4,-79.1,-53.2C-70.4,-68.9,-56.3,-81.7,-41,-87.2C-25.8,-92.8,-12.9,-91.1,1.6,-94C16.1,-96.9,32.2,-104.4,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>
    </section>
  );
};

// Join Section
const JoinSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");


  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
    },
    button: {
      height: 150,
      width: 150,
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      mixBlendMode: "difference"
    }
  }

  const springConfig = { type: "spring", stiffness: 300, damping: 20 };

  const textEnter = () => setCursorVariant("button");
  const textLeave = () => setCursorVariant("default");

  return (
    <section id="join" className="py-20 bg-gradient-to-br from-teal-600 to-teal-800 relative overflow-hidden">
      <motion.div
        className="cursor"
        variants={variants as Variants}
        animate={cursorVariant}
        transition={springConfig}
      />
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-5xl mb-8 text-center text-white font-abril">Join Kartika.id</h2>
        <p className="text-xl mb-12 text-center text-white max-w-2xl mx-auto">
          Be part of a community that empowers and supports future female engineers. Shape your engineering future with us!
        </p>
        <div className="relative">
          <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 animate-spin-slow" viewBox="0 0 100 100">
            <defs>
              <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
          </svg>
          <motion.a
            href="https://bit.ly/kartikaidngen1"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-48 h-48 mx-auto bg-yellow-400 rounded-full shadow-lg text-teal-800 font-bold text-xl flex items-center justify-center hover:bg-yellow-300 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={textEnter}
            onMouseLeave={textLeave}
          >
            Register Now
          </motion.a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FFFAF0" fillOpacity="0.8"></path>
        </svg>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    controls.start({
      backgroundPosition: `${mousePosition.x / 5}px ${mousePosition.y / 5}px`,
    });
  }, [mousePosition, controls]);

  return (
    <footer className="relative bg-teal-800 text-white overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-900"
        animate={controls}
        transition={{ type: 'tween', ease: 'linear' }}
      />
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-abril">Kartika.id</h3>
            <p>Empowering future female engineers to shape their destinies.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-abril">Quick Links</h3>
            <ul className="space-y-2">
              {['About Us', 'Background', 'Programs', 'Our Team', 'Join Us'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="hover:text-yellow-300 transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-abril">Contact</h3>
            <p>Email: info@kartika.id</p>
            <p>Universitas Hasanuddin, Makassar, Indonesia</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-abril">Follow Us</h3>
            <div className="flex space-x-4">
              {[
                { Icon: FaInstagram, href: 'https://www.instagram.com/kartikaidn' },
                { Icon: FaTwitter, href: '#' },
                { Icon: FaLinkedin, href: '#' },
              ].map(({ Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-yellow-300 transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <motion.div 
          className="mt-12 pt-8 border-t border-teal-700 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p>&copy; 2024 Kartika.id. All rights reserved.</p>
          <p className="mt-2">Fueled by @youngleadersforindonesia</p>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-teal-900 to-transparent" />
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#FFFAF0" fillOpacity="0.1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </footer>
  );
};

// Main App Component
export default function Home() {
  useEffect(() => {
    // Update the document title
    document.title = "Kartika.id";
  }, []);

  return (
    <div className="font-jakarta">
      <Header />
      <HeroSection />
      <AboutSection />
      <BackgroundSection />
      <MissionsSection />
      <SolutionsSection />
      <TeamSection />
      <OrganizationStructureSection />
      <ProgramScheduleSection />
      <ProgramOutcomesSection />
      <JoinSection />
      <Footer />
    </div>
  );
}