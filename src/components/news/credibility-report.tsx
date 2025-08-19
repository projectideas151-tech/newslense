
import type { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Scale, Quote, Newspaper, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CredibilityReportProps = {
  result: AnalysisResult;
  onNewAnalysis: () => void;
};

const getScoreColor = (score: number) => {
  if (score >= 8) return "text-green-500";
  if (score >= 6) return "text-yellow-500";
  if (score >= 4) return "text-orange-500";
  return "text-red-500";
};

const getCredibilityLabel = (score: number) => {
  if (score >= 8) return "High Credibility";
  if (score >= 6) return "Moderate Credibility";
  if (score >= 4) return "Low-to-Moderate Credibility";
  return "Low Credibility";
};

const factorIcons: { [key: string]: React.ElementType } = {
  bias: Scale,
  citations: Quote,
  facts: CheckCircle,
  source: Newspaper,
};

const QuickIndicator = ({ title, value, level }: { title: string; value: "Yes" | "Partial" | "No" | "Low" | "Medium" | "High" | "Good" | "Fair" | "Poor" | "High" | "Moderate" | "Low", level: 'good' | 'medium' | 'bad' }) => {
  const levelClasses = {
    good: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
    bad: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  }
  return (
    <div className={`flex justify-between items-center p-3 rounded-lg border ${levelClasses[level]}`}>
      <span className="font-medium">{title}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

export function CredibilityReport({ result, onNewAnalysis }: CredibilityReportProps) {
  const router = useRouter();
  const { overallCredibilityScore, articleSummary, bias, citations, facts, source, quickIndicators } = result;

  const credibilityFactors = [
    { title: 'Bias', ...bias },
    { title: 'Citations', ...citations },
    { title: 'Facts', ...facts },
    { title: 'Source Reliability', ...source },
  ];
  
  const getIndicatorLevel = (indicator: keyof typeof quickIndicators): 'good' | 'medium' | 'bad' => {
    switch (indicator) {
        case 'verifiedSources':
            return quickIndicators[indicator] === 'Yes' ? 'good' : quickIndicators[indicator] === 'Partial' ? 'medium' : 'bad';
        case 'biasLevel':
            return quickIndicators[indicator] === 'Low' ? 'good' : quickIndicators[indicator] === 'Medium' ? 'medium' : 'bad';
        case 'factAccuracy':
            return quickIndicators[indicator] === 'Good' ? 'good' : quickIndicators[indicator] === 'Fair' ? 'medium' : 'bad';
        case 'sourceQuality':
            return quickIndicators[indicator] === 'High' ? 'good' : quickIndicators[indicator] === 'Moderate' ? 'medium' : 'bad';
        default:
            return 'medium';
    }
  }
  
  const handleGoHome = () => {
    router.push('/');
  }

  return (
    <div className="space-y-8 p-0 sm:p-4 md:p-8 rounded-lg bg-secondary/50">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
           <Button onClick={handleGoHome} variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold font-headline">Credibility Report</h1>
          <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button onClick={onNewAnalysis} size="lg">Start New Analysis</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Article Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{articleSummary}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Credibility Factors</CardTitle>
              <CardDescription>Detailed breakdown of the credibility score.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue="Bias">
                {credibilityFactors.map((factor) => {
                  const FactorIcon = factorIcons[factor.title.toLowerCase().split(' ')[0] as keyof typeof factorIcons];
                  return (
                    <AccordionItem value={factor.title} key={factor.title}>
                      <AccordionTrigger className="hover:no-underline text-left">
                        <div className="flex items-center gap-3 w-full">
                          <div className={`p-2 rounded-md bg-muted ${getScoreColor(factor.score)} bg-opacity-10`}>
                            <FactorIcon className={`h-5 w-5 ${getScoreColor(factor.score)}`} />
                          </div>
                          <span className="font-semibold text-base sm:text-lg">{factor.title}</span>
                          <div className="ml-auto flex items-center gap-2 sm:gap-4">
                             <Progress value={factor.score * 10} className="w-16 sm:w-24 h-2" />
                             <Badge variant="outline" className={`ml-auto ${getScoreColor(factor.score)} border-current text-sm sm:text-base`}>{factor.score}/10</Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-14 pt-2">
                        <p className="text-muted-foreground">{factor.summary}</p>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="text-center shadow-md">
            <CardHeader>
              <CardTitle>Overall Credibility</CardTitle>
              <CardDescription className={`${getScoreColor(overallCredibilityScore)} font-semibold`}>{getCredibilityLabel(overallCredibilityScore)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-40 w-40 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-muted"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className={getScoreColor(overallCredibilityScore)}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={`${overallCredibilityScore * 10}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-5xl font-bold ${getScoreColor(overallCredibilityScore)}`}>{overallCredibilityScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Quick Indicators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <QuickIndicator title="Verified Sources" value={quickIndicators.verifiedSources} level={getIndicatorLevel('verifiedSources')} />
                <QuickIndicator title="Bias Level" value={quickIndicators.biasLevel} level={getIndicatorLevel('biasLevel')} />
                <QuickIndicator title="Fact Accuracy" value={quickIndicators.factAccuracy} level={getIndicatorLevel('factAccuracy')} />
                <QuickIndicator title="Source Quality" value={quickIndicators.sourceQuality} level={getIndicatorLevel('sourceQuality')} />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button size="lg">Export as PDF</Button>
              <Button size="lg" variant="secondary">Share Analysis</Button>
              <Button size="lg" variant="outline">Save to Dashboard</Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
