/**
 * v0 by Vercel.
 * @see https://v0.dev/t/plBYy1Gcqzx
 */
import Link from "next/link";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./button";
import Drawer from "./drawer";

export function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-start">
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <Button
        onClickHandler={
          sessionData ? () => void signOut() : () => void signIn()
        }
      >
        <>{sessionData ? "Sign out" : "Sign in"}</>
      </Button>
    </div>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: sessionData } = useSession();
  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-2 shadow-md dark:bg-gray-800">
        <nav className="flex items-center gap-4 text-lg font-medium">
          <Link
            className="flex items-center gap-2 text-lg font-semibold"
            href="#"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span className="sr-only">T3 Recipe Book</span>
          </Link>
        </nav>
        <Button onClickHandler={() => setIsOpen((prev) => !prev)}>
          <>
            {sessionData ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="sr-only">Toggle user menu</span>
              </>
            ) : (
              <>Login</>
            )}
          </>
        </Button>
      </header>
      <Drawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Menu"
        description="Try something new!"
      >
        <AuthShowcase />
      </Drawer>
    </>
  );
};

export default Navbar;
