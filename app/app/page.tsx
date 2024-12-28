'use client'

import { useState, useEffect, useCallback, useRef, ReactElement, Key, JSXElementConstructor, ReactNode, Suspense } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import Logo from '/public/images/Logo Learnitab.png';
import { FiSearch, FiHeart, FiCalendar, FiRotateCw, FiMenu, FiLinkedin, 
         FiInstagram, FiLink, FiTrash2, FiBriefcase, FiAward, 
         FiBookOpen, FiUsers, FiDisc, FiDownload, FiMapPin, FiGlobe, FiExternalLink } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { SiProducthunt } from 'react-icons/si';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { CustomErrorBoundary } from '../components/ErrorBoundary';
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
  title: string;
  company_name: string;
  description: string;
  url: string;
  location: string;
  remote: boolean;
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

interface JobPost {
  _id: string;
  title: string;
  category: string;
  labels: {
    [key: string]: string | string[];
  };
  deadline?: string | null;
  link: string;
  body: string | string[];
  location?: string;
  remote?: boolean;
  source?: string;
  jobTypes?: string[];
  experience?: string[];
  education?: string[];
  responsibilities?: string[];
  requirements?: string[];
  workLocation?: string;
  duration?: string;
  stipend?: string;
  workType?: string;
  prize?: string;
  eligibility?: string;
  email?: string;
  expired?: boolean;
  daysLeft?: number;
  image?: string;
  // Social media fields
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  instagram?: string;
  // Additional mentor-specific fields
  mentorTopics?: string[];
  availability?: string;
  timezone?: string;
  languages?: string[];
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
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedPostTitle, setSelectedPostTitle] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState<JobPost[]>([]);
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
  const [selectedEvent, setSelectedEvent] = useState<JobPost | null>(null);
  const [showCalendarManagement, setShowCalendarManagement] = useState(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'days-left'>('default');
  const [filterDays, setFilterDays] = useState<number | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [recommendations, setRecommendations] = useState<JobPost[]>([]);

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

  // Single effect to handle initial data loading, URL params, and visible posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Fetch regular posts for other categories
        const regularResponse = await fetch('/api/posts');
        const regularData = await regularResponse.json();

        // Fetch job posts from multiple sources with type annotations
        const [arbeitnowJobs, remotiveJobs, jobicyJobs] = await Promise.all([
          fetch('https://www.arbeitnow.com/api/job-board-api').then(res => res.json()) as Promise<{ data: ArbeitnowJob[] }>,
          fetch('https://remotive.com/api/remote-jobs?limit=100').then(res => res.json()) as Promise<{ jobs: RemotiveJob[] }>,
          fetch('https://jobicy.com/api/v2/remote-jobs?count=50').then(res => res.json()) as Promise<{ jobs: JobicyJob[] }>
        ]);

        // Transform job data with proper typing
        const transformedJobs = [
          ...arbeitnowJobs.data.map((job: ArbeitnowJob) => ({
            _id: `arbeitnow-${job.slug}`,
            title: job.title,
            category: 'Job',
            labels: { Company: job.company_name },
            deadline: null,
            link: job.url,
            body: job.description,
            location: job.location,
            remote: job.remote,
            source: 'Arbeitnow',
            expired: false,
            daysLeft: null,
            image: 'https://od.lk/s/OTZfOTY3MjAxNDBf/magang-dummy.png',
            linkedin: null,
            twitter: null,
            github: null,
            website: null,
            instagram: null
          })),
          ...remotiveJobs.jobs.map((job: RemotiveJob) => ({
            _id: `remotive-${job.id}`,
            title: job.title,
            category: 'Job',
            labels: { Company: job.company_name },
            deadline: null,
            link: job.url,
            body: job.description,
            location: job.candidate_required_location || 'Remote',
            remote: true,
            source: 'Remotive',
            expired: false,
            daysLeft: null,
            image: 'https://od.lk/s/OTZfOTY3MjAxNDBf/magang-dummy.png',
            linkedin: null,
            twitter: null,
            github: null,
            website: null,
            instagram: null
          })),
          ...jobicyJobs.jobs.map((job: JobicyJob) => ({
            _id: `jobicy-${job.id}`,
            title: job.jobTitle,
            category: 'Job',
            labels: { Company: job.companyName },
            deadline: null,
            link: job.url,
            body: job.jobDescription,
            location: job.jobGeo || 'Remote',
            remote: true,
            source: 'Jobicy',
            expired: false,
            daysLeft: null,
            image: 'https://od.lk/s/OTZfOTY3MjAxNDBf/magang-dummy.png',
            linkedin: null,
            twitter: null,
            github: null,
            website: null,
            instagram: null
          }))
        ];

        // Combine regular posts with job posts
        if (regularData.data) {
          const otherPosts = Object.entries(regularData.data)
            .filter(([category]) => category !== 'internship') // Exclude old internship category
            .flatMap(([category, categoryPosts]: [string, unknown]) =>
              Array.isArray(categoryPosts) ? categoryPosts.map(post => ({
                ...post,
                category,
                expired: post.deadline ? new Date(post.deadline) < new Date() : false,
                daysLeft: post.deadline ? Math.ceil((new Date(post.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
              })) : []
            );

          const allPosts = [...transformedJobs, ...otherPosts];
          setPosts(allPosts);

          // Handle URL parameters after posts are loaded
          const searchParams = new URLSearchParams(window.location.search);
          const postId = searchParams.get('post');
          if (postId) {
            const targetPost = allPosts.find(post => post._id === postId);
            if (targetPost) {
              setSelectedPostTitle(targetPost.title);
              setCurrentCategory(targetPost.category);
              
              const filteredPosts = allPosts.filter(post => 
                post.category === targetPost.category
              );
              setVisiblePosts(filteredPosts.slice(0, postsPerPage));
              setHasMore(filteredPosts.length > postsPerPage);
              
              setTimeout(() => {
                const postElement = document.getElementById(`post-${postId}`);
                postElement?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
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

  function copyPostLink(post: JobPost): void {
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

  const toggleCalendarPanel = (post: JobPost) => {
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

  const getSortedPosts = (filteredPosts: JobPost[]) => {
    const activePosts = filteredPosts.filter(post => !post.expired);
    const expiredPosts = filteredPosts.filter(post => post.expired);

    if (sortOrder === 'days-left') {
      return [
        ...activePosts.sort((a, b) => (a.daysLeft || 0) - (b.daysLeft || 0)),
        ...expiredPosts
      ];
    }

    return [...activePosts, ...expiredPosts];
  };

  const displayFullPost = (post: JobPost) => {
    if (post.category === 'Job') {
      return (
        <div className="post-full space-y-8 font-['Plus_Jakarta_Sans']">
          {/* Header Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg text-gray-600">{post.labels['Company']}</span>
                  <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {post.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(post.title);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    favorites.includes(post.title)
                      ? 'bg-pink-50 text-pink-500 border border-pink-200'
                      : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'
                  }`}
                >
                  <FiHeart className={favorites.includes(post.title) ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyPostLink(post);
                  }}
                  className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-gray-400 transition-colors"
                >
                  <FiLink size={20} />
                </button>
              </div>

              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
              >
                Apply Now
              </a>
            </div>
          </div>

          {/* Job Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2">
              <FiBriefcase className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Job Type</p>
                <p className="font-medium">{post.jobTypes?.[0] || 'Full Time'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{post.location}</p>
              </div>
            </div>
            {post.remote && (
              <div className="flex items-center gap-2">
                <FiGlobe className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Work Type</p>
                  <p className="font-medium">Remote</p>
                </div>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div 
              className="text-gray-700 space-y-4"
              dangerouslySetInnerHTML={{ 
                __html: typeof post.body === 'string' 
                  ? post.body
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                  : Array.isArray(post.body) 
                    ? post.body.join('<br><br>') 
                    : ''
              }}
            />
          </div>

          {/* Application Section */}
          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">How to Apply</h2>
            <p className="text-gray-700 mb-4">
              Click the apply button to submit your application directly on the company's website.
            </p>
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply for this position
              <FiExternalLink className="ml-2" />
            </a>
          </div>
        </div>
      );
    }

    // Return original display for other categories
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

  const renderPosts = (posts: JobPost[]) => {
    if (isLoading) {
      return Array(5).fill(0).map((_, index) => (
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
      ));
    }

    return posts.map((post) => (
      <div
        key={post._id}
        id={`post-${post._id}`}
        onClick={() => setSelectedPostTitle(post.title)}
        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-gray-100"
      >
        <div className="flex items-start gap-4 max-w-full">
          <Image
            src={post.image || 'https://od.lk/s/OTZfOTY3MjAxNDBf/magang-dummy.png'}
            alt={`${post.labels['Company']} logo`}
            width={60}
            height={60}
            className="rounded-lg object-contain"
            priority={true}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://od.lk/s/OTZfOTY3MjAxNDBf/magang-dummy.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
            <p className="text-sm text-gray-600 truncate">
              {post.category === 'mentors' ? post.labels['Organization'] : post.labels['Company']}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                {post.category}
              </span>
              {post.deadline && (
                <span className="text-xs text-gray-500 flex items-center gap-2">
                  {post.category !== 'internship' && (
                    <>Deadline: {format(parseISO(post.deadline), 'MMM dd, yyyy')}</>
                  )}
                  {post.category === 'internship' ? (
                    post.expired && (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                        Expired
                      </span>
                    )
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full ${
                      post.expired 
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {post.expired ? 'Expired' : `${post.daysLeft} days left`}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(post.title);
            }}
            className={`flex-shrink-0 p-2 rounded-full transition-colors ${
              favorites.includes(post.title)
                ? 'text-pink-500 bg-pink-50'
                : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'
            }`}
          >
            <FiHeart className={favorites.includes(post.title) ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    ));
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
  const handlePostSelection = (post: JobPost) => {
    setSelectedPostTitle(post.title);
    if (window.innerWidth < 768) { // Mobile breakpoint
      setShowMobileDetail(true);
    }
  };

  return (
    <CustomErrorBoundary>
      <div className="h-screen overflow-hidden w-full flex flex-col">
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply opacity-70 animate-blob"></div>
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-48 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>

        {/* Modified header with mobile menu */}
        <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
          <div className="w-full px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative cursor-pointer" onClick={() => window.open('https://learnitab.com', '_blank')}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                  <Image
                    src={Logo}
                    alt="Learnitab Logo"
                    width={40}
                    height={40}
                    className="relative z-10 mr-4"
                  />
                </div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Learnitab</h1>
                {/* Attractive Download Button with Icon moved closer */}
                <button 
                  onClick={() => window.open('https://learnitab.com/download', '_blank')} // Updated URL
                  className="ml-2 flex items-center px-3 py-1 text-sm font-bold bg-white shadow-lg rounded-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                >
                  <FiDownload className="mr-2" /> {/* Download Icon */}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Download Learnitab Opportunity Desktop App</span>
                </button>
              </div>
              <nav className="hidden md:flex space-x-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                      currentCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setCurrentCategory(category)}
                  >
                    <span>
                      {category === '' ? 'All Opportunities' : category.charAt(0).toUpperCase() + category.slice(1)}
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
          </div>
        </header>

        {/* Modified main content */}
        <main className="flex flex-col md:flex-row -mx-2 relative z-10 h-[calc(100vh-80px)]">
          {/* List View - added padding inside the container instead */}
          <div className={`w-full md:w-2/5 flex flex-col gap-4 p-4 overflow-hidden ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
            {/* Search bar container */}
            <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-stretch justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-grow">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700 bg-opacity-50 font-['Plus_Jakarta_Sans']"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowSaved(!showSaved)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                      showSaved 
                        ? 'bg-pink-50 text-pink-600 border border-pink-200' 
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${showSaved ? 'text-pink-500' : 'text-gray-400'}`} />
                    <span className="text-sm font-['Plus_Jakarta_Sans']">{favorites.length}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCalendarManagement(true);
                      setIsOverlayVisible(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md bg-white hover:bg-gray-50 border border-gray-200"
                  >
                    <FiCalendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-['Plus_Jakarta_Sans']">{calendarEvents.length}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List container with fixed height - adjusted height calculation */}
            <div 
              ref={listRef}
              className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white bg-opacity-90 rounded-lg shadow-lg"
              style={{ height: 'calc(100vh - 224px)' }}
            >
              <div className="p-4">
                <div className="space-y-4">
                  {showSaved ? 
                    renderPosts(posts.filter(post => favorites.includes(post.title))) :
                    renderPosts(getSortedPosts(getFilteredPosts()))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Detail View - Ensure it's visible in mobile mode */}
          <div className={`w-full md:w-3/5 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar font-['Plus_Jakarta_Sans'] 
            ${showMobileDetail ? 'fixed inset-0 z-50 bg-white' : 'hidden md:block'}`}>
            <div className="bg-white rounded-xl shadow-lg p-4 transition-all duration-300">
              {selectedPostTitle ? (
                <div className="bg-white rounded-lg p-4">
                  {posts.filter(post => post.title === selectedPostTitle).map(post => (
                    <div key={post._id}>
                      {/* Header Section */}
                      <div className="border-b pb-6">
                        {/* Title, Image, and Close Button */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <Image
                              src={post.image || 'https://od.lk/s/OTZfOTY3MjAxNDBf/magang-dummy.png'}
                              alt={`${post.labels['Company']} logo`}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                              priority={true}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://od.lk/s/OTZfOTY3MjAxNDBf/magang-dummy.png';
                              }}
                            />
                            <div>
                              <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                              <p className="text-lg text-gray-600">
                                {post.category === 'mentors' ? post.labels['Organization'] : post.labels['Company']}
                              </p>
                              {/* Social Media Icons for Mentors */}
                              {post.category === 'mentors' && (
                                <div className="flex items-center gap-3 mt-2">
                                  {post.linkedin && (
                                    <a 
                                      href={post.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <FiLinkedin size={20} />
                                    </a>
                                  )}
                                  {post.instagram && (
                                    <a 
                                      href={post.instagram}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-pink-600 hover:text-pink-700"
                                    >
                                      <FiInstagram size={20} />
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedPostTitle(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <IoMdClose size={24} />
                          </button>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleFavorite(post.title)}
                              className={`p-2.5 rounded-lg ${
                                favorites.includes(post.title)
                                  ? 'bg-pink-50 text-pink-500 border border-pink-200'
                                  : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-400'
                              }`}
                            >
                              <FiHeart size={20} className={favorites.includes(post.title) ? 'fill-current' : ''} />
                            </button>
                            
                            <button
                              onClick={() => copyPostLink(post)}
                              className="p-2.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-gray-400"
                            >
                              <FiLink size={20} />
                            </button>

                            {(post.category === 'competitions' || post.category === 'scholarships') && (
                              <button
                                onClick={() => toggleCalendarPanel(post)}
                                className="p-2.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-gray-400"
                              >
                                <FiCalendar size={20} />
                              </button>
                            )}
                          </div>

                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            {post.category === 'mentors' ? 'Schedule Mentoring' : 'Apply Now'}
                          </a>
                        </div>
                      </div>

                      {/* Description Section - Add this part */}
                      <div className="mt-6 space-y-6">
                        {post.category === 'mentors' ? (
                          <>
                            <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-4">Mentoring Topics</h2>
                              <div className="flex flex-wrap gap-2">
                                {post.labels['Mentoring Topic']?.map((topic, index) => (
                                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {post.experience && post.experience.length > 0 && (
                              <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">Experience</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                  {post.experience.map((exp, index) => (
                                    <li key={index} className="text-gray-700">{exp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {post.education && post.education.length > 0 && (
                              <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">Education</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                  {post.education.map((edu, index) => (
                                    <li key={index} className="text-gray-700">{edu}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : post.category === 'internship' ? (
                          <>
                            {post.responsibilities && post.responsibilities.length > 0 && (
                              <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                  {post.responsibilities.map((resp, index) => (
                                    <li key={index} className="text-gray-700">{resp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {post.requirements && post.requirements.length > 0 && (
                              <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                  {post.requirements.map((req, index) => (
                                    <li key={index} className="text-gray-700">{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                              <div className="space-y-2">
                                {post.workLocation && <p><strong>Location:</strong> {post.workLocation}</p>}
                                {post.duration && <p><strong>Duration:</strong> {post.duration}</p>}
                                {post.stipend && <p><strong>Stipend:</strong> {post.stipend}</p>}
                                {post.workType && <p><strong>Work Type:</strong> {post.workType}</p>}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-4">
                                {post.category.charAt(0).toUpperCase() + post.category.slice(1)} Details
                              </h2>
                              {Array.isArray(post.body) ? (
                                <div className="space-y-4">
                                  {post.body.map((paragraph, index) => (
                                    <p key={index} className="text-gray-700">{paragraph}</p>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-700">{post.body}</p>
                              )}
                            </div>

                            <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                              <div className="space-y-2">
                                {post.deadline && <p><strong>Deadline:</strong> {post.deadline}</p>}
                                {post.location && <p><strong>Location:</strong> {post.location}</p>}
                                {post.prize && <p><strong>Prize:</strong> {post.prize}</p>}
                                {post.eligibility && <p><strong>Eligibility:</strong> {post.eligibility}</p>}
                                {post.email && <p><strong>Contact:</strong> {post.email}</p>}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                renderWelcomeScreen()
              )}
            </div>
          </div>
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
          }
          
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          .animate-blob {
            animation: blob 10s infinite ease-in-out;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(136, 136, 136, 0.5) transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(136, 136, 136, 0.5);
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(136, 136, 136, 0.7);
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
      </div>
    </CustomErrorBoundary>
  );
}
