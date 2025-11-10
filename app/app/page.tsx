'use client'

import { useState, useEffect, useCallback, useRef, ReactElement, Key, JSXElementConstructor, ReactNode, Suspense } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { FiSearch, FiHeart, FiCalendar, FiRotateCw, FiMenu, FiLinkedin, 
         FiInstagram, FiLink, FiTrash2, FiBriefcase, FiAward, 
         FiBookOpen, FiUsers, FiDisc, FiDownload, FiSend, FiCpu } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { SiProducthunt } from 'react-icons/si';
import { Post } from '../models/Post';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { CustomErrorBoundary } from '../components/ErrorBoundary';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// @ts-ignore
console.error = (...args: any) => {
  if (args[0]?.includes?.('Encountered two children with the same key')) return;
  console.warn(...args);
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
});

type CalendarEvent = {
  id: string;
  title: string;
  deadline: string;
};

// 1. Add proper error handling for localStorage with timestamp support
type FavoriteItem = {
  title: string;
  lovedAt: number;
  unlovedAt?: number;
};

const getInitialState = () => {
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Handle legacy format (array of strings) and convert to new format
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          const converted: FavoriteItem[] = parsed.map((title: string) => ({
            title,
            lovedAt: Date.now()
          }));
          localStorage.setItem('favorites', JSON.stringify(converted));
          return converted;
        }
        return parsed;
      }
      return [];
    }
    return [];
  } catch (e) {
    return [];
  }
};

// Function to cleanup old unloved favorites
const cleanupOldFavorites = (favorites: FavoriteItem[]): FavoriteItem[] => {
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  return favorites.filter(fav => {
    // Keep if still loved (no unlovedAt)
    if (!fav.unlovedAt) return true;
    // Keep if unloved less than 3 days ago
    return (now - fav.unlovedAt) < threeDaysInMs;
  });
};

// Add this type definition at the top with other types
type RemotiveJob = {
  id: number;
  title: string;
  company_logo: string;
  description: string;
  url: string;
  company_name: string;
  job_type: string;
  candidate_required_location: string;
  salary: string;
  publication_date: string;
};

// Add Jobicy job type
type JobicyJob = {
  id: string;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  jobType: string;
  jobGeo: string;
  jobDescription: string;
  pubDate: string;
  annualSalaryMin?: number;
  annualSalaryMax?: number;
  salaryCurrency?: string;
};

// Add Arbeitnow job type
type ArbeitnowJob = {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
};

// Add types at the top of the file
type Experience = {
  role: string;
  company: string;
  duration: string;
};

type Education = {
  degree: string;
  school: string;
  year: string;
};

// Add RemoteOK job type after the other job types
type RemoteOKJob = {
  id: string;
  company: string;
  position: string;
  description: string;
  tags: string[];
  location: string;
  salary_min: number;
  salary_max: number;
  company_logo: string;
  url: string;
  date: string;
};

// Add Web3Job type definition after other job types
type Web3Job = {
  id: number;
  title: string;
  date: string;
  date_epoch: number;
  country: string;
  city: string;
  company: string;
  location: string;
  apply_url: string;
  tags: string[];
  description: string;
};

// Add fetchJobicyJobs function
const fetchJobicyJobs = async () => {
  try {
    console.log('Fetching Jobicy jobs...');
    const response = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50');
    const data = await response.json();
    
    console.log('Jobicy response:', data);

    if (!data.jobs || !Array.isArray(data.jobs)) {
      console.error('Invalid Jobicy response format:', data);
      return [];
    }

    return data.jobs.map((job: JobicyJob) => ({
      _id: job.id,
      title: job.jobTitle,
      category: 'jobs',
      link: job.url,
      company: job.companyName,
      image: job.companyLogo,
      location: job.jobGeo,
      workType: job.jobType,
      body: job.jobDescription,
      source: 'jobicy',
      created_at: new Date(job.pubDate).getTime(),
      expired: false,
      daysLeft: 30,
      labels: {
        Company: job.companyName,
        Position: job.jobTitle,
        Status: job.jobType
      }
    }));
  } catch (error: any) {
    console.error('Error fetching Jobicy jobs:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return [];
  }
};

// Update the fetchRemotiveJobs function
const fetchRemotiveJobs = async () => {
  try {
    const response = await fetch('https://remotive.com/api/remote-jobs');
    const data = await response.json();
    
    return data.jobs.map((job: RemotiveJob) => ({
      _id: job.id.toString(),
      title: job.title,
      category: 'jobs',
      image: job.company_logo,
      body: job.description,
      link: job.url,
      company: job.company_name,
      location: job.candidate_required_location || 'Remote',
      workType: job.job_type || 'Full Time',
      source: 'remotive',
      created_at: new Date(job.publication_date).getTime(),
      expired: false,
      daysLeft: 30,
      labels: {
        Company: job.company_name,
        Position: job.title,
        Status: job.job_type || 'Full Time'
      }
    }));
  } catch (error) {
    console.error('Error fetching Remotive jobs:', error);
    return [];
  }
};

// Update fetchArbeitnowJobs function
const fetchArbeitnowJobs = async () => {
  try {
    const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid response format from Arbeitnow:', data);
      return [];
    }

    // Use all jobs from the API response
    return data.data.map((job: ArbeitnowJob) => ({
      _id: job.slug,
      title: job.title,
      category: 'jobs',
      link: job.url,
      company: job.company_name,
      location: job.location,
      workType: job.job_types.join(', '),
      body: job.description,
      source: 'arbeitnow',
      created_at: job.created_at * 1000,
      expired: false,
      daysLeft: 30,
      remote: job.remote,
      tags: job.tags,
      labels: {
        Company: job.company_name,
        Position: job.title,
        Status: job.job_types[0] || 'Full Time'
      }
    }));
  } catch (error) {
    console.error('Error fetching Arbeitnow jobs:', error);
    return [];
  }
};

// Add fetchRemoteOKJobs function after the other fetch functions
const fetchRemoteOKJobs = async () => {
  try {
    console.log('Fetching RemoteOK jobs...');
    // Add limit parameter to get more jobs
    const response = await fetch('https://remoteok.com/api?limit=100', {
      headers: {
        'User-Agent': 'Learnitab (https://learnitab.com)'
      }
    });
    const data = await response.json();
    
    // Skip the first item as it's usually metadata
    const jobs = data.slice(1);
    console.log('RemoteOK jobs count:', jobs.length);
    
    return jobs.map((job: RemoteOKJob) => ({
      _id: job.id,
      title: job.position,
      category: 'jobs',
      link: job.url,
      company: job.company,
      image: job.company_logo || DEFAULT_COMPANY_LOGO,
      location: job.location || 'Remote',
      workType: job.tags?.[0] || 'Full Time',
      body: job.description,
      source: 'remoteok',
      created_at: new Date(job.date).getTime(),
      expired: false,
      daysLeft: 30,
      salary: job.salary_min && job.salary_max ? 
        `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : 
        'Not specified',
      labels: {
        Company: job.company,
        Position: job.position,
        Location: job.location || 'Remote',
        Status: job.tags?.[0] || 'Full Time',
        Salary: job.salary_min && job.salary_max ? 
          `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : 
          'Not specified'
      }
    }));
  } catch (error: any) {
    console.error('Error fetching RemoteOK jobs:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return [];
  }
};

