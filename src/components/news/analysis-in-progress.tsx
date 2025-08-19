
'use client';

import { useState, useEffect } from 'react';
import { Eye, FileDown, Circle, Scale, Search, Check, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const analysisSteps = [
    { name: 'Pre-Processing', description: 'Fetching and structuring article content...', icon: FileDown },
    { name: 'Credibility Scan', description: 'Evaluating source reliability and fact density...', icon: Circle },
    { name: 'Bias Detection', description: 'Analyzing language patterns for ideological bias...', icon: Scale },
    { name: 'Perspective Mapping', description: 'Comparing coverage across diverse outlets...', icon: Search },
    { name: 'Finalizing', description: 'Preparing dashboard insights...', icon: CheckCircle },
];

const Step = ({ step, isActive, isCompleted }: { step: typeof analysisSteps[0], isActive: boolean, isCompleted: boolean }) => {
    const Icon = step.icon;

    return (
        <div className="flex items-start gap-4">
            <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                isCompleted ? 'bg-primary' : isActive ? 'bg-primary/20 animate-pulse' : 'bg-muted',
            )}>
               <Icon className={cn(
                   "h-5 w-5",
                   isCompleted ? 'text-primary-foreground' : isActive ? 'text-primary' : 'text-muted-foreground',
               )}/>
            </div>
            <div>
                <p className={cn(
                    "font-semibold transition-colors",
                    isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground',
                )}>{step.name}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
        </div>
    );
};

export function AnalysisInProgress() {
    const [progress, setProgress] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const totalDuration = 8000; // 8 seconds total
        const intervalTime = totalDuration / 100;
        const stepDuration = totalDuration / analysisSteps.length;
        
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 1;
                if (newProgress >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return newProgress;
            });
        }, intervalTime);

        const stepInterval = setInterval(() => {
            setActiveStep(prev => {
                if(prev >= analysisSteps.length -1) {
                    clearInterval(stepInterval);
                    return prev;
                }
                return prev + 1;
            })
        }, stepDuration);
        
        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, []);

    return (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl">
                <CardContent className="p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-6">
                        <Eye className="h-8 w-8 text-primary-foreground" />
                    </div>

                    <h2 className="text-2xl font-bold font-headline mb-2">Analyzing Article</h2>
                    <p className="text-muted-foreground mb-8">
                        AI-powered credibility and bias assessment in progress
                    </p>

                    <div className="space-y-6 text-left mb-8">
                        {analysisSteps.map((step, index) => (
                           <Step 
                            key={step.name} 
                            step={step} 
                            isActive={index === activeStep}
                            isCompleted={index < activeStep}
                           />
                        ))}
                    </div>

                    <Progress value={progress} className="h-2" />
                </CardContent>
            </Card>
        </div>
    );
}
