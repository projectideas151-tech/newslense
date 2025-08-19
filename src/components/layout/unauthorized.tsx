
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-background">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
            <CardDescription>You need to be signed in to access this page.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
                Please sign in to your account to continue. If you don't have an account, you can sign up for free.
            </p>
            <Button onClick={() => router.push('/signin')} className="w-full">
                Go to Sign In
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
