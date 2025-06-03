"use client";

import React, { type FormEvent } from "react";

import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

import useInput from "../../../hooks/useInput";
import WithNavBar from "~/components/UI/with-nabvar";
import { Button } from "~/components/UI/button";
import { Input } from "~/components/UI/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/card";

function Register() {
  const router = useRouter();

  // TODO: replace with TanStack Form
  const { inputValue: username, valueHandler: usernameHandler } = useInput(
    (value: string) => value.trim() !== "",
    "",
  );

  const {
    inputValue: password,
    isInputInvalid: passwordInputIsInvalid,
    valueHandler: passwordHandler,
    blurHandler: passwordBlurHandler,
  } = useInput((value: string) => value.trim().length >= 6, "");

  const {
    inputValue: confirmPassword,
    isInputInvalid: confirmPasswordInputIsInvalid,
    valueHandler: confirmPasswordHandler,
    blurHandler: confirmPasswordBlurHandler,
  } = useInput((value: string) => value.trim() === password, "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userData = {
      username,
      password,
    };

    // Make call to backend to create user
    fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Account created successfully");
          void router.push("/auth/login");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <WithNavBar classes="bg-forked-neutral">
      <main className="mx-auto flex max-w-6xl items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            <Link
              href="/"
              className="flex items-center gap-1 text-lg font-semibold"
            >
              <img src="/forked-logo.png" alt="Logo" className="h-8 w-8" />
              <span>Forked</span>
            </Link>
            <p className="mt-2 text-forked-secondary-foreground">
              Create your account to start cooking
            </p>
          </div>
          <Card className="border border-border bg-forked-background shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">
                Sign Up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    className="mb-1 block text-sm font-bold text-gray-700"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <Input
                    className="mt-2 w-full px-4 py-3 text-black"
                    id="username"
                    placeholder="username"
                    required
                    type="username"
                    value={username}
                    onChange={usernameHandler}
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-sm font-bold text-gray-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Input
                    className="mt-2 w-full px-4 py-3 text-black"
                    id="password"
                    required
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={passwordHandler}
                    onBlur={passwordBlurHandler}
                  />
                  {passwordInputIsInvalid && (
                    <p className="pt-2 text-red-500">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="mb-1 block text-sm font-bold text-gray-700"
                    htmlFor="confirm-password"
                  >
                    Confirm Password
                  </label>
                  <Input
                    className="mt-2 w-full px-4 py-3 text-black"
                    id="confirmPassword"
                    required
                    type="password"
                    placeholder="password"
                    value={confirmPassword}
                    onChange={confirmPasswordHandler}
                    onBlur={confirmPasswordBlurHandler}
                  />
                  {confirmPasswordInputIsInvalid && (
                    <p className="pt-2 text-red-500">Password do not match!</p>
                  )}
                </div>
                <div className="mt-2 flex flex-col gap-4">
                  <Button
                    type="submit"
                    size={"full"}
                    disabled={
                      // Disable button if inputs are invalid while typing
                      confirmPasswordInputIsInvalid || passwordInputIsInvalid
                    }
                  >
                    Create
                  </Button>
                  <Button variant={"ghost"} asChild>
                    <Link href="/auth/login" className="text-center">
                      Have an account? Sign in
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </WithNavBar>
  );
}

export default Register;
