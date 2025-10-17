'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calculator, House, LayoutGrid, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // const isHomePage = pathname === '/';


  return (
    <header className="w-full border-b border-slate-700 bg-background text-foreground">
      <div className="flex h-16 items-center justify-between px-2 sm:px-6 w-full">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="font-bold text-sm sm:text-xl ml-1">Concrete Calculator</span>
            <span className='ml-1 px-1 py-1 text-[10px] sm:text-xs font-poppins text-green-400 bg-[#252525] border border-green-400/30 rounded-sm'>MAX</span>
          </Link>          
        </div>
        <div className='flex gap-2'>
          <nav className="hidden md:flex items-center gap-6 ml-5 font-poppins">
            
            <Link
              href="/"
              className={`flex items-center gap-2 ${pathname === '/' ? 'text-green-400' : 'text-foreground'} active:text-green-400 hover:text-green-400`}
            >
              <House className="h-4 w-4" />
              <span className="text-sm">Home</span>
            </Link>

            <Link
              href="/calculators"
              className={`flex items-center gap-2 ${pathname === '/Calculators' ? 'text-green-400' : 'text-foreground'} active:text-green-400 hover:text-green-400`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="text-sm">All Calculators</span>
            </Link>

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
            
            <SheetContent side="left" className="bg-background border-slate-800">
              <div className="pl-6 mt-8">
                <Link href="/" className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-green-400" />
                  <span className="text-lg font-bold text-white">Concrete Calculator</span>
                </Link>
              </div>
              <div className="flex flex-col mt-6 ml-10">
                <nav className="md:flex items-center gap-10 ml-3 font-poppins">            
                    <Link
                      href="/"
                      className={`flex items-center gap-2 ${pathname === '/' ? 'text-primary' : 'text-foreground'} active:text-priamary hover:text-primary`}
                    >
                      <House className="h-4 w-4" />
                      <span className="text-sm">Home</span>
                    </Link>

                    <Link
                      href="/Calculators"
                      className={`flex items-center mt-6 gap-2 ${pathname === '/Calculators' ? 'text-primary' : 'text-foreground'} active:text-primary hover:text-primary`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span className="text-sm">All Calculators</span>
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
