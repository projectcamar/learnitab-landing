'use client'

import { useState, useEffect, useCallback, useRef, ReactElement, Key, JSXElementConstructor, ReactNode, Suspense } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import Logo from '/public/images/Logo Learnitab.png';
import { FiSearch, FiHeart, FiCalendar, FiRotateCw, FiMenu, FiLinkedin, 
         FiInstagram, FiLink, FiTrash2, FiBriefcase, FiAward, 
         FiBookOpen, FiUsers, FiDisc, FiDownload, FiMapPin, FiMonitor, 
         FiHome, FiTag, FiClock, FiExternalLink } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { SiProducthunt } from 'react-icons/si';
import { Post } from '../models/Post';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useSearchParams } from 'next/navigation';

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

// 1. Add proper error handling for localStorage
const getInitialState = () => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

interface ArbeitnowJob {
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
}

interface RemotiveJob {
  id: string;
  title: string;
  company_name: string;
  description: string;
  url: string;
  candidate_required_location: string;
  publication_date: string;
}

interface JobicyJob {
  id: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  url: string;
  jobGeo: string;
  pubDate: string;
}

// Add interface for Arbeitnow response
interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links: {
    first: string;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    path: string;
    per_page: number;
    to: number;
  };
}

export default function Home() {
  const postsPerPage = 10;

  // 2. Initialize state with null checks for browser APIs
  const [favorites, setFavorites] = useState<string[]>(() => getInitialState());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('calendarEvents');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 3. Initialize other state variables
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedPostTitle, setSelectedPostTitle] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // 4. Move browser-specific code into useEffect
  useEffect(() => {
    // Initialize localStorage items here
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setCalendarEvents(JSON.parse(savedEvents));
    }
  }, []);

  // 5. Update the posts count display
  const getPostsCount = () => {
    if (showSaved) {
      return favorites.length;
    }
    return posts.filter(post => 
      (!currentCategory || post.category === currentCategory)
    ).length;
  };

  const categories = ['', 'Job', 'competitions', 'scholarships', 'mentors'];
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

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Add new loading state
  const [isLoading, setIsLoading] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const [error, setError] = useState<string | null>(null);

  // Single effect to handle initial data loading, URL params, and visible posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const arbeitnowResponse = await fetch('https://www.arbeitnow.com/api/job-board-api');
        const arbeitnowData: { data: ArbeitnowJob[] } = await arbeitnowResponse.json();

        const arbeitnowPosts: Post[] = arbeitnowData.data.map(job => ({
          _id: job.slug,
          title: job.title,
          category: 'Job',
          body: job.description,
          location: job.location,
          link: job.url,
          company_name: job.company_name,
          job_types: job.job_types,
          tags: job.tags,
          created_at: job.created_at,
          labels: {
            Company: job.company_name,
            Position: job.title,
            Status: job.job_types?.[0] || 'Not specified'
          },
          workLocation: job.location,
          workType: 'On-site',
          expired: false
        } as Post));

        setPosts(arbeitnowPosts);
        setVisiblePosts(arbeitnowPosts.slice(0, postsPerPage));
        setHasMore(arbeitnowPosts.length > postsPerPage);
        
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Add a cleanup effect to reset category when unmounting
  useEffect(() => {
    return () => {
      setCurrentCategory('');
      setSelectedPostTitle(null);
    };
  }, []);

  // Effect for infinite scroll
  useEffect(() => {
    if (inView && hasMore) {
      const filteredPosts = posts.filter(post => {
        const matchesCategory = !currentCategory || post.category === currentCategory;
        const matchesSearch = !searchTerm || 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      const nextPosts = filteredPosts.slice(
        visiblePosts.length,
        visiblePosts.length + postsPerPage
      );

      if (nextPosts.length > 0) {
        setVisiblePosts(prev => [...prev, ...nextPosts]);
      } else {
        setHasMore(false);
      }
    }
  }, [inView, hasMore, posts, currentCategory, searchTerm, visiblePosts.length, postsPerPage]);

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
      const newFavorites = prevFavorites.includes(postTitle)
        ? prevFavorites.filter((title: string) => title !== postTitle)
        : [...prevFavorites, postTitle];
      
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

  const getFilteredPosts = () => {
    let filteredPosts = posts.filter(post => 
      (currentCategory === '' && post.category !== 'mentors') || 
      post.category === currentCategory
    );

    if (searchTerm) {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.body && post.body.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return [...new Map(filteredPosts.map(post => [post._id, post])).values()];
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
    return (
      <div className="post-full space-y-8 font-['Plus_Jakarta_Sans']">
        {/* Header with Title and Company */}
        <div className="flex flex-col space-y-4">
          {/* Title and Company */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
              <p className="text-lg text-gray-600 mt-2">
                {post.category === 'mentors' ? post.labels['Organization'] : post.labels['Company']}
              </p>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleFavorite(post.title)}
                className={`p-2 rounded-lg transition-colors ${
                  favorites.includes(post.title)
                    ? 'bg-pink-50 text-pink-500 border border-pink-200'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-400'
                }`}
              >
                <FiHeart size={20} className={favorites.includes(post.title) ? 'fill-current' : ''} />
              </button>

              <button
                onClick={() => copyPostLink(post)}
                className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-gray-400 transition-colors"
              >
                <FiLink size={20} />
              </button>

              {(post.category === 'competitions' || post.category === 'scholarships') && (
                <button
                  onClick={() => toggleCalendarPanel(post)}
                  className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-gray-400 transition-colors"
                >
                  <FiCalendar size={20} />
                </button>
              )}
            </div>

            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
            >
              {post.category === 'mentors' ? 'Schedule Mentoring' : 'Apply Now'}
            </a>
          </div>
        </div>

        <div className="border-t pt-6">
          {/* Description Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <div className="prose max-w-none text-gray-700">
              {Array.isArray(post.body) ? (
                post.body.map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))
              ) : (
                <p>{post.body}</p>
              )}
            </div>
          </div>

          {/* Rest of the sections */}
          {/* ... */}
        </div>

        {/* Remove the footer section entirely since we moved the actions up */}
      </div>
    );
  };

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'internship':
        return 'bg-blue-100 text-blue-800';
      case 'competitions':
        return 'bg-purple-100 text-purple-800';
      case 'scholarships':
        return 'bg-green-100 text-green-800';
      case 'mentors':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'internship':
        return <FiBriefcase className="mr-2" />;
      case 'competitions':
        return <FiAward className="mr-2" />;
      case 'scholarships':
        return <FiBookOpen className="mr-2" />;
      case 'mentors':
        return <FiUsers className="mr-2" />;
      default:
        return null;
    }
  };

  const selectCategory = (category: string) => {
    setCurrentCategory(category);
    setVisiblePosts([]);
    setHasMore(true);
    
    // Clear the post parameter from URL when changing categories
    const url = new URL(window.location.href);
    url.searchParams.delete('post');
    window.history.pushState({}, '', url);
    
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

  // Add function to handle mobile post selection
  const handlePostSelection = (post: Post) => {
    setSelectedPostTitle(post.title);
    if (window.innerWidth < 768) { // Mobile breakpoint
      setShowMobileDetail(true);
    }
  };

  // Add loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );

  return (
    <div className="h-screen overflow-hidden w-full flex flex-col">
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply opacity-70 animate-blob"></div>
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
            {/* ... rest of your sidebar code ... */}
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              {posts.length > 0 ? (
                <div className="grid gap-4 p-6">
                  {visiblePosts.map((post) => (
                    <div 
                      key={post._id} 
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          {post.title}
                        </h3>

                        <div className="space-y-2 text-gray-600">
                          {post.workLocation && (
                            <p className="flex items-center">
                              <FiMapPin className="mr-2" />
                              <strong className="mr-2">Location:</strong> {post.workLocation}
                            </p>
                          )}

                          {post.labels?.Company && (
                            <p className="flex items-center">
                              <FiHome className="mr-2" />
                              <strong className="mr-2">Company:</strong> {post.labels.Company}
                            </p>
                          )}

                          {post.created_at && (
                            <p className="flex items-center text-gray-500 text-sm">
                              <FiClock className="mr-2" />
                              <strong className="mr-2">Posted:</strong> 
                              {format(new Date(post.created_at * 1000), 'MMM dd, yyyy')}
                            </p>
                          )}
                        </div>

                        <div className="mt-4">
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                          >
                            <FiExternalLink className="mr-2" />
                            Apply Now
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                renderWelcomeScreen()
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Your existing modals and styles */}
      {/* ... */}
    </div>
  );
}
