
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { AnalysisResult, HistoryItem } from '@/lib/types';
import { CredibilityAnalyzer } from '@/components/news/credibility-analyzer';
import { FullscreenLoader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, FileText, Link as LinkIcon, PlayCircle, Search, Sparkles, BarChartBig, Download, ChevronDown, Bell, Plus, TriangleAlert, TrendingDown, HelpCircle, Eye } from 'lucide-react';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Bar, Cell } from 'recharts';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CredibilityReport } from '@/components/news/credibility-report';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


const StatCard = ({ title, value, change, icon, changeColor }: { title: string, value: string, change?: string, icon: React.ReactNode, changeColor?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {change && <p className={`text-xs ${changeColor || 'text-muted-foreground'}`}>{change}</p>}
        </CardContent>
    </Card>
);


const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/50';
}

const biasData = [
  { name: 'BBC News', 'Left-Leaning': 2, 'Neutral': 8, 'Right-Leaning': 1 },
  { name: 'Reuters', 'Left-Leaning': 1, 'Neutral': 9, 'Right-Leaning': 0 },
  { name: 'CNN', 'Left-Leaning': 6, 'Neutral': 4, 'Right-Leaning': 1 },
  { name: 'Fox News', 'Left-Leaning': 1, 'Neutral': 3, 'Right-Leaning': 7 },
  { name: 'AP', 'Left-Leaning': 2, 'Neutral': 7, 'Right-Leaning': 1 },
];

const chartConfig = {
  'Left-Leaning': { label: 'Left-Leaning', color: 'hsl(var(--chart-1))' },
  'Neutral': { label: 'Neutral', color: 'hsl(var(--chart-2))' },
  'Right-Leaning': { label: 'Right-Leaning', color: 'hsl(var(--chart-3))' },
} satisfies Record<string, { label: string; color: string; }>;


const heatmapData = [
    { source: 'The Guardian', score: 8.9 },
    { source: 'Wall Street Journal', score: 8.5 },
    { source: 'Associated Press', score: 9.2 },
    { source: 'Reuters', score: 9.1 },
    { source: 'BBC News', score: 8.7 },
    { source: 'NPR', score: 8.2 },
    { source: 'Al Jazeera', score: 7.8 },
    { source: 'CNN', score: 6.5 },
    { source: 'Fox News', score: 4.8 },
    { source: 'Breitbart', score: 3.2 },
    { source: 'The Onion', score: 1.5 },
    { source: 'Daily Mail', score: 5.1 },
];

const getHeatmapColor = (score: number) => {
    if (score >= 9) return 'bg-green-700/80 hover:bg-green-700';
    if (score >= 8) return 'bg-green-600/80 hover:bg-green-600';
    if (score >= 7) return 'bg-yellow-500/80 hover:bg-yellow-500';
    if (score >= 6) return 'bg-yellow-400/80 hover:bg-yellow-400';
    if (score >= 5) return 'bg-orange-500/80 hover:bg-orange-500';
    if (score >= 4) return 'bg-orange-600/80 hover:bg-orange-600';
    return 'bg-red-600/80 hover:bg-red-600';
}


