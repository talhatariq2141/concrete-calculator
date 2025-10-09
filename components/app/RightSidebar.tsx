// import Link from "next/link";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RightSidebarCalculatorsWidget from "./RightSidebarCalculatorWidget";

export default function RightSidebar() {
  return (
    <aside className=" top-24 h-fit w-full space-y-6">
      
      <RightSidebarCalculatorsWidget />
      
      
      
      
      {/* <Card className="p-5">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-sm font-semibold text-[var(--brand-primary)]">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-[var(--brand-accent)] hover:underline">Home</Link>
            </li>
            <li>
              <Link href="/about" className="text-[var(--brand-accent)] hover:underline">About Us</Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="text-[var(--brand-accent)] hover:underline">Privacy Policy</Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="p-5">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-sm font-semibold text-[var(--brand-primary)]">Need a Concrete Calculator?</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="mb-3 text-sm text-[var(--brand-subtle)]">
            Our calculator helps you estimate volume, cost, and bag counts with precision.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Try it (Coming Soon)
          </a>
        </CardContent>
      </Card>

      <Card className="border-dashed p-5">
        <CardHeader className="p-0">
          <span className="inline-block rounded-full bg-[var(--brand-teal)]/10 px-3 py-1 text-xs font-medium text-[var(--brand-teal)]">
            Pro Tip
          </span>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          <p className="text-sm text-[var(--brand-subtle)]">
            Measure twice, pour once: accurate dimensions save cost and time.
          </p>
        </CardContent>
      </Card> */}
    </aside>
  );
}
