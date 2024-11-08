'use client'

import React from 'react';
import { FaApple, FaWindows, FaLinux, FaLightbulb, FaUsers, FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DownloadPage = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen flex flex-col items-center">
      <main className="flex flex-col items-center justify-center flex-grow text-center p-8 mt-16 relative overflow-hidden">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold mb-4 relative"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">Learnitab</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 opacity-30 blur-md"></span>
          <span className="relative z-10">Opportunity Portal App</span>
        </motion.h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Unlock a world of opportunities! Get instant access to scholarships, internships, and competitions right on your desktop.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-16">
          <motion.a 
            href="/LearnitabWindowsSetup.exe" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-full flex items-center shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
            download
          >
            <FaWindows className="mr-2" />
            Download for Windows
          </motion.a>
          <motion.a 
            href="/LearnitabMacOSSetup.exe" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-full flex items-center shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
            download
          >
            <FaApple className="mr-2" />
            Download for macOS
          </motion.a>
          <motion.a 
            href="/LearnitabLinuxSetup.exe" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-full flex items-center shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
            download
          >
            <FaLinux className="mr-2" />
            Download for Linux
          </motion.a>
        </div>

        <section className="mt-16 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8">What You Get If You Install Learnitab Desktop App</h2>
          <div className="space-y-8">
            <Feature 
              title="Explore Opportunities" 
              description="Discover various internships, competitions, and scholarships available for you." 
              icon={<FaBook className="text-5xl text-purple-600" />} 
            />
            <Feature 
              title="Connect with Mentors" 
              description="Find mentors who can guide you through your career journey." 
              icon={<FaUsers className="text-5xl text-purple-600" />} 
            />
            <Feature 
              title="Stay Informed" 
              description="Get updates on the latest opportunities and events." 
              icon={<FaLightbulb className="text-5xl text-purple-600" />} 
            />
          </div>
        </section>

        {/* Decorative Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </main>
    </div>
  );
};

const Feature = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <motion.div 
    className="bg-white bg-opacity-90 rounded-xl p-6 shadow-lg relative overflow-hidden transition-transform transform hover:scale-105"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-semibold mb-2 text-purple-600 ml-4">{title}</h3>
    </div>
    <p className="text-gray-700">{description}</p>
    <span className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 opacity-20 blur-md"></span>
  </motion.div>
);

export default DownloadPage;