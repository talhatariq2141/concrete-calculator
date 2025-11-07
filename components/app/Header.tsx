'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calculator, House, LayoutGrid, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type HeaderProps = {
  /** Use "light" for the blog layouts; defaults to "dark" for the site */
  variant?: 'dark' | 'light';
};

export function Header({ variant = 'dark' }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '/';
  const isLight = variant === 'light';

  // Accent colors (kept brand-consistent)
  const accentActive = isLight ? 'text-green-600' : 'text-green-400';
  const accentHover  = isLight ? 'hover:text-green-600' : 'hover:text-green-400';

  return (
    <header
      className={[
        'w-full border-b',
        isLight
          ? 'border-slate-200 bg-white text-slate-800'
          : 'border-slate-700 bg-background text-foreground',
      ].join(' ')}
    >
      <div className="flex h-16 items-center justify-between px-2 sm:px-6 w-full">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className={['h-6 w-6', isLight ? 'text-green-600' : 'text-primary'].join(' ')} />
            <span className={['font-bold text-sm sm:text-xl ml-1', isLight ? 'text-slate-900 font-sans font-bold' : ''].join(' ')}>
              Concrete Calculator
            </span>
            <span
              className={[
                'ml-1 px-1 py-1 text-[10px] sm:text-xs font-poppins border rounded-sm',
                isLight
                  ? 'text-slate-950 bg-green-100 border-green-500'
                  : 'text-green-400 bg-[#252525] border-green-400/30',
              ].join(' ')}
            >
              MAX
            </span>
          </Link>
        </div>

        {/* Nav + Mobile trigger */}
        <div className="flex gap-2">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 ml-5 font-poppins">
            <Link
              href="/"
              className={[
                'flex items-center gap-2',
                pathname === '/' ? accentActive : isLight ? 'text-slate-700' : 'text-foreground',
                accentHover,
                'active:text-green-600',
              ].join(' ')}
            >
              <House className="h-4 w-4" />
              <span className="text-sm">Home</span>
            </Link>

            <Link
              href="/calculators"
              className={[
                'flex items-center gap-2',
                pathname.startsWith('/calculators') ? accentActive : isLight ? 'text-slate-700' : 'text-foreground',
                accentHover,
                'active:text-green-600',
              ].join(' ')}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="text-sm">All Calculators</span>
            </Link>
            
            <Link
                href="/blog"
                onClick={() => setOpen(false)}
                className={[
                   'flex items-center gap-2',
                     pathname.startsWith('/blog') ? accentActive : isLight ? 'text-slate-700' : 'text-foreground',
                    accentHover,
                    'active:text-green-600',
                  ].join(' ')}
            >
                <LayoutGrid className="h-4 w-4" />
                <span className="text-sm">Blog</span>
            </Link>

          </nav>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={
                  isLight
                    ? 'text-slate-700 hover:text-green-700 hover:bg-slate-100'
                    : 'text-white hover:text-teal-400 hover:bg-slate-800'
                }
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className={isLight ? 'bg-white border-slate-200' : 'bg-background border-slate-800'}
            >
              <div className="pl-6 mt-8">
                <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <Calculator className={['h-6 w-6', isLight ? 'text-green-600' : 'text-green-400'].join(' ')} />
                  <span className={['text-lg font-bold', isLight ? 'text-slate-900' : 'text-white'].join(' ')}>
                    Concrete Calculator
                  </span>
                </Link>
              </div>

              <div className="flex flex-col mt-6 ml-10">
                <nav className="md:flex items-center gap-10 ml-3 font-poppins">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className={[
                      'flex items-center gap-2',
                      pathname === '/' ? accentActive : isLight ? 'text-slate-700' : 'text-foreground',
                      accentHover,
                    ].join(' ')}
                  >
                    <House className="h-4 w-4" />
                    <span className="text-sm">Home</span>
                  </Link>

                  <Link
                    href="/calculators"
                    onClick={() => setOpen(false)}
                    className={[
                      'flex items-center gap-2 mt-6',
                      pathname.startsWith('/calculators') ? accentActive : isLight ? 'text-slate-700' : 'text-foreground',
                      accentHover,
                    ].join(' ')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="text-sm">All Calculators</span>
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setOpen(false)}
                    className={[
                      'flex items-center gap-2 mt-6',
                      pathname.startsWith('/blog') ? accentActive : isLight ? 'text-slate-700' : 'text-foreground',
                      accentHover,
                    ].join(' ')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="text-sm">Blog</span>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
