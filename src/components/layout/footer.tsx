import { Newspaper, Twitter, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold font-headline tracking-tight text-foreground">
                  NewsLens
                </h1>
              </div>
              <p className="text-sm">
                AI-powered news credibility and bias analysis platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">API</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter /></Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground"><Linkedin /></Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground"><Instagram /></Link>
              </div>
            </div>

        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} NewsLens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
