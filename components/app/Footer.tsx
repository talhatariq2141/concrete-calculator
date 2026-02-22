import React from "react";
import Link from "next/link";

type FooterProps = {
  /** Use "light" in blog layouts; defaults to "dark" elsewhere */
  variant?: "dark" | "light";
  className?: string;
};

export const Footer: React.FC<FooterProps> = ({ variant = "dark", className }) => {
  const isLight = variant === "light";

  const wrapper =
    (isLight
      ? "border-slate-200 bg-white"
      : "border-slate-800 bg-[#0e1013]") +
    " border-t py-8 px-4 sm:px-6 lg:px-8 " +
    (className ?? "");

  const textPrimary = isLight ? "text-slate-600" : "text-slate-400";
  const textLinks = isLight ? "text-slate-600" : "text-slate-500";
  const linkHover = isLight ? "hover:text-teal-700" : "hover:text-teal-400";

  return (
    <footer className={wrapper}>
      <div className="max-w-7xl mx-auto text-center">
        <p className={`${textPrimary} mb-4`}>
          &copy; {new Date().getFullYear()} Concrete Calculator Max. All rights reserved.
        </p>
        <div className={`flex justify-center gap-6 text-sm ${textLinks}`}>
          <Link href="/privacy-policy" className={`transition-colors ${linkHover}`}>
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className={`transition-colors ${linkHover}`}>
            Terms of Service
          </Link>
          <Link href="/disclaimer" className={`transition-colors ${linkHover}`}>
            Disclaimer
          </Link>
          <Link href="/about-us" className={`transition-colors ${linkHover}`}>
            About Us
          </Link>
        </div>
      </div>
    </footer>
  );
};
