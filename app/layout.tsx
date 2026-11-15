import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Liwa Oasis RV Camp",
  description: "Staff Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen text-gray-900`}>
        {/* Top Navigation Bar */}
        <nav className="bg-green-800 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 font-bold text-xl tracking-wider">
                  LIWA OASIS RV CAMP
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link href="/" className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Quick Check
                    </Link>
                    <Link href="/today" className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Today
                    </Link>
                    <Link href="/new-booking" className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      New Booking
                    </Link>
                    <Link href="/guests" className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Guests
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}