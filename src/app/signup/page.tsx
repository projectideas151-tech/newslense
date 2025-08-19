
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <p className="text-muted-foreground mb-8">This is a placeholder page for the sign-up form.</p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
