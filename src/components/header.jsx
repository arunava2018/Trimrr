import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LinkIcon } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/useFetch";
import { BarLoader } from "react-spinners";
import { signout } from "@/db/apiAuth";

const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();
  const { loading, fn: fnLogOut } = useFetch(signout);

  return (
    <>
      <nav className="py-4 px-6 flex justify-between items-center max-w-7xl mx-auto">
        {/* Brand Logo (Text only) */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-red-600 hover:text-red-700 transition-colors duration-200"
        >
          Trimrr
        </Link>

        {/* Right Side */}
        <div>
          {!user ? (
            <Button
              onClick={() => navigate("/auth")}
              className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md 
               hover:bg-red-700 hover:scale-105 transition-all duration-200 ease-in-out"
            >
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-600">
                  <Avatar>
                    <AvatarImage
                      src={user?.user_metadata?.profile_pic}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user?.user_metadata?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="font-semibold">
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={loading}
                  onClick={() => {
                    fnLogOut().then(() => {
                      fetchUser();
                      navigate("/");
                    });
                  }}
                  className="text-red-600 cursor-pointer"
                >
                  {loading ? (
                    <BarLoader width={60} color="#e11d48" />
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4 text-red-600" />
                      <span>Log out</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>

      {/* Top Loading Bar */}
      {loading && (
        <div className="fixed top-0 left-0 w-full z-50">
          <BarLoader width="100%" color="#e11d48" height={3} />
        </div>
      )}
    </>
  );
};

export default Header;
