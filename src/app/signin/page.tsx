
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { BarChartBig, FileText, Loader2, Lock, Newspaper, Scale, ShieldCheck } from 'lucide-react';
import { SVGProps, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.94 11.04c0-.8-.07-1.57-.2-2.34H12v4.45h5.02c-.22 1.44-1.24 3.06-3.23 4.32v2.85h3.66c2.14-1.98 3.38-4.88 3.38-8.28z"/>
    <path d="M12 21c3.1 0 5.68-1.04 7.57-2.85l-3.66-2.85c-1.03.7-2.36 1.1-3.91 1.1-3.02 0-5.57-2.03-6.48-4.75H2.03v2.9C3.86 18.25 7.63 21 12 21z"/>
    <path d="M5.52 14.25c-.24-.7-.38-1.45-.38-2.25s.14-1.55.38-2.25V6.86H2.03C.78 9.2.01 12 .01 12s.77 2.8 2.02 5.14l3.49-2.89z"/>
  </svg>
)

const MicrosoftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11.4 21.9H3.9V14.4H11.4V21.9Z" fill="#F25022"/>
      <path d="M21.9 21.9H14.4V14.4H21.9V21.9Z" fill="#7FBA00"/>
      <path d="M11.4 11.4H3.9V3.9H11.4V11.4Z" fill="#00A4EF"/>
      <path d="M21.9 11.4H14.4V3.9H21.9V11.4Z" fill="#FFB900"/>
  </svg>
)

const LinkedInIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
  </svg>
)

const Feature = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-start gap-3">
        <div className="p-1.5 bg-primary/10 text-primary rounded-lg">{icon}</div>
        <div>
            <h4 className="font-semibold text-sm">{title}</h4>
        </div>
    </div>
)


export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        if (email === 'test@gmail.com' && password === 'Kolkata@1') {
            login();
            toast({
                title: 'Signed in successfully!',
                description: 'Welcome back to NewsLens.',
            });
            router.push('/dashboard');
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid Credentials',
                description: 'Please check your email and password.',
            });
            setIsLoading(false);
        }
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Newspaper className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome to NewsLens</CardTitle>
            <CardDescription>
              Sign in to start analyzing news credibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                  <Button variant="outline" className="w-full h-11" type="button">
                      <GoogleIcon className="mr-2 h-5 w-5" />
                      Continue with Google
                  </Button>
                  <Button variant="outline" className="w-full h-11" type="button">
                      <MicrosoftIcon className="mr-2 h-5 w-5" />
                      Continue with Microsoft
                  </Button>
                  <Button variant="outline" className="w-full h-11" type="button">
                      <LinkedInIcon className="mr-2 h-5 w-5" />
                      Continue with LinkedIn
                  </Button>
              </div>
              
              <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                  </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    placeholder="Enter your email" 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    placeholder="Enter your password" 
                    required 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                      <Checkbox id="remember-me" disabled={isLoading} />
                      <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
                  </div>
                  <Link className="text-sm text-primary hover:underline" href="#">
                    Forgot password?
                  </Link>
                </div>
                <Button className="w-full h-11 text-base" type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                </Button>
                <div className="text-center text-sm">
                  Don't have an account?{' '}
                  <Link className="font-medium text-primary hover:underline" href="/signup">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-xl">
            <CardHeader>
                <CardTitle className="text-base">What you'll get with NewsLens</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Feature icon={<ShieldCheck size={20}/>} title="Credibility Analysis" />
                    <Feature icon={<Scale size={20}/>} title="Bias Detection" />
                    <Feature icon={<FileText size={20}/>} title="AI Summaries" />
                    <Feature icon={<BarChartBig size={20}/>} title="Visual Insights" />
                </div>
            </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Lock size={14} />
            Your data is secure and encrypted. We never share your information.
        </p>
      </div>
    </div>
  );
}
