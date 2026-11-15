import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Liwa Oasis RV Camp",
  description: "Staff Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  
  // Create a server-side Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // If the user is NOT logged in, don't show the green navigation bar
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen text-gray-900`}>
        {session && (
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
                <div>
                  <form action="/auth/signout" method="post">
                    <button className="text-sm bg-green-900 hover:bg-green-950 px-3 py-1 rounded border border-green-700">
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </nav>
        )}

        <main className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${!session ? 'flex items-center justify-center min-h-screen' : ''}`}>
          {children}
        </main>
      </body>
    </html>
  );
}