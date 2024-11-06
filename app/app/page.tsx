'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import Logo from '/public/images/Logo Learnitab.png';
import { FiSearch, FiHeart, FiCalendar, FiRotateCw, FiMenu, FiLinkedin, 
         FiInstagram, FiLink, FiTrash2, FiBriefcase, FiAward, 
         FiBookOpen, FiUsers, FiDisc } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { SiProducthunt } from 'react-icons/si';
import { Post } from '../models/Post';
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

// Create a loading component
function LoadingSpinner() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Create an error component
function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <h2 className="text-xl font-bold text-red-500">Something went wrong!</h2>
      <p>{error.message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );
}

// Create a separate component for the search params functionality
function SearchParamsWrapper() {
  const searchParams = useSearchParams()!;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Your fetch logic here
        // const response = await fetch(...);
        // const data = await response.json();
        // setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  if (error) return <ErrorDisplay error={error} />;
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="h-screen overflow-hidden w-full flex flex-col">
      {/* Your existing JSX */}
    </div>
  );
}

// Main component with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CustomErrorBoundary>
        <SearchParamsWrapper />
      </CustomErrorBoundary>
    </Suspense>
  );
}