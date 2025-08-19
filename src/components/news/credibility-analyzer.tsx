
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Link, FileText, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { runAnalysis } from '@/app/actions';
import type { AnalysisResult } from '@/lib/types';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  inputType: z.enum(['url', 'text']),
  inputValue: z.string().min(1, { message: 'Please enter a value.' }),
}).refine(data => {
  if (data.inputType === 'url') {
    try {
      new URL(data.inputValue);
      return true;
    } catch {
      return false;
    }
  }
  if (data.inputType === 'text') {
    return data.inputValue.length >= 100;
  }
  return false;
}, {
  message: (data) => {
    if (data.inputType === 'url') return 'Please enter a valid URL.';
    if (data.inputType === 'text') return 'Article content must be at least 100 characters.';
    return 'Invalid input.';
  },
  path: ['inputValue'],
});


type CredibilityAnalyzerProps = {
  onAnalysisStart: () => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onAnalysisError: (error: string) => void;
  isAnalyzing: boolean;
  initialUrl?: string;
};

export function CredibilityAnalyzer({
  onAnalysisStart,
  onAnalysisComplete,
  onAnalysisError,
  isAnalyzing,
  initialUrl = '',
}: CredibilityAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>(initialUrl ? 'url' : 'url');
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      inputType: initialUrl ? 'url' : 'url',
      inputValue: initialUrl,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.inputType === 'url') {
        router.push(`/analyze?url=${encodeURIComponent(data.inputValue)}`);
    } else {
        // For text, we can't pass it all via URL.
        // A better approach is to store it in session storage and retrieve it on the analyze page.
        sessionStorage.setItem('analysisText', data.inputValue);
        router.push('/analyze');
    }
  }

  const handleTabChange = (value: string) => {
    const newTab = value as 'url' | 'text';
    setActiveTab(newTab);
    form.setValue('inputType', newTab);
    form.reset({ inputType: newTab, inputValue: '' });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-2xl border bg-card">
      <CardHeader>
        <CardTitle className="text-center font-headline text-2xl">Analyze News Article</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url"><Link className="mr-2 h-4 w-4" /> URL</TabsTrigger>
                  <TabsTrigger value="text"><FileText className="mr-2 h-4 w-4" /> Text</TabsTrigger>
              </TabsList>
                <div className="p-2">
                  <FormField
                    control={form.control}
                    name="inputValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div>
                            <TabsContent value="url" className="m-0">
                              <Input 
                                {...field}
                                placeholder="Enter news article URL..." 
                                className="text-base h-12"
                              />
                            </TabsContent>
                            <TabsContent value="text" className="m-0">
                              <Textarea
                                {...field}
                                placeholder="Paste the full content of the news article here..."
                                className="min-h-[150px] resize-y text-base"
                              />
                            </TabsContent>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
            </Tabs>
             <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                </>
              ) : (
                <>
                    <Search className="mr-2 h-5 w-5" />
                    Analyze Article
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
