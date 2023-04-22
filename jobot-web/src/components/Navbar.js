import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function Navbar() {
  const user = useUser();

  return (
    <nav className="shadow px-4 py-2 flex flex-row justify-between items-center">
      <div className="text-xl font-bold">Jobot</div>
      <div>
        {user === null && (
          <Link
            href="/login"
            className="text-gray-500 hover:text-blue-500 text-sm"
          >
            Log In
          </Link>
        )}
        {user && (
          <Link
            href="/logout"
            className="text-gray-500 hover:text-blue-500 text-sm"
          >
            Log Out
          </Link>
        )}
      </div>
    </nav>
  );
}