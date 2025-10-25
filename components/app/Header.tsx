"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Calculator, House, LayoutGrid, Menu, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/app/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // const isHomePage = pathname === '/';


  return (
    <header className="w-full border-b border-border/60 bg-background/90 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          <span className="ml-1 text-sm font-bold sm:text-xl">Concrete Calculator</span>
          <span className="ml-1 rounded-sm border border-primary/30 bg-primary/10 px-1 py-0.5 text-[10px] font-poppins uppercase tracking-wide text-primary sm:text-xs">
            Max
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-6 font-poppins md:flex">
            <Link
              href="/"
              className={`flex items-center gap-2 text-sm transition-colors ${pathname === "/" ? "text-primary" : "text-foreground hover:text-primary"}`}
            >
              <House className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/calculators"
              className={`flex items-center gap-2 text-sm transition-colors ${pathname === "/calculators" ? "text-primary" : "text-foreground hover:text-primary"}`}
            >
              <LayoutGrid className="h-4 w-4" />
              All Calculators
            </Link>
            <Link
              href="/light"
              className={`flex items-center gap-2 text-sm transition-colors ${pathname === "/light" ? "text-primary" : "text-foreground hover:text-primary"}`}
            >
              <Sun className="h-4 w-4" />
              Light Home
            </Link>
          </nav>

          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="bg-background">
              <div className="mt-8 pl-2">
                <Link href="/" className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold">Concrete Calculator</span>
                </Link>
              </div>
              <div className="mt-6 flex flex-col gap-4 pl-2 font-poppins">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 text-sm transition-colors ${pathname === "/" ? "text-primary" : "text-foreground hover:text-primary"}`}
                >
                  <House className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  href="/calculators"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 text-sm transition-colors ${pathname === "/calculators" ? "text-primary" : "text-foreground hover:text-primary"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  All Calculators
                </Link>
                <Link
                  href="/light"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 text-sm transition-colors ${pathname === "/light" ? "text-primary" : "text-foreground hover:text-primary"}`}
                >
                  <Sun className="h-4 w-4" />
                  Light Home
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