export default function HomePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(3);

  useEffect(() => {
    try {
        const storedHistory = localStorage.getItem('analysisHistory');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    } catch(e) {
        console.error("Could not parse history from local storage", e);
    }
  }, []);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setIsAnalyzing(false);
    setAnalysisResult(result);
    // Refresh history from local storage
    const storedHistory = localStorage.getItem('analysisHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  };

  const handleAnalysisError = (error: string) => {
    setIsAnalyzing(false);
    toast({
      variant: 'destructive',
      title: 'Analysis Error',
      description: error,
    });
  };
  
  const handleTryNewsLens = () => {
    router.push('/analyze');
  }

  const handleViewAnalysis = (item: HistoryItem) => {
      if (item.source.type === 'url') {
          router.push(`/analyze?url=${encodeURIComponent(item.source.value)}`);
      } else {
          sessionStorage.setItem('analysisText', item.source.value);
          router.push('/analyze');
      }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }


  return (
    <TooltipProvider>
      <div className="bg-background text-foreground flex-1 p-4 sm:p-6 md:p-8">
          <FullscreenLoader visible={isAnalyzing} title="Analyzing Article..." />

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                  <h1 className="text-3xl font-bold font-headline tracking-tight">Analytics Dashboard</h1>
                  <p className="text-muted-foreground">Track your news analysis history and insights</p>
              </div>
              <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-9 w-9">
                      <Bell className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-9 w-9">
                      <AvatarImage src="https://i.pravatar.cc/40?img=1" alt="User" data-ai-hint="profile avatar" />
                      <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                  </Button>
              </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search analyzed articles..." className="pl-10" />
              </div>
              <Select>
                  <SelectTrigger>
                      <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="bbc">BBC News</SelectItem>
                      <SelectItem value="reuters">Reuters</SelectItem>
                      <SelectItem value="cnn">CNN</SelectItem>
                  </SelectContent>
              </Select>
              <Select>
                  <SelectTrigger>
                      <SelectValue placeholder="All Scores" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Scores</SelectItem>
                      <SelectItem value="high">High (8-10)</SelectItem>
                      <SelectItem value="medium">Medium (6-7.9)</SelectItem>
                      <SelectItem value="low">Low (0-5.9)</SelectItem>
                  </SelectContent>
              </Select>
              <Select>
                  <SelectTrigger>
                      <SelectValue placeholder="Last 30 Days" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 90 Days</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          
          {/* Main Content Area */}
          <div className="space-y-8 mb-8">
            <CredibilityAnalyzer
              onAnalysisStart={handleAnalysisStart}
              onAnalysisComplete={handleAnalysisComplete}
              onAnalysisError={handleAnalysisError}
              isAnalyzing={isAnalyzing}
            />
          
            {analysisResult && (
              <CredibilityReport result={analysisResult} onNewAnalysis={() => setAnalysisResult(null)} />
            )}
          </div>


          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
              <StatCard title="Articles Analyzed" value={history.length.toString()} change="↑ 12% from last month" icon={<FileText className="h-4 w-4 text-muted-foreground" />} changeColor="text-green-500" />
              <StatCard title="Avg Credibility" value="7.8/10" change="↑ 0.3 improvement" icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} changeColor="text-green-500" />
              <StatCard title="Alerts" value="3" change="✨ New bias alerts" icon={<TriangleAlert className="h-4 w-4 text-muted-foreground" />} changeColor="text-yellow-500" />
          </div>
          
          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-8">
              <Card className="lg:col-span-4">
                  <CardHeader>
                      <CardTitle>Bias Trends Over Time</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                      <ChartContainer config={chartConfig} className="h-[300px] w-full">
                          <BarChart accessibilityLayer data={biasData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                              <CartesianGrid vertical={false} />
                              <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <ChartLegend content={<ChartLegendContent />} />
                              <Bar dataKey="Left-Leaning" stackId="a" fill="var(--color-Left-Leaning)" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="Neutral" stackId="a" fill="var(--color-Neutral)" />
                              <Bar dataKey="Right-Leaning" stackId="a" fill="var(--color-Right-Leaning)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ChartContainer>
                  </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                  <CardHeader>
                      <CardTitle>Source Credibility Heatmap</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-white">
                          {heatmapData.map(source => (
                              <Tooltip key={source.source}>
                                  <TooltipTrigger>
                                  <div className={cn(
                                      "p-3 rounded-lg text-sm font-semibold transition-all duration-300",
                                      getHeatmapColor(source.score)
                                  )}>
                                      {source.source}
                                  </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                      <p>Credibility Score: {source.score.toFixed(1)}</p>
                                  </TooltipContent>
                              </Tooltip>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Collections, Alerts, Summaries */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Collections</CardTitle>
                      <Button variant="ghost" size="icon"><Plus className="h-4 w-4"/></Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer">
                          <div>
                              <p className="font-semibold">Climate Research</p>
                              <p className="text-sm text-muted-foreground">12 articles</p>
                          </div>
                          <ChevronDown className="h-5 w-5 -rotate-90 text-muted-foreground"/>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer">
                          <div>
                              <p className="font-semibold">Tech Policy</p>
                              <p className="text-sm text-muted-foreground">8 articles</p>
                          </div>
                          <ChevronDown className="h-5 w-5 -rotate-90 text-muted-foreground"/>
                      </div>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader><CardTitle className="text-lg">Recent Alerts</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                       <div className="flex items-start gap-4 p-3 rounded-md bg-red-50 dark:bg-red-500/10">
                          <div className="p-2 bg-red-100 rounded-full dark:bg-red-500/20"><TriangleAlert className="h-5 w-5 text-red-600 dark:text-red-400"/></div>
                          <div>
                              <p className="font-semibold">High Bias Detected</p>
                              <p className="text-sm text-muted-foreground">CNN article on politics</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4 p-3 rounded-md bg-yellow-50 dark:bg-yellow-500/10">
                          <div className="p-2 bg-yellow-100 rounded-full dark:bg-yellow-500/20"><TrendingDown className="h-5 w-5 text-yellow-600 dark:text-yellow-400"/></div>
                          <div>
                              <p className="font-semibold">Credibility Drop</p>
                              <p className="text-sm text-muted-foreground">Source rating decreased</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle className="text-lg">AI Summaries</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                       <div className="p-3 rounded-md border">
                          <p className="font-semibold truncate">Climate Summit</p>
                          <p className="text-sm text-muted-foreground truncate">Historic agreement reached on carbon emissions with mixed credibility sources...</p>
                      </div>
                      <div className="p-3 rounded-md border">
                          <p className="font-semibold truncate">Tech Regulations</p>
                          <p className="text-sm text-muted-foreground truncate">European markets implementing new digital governance frameworks...</p>
                      </div>
                  </CardContent>
              </Card>
          </div>
          
          {/* Recent Analyses Table */}
          <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <CardTitle>Recent Analyses</CardTitle>
                        <CardDescription>Your last {history.length} analyzed articles.</CardDescription>
                    </div>
                    {history.length > visibleHistoryCount && (
                         <Button variant="outline" onClick={() => setVisibleHistoryCount(prev => prev + 3)}>Load More</Button>
                    )}
                </div>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Article</TableHead>
                              <TableHead className="hidden md:table-cell">Source</TableHead>
                              <TableHead className="hidden lg:table-cell">Analyzed</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead className="hidden md:table-cell">Bias</TableHead>
                              <TableHead className="text-right"></TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {history.length > 0 ? (
                            history.slice(0, visibleHistoryCount).map(item => (
                               <TableRow key={item.id}>
                                  <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                                  <TableCell className="hidden md:table-cell">{item.result.source.summary.split(' ')[0]}</TableCell>
                                  <TableCell className="hidden lg:table-cell text-muted-foreground">{formatTimeAgo(item.timestamp)}</TableCell>
                                  <TableCell>
                                      <Badge variant="outline" className={getScoreColor(item.result.overallCredibilityScore)}>{item.result.overallCredibilityScore}/10</Badge>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                       <Badge variant="secondary">{item.result.quickIndicators.biasLevel}</Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <Button variant="ghost" onClick={() => handleViewAnalysis(item)}>
                                          <Eye className="mr-2 h-4 w-4" />
                                          View
                                      </Button>
                                  </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    You haven't analyzed any articles yet.
                                </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
          
          {/* Help widget */}
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
              <Button size="lg" className="rounded-full h-16 w-16 shadow-lg bg-blue-600 hover:bg-blue-700">
                  <HelpCircle className="h-6 w-6" />
                  <span className="sr-only">Help</span>
              </Button>
          </div>
      </div>
    </TooltipProvider>
  );
}
