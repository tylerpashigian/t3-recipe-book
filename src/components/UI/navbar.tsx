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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/UI/avatar";
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
      <div className="flex w-full flex-col items-center space-y-3 pt-4">
        {!!session ? (
          <>
            <div className="flex flex-col items-center md:items-center">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900">
                <AvatarImage
                  alt="User Avatar"
                  src={session.user?.image ?? ""}
                />
                <AvatarFallback>
                  <FaUser />
                </AvatarFallback>
              </Avatar>
              {displayName ? (
                <h3 className="font-semibold text-foreground">{displayName}</h3>
              ) : null}
              {session.user.email ? (
                <p className="text-sm text-forked-secondary-foreground">
                  {session.user.email}
                </p>
              ) : null}
            </div>
            <Button
              size={"full"}
              onClick={() => setIsDrawerOpen(false)}
              asChild
            >
              <Link href={`/user/${session?.user.id}`}>View Profile</Link>
            </Button>
            <Button
              size={"full"}
              onClick={() => void signOut()}
              variant={"ghost"}
            >
              <>{"Sign out"}</>
            </Button>
          </>
        ) : (
          <>
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Join the Forked Community
              </h3>
              <p
                className="text-sm text-forked-secondary-foreground md:max-w-xs"
                id="problem-text"
              >
                Create an account to save your favorite recipes, share your
                culinary creations, and connect with fellow food lovers.
              </p>
            </div>
            <Button size={"full"} onClick={() => void signIn()}>
              <>{"Sign in"}</>
            </Button>
            <Button size={"full"} asChild>
              <Link
                href={"/auth/register"}
                onClick={() => setIsDrawerOpen(false)}
              >
                <>Create</>
              </Link>
            </Button>
          </>
        )}
      </div>
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
                <SheetTitle>
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <img
                      src="/forked-logo.png"
                      alt="Logo"
                      className="h-6 w-6"
                    />
                    <span>Forked</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <AuthShowcase setIsDrawerOpen={setIsOpen} session={session} />
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
