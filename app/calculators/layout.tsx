import type { Metadata } from "next";



export const metadata: Metadata = {
metadataBase: new URL("https://concretecalculatormax.com"),
  title: {
    default: "Concrete Calculator Max",
    template: "%s — Concrete Calculator Max",
  },
  description:
    "Fast, accurate concrete volume, mix, weight, cost, and reinforcement calculators.",
  openGraph: {
    type: "website",
    siteName: "Concrete Calculator Mas",
    url: "https://concretecalculatormax.com",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@YourHandle", // optional
    creator: "@YourHandle", // optional
    images: ["/og/default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-1">
        <main className="flex-1 overflow-auto p-6 bg-background">                
            <div className="min-h-screen bg-background">        
            
                {children}
                
            </div>  
        </main>
        <div
          className="hidden lg:block w-80 bg-teal-400 dark:bg-background border-1 border-border dark:border-slate-800"
          style={{
            position: "sticky",
            top: "64px",
            height: "calc(-4rem + 100vh)",
          }}
        >
            {/* Sidebar content can go here */}
            <div className="h-full w-full">

            </div>
        </div>

    </div>
  );
}
