'use client';

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
              Contact Form
            </h1>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                {session.user?.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profile"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {session.user?.name?.[0] || session.user?.email?.[0] || "?"}
                    </span>
                  </div>
                )}
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">
                    {session.user?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {session.user?.email}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => signOut()}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all transform hover:scale-[1.02]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 