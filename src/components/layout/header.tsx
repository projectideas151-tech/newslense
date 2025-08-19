
'use client';

import { Newspaper, PanelLeft, LogOut, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { isLoggedIn, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
        title: 'Signed out successfully.',
    });
    handleLinkClick();
  }

  const unauthenticatedLinks = [
    { href: "/analyze", label: "Analyze" },
    { href: "/discover", label: "Discover" },
    { href: "/about", label: "About" },
  ];

  const authenticatedLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/discover", label: "Discover" },
    { href: "/about", label: "About" },
  ];

  const navLinks = isLoggedIn ? authenticatedLinks : unauthenticatedLinks;

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2">
            <Newspaper className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold font-headline tracking-tight">
              NewsLens
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
             <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">{link.label}</Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                 <SheetHeader>
                   <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 mb-8" onClick={handleLinkClick}>
                      <Newspaper className="h-7 w-7 text-primary" />
                      <span className="text-2xl font-bold font-headline tracking-tight">
                        NewsLens
                      </span>
                    </Link>
                </SheetHeader>
                <nav className="grid gap-4 text-lg font-medium">
                   {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                      onClick={handleLinkClick}
                    >
                      {link.label}
                    </Link>
                  ))}
                   {isLoggedIn ? (
                     <Button variant="outline" onClick={handleLogout} className="mt-4">
                       <LogOut className="mr-2 h-4 w-4"/>
                       Sign Out
                     </Button>
                  ) : (
                    <div className="grid gap-4 mt-4">
                      <Button asChild onClick={handleLinkClick}>
                        <Link href="/signin"><LogIn className="mr-2 h-4 w-4" /> Sign In</Link>
                      </Button>
                      <Button asChild variant="outline" onClick={handleLinkClick}>
                        <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" /> Get Started</Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4"/>
                Sign Out
              </Button>
              <ThemeToggle />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
