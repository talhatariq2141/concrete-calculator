import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-background py-8 px-4 sm:px-6 lg:px-8 border-t border-border/60 transition-colors">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Concrete Calculator Max. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <a href="/privacy-policy" className="transition-colors hover:text-primary">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="transition-colors hover:text-primary">
            Terms of Service
          </a>
          <a href="/about-us" className="transition-colors hover:text-primary">
            About Us
          </a>
        </div>
      </div>
    </footer>
  );
};
