"use client"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export function ThemeToggle() {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}








// import React, { useState, useEffect } from "react";

// const SunIcon = () => (
//     <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
//         <circle cx="12" cy="12" r="5" />
//         <g>
//             <line x1="12" y1="1" x2="12" y2="3" />
//             <line x1="12" y1="21" x2="12" y2="23" />
//             <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
//             <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
//             <line x1="1" y1="12" x2="3" y2="12" />
//             <line x1="21" y1="12" x2="23" y2="12" />
//             <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
//             <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
//         </g>
//     </svg>
// );

// const MoonIcon = () => (
//     <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
//         <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
//     </svg>
// );

// const THEME_KEY = "theme";

// function getInitialTheme(): "light" | "dark" {
//     if (typeof window === "undefined") return "light";
//     const stored = localStorage.getItem(THEME_KEY);
//     if (stored === "dark" || stored === "light") return stored;
//     return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
// }

// export default function ThemeToggle() {
//     const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

//     useEffect(() => {
//         document.documentElement.classList.toggle("dark", theme === "dark");
//         localStorage.setItem(THEME_KEY, theme);
//     }, [theme]);

//     const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

//     return (
//         <button
//             onClick={toggleTheme}
//             aria-label="Toggle theme"
//             style={{
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 padding: 8,
//                 borderRadius: "50%",
//                 color: "inherit",
//             }}
//         >
//             {theme === "dark" ? <MoonIcon /> : <SunIcon />}
//         </button>
//     );
// }