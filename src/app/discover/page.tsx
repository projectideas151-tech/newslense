
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Globe, MapPin, Plus, WifiOff } from 'lucide-react';
import type { TrendingNewsArticle } from '@/lib/types';
import { getTrendingNews } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Unauthorized from '@/components/layout/unauthorized';

const categories = ['All News', 'Politics', 'Business', 'Technology', 'Health', 'Sports', 'Entertainment'];

const getScoreColorClasses = (score: number) => {
  if (score >= 8) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
  if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20';
  return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
};

const NewsCardSkeleton = () => (
    <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-11/12 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20" />
            </div>
        </CardContent>
    </Card>
);

const NewsCard = ({ article, onAnalyze }: { article: TrendingNewsArticle, onAnalyze: (url: string) => void }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image src={article.imageUrl} alt={`${article.source} logo`} width={24} height={24} className="rounded-full" data-ai-hint="logo" />
            <span className="text-sm font-medium text-muted-foreground">{article.source}</span>
          </div>
          <div className={`px-2 py-1 rounded-md text-sm font-bold border ${getScoreColorClasses(article.credibilityScore)}`}>
            {article.credibilityScore.toFixed(1)}/10
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2 font-headline h-14 overflow-hidden">{article.headline}</h3>
        <p className="text-muted-foreground text-sm mb-4 h-20 overflow-hidden flex-grow">
          {article.shortAnalysis}
        </p>
        <div className="flex justify-between items-center text-sm text-muted-foreground mt-auto">
          <span>2 hours ago</span>
          <Button variant="link" className="p-0 h-auto text-primary" onClick={() => onAnalyze(article.url)}>
            Analyze <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


const ErrorState = ({ title, message, onRetry }: { title: string, message: string, onRetry?: () => void }) => (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-12 bg-card rounded-lg">
        <WifiOff className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
        {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
);

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState('global');
  const [activeCategory, setActiveCategory] = useState('All News');
  const [news, setNews] = useState<TrendingNewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let fetchLocation: string | undefined = undefined;
      if (activeTab === 'local') {
          if (location === 'denied') {
             setError("Location access was denied. To see local news, please enable location permissions in your browser settings.");
             setNews([]);
             setIsLoading(false);
             return;
          }
          if (!location) {
            // Location is still being fetched
            setIsLoading(true);
            return;
          }
          fetchLocation = location;
      }

      const trendingNews = await getTrendingNews({ 
          category: activeCategory, 
          count: activeCategory === 'All News' ? 9 : 6,
          location: fetchLocation,
      });
      setNews(trendingNews);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Failed to load news',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, toast, activeTab, location]);

  useEffect(() => {
    if (!isLoggedIn) return;

    if(activeTab === 'local' && !location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd use a reverse geocoding service.
          // For this demo, we'll simulate it.
          setLocation(`lat: ${latitude.toFixed(2)}, lon: ${longitude.toFixed(2)} (Simulated City)`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation('denied');
        },
        { timeout: 10000 }
      );
    } else {
      fetchNews();
    }
  }, [isLoggedIn, activeTab, activeCategory, location, fetchNews]);


  const handleAnalyze = (url: string) => {
    const analysisUrl = `/analyze?url=${encodeURIComponent(url)}`;
    router.push(analysisUrl);
  };
  
  const handleQuickAnalyze = () => {
    router.push('/analyze');
  }
  
  if (!isLoggedIn) {
      return <Unauthorized />;
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Discover News</h1>
        <p className="text-muted-foreground">Stay informed with credibility-verified news from around the world</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 md:w-max">
          <TabsTrigger value="global"><Globe className="mr-2 h-4 w-4" /> Global</TabsTrigger>
          <TabsTrigger value="local"><MapPin className="mr-2 h-4 w-4" /> Local</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
              <Button 
                key={category} 
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
              >
                  {category}
              </Button>
          ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
        ) : error ? (
           <ErrorState title="Failed to Load News" message={error} onRetry={fetchNews} />
        ) : (
          news.map((article) => <NewsCard key={article.id} article={article} onAnalyze={handleAnalyze} />)
        )}
      </div>

      {!isLoading && !error && news.length > 0 && (
        <div className="text-center mt-12">
            <Button variant="outline" size="lg">Load More Articles</Button>
        </div>
      )}
      
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
        <Button size="lg" className="rounded-full h-16 w-16 shadow-lg" onClick={handleQuickAnalyze}>
            <Plus className="h-6 w-6" />
            <span className="sr-only">Quick Analyze</span>
        </Button>
      </div>

    </div>
  );
}
