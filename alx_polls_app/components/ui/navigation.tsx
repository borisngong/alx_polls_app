"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, Home, Plus, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";

export function Navigation() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Polls App</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              <Home className="h-5 w-5 mr-2 inline" />
              Home
            </Link>
            <Link href="/polls" className="text-gray-700 hover:text-gray-900">
              <BarChart3 className="h-5 w-5 mr-2 inline" />
              Polls
            </Link>
            {user && (
              <Link href="/polls/create" className="text-gray-700 hover:text-gray-900">
                <Plus className="h-5 w-5 mr-2 inline" />
                Create Poll
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div>Loading...</div>
            ) : user ? (
              <>
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
