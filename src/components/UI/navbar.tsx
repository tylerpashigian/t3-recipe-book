"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/plBYy1Gcqzx
 */
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { type Session } from "next-auth";

import { FaUser } from "react-icons/fa6";
import NavbarStatic from "./navbar-static";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { cn } from "~/lib/utils";

type Props = {
  setIsDrawerOpen: (isOpen: boolean) => void;
  session: Session | null;
};

export const AuthShowcase = ({ setIsDrawerOpen, session }: Props) => {
  const displayName: string | undefined =
    session?.user.name ?? session?.user?.username;

  return (
    <div className="flex min-w-[20vw] flex-col items-start space-y-3">
      <p className="text-center text-lg font-bold text-black">
        {displayName && <span>Logged in as {displayName}</span>}
      </p>
      {!!session ? (
        <Button size={"full"} onClick={() => setIsDrawerOpen(false)} asChild>
          <Link href={`/user/${session?.user.id}`}>
            <>View Profile</>
          </Link>
        </Button>
      ) : (
        <Button size={"full"} asChild>
          <Link href={"/auth/register"} onClick={() => setIsDrawerOpen(false)}>
            <>Create</>
          </Link>
        </Button>
      )}
      <Button
        size={"full"}
        onClick={session ? () => void signOut() : () => void signIn()}
      >
        <>{session ? "Sign out" : "Sign in"}</>
      </Button>
    </div>
  );
};

const Navbar = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out",
        scrolled ? "mt-4 px-4 sm:px-6 lg:px-8" : "mt-0 px-0",
      )}
    >
      <header
        className={cn(
          "flex w-full justify-between border-b p-2 transition-all duration-300 ease-in-out",
          scrolled
            ? "mx-auto rounded-xl border bg-background/70 shadow-lg backdrop-blur-sm"
            : "w-full rounded-none border-b bg-background",
        )}
      >
        <NavbarStatic />
        <div className="flex gap-2">
          {!!session && (
            <Button asChild>
              <Link href={"/recipe/create"}>Create Recipe</Link>
            </Button>
          )}
          <Sheet open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
            <SheetTrigger asChild>
              <Button>
                {session ? (
                  <div>
                    <FaUser />
                    <span className="sr-only">Toggle user menu</span>
                  </div>
                ) : (
                  <>Login</>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Profile</SheetTitle>
              </SheetHeader>
              <SheetDescription>
                {/* Fixes hydration error, not sure why this is necessary though */}
                <div>
                  <AuthShowcase setIsDrawerOpen={setIsOpen} session={session} />
                </div>
              </SheetDescription>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
