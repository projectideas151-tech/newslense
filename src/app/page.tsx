
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { AnalysisResult } from '@/lib/types';
import { CredibilityAnalyzer } from '@/components/news/credibility-analyzer';
import { FullscreenLoader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, FileText, Link as LinkIcon, PlayCircle, Search, Sparkles, BarChartBig } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import HomePage from './home/page';


const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className={`p-6 rounded-lg shadow-md flex flex-col items-start bg-card`}>
        <div className="p-2 bg-background rounded-md mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
);

const HowItWorksStep = ({ number, title, description }: { number: number, title: string, description: string }) => (
    <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-bold text-xl mb-4">
            {number}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isLoggedIn } = useAuth();

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setIsAnalyzing(false);
    // Instead of showing the report here, we assume it's handled by a dedicated page.
    // We can store the result in a shared state or pass it via router if needed,
    // but for now, we just stop the loader. A redirect would happen in the analyzer component's logic.
    // For this simplified version, the router push will be in the `/analyze` page.
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

  if (isLoggedIn) {
    return <HomePage />;
  }


  return (
    <div className="bg-background text-foreground">
      <FullscreenLoader visible={isAnalyzing} title="Analyzing Article..." />
      {/* Hero Section */}
      <section className="py-16 md:py-20 px-4 text-center">
        <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                    <div className="inline-block bg-primary/10 text-primary font-semibold px-4 py-1.5 rounded-full text-sm mb-4">
                      AI-Powered Analysis
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight mb-6">
                        Verify News <span className="text-primary">Credibility</span> with AI
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                        Analyze news articles for credibility, detect bias, and get AI-powered summaries. Make informed decisions with NewsLens.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                        <Button size="lg" onClick={handleTryNewsLens} className="w-full sm:w-auto">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Try NewsLens Free
                        </Button>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Watch Demo
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                       <span><CheckCircle className="inline-block mr-2 h-4 w-4 text-green-500" />Free to use</span>
                       <span><CheckCircle className="inline-block mr-2 h-4 w-4 text-green-500" />AI-powered analysis</span>
                       <span><CheckCircle className="inline-block mr-2 h-4 w-4 text-green-500" />Instant results</span>
                    </div>
                </div>

                <div className="bg-card p-4 sm:p-6 rounded-lg shadow-lg">
                   <CredibilityAnalyzer
                        onAnalysisStart={handleAnalysisStart}
                        onAnalysisComplete={handleAnalysisComplete}
                        onAnalysisError={handleAnalysisError}
                        isAnalyzing={isAnalyzing}
                    />
                </div>
            </div>
        </div>
      </section>

      {/* Powerful Features Section */}
      <section className="py-16 md:py-20 px-4 bg-secondary/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold font-headline mb-4">Powerful Features</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Everything you need to analyze media information for credibility and make informed decisions.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <FeatureCard icon={<LinkIcon className="text-primary"/>} title="URL Analysis" description="Simply paste a URL to get instant credibility analysis powered by our advanced AI algorithms." />
            <FeatureCard icon={<FileText className="text-primary"/>} title="Text Input" description="Copy or paste text directly for immediate analysis when a URL isn't available." />
            <FeatureCard icon={<Sparkles className="text-primary"/>} title="Credibility Analysis" description="AI-powered analysis of credibility based on multiple factors and data sources." />
            <FeatureCard icon={<BarChartBig className="text-primary"/>} title="Bias Detection" description="Identify overt and subtle political culture, or ideological bias in the text." />
            <FeatureCard icon={<Search className="text-primary"/>} title="Key Findings" description="Get a concise summary of key findings and important points from the analysis." />
            <FeatureCard icon={<CheckCircle className="text-primary"/>} title="Visual Ratings" description="Easy-to-understand visual representations of credibility and reliability levels." />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold font-headline mb-4">How NewsLens Works</h2>
          <p className="text-muted-foreground mb-12">Simple steps to verify news credibility</p>
          <div className="grid md:grid-cols-3 gap-12">
            <HowItWorksStep number={1} title="Input Article" description="Paste a URL or raw text into the analysis box." />
            <HowItWorksStep number={2} title="AI Analysis" description="Our AI analyzes credibility, bias, and sources." />
            <HowItWorksStep number={3} title="Get Results" description="Receive a detailed report with visual ratings and summaries." />
          </div>
        </div>
      </section>

      {/* Comprehensive Dashboard Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold font-headline mb-4">Comprehensive Dashboard</h2>
            <p className="text-muted-foreground mb-6">View your analysis history, manage saved articles, and access detailed reports all in one place.</p>
            <ul className="space-y-2">
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-primary mr-2" /> Complete analysis history</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-primary mr-2" /> Save and label articles</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-primary mr-2" /> Detailed analytics</li>
            </ul>
          </div>
          <div>
            <Image src="https://placehold.co/600x400.png" data-ai-hint="dashboard analytics" alt="NewsLens Dashboard" width={600} height={400} className="rounded-lg shadow-xl" />
          </div>
        </div>
      </section>

      {/* Developer API Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-900 text-slate-100">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold font-headline mb-4">Developer API</h2>
            <p className="text-slate-400 mb-6">Integrate NewsLens into your applications.</p>
            <p className="text-slate-400 mb-6">
                Access all of NewsLens’s functionality with our powerful and easy-to-use RESTful API.
            </p>
            <ul className="space-y-2 text-slate-300">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Easy integration</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Secure and reliable</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> High performance</li>
            </ul>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg font-mono text-sm shadow-lg overflow-x-auto">
            <pre>
              <code>
                <span className="text-slate-500">// Request</span><br/>
                <span className="text-purple-400">POST</span> <span className="text-green-400">/v1/analyze</span><br/>
                <span className="text-blue-400">Content-Type</span>: <span className="text-yellow-300">application/json</span><br/>
                <br/>
                &#123;<br/>
                &nbsp;&nbsp;<span className="text-blue-400">"url"</span>: <span className="text-yellow-300">"https://example.com/news-article"</span><br/>
                &#125;
              </code>
            </pre>
            <hr className="border-slate-700 my-4" />
            <pre>
              <code>
              <span className="text-slate-500">// Response</span><br/>
              &#123;<br/>
                &nbsp;&nbsp;<span className="text-blue-400">"credibilityScore"</span>: <span className="text-orange-400">8.5</span>,<br/>
                &nbsp;&nbsp;<span className="text-blue-400">"bias"</span>: <span className="text-yellow-300">"Low"</span>,<br/>
                &nbsp;&nbsp;<span className="text-blue-400">"summary"</span>: <span className="text-yellow-300">"..."</span><br/>
              &#125;
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-primary-foreground" style={{background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)'}}>
          <div className="container mx-auto text-center">
              <h2 className="text-4xl font-bold font-headline mb-4">Start Analyzing News Today</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of users who trust NewsLens for accurate news analysis. Get started for free, no credit card required.
              </p>
              <Button size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={handleTryNewsLens}>
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Get Started Free
              </Button>
          </div>
      </section>
    </div>
  );
}
