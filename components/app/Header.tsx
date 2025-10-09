'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calculator, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById('calculator-section');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-teal-400" />
            <span className="text-xl font-bold text-white">Concrete Calculator</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-teal-400 ${
                  pathname === link.href ? 'text-teal-400' : 'text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isHomePage && (
              <Button
                onClick={scrollToCalculator}
                className="bg-teal-400 text-slate-900 hover:bg-teal-500"
              >
                Start Calculating
              </Button>
            )}
          </nav>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-teal-400 hover:bg-slate-800"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="bg-slate-900 border-slate-800">
              <div className="pl-6 mt-8">
                <Link href="/" className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-teal-400" />
                  <span className="text-lg font-bold text-white">Concrete Calculator</span>
                </Link>
              </div>
              <div className="flex flex-col gap-6 mt-6 ml-10">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-teal-400 ${
                      pathname === link.href ? 'text-teal-400' : 'text-slate-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isHomePage && (
                  <Button
                    onClick={() => {
                      scrollToCalculator();
                      setOpen(false);
                    }}
                    className="bg-teal-400 text-slate-900 hover:bg-teal-500 max-w-3xs"
                  >
                    Start Calculating
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