// Add fetchWeb3Jobs function after other fetch functions
const fetchWeb3Jobs = async () => {
  try {
    console.log('Fetching Web3 jobs...');
    const response = await fetch('https://web3.career/api/v1?token=o8KS57qZNyYZfGAqqQnPuVDK5URZjgwH');
    const data = await response.json();
    
    if (!data[2] || !Array.isArray(data[2])) {
      console.error('Invalid Web3 jobs response format:', data);
      return [];
    }

    return data[2].map((job: Web3Job) => ({
      _id: job.id.toString(),
      title: job.title,
      category: 'jobs',
      link: job.apply_url,
      company: job.company,
      location: job.location || `${job.city}, ${job.country}`,
      workType: job.tags.includes('remote') ? 'Remote' : 'On-site',
      body: job.description,
      source: 'web3',
      created_at: job.date_epoch * 1000,
      expired: false,
      daysLeft: 30,
      tags: job.tags,
      labels: {
        Company: job.company,
        Position: job.title,
        Location: job.location || `${job.city}, ${job.country}`,
        Status: job.tags.includes('remote') ? 'Remote' : 'On-site',
        'Web3 Tags': job.tags.join(', ')
      }
    }));
  } catch (error: any) {
    console.error('Error fetching Web3 jobs:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return [];
  }
};

const DEFAULT_COMPANY_LOGO = 'https://od.lk/s/OTZfMTAwNTkwMzk0Xw/Job.png';

export default function Home() {
  const postsPerPage = 15;

  // Initialize with empty arrays for SSR
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [currentCategory, setCurrentCategory] = useState('jobs');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaved, setShowSaved] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostTitle, setSelectedPostTitle] = useState<string | null>(null);

  // 2. Move all localStorage operations to a single useEffect
  useEffect(() => {
    // Initialize from localStorage after component mounts
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        // Clean up old unloved favorites
        const cleaned = cleanupOldFavorites(parsed);
        setFavorites(cleaned);
        // Save cleaned list back
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('favorites', JSON.stringify(cleaned));
        }
      }

      const savedEvents = localStorage.getItem('calendarEvents');
      if (savedEvents) {
        setCalendarEvents(JSON.parse(savedEvents));
      }

      const savedAIJobsData = localStorage.getItem('ai-jobs-saved');
      if (savedAIJobsData) {
        setSavedAIJobs(JSON.parse(savedAIJobsData));
      }

      setShowWelcome(true); // Set welcome screen after mount
    } catch (e) {
      console.error('Error initializing from localStorage:', e);
    }
  }, []);

  // Add periodic cleanup effect (runs every hour)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setFavorites(prev => {
        const cleaned = cleanupOldFavorites(prev);
        if (cleaned.length !== prev.length) {
          localStorage.setItem('favorites', JSON.stringify(cleaned));
        }
        return cleaned;
      });
    }, 60 * 60 * 1000); // Run every hour

    return () => clearInterval(cleanupInterval);
  }, []);

  // Helper function to check if a post is favorited
  const isFavorited = (postTitle: string): boolean => {
    return favorites.some(fav => fav.title === postTitle && !fav.unlovedAt);
  };

  // 3. Modify the favorites counter display to handle SSR
  const getPostsCount = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    if (showSaved) {
      return favorites.filter(fav => !fav.unlovedAt).length;
    }
    return posts.filter(post => post.category === currentCategory).length;
  }, [showSaved, favorites, posts, currentCategory]);

  // 4. Update the favorites button display
  const renderFavoritesButton = () => (
    <button
      onClick={() => setShowSaved(!showSaved)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
        showSaved 
          ? 'bg-pink-50 text-pink-600 border border-pink-200' 
          : 'bg-white hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <FiHeart className={`w-5 h-5 ${showSaved ? 'text-pink-500' : 'text-gray-400'}`} />
      <span className="text-sm font-['Plus_Jakarta_Sans']">
        {typeof window !== 'undefined' ? favorites.filter(fav => !fav.unlovedAt).length : 0}
      </span>
    </button>
  );

  // 5. Update the calendar events button display
  const renderCalendarButton = () => (
    <button
      onClick={() => {
        setShowCalendarManagement(true);
        setIsOverlayVisible(true);
      }}
      className="flex items-center space-x-2 px-4 py-2 rounded-md bg-white hover:bg-gray-50 border border-gray-200"
    >
      <FiCalendar className="w-5 h-5 text-gray-400" />
      <span className="text-sm font-['Plus_Jakarta_Sans']">
        {typeof window !== 'undefined' ? calendarEvents.length : 0}
      </span>
    </button>
  );

  const categories = ['jobs', 'ai-jobs', 'mentors'];
  const listRef = useRef<HTMLDivElement>(null);
  const [showCalendarPanel, setShowCalendarPanel] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Post | null>(null);
  const [showCalendarManagement, setShowCalendarManagement] = useState(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'days-left'>('default');
  const [filterDays, setFilterDays] = useState<number | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [recommendations, setRecommendations] = useState<Post[]>([]);

  // Add new state for mobile view control
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // AI Jobs chatbot states
  type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
    jobCards?: any[];
  };
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // AI Jobs saved jobs states
  const [savedAIJobs, setSavedAIJobs] = useState<any[]>([]);
  const [selectedSavedJob, setSelectedSavedJob] = useState<any | null>(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Modify the initial data fetching useEffect
  useEffect(() => {
    const fetchInitialPosts = async () => {
      setIsLoading(true);
      try {
        console.log('Starting initial fetch...');
        const [response, remotiveJobs, jobicyJobs, arbeitnowJobs, remoteOKJobs, web3Jobs] = await Promise.all([
          fetch('/api/posts'),
          fetchRemotiveJobs(),
          fetchJobicyJobs(),
          fetchArbeitnowJobs(),
          fetchRemoteOKJobs(),
          fetchWeb3Jobs()
        ]);

        const data = await response.json();
        
        if (data.data) {
          const { mentors } = data.data;
          
          // Transform mentor data properly
          const transformedMentors = Array.isArray(mentors) ? mentors.map(mentor => ({
            _id: mentor._id,
            title: mentor.title,
            category: 'mentors',
            image: mentor.image,
            linkedin: mentor.linkedin,
            instagram: mentor.instagram,
            experience: Array.isArray(mentor.experience) 
              ? mentor.experience.map((exp: string | Experience) => ({
                  role: typeof exp === 'string' ? exp : exp.role || 'Experience',
                  company: '',
                  duration: ''
                }))
              : [{ role: mentor.experience, company: '', duration: '' }],
            education: Array.isArray(mentor.education)
              ? mentor.education.map((edu: string | Education) => ({
                  degree: typeof edu === 'string' ? edu : edu.degree || 'Education',
                  school: '',
                  year: ''
                }))
              : [{ degree: mentor.education, school: '', year: '' }],
            body: mentor.company || mentor.labels?.Organization,
            labels: {
              Field: mentor.labels?.Field || 'Not specified',
              Organization: mentor.labels?.Organization || mentor.company || '',
              'Mentoring Topics': Array.isArray(mentor.labels?.['Mentoring Topic']) 
                ? mentor.labels['Mentoring Topic'].join(', ')
                : mentor.labels?.['Mentoring Topic'] || ''
            },
            link: mentor.link,
            source: 'learnitab',
            created_at: new Date().getTime(),
            expired: false,
            daysLeft: 30
          })) : [];
          
          const transformedPosts = [
            ...transformedMentors,
            ...remotiveJobs,
            ...jobicyJobs,
            ...arbeitnowJobs,
            ...remoteOKJobs,
            ...web3Jobs
          ].sort((a, b) => b.created_at - a.created_at);
          
          setPosts(transformedPosts);
          setPage(1);
          setHasMore(true);
        }
      } catch (error) {
        console.error('Error in fetchInitialPosts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPosts();
  }, []);

  // Add a loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  // Modify the renderPosts function to include the loading spinner
  const renderPosts = (posts: Post[]) => {
    return (
      <>
        {isLoading && posts.length === 0 ? (
          // Initial loading state
          Array(5).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))
        ) : (
          <>
            {posts.map((post) => (
              <div
                key={post._id}
                id={`post-${post._id}`}
                onClick={() => handlePostSelection(post)}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-gray-100"
              >
                <div className="flex items-start gap-4 max-w-full">
                  <Image
                    src={post.image || DEFAULT_COMPANY_LOGO}
                    alt={post.title}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover flex-shrink-0"
                    onError={(e: any) => {
                      e.target.src = DEFAULT_COMPANY_LOGO;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                    {post.category === 'mentors' ? (
                      <div className="flex items-center gap-2 mt-1">
                        {post.linkedin && (
                          <a href={post.linkedin} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:text-blue-800">
                            <FiLinkedin />
                          </a>
                        )}
                        {post.instagram && (
                          <a href={post.instagram} target="_blank" rel="noopener noreferrer"
                             className="text-pink-600 hover:text-pink-800">
                            <FiInstagram />
                          </a>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 truncate">
                          {post.labels['Company']}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Posted {format(new Date(post.created_at || Date.now()), 'MMM dd, yyyy')}
                        </p>
                      </>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full">
                        {post.source}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(post.title);
                    }}
                    className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                      isFavorited(post.title)
                        ? 'text-pink-500 bg-pink-50'
                        : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'
                    }`}
                  >
                    <FiHeart className={isFavorited(post.title) ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
            ))}
            {/* Show loading spinner when loading more posts */}
            {isLoading && <LoadingSpinner />}
            {/* Add invisible div for intersection observer */}
            <div ref={ref} className="h-4 w-full" />
          </>
        )}
      </>
    );
  };

  // Update the infinite scroll effect
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      const currentPosts = getFilteredPosts();
      const totalPosts = posts.filter(post => post.category === currentCategory).length;
      
      if (currentPosts.length < totalPosts) {
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    }
  }, [inView, hasMore, isLoading]);

  // Add a cleanup effect to reset category when unmounting
  useEffect(() => {
    return () => {
      setCurrentCategory('');
      setSelectedPostTitle(null);
    };
  }, []);

  // Effect for welcome screen
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  function copyPostLink(post: Post): void {
    // Get the current pathname and combine it with the post parameter
    const currentPath = window.location.pathname;
    const url = `${window.location.origin}${currentPath}?post=${post._id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(post._id);
    setTimeout(() => setCopiedLink(null), 2000);
  }

  function addToCalendar(event: CalendarEvent): void {
    setCalendarEvents(prev => {
      const newEvents = [...prev, event];
      localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
      return newEvents;
    });
    setShowCalendarPanel(false);
    setIsOverlayVisible(false);
  }

  function removeFromCalendar(id: string): void {
    setCalendarEvents(prev => {
      const newEvents = prev.filter(event => event.id !== id);
      localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
      return newEvents;
    });
  }

  const toggleCalendarPanel = (post: Post) => {
    setSelectedEvent(post);
    setShowCalendarPanel(true);
    setIsOverlayVisible(true);
  };

  const toggleFavorite = (postTitle: string) => {
    setFavorites(prevFavorites => {
      const existingIndex = prevFavorites.findIndex(fav => fav.title === postTitle);
      let newFavorites: FavoriteItem[];
      
      if (existingIndex !== -1) {
        const existing = prevFavorites[existingIndex];
        if (existing.unlovedAt) {
          // Re-love it (remove unlovedAt)
          newFavorites = [...prevFavorites];
          newFavorites[existingIndex] = { title: postTitle, lovedAt: Date.now() };
        } else {
          // Unlove it (set unlovedAt)
          newFavorites = [...prevFavorites];
          newFavorites[existingIndex] = { ...existing, unlovedAt: Date.now() };
        }
      } else {
        // Add as new favorite
        newFavorites = [...prevFavorites, { title: postTitle, lovedAt: Date.now() }];
      }
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // 6. Add copy feedback component
  const renderCopyFeedback = () => {
    if (copiedLink) {
      return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50">
          Link copied!
        </div>
      );
    }
    return null;
  };

  type ReactElementWithProps = ReactElement<{
    key: Key;
    children?: ReactNode;
  }, string | JSXElementConstructor<any>>;

  const opportunityText = "Don&apos;t miss this opportunity";

  // Add filter states
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: Infinity });
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);

  // Add mentor-specific filter options
  const filterOptions = {
    jobs: {
      sources: ['all', 'remotive', 'jobicy', 'arbeitnow', 'remoteok', 'web3'],
      types: ['all', 'full-time', 'part-time', 'contract', 'internship', 'remote'],
      locations: ['all', 'usa', 'europe', 'asia', 'remote']
    },
    mentors: {
      sources: ['all', 'learnitab'],
      types: ['all', 'Business', 'Technology', 'Design', 'Engineering', 'Product'],
      locations: ['all', 'Indonesia', 'Remote']
    }
  };

  // Function to save/unsave AI job
  const toggleSaveAIJob = (job: any) => {
    setSavedAIJobs(prev => {
      const isAlreadySaved = prev.some(savedJob => savedJob.id === job.id || savedJob.url === job.url);
      let newSaved;
      
      if (isAlreadySaved) {
        newSaved = prev.filter(savedJob => savedJob.id !== job.id && savedJob.url !== job.url);
      } else {
        newSaved = [...prev, { ...job, savedAt: Date.now() }];
      }
      
      localStorage.setItem('ai-jobs-saved', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  // Check if job is saved
  const isAIJobSaved = (job: any) => {
    return savedAIJobs.some(savedJob => savedJob.id === job.id || savedJob.url === job.url);
  };

  // AI Chatbot handler
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    // Add user message to chat
    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user' as const, content: userMessage }];
    setChatMessages(newMessages);
    setIsChatLoading(true);

    try {
      // IMPORTANT: Limit conversation history to prevent request payload from being too large
      // Only send the last 6 messages (3 user + 3 assistant exchanges) to keep request size manageable
      const recentHistory = chatMessages
        .slice(-6)  // Only keep last 6 messages
        .map(msg => ({ 
          role: msg.role, 
          content: msg.content.substring(0, 2000)  // Truncate very long messages to 2000 chars
        }));
      
      // Don't send all jobs in the request body to avoid payload size issues
      // The backend will fetch jobs from APIs if needed
      const response = await fetch('/api/ai-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: recentHistory,
          // allJobs removed to prevent payload size errors - backend will fetch jobs
        }),
      });

      // Check if response is JSON before parsing
      let data;
      const contentType = response.headers.get('content-type');
      
      // Handle specific HTTP status codes first
      if (response.status === 413) {
        data = {
          error: 'Request payload too large',
          errorType: 'payload_too_large',
          message: 'The request was too large. Please try a shorter message or refresh the page to reset the conversation.'
        };
      } else if (response.status === 502 || response.status === 503 || response.status === 504) {
        data = {
          error: 'Server temporarily unavailable',
          errorType: 'server_unavailable',
          message: 'The server is temporarily unavailable or overloaded. Please try again in a few moments.'
        };
      } else if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError: any) {
          console.error('Failed to parse JSON response:', jsonError);
          data = {
            error: 'Invalid JSON response',
            errorType: 'invalid_response',
            message: 'The server returned an invalid response. Please try again.'
          };
        }
      } else {
        // Response is not JSON, try to get the text content
        const textResponse = await response.text();
        console.error('Non-JSON response received. Status:', response.status, 'Body:', textResponse);
        
        // Create a proper error object based on status code and content
        let errorMessage = 'The server returned an unexpected response. Please try again.';
        let errorType = 'invalid_response';
        
        if (textResponse.toLowerCase().includes('too large') || textResponse.toLowerCase().includes('payload')) {
          errorMessage = 'The request was too large. Please try a shorter message or refresh the page.';
          errorType = 'payload_too_large';
        } else if (textResponse.toLowerCase().includes('timeout')) {
          errorMessage = 'The request timed out. Please try again with a simpler query.';
          errorType = 'timeout';
        } else if (response.status >= 500) {
          errorMessage = 'The server encountered an error. Please try again later.';
          errorType = 'server_error';
        }
        
        data = {
          error: textResponse || 'Server returned a non-JSON response',
          errorType: errorType,
          message: errorMessage
        };
      }

      if (response.ok && data && !data.error) {
        // Parse job cards from the message
        let messageContent = data.message || '';
        const jobCards = data.jobCards || [];
        
        // Remove [JOB_CARD] tags from message content for cleaner display
        messageContent = messageContent.replace(/\[JOB_CARD\][\s\S]*?\[\/JOB_CARD\]/g, '').trim();
        
        setChatMessages([...newMessages, { 
          role: 'assistant' as const, 
          content: messageContent,
          jobCards: jobCards
        }]);
      } else {
        // Handle specific error types from the API
        let errorMessage = 'Sorry, I encountered an error. Please try again.';
        
        if (data.errorType) {
          switch (data.errorType) {
            case 'missing_api_key':
            case 'invalid_api_key':
              errorMessage = '🔑 **AI Service Configuration Error**\n\n' + 
                (data.message || 'The AI assistant is not configured properly. Please make sure the OpenAI API key is set correctly in your environment variables.');
              break;
            case 'rate_limit':
              errorMessage = '⏱️ **Rate Limit Reached**\n\n' + 
                (data.message || 'Too many requests. Please wait a moment before trying again.');
              break;
            case 'no_jobs':
              errorMessage = '📋 **No Jobs Available**\n\n' + 
                (data.message || 'Unable to fetch job listings from our sources. The job APIs might be temporarily unavailable. Please try again in a few minutes.');
              break;
            case 'network_error':
              errorMessage = '🌐 **Network Connection Error**\n\n' + 
                (data.message || 'Unable to connect to the required services. Please check your internet connection and try again.');
              break;
            case 'openai_error':
              errorMessage = '🤖 **AI Service Error**\n\n' + 
                (data.message || 'The AI assistant encountered an error while processing your request. Please try again.');
              break;
            case 'payload_too_large':
              errorMessage = '📦 **Request Too Large**\n\n' + 
                (data.message || 'The request was too large. This might be due to too many jobs being sent to the AI. Please try refreshing the page and try again.');
              break;
            case 'timeout':
              errorMessage = '⏱️ **Request Timed Out**\n\n' + 
                (data.message || 'The request took too long to process. Please try again with a simpler query.');
              break;
            case 'server_unavailable':
            case 'server_error':
              errorMessage = '🔧 **Server Error**\n\n' + 
                (data.message || 'The server encountered an error or is temporarily unavailable. Please try again in a few moments.');
              break;
            case 'invalid_response':
              errorMessage = '⚠️ **Server Response Error**\n\n' + 
                (data.message || 'The server returned an unexpected response. Please try again.');
              break;
            default:
              errorMessage = '❌ **Error**\n\n' + (data.message || data.error || errorMessage);
          }
        } else if (data.error) {
          errorMessage = `❌ **Error**\n\n${data.error}`;
        }
        
        setChatMessages([...newMessages, { 
          role: 'assistant' as const, 
          content: errorMessage 
        }]);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Determine the type of network error
      let errorMessage = '🌐 **Connection Error**\n\n';
      
      if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        errorMessage += 'Unable to connect to the server. This could be due to:\n\n' +
          '• **Network connectivity issues** - Check your internet connection\n' +
          '• **Server unavailability** - The server might be temporarily down\n' +
          '• **CORS or firewall issues** - Network restrictions might be blocking the request\n\n' +
          'Please try again in a few moments.';
      } else if (error.name === 'AbortError') {
        errorMessage += 'The request timed out. The server took too long to respond.\n\n' +
          'Please try again with a simpler query.';
      } else {
        errorMessage += `An unexpected error occurred: ${error.message || 'Unknown error'}\n\n` +
          'Please try again or contact support if the issue persists.';
      }
      
      setChatMessages([...newMessages, { 
        role: 'assistant' as const, 
        content: errorMessage
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Load chat history from localStorage
  useEffect(() => {
    if (currentCategory === 'ai-jobs') {
      try {
        const savedChat = localStorage.getItem('ai-jobs-chat-history');
        if (savedChat) {
          const parsed = JSON.parse(savedChat);
          setChatMessages(parsed);
        } else if (chatMessages.length === 0) {
          // Initialize with welcome message
          setChatMessages([{
            role: 'assistant',
            content: '👋 Hi! I\'m your AI job search assistant. I can help you find the perfect remote job from thousands of listings across Remotive, Jobicy, Arbeitnow, RemoteOK, and Web3.career.\n\nTell me about your skills, experience, and what kind of role you\'re looking for, and I\'ll recommend the best matches for you!\n\nFor example, you could say:\n• "I\'m looking for senior React developer positions"\n• "Show me entry-level data science jobs"\n• "I need remote marketing roles with good salary"'
          }]);
        }
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
  }, [currentCategory]);
  
  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (currentCategory === 'ai-jobs' && chatMessages.length > 0) {
      try {
        localStorage.setItem('ai-jobs-chat-history', JSON.stringify(chatMessages));
      } catch (e) {
        console.error('Error saving chat history:', e);
      }
    }
  }, [chatMessages, currentCategory]);
  
  // Function to clear chat history
  const clearChatHistory = () => {
    setChatMessages([{
      role: 'assistant',
      content: '👋 Hi! I\'m your AI job search assistant. I can help you find the perfect remote job from thousands of listings across Remotive, Jobicy, Arbeitnow, RemoteOK, and Web3.career.\n\nTell me about your skills, experience, and what kind of role you\'re looking for, and I\'ll recommend the best matches for you!\n\nFor example, you could say:\n• "I\'m looking for senior React developer positions"\n• "Show me entry-level data science jobs"\n• "I need remote marketing roles with good salary"'
    }]);
    localStorage.removeItem('ai-jobs-chat-history');
  };

  // Render Saved Jobs Detail View
  const renderSavedJobDetail = (job: any) => {
    return (
      <div className="p-6 space-y-4 h-full overflow-y-auto custom-scrollbar">
        <button
          onClick={() => setSelectedSavedJob(null)}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Saved Jobs
        </button>
        
        <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
          {/* Job Header */}
          <div className="flex items-start gap-4 border-b pb-4">
            {job.logo && (
              <img
                src={job.logo || job.company_logo}
                alt={job.company}
                className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 shadow-sm flex-shrink-0"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <p className="text-lg text-gray-600 mt-1">{job.company}</p>
              <p className="text-sm text-gray-500 mt-1">📍 {job.location}</p>
            </div>
          </div>

          {/* Job Details */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium">
              {job.type}
            </span>
            <span className="text-xs px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium">
              {job.source}
            </span>
            {job.salary && job.salary !== 'Not specified' && (
              <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-medium">
                💰 {job.salary}
              </span>
            )}
          </div>

          {/* Job Description */}
          {job.description && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
              <div 
                className="text-gray-700 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button 
              onClick={() => toggleSaveAIJob(job)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold flex items-center gap-2"
            >
              <FiTrash2 size={14} /> Remove from Saved
            </button>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-semibold text-center flex items-center justify-center gap-2"
            >
              Apply Now <FiLink size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Render AI Jobs Chatbot Interface
  const renderAIJobsChatbot = () => {
    // Count total job cards in all messages
    const totalJobsRecommended = chatMessages.reduce((sum, msg) => sum + (msg.jobCards?.length || 0), 0);
    
    return (
    <div className="flex h-full gap-4">
      {/* Left Sidebar - Saved Jobs */}
      <div className="w-80 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 rounded-t-xl text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FiHeart className="fill-current" />
            Saved Jobs ({savedAIJobs.length})
          </h3>
          <p className="text-xs text-blue-100 mt-1">Click to view details</p>
        </div>
        
        {selectedSavedJob ? (
          renderSavedJobDetail(selectedSavedJob)
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {savedAIJobs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiHeart size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No saved jobs yet</p>
                <p className="text-xs mt-1">Save jobs from AI recommendations</p>
              </div>
            ) : (
              savedAIJobs.map((job, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedSavedJob(job)}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer p-3"
                >
                  <div className="flex items-start gap-3">
                    {job.logo && (
                      <img
                        src={job.logo || job.company_logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {job.title}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">{job.company}</p>
                      <p className="text-xs text-gray-500 mt-1">{job.location}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Side - Chat Interface */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-2xl border border-blue-200">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 rounded-t-xl text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-inner">
              <FiCpu size={26} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold tracking-tight">Learnitab AI Jobs Assistant</h2>
              <p className="text-sm text-blue-100 mt-0.5 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Powered by OpenAI • {totalJobsRecommended} jobs recommended
              </p>
            </div>
          </div>
          <button
            onClick={clearChatHistory}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all flex items-center gap-2 text-sm"
            title="Clear chat history"
          >
            <FiTrash2 size={18} />
            <span className="hidden md:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`${msg.role === 'user' ? 'max-w-[85%]' : 'max-w-[95%]'} ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-sm border-2 border-blue-400 p-4 shadow-lg'
                  : ''
              }`}
            >
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* AI Message Content */}
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm border-2 border-gray-200 hover:border-blue-200 transition-colors p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-lg">
                        <FiCpu size={14} className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">AI Assistant</span>
                    </div>
                    <div className="markdown-content text-sm leading-relaxed prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Custom styling untuk markdown elements
                          strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                          em: ({node, ...props}) => <em className="italic text-gray-800" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 my-2" {...props} />,
                          li: ({node, ...props}) => <li className="text-gray-700 ml-2" {...props} />,
                          p: ({node, ...props}) => <p className="my-2 text-gray-800" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold text-gray-900 mt-3 mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base font-bold text-gray-900 mt-2 mb-1" {...props} />,
                          code: ({node, inline, ...props}: any) => 
                            inline ? (
                              <code className="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-xs font-mono" {...props} />
                            ) : (
                              <code className="block p-2 bg-gray-100 text-blue-600 rounded text-xs font-mono overflow-x-auto my-2" {...props} />
                            ),
                          a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline font-medium" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-2" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  
                  {/* Job Cards - Integrated inline with message */}
                  {msg.jobCards && msg.jobCards.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {msg.jobCards.map((job, jobIdx) => (
                        <div
                          key={jobIdx}
                          className="bg-gradient-to-br from-white to-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 p-4"
                        >
                          <div className="flex items-start gap-4">
                            {job.logo && (
                              <img
                                src={job.logo || job.company_logo}
                                alt={job.company}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 shadow-sm flex-shrink-0"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base text-gray-900 mb-1">
                                {job.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2 flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">{job.company}</span>
                                <span className="text-gray-400">•</span>
                                <span>{job.location}</span>
                              </p>
                              
                              {/* Job Details Tags */}
                              <div className="flex gap-2 flex-wrap mb-3">
                                <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium">
                                  {job.type}
                                </span>
                                <span className="text-xs px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium">
                                  {job.source}
                                </span>
                                {job.salary && job.salary !== 'Not specified' && (
                                  <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-medium">
                                    💰 {job.salary}
                                  </span>
                                )}
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button 
                                  className={`px-4 py-2 rounded-lg transition-all text-xs font-semibold shadow-md hover:shadow-lg flex items-center gap-2 ${
                                    isAIJobSaved(job)
                                      ? 'bg-pink-500 text-white hover:bg-pink-600'
                                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-pink-500 hover:text-pink-500'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSaveAIJob(job);
                                  }}
                                >
                                  <FiHeart size={14} className={isAIJobSaved(job) ? 'fill-current' : ''} />
                                  {isAIJobSaved(job) ? 'Saved' : 'Save Job'}
                                </button>
                                <button 
                                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-xs font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(job.url, '_blank');
                                  }}
                                >
                                  Apply Now <FiLink size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isChatLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white p-5 rounded-2xl rounded-bl-sm shadow-lg border-2 border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-t-2 border-blue-100 p-5 rounded-b-xl">
        <div className="flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me about jobs... (e.g., 'Show me React developer positions')"
            className="flex-1 px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm hover:border-blue-400 transition-all"
            disabled={isChatLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isChatLoading || !chatInput.trim()}
            className="px-7 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105"
          >
            <FiSend size={18} />
            Send
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-3 text-center flex items-center justify-center gap-2">
          <span className="text-base">💡</span>
          <span className="font-medium">Tip: Be specific about your skills and preferences for better recommendations</span>
        </p>
      </div>
      </div>
    </div>
    );
  };

  // Update renderSearchBar function
  const renderSearchBar = () => (
    <div className="flex flex-col space-y-4 bg-white p-4 rounded-lg">
      {/* Top row: Search input and action buttons */}
      <div className="flex items-center gap-4">
        {/* Search input */}
        <div className="flex-grow relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Favorites and Calendar counts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              showSaved 
                ? 'bg-pink-50 text-pink-600 border border-pink-200' 
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FiHeart className={showSaved ? 'text-pink-500' : 'text-gray-400'} />
            <span className="font-medium">{favorites.length}</span>
          </button>
          <button
            onClick={() => {
              setShowCalendarManagement(true);
              setIsOverlayVisible(true);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200"
          >
            <FiCalendar className="text-gray-400" />
            <span className="font-medium">{calendarEvents.length}</span>
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-1">
        <select 
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="flex-1 py-1.5 px-2 text-sm rounded-lg border border-gray-200 bg-white hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Sources</option>
          {filterOptions[currentCategory as keyof typeof filterOptions].sources.map(source => (
            source !== 'all' && <option key={source} value={source}>{source.charAt(0).toUpperCase() + source.slice(1)}</option>
          ))}
        </select>

        <select
          value={selectedJobType}
          onChange={(e) => setSelectedJobType(e.target.value)}
          className="flex-1 py-1.5 px-2 text-sm rounded-lg border border-gray-200 bg-white hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          {filterOptions[currentCategory as keyof typeof filterOptions].types.map(type => (
            type !== 'all' && <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="flex-1 py-1.5 px-2 text-sm rounded-lg border border-gray-200 bg-white hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Locations</option>
          {filterOptions[currentCategory as keyof typeof filterOptions].locations.map(location => (
            location !== 'all' && <option key={location} value={location}>{location}</option>
          ))}
        </select>

        {currentCategory === 'jobs' && (
          <button
            onClick={() => setIsRemoteOnly(!isRemoteOnly)}
            className={`flex items-center px-2 py-1.5 rounded-lg transition-colors text-sm ${
              isRemoteOnly 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>🌍</span>
          </button>
        )}
      </div>
    </div>
  );

  // Update the getFilteredPosts function to include pagination
  const getFilteredPosts = () => {
    let filteredPosts = posts.filter(post => {
      // First check category
      if (post.category !== currentCategory) return false;
      
      // Only apply job-specific filters if we're in the jobs category
      if (currentCategory === 'jobs') {
        // Source filter
        if (selectedSource !== 'all' && post.source !== selectedSource) return false;
        
        // Job type filter
        if (selectedJobType !== 'all') {
          const workType = post.workType;
          if (!workType) return false;
          const workTypeStr = Array.isArray(workType) ? workType.join(' ') : workType;
          if (!workTypeStr.toLowerCase().includes(selectedJobType.toLowerCase())) return false;
        }
        
        // Location filter
        if (selectedLocation !== 'all') {
          const location = post.location;
          if (!location) return false;
          if (!location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
        }
        
        // Remote filter
        if (isRemoteOnly && !post.remote) return false;
      }
      
      return true;
    });

    // Search term filter (applies to all categories)
    if (searchTerm) {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredPosts.slice(0, page * 15);
  };

  const getSortedPosts = (filteredPosts: Post[]) => {
    const activePosts = filteredPosts.filter(post => !post.expired);
    const expiredPosts = filteredPosts.filter(post => post.expired);

    if (sortOrder === 'days-left') {
      activePosts.sort((a, b) => (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity));
      expiredPosts.sort((a, b) => (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity));
    }

    return [...activePosts, ...expiredPosts];
  };

  const displayFullPost = (post: Post) => {
    if (post.category === 'mentors') {
      return (
        <div className="space-y-6">
          {/* Header with image, title, and company info */}
          <div className="flex items-start gap-6 border-b pb-6">
            <Image
              src={post.image || DEFAULT_COMPANY_LOGO}
              alt={post.title}
              width={120}
              height={120}
              className="rounded-lg object-cover"
              onError={(e: any) => { e.target.src = DEFAULT_COMPANY_LOGO }}
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
              <p className="text-gray-600 mt-2">{post.body}</p>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-4">
                {post.linkedin && (
                  <a href={post.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <FiLinkedin size={20} /> LinkedIn
                  </a>
                )}
                {post.instagram && post.instagram !== '-' && (
                  <a href={post.instagram} target="_blank" rel="noopener noreferrer"
                     className="text-pink-600 hover:text-pink-800 flex items-center gap-2">
                    <FiInstagram size={20} /> Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 border-b pb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleFavorite(post.title)}
                className={`p-2.5 rounded-lg ${
                  isFavorited(post.title)
                    ? 'bg-pink-50 text-pink-500 border border-pink-200'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-400'
                }`}
              >
                <FiHeart size={20} className={isFavorited(post.title) ? 'fill-current' : ''} />
              </button>
              
              <button
                onClick={() => copyPostLink(post)}
                className="p-2.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-gray-400"
              >
                <FiLink size={20} />
              </button>
            </div>

            <a
              href="https://forms.gle/TTzj45XHARhDuGKU9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              Schedule Mentoring
            </a>
          </div>

          {/* Labels Section - Now under Action Buttons */}
          <div className="mt-6 space-y-4 bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Field:</span>
              <span className="text-sm text-gray-900">{post.labels?.Field || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Organization:</span>
              <span className="text-sm text-gray-900">{post.labels?.Organization || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Mentoring Topics:</span>
              <span className="text-sm text-gray-900">{post.labels?.['Mentoring Topics'] || 'Not specified'}</span>
            </div>
          </div>

          {/* Experience Section */}
          {post.experience && post.experience.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiBriefcase /> Experience
              </h2>
              <div className="space-y-4">
                {post.experience.map((exp: Experience | string, index: number) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-4">
                    <h3 className="font-medium text-gray-900">
                      {typeof exp === 'string' ? exp : exp.role}
                    </h3>
                    {typeof exp !== 'string' && (
                      <>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {post.education && post.education.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiBookOpen /> Education
              </h2>
              <div className="space-y-4">
                {(Array.isArray(post.education) ? post.education : []).map((edu: any, index) => (
                  <div key={index} className="border-l-2 border-indigo-500 pl-4">
                    <h3 className="font-medium text-gray-900">{typeof edu === 'string' ? edu : edu.degree}</h3>
                    <p className="text-gray-600">{typeof edu === 'string' ? '' : edu.school}</p>
                    <p className="text-sm text-gray-500">{typeof edu === 'string' ? '' : edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Return existing job post display for non-mentor posts
    return (
      <div className="post-full space-y-4 font-['Plus_Jakarta_Sans']">
        {/* Compact Header Section */}
        <div className="flex items-start gap-4 pb-4 border-b">
          <Image
            src={post.image || DEFAULT_COMPANY_LOGO}
            alt={post.title}
            width={64}
            height={64}
            className="rounded-lg object-cover flex-shrink-0"
            onError={(e: any) => {
              e.target.src = DEFAULT_COMPANY_LOGO;
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{post.title}</h1>
            <p className="text-base text-gray-600 font-medium">{post.labels['Company']}</p>
            
            {/* Compact Info Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                📅 {format(new Date(post.created_at || Date.now()), 'MMM dd, yyyy')}
              </span>
              {post.workLocation && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                  📍 {post.workLocation}
                </span>
              )}
              {post.workType && (
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                  💼 {post.workType}
                </span>
              )}
              {post.stipend && (
                <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs">
                  💰 {post.stipend}
                </span>
              )}
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                🔗 {post.source}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Action Buttons */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(post.title)}
              className={`p-2 rounded-lg transition-all ${
                isFavorited(post.title)
                  ? 'bg-pink-50 text-pink-500 border border-pink-200'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-400'
              }`}
              title={isFavorited(post.title) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiHeart size={18} className={isFavorited(post.title) ? 'fill-current' : ''} />
            </button>
            
            <button
              onClick={() => copyPostLink(post)}
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-400"
              title="Copy link"
            >
              <FiLink size={18} />
            </button>
          </div>

          {post.link && (
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center gap-2 text-sm shadow-md hover:shadow-lg"
            >
              Apply Now <FiLink size={14} />
            </a>
          )}
        </div>

        {/* Compact Job Description */}
        <div className="prose prose-sm max-w-none">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiBriefcase className="text-blue-600" /> Job Description
          </h2>
          <div 
            className="text-gray-700 text-sm leading-relaxed space-y-2 job-description-content"
            dangerouslySetInnerHTML={{ __html: post.body?.toString() || '' }}
          />
        </div>

        {/* Compact Additional Information */}
        {(post.location || post.salary || post.tags) && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mt-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiAward className="text-indigo-600" /> Additional Details
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {post.location && (
                <div className="bg-white rounded p-2">
                  <span className="font-medium text-gray-500">Location</span>
                  <p className="text-gray-900 mt-0.5">{post.location}</p>
                </div>
              )}
              {post.salary && (
                <div className="bg-white rounded p-2">
                  <span className="font-medium text-gray-500">Salary</span>
                  <p className="text-gray-900 mt-0.5">{post.salary}</p>
                </div>
              )}
              {post.remote !== undefined && (
                <div className="bg-white rounded p-2">
                  <span className="font-medium text-gray-500">Work Mode</span>
                  <p className="text-gray-900 mt-0.5">{post.remote ? '🌍 Remote' : '🏢 On-site'}</p>
                </div>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white rounded p-2 col-span-2">
                  <span className="font-medium text-gray-500">Tags</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {post.tags.slice(0, 8).map((tag: string, idx: number) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compact Source Attribution */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t">
          Sourced from <span className="font-medium text-gray-700">{(post.source || 'unknown').charAt(0).toUpperCase() + (post.source || 'unknown').slice(1)}</span>
        </div>
      </div>
    );
  };

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'mentors':
        return 'bg-orange-100 text-orange-800';
      case 'jobs':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'jobs':
        return <FiBriefcase className="mr-2" />;
      case 'mentors':
        return <FiUsers className="mr-2" />;
      default:
        return null;
    }
  };

  const selectCategory = (category: string) => {
    setCurrentCategory(category);
    // Reset all filters when changing categories
    setSelectedSource('all');
    setSelectedJobType('all');
    setSelectedLocation('all');
    setIsRemoteOnly(false);
    setPage(1);
    setHasMore(true);
    setSelectedPostTitle(null);
  };

  const toggleShowSaved = () => {
    setShowSaved(prev => !prev);
    setVisiblePosts([]);
    setHasMore(true);
  };

  const renderWelcomeScreen = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
        <Image
          src="https://od.lk/s/OTZfOTUyNTU0MTlf/Grand_Design_Learnitab_Page_1-min.png"
          alt="Welcome to Learnitab"
          width={600}
          height={400}
          className="rounded-lg shadow-lg mb-4"
        />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-1 mt-2">
          Welcome to Learnitab
        </h2>
        
        <p className="text-gray-600 mb-4 max-w-lg mt-1">
          Your gateway to discovering amazing opportunities in internships, competitions, scholarships, and mentorship. Select an opportunity from the left to get started~!
        </p>

        <div className="flex items-center gap-6">
          <a
            href="https://discord.gg/rXRza3Wn"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 text-indigo-600 hover:text-indigo-700 transition-all"
          >
            <FiDisc size={24} />
          </a>
          <a
            href="https://instagram.com/learnitab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 text-pink-600 hover:text-pink-700 transition-all"
          >
            <FiInstagram size={24} />
          </a>
          <a
            href="https://www.linkedin.com/company/learnitab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 text-blue-600 hover:text-blue-700 transition-all"
          >
            <FiLinkedin size={24} />
          </a>
          <a
            href="https://www.producthunt.com/products/learnitab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 text-orange-600 hover:text-orange-700 transition-all"
          >
            <SiProducthunt size={24} />
          </a>
        </div>
      </div>
    );
  };

  // Add this function to handle post selection and scroll reset
  const handlePostSelection = (post: Post) => {
    setSelectedPostTitle(post.title);
    
    // Reset scroll position of the detail view
    const detailView = document.querySelector('.detail-view-container');
    if (detailView) {
      detailView.scrollTop = 0;
    }
    
    // For mobile view
    if (window.innerWidth < 768) {
      setShowMobileDetail(true);
    }
  };

  // Update the main fetch function
  const fetchPosts = async () => {
    try {
      const [remotiveJobs, jobicyJobs, arbeitnowJobs, remoteOKJobs, web3Jobs] = await Promise.all([
        fetchRemotiveJobs(),
        fetchJobicyJobs(),
        fetchArbeitnowJobs(),
        fetchRemoteOKJobs(),
        fetchWeb3Jobs()
      ]);
      
      return [...remotiveJobs, ...jobicyJobs, ...arbeitnowJobs, ...remoteOKJobs, ...web3Jobs];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  };

  return (
    <CustomErrorBoundary>
      <div className="h-screen overflow-hidden w-full flex flex-col relative">
        {/* Add background image container */}
        <div 
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: 'scale(1.1)',
            filter: 'blur(0px) brightness(1)'
          }}
        />
        
        {/* Header */}
        <header className="relative bg-transparent sticky top-0 z-50">
          <div className="relative z-20 w-full px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative cursor-pointer" onClick={() => window.open('https://learnitab.com', '_blank')}>
                  <Image
                    src="/images/Logo Learnitab.png"
                    alt="Learnitab Logo"
                    width={40}
                    height={40}
                    className="relative z-10 mr-4"
                  />
                </div>
                <h1 
                  className="text-2xl font-bold text-transparent bg-clip-text animate-gradient"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #ffffff, #4F46E5, #2563EB, #ffffff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Learnitab
                </h1>
              </div>
              <nav className="hidden md:flex space-x-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      currentCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105 border-2 border-blue-400'
                        : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border-2 border-gray-200 hover:border-gray-300 shadow-md'
                    }`}
                    onClick={() => setCurrentCategory(category)}
                  >
                    {category === 'ai-jobs' && <FiCpu size={18} className="animate-pulse" />}
                    {category === 'jobs' && <FiBriefcase size={18} />}
                    {category === 'mentors' && <FiUsers size={18} />}
                    <span>
                      {category === 'ai-jobs' 
                        ? 'Learnitab AI Jobs' 
                        : category.charAt(0).toUpperCase() + category.slice(1)
                      }
                    </span>
                  </button>
                ))}
              </nav>
              <button 
                className="md:hidden text-blue-900"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <IoMdClose size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
            
            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 border-t border-gray-200">
                <nav className="flex flex-col p-4 space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        currentCategory === category
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                      onClick={() => {
                        setCurrentCategory(category);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {category === 'ai-jobs' && <FiCpu size={20} className={currentCategory === category ? 'animate-pulse' : ''} />}
                      {category === 'jobs' && <FiBriefcase size={20} />}
                      {category === 'mentors' && <FiUsers size={20} />}
                      <span>
                        {category === 'ai-jobs' 
                          ? 'Learnitab AI Jobs' 
                          : category.charAt(0).toUpperCase() + category.slice(1)
                        }
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex flex-col md:flex-row -mx-2 relative z-20 h-[calc(100vh-80px)]">
          {currentCategory === 'ai-jobs' ? (
            /* AI Jobs Chatbot Full Screen */
            <div className="w-full p-4 h-full">
              <div className="h-full shadow-xl rounded-lg overflow-hidden">
                {renderAIJobsChatbot()}
              </div>
            </div>
          ) : (
            <>
              {/* List View - update background */}
              <div className={`w-full md:w-2/5 flex flex-col gap-4 p-4 overflow-hidden bg-transparent ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
                {/* Search bar container - keep white background */}
                <div className="bg-white rounded-lg shadow-lg transition-all duration-300">
                  {renderSearchBar()}
                </div>

                {/* List container - keep white background */}
                <div 
                  ref={listRef}
                  className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white rounded-lg shadow-lg"
                  style={{ height: 'calc(100vh - 224px)' }}
                >
                  <div className="p-4 space-y-4">
                    {showSaved ? 
                      renderPosts(posts.filter(post => isFavorited(post.title))) :
                      renderPosts(getSortedPosts(getFilteredPosts()))
                    }
                  </div>
                </div>
              </div>

              {/* Detail View - update background */}
              <div className={`w-full md:w-3/5 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar detail-view-container font-['Plus_Jakarta_Sans'] bg-transparent 
                ${showMobileDetail ? 'fixed inset-0 z-50 bg-transparent' : 'hidden md:block'}`}>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  {selectedPostTitle ? (
                    posts.filter(post => post.title === selectedPostTitle)
                      .map(post => displayFullPost(post))[0]
                  ) : (
                    renderWelcomeScreen()
                  )}
                </div>
              </div>
            </>
          )}
        </main>

        {/* Mobile-friendly modals */}
        {(showCalendarPanel || showCalendarManagement) && (
          <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm z-50">
            <div className="fixed inset-y-0 right-0 w-full md:w-80 bg-white shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add to Calendar</h2>
                <button onClick={() => {
                  setShowCalendarPanel(false);
                  setShowCalendarManagement(false);
                  setIsOverlayVisible(false);
                }} className="text-gray-500 hover:text-gray-700">
                  <IoMdClose size={24} />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Add this opportunity's deadline to your calendar:</p>
                <h3 className="font-semibold mb-2">{selectedEvent?.title}</h3>
                <p className="text-sm mb-4">Deadline: {selectedEvent?.deadline || new Date().toISOString()}</p>
              </div>
              <button
                onClick={() => selectedEvent && selectedEvent.deadline && addToCalendar({
                  id: selectedEvent._id,
                  title: selectedEvent.title,
                  deadline: selectedEvent.deadline
                })}
                className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition-colors duration-200"
              >
                Add to Calendar
              </button>
            </div>
          </div>
        )}

        {showCalendarManagement && (
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Calendar Management</h2>
              <button onClick={() => {
                setShowCalendarManagement(false);
                setIsOverlayVisible(false);
              }} className="text-gray-500 hover:text-gray-700">
                <IoMdClose size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by days:</label>
              <select
                value={filterDays || ''}
                onChange={(e) => setFilterDays(e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">All events</option>
                <option value="7">Next 7 days</option>
                <option value="30">Next 30 days</option>
                <option value="90">Next 90 days</option>
              </select>
            </div>
            <div className="space-y-4">
              {calendarEvents
                .filter(event => !filterDays || isAfter(parseISO(event.deadline), new Date()) && isBefore(parseISO(event.deadline), addDays(new Date(), filterDays)))
                .map(event => (
                  <div key={event.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{format(parseISO(event.deadline), 'MMM dd, yyyy')}</p>
                    </div>
                    <button
                      onClick={() => removeFromCalendar(event.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        <style jsx global>{`
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: transparent !important;
          }
          
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-blob {
            animation: blob 10s infinite ease-in-out;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(156, 163, 175, 0.7);
          }
          
          /* Hide horizontal scrollbar */
          .custom-scrollbar::-webkit-scrollbar-horizontal {
            display: none;
          }
        `}</style>

        <style jsx>{`
          .shine-animation {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.8));
            background-size: 200% 100%;
            animation: shine 1.5s infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: black;
          }

          @keyframes shine {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>

        <style jsx global>{`
          /* Enhanced markdown styling for AI responses */
          .markdown-content {
            line-height: 1.6;
          }
          
          .markdown-content strong {
            font-weight: 700;
            color: #1f2937;
          }
          
          .markdown-content em {
            font-style: italic;
            color: #374151;
          }
          
          .markdown-content ul,
          .markdown-content ol {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          .markdown-content li {
            margin-left: 0.5rem;
            line-height: 1.75;
          }
          
          .markdown-content p {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          .markdown-content p:first-child {
            margin-top: 0;
          }
          
          .markdown-content p:last-child {
            margin-bottom: 0;
          }
          
          .markdown-content h1,
          .markdown-content h2,
          .markdown-content h3 {
            font-weight: 700;
            line-height: 1.25;
          }
          
          .markdown-content code {
            font-family: 'Courier New', monospace;
          }
          
          .markdown-content a {
            transition: color 0.2s ease;
          }
          
          .markdown-content blockquote {
            margin: 0.5rem 0;
          }
          
          /* Better spacing for nested lists */
          .markdown-content ul ul,
          .markdown-content ol ol,
          .markdown-content ul ol,
          .markdown-content ol ul {
            margin-top: 0.25rem;
            margin-bottom: 0.25rem;
            margin-left: 1rem;
          }
        `}</style>

        <style jsx>{`
          .prose {
            max-width: 100% !important;
          }

          .prose img {
            max-width: 100%;
            height: auto;
          }

          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
          }
        `}</style>
      </div>
    </CustomErrorBoundary>
  );
}
