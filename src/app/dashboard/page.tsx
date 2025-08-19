
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import HomePage from '../home/page';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/signin');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  return <HomePage />;
}
