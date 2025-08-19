
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { AnalysisResult, HistoryItem } from '@/lib/types';
import { CredibilityAnalyzer } from '@/components/news/credibility-analyzer';
import { CredibilityReport } from '@/components/news/credibility-report';
import { AnalysisInProgress } from '@/components/news/analysis-in-progress';
import { FullscreenLoader } from '@/components/ui/loader';
import { runAnalysis } from '@/app/actions';
import { useAuth } from '@/hooks/use-auth';
import Unauthorized from '@/components/layout/unauthorized';

function AnalyzeContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysisInput, setCurrentAnalysisInput] = useState<{type: 'url' | 'text', value: string} | null>(null);
  
  const urlToAnalyze = searchParams.get('url');

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const textToAnalyze = sessionStorage.getItem('analysisText');
    sessionStorage.removeItem('analysisText'); // Clear it after reading

    const input = urlToAnalyze ? { type: 'url' as const, value: urlToAnalyze } : textToAnalyze ? { type: 'text' as const, value: textToAnalyze } : null;

    if (input) {
      if (analysisResult || isAnalyzing) return; // Prevent re-running analysis
      
      const startAnalysis = async (type: 'url' | 'text', value: string) => {
        handleAnalysisStart();
        setCurrentAnalysisInput({ type, value });
        try {
          const result = await runAnalysis(type, value);
          handleAnalysisComplete(result, { type, value });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
          handleAnalysisError(errorMessage);
        }
      };

      startAnalysis(input.type, input.value);
    }
  }, [urlToAnalyze, isLoggedIn]);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
  };

  const handleAnalysisComplete = (result: AnalysisResult, source: { type: 'url' | 'text', value: string }) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);

    // Save to history
    try {
        const history: HistoryItem[] = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
        const newHistoryItem: HistoryItem = {
            id: new Date().toISOString(),
            source: source,
            result: result,
            timestamp: new Date().toISOString(),
            title: source.type === 'url' ? source.value : result.articleSummary.substring(0, 50) + '...',
        };

        const updatedHistory = [newHistoryItem, ...history];
        localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));

    } catch (error) {
        console.error("Failed to save to history:", error);
    }
  };

  const handleAnalysisError = (error: string) => {
    setIsAnalyzing(false);
    toast({
      variant: 'destructive',
      title: 'Analysis Error',
      description: error,
    });
    router.replace('/analyze');
  };

  const handleNewAnalysisFromReport = () => {
    setAnalysisResult(null);
    setCurrentAnalysisInput(null);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('url');
    router.replace(newUrl.toString());
  }

  if (!isLoggedIn) {
      return <Unauthorized />;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {isAnalyzing && !analysisResult && <AnalysisInProgress />}
        {analysisResult && <CredibilityReport result={analysisResult} onNewAnalysis={handleNewAnalysisFromReport} />}
        {!analysisResult && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <CredibilityAnalyzer
                    onAnalysisStart={handleAnalysisStart}
                    onAnalysisComplete={(result) => handleAnalysisComplete(result, currentAnalysisInput!)}
                    onAnalysisError={handleAnalysisError}
                    isAnalyzing={isAnalyzing}
                />
            </div>
        )}
      </div>
    </>
  );
}


export default function AnalyzePage() {
    return (
        <Suspense fallback={<FullscreenLoader visible={true} title="Loading Page..." />}>
            <AnalyzeContent />
        </Suspense>
    )
}
