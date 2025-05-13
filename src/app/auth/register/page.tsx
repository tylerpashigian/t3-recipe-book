"use client";

import React, { type FormEvent } from "react";
import useInput from "../../../hooks/useInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WithNavBar from "~/components/UI/with-nabvar";
import { Button } from "~/components/UI/button";
import { Input } from "~/components/UI/input";
import toast from "react-hot-toast";

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
    <WithNavBar>
      <main className="flex flex-col">
        <div className="container flex flex-col items-center justify-center gap-12 py-8 md:py-16">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Enter your username and password to create your account
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white px-8 pb-8 pt-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
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
              </div>
              {passwordInputIsInvalid && (
                <p className="text-red-500">
                  Password must be at least 6 characters
                </p>
              )}
              <div className="space-y-2">
                <label
                  className="mb-1 block text-sm font-bold text-gray-700"
                  htmlFor="confirmPassword"
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
              </div>
              {confirmPasswordInputIsInvalid && (
                <p className="text-red-500">Password do not match!</p>
              )}
            </div>
            <div className="grid grid-cols-1 items-center justify-between gap-2 md:grid-cols-2">
              <Button
                type="submit"
                disabled={
                  confirmPasswordInputIsInvalid || passwordInputIsInvalid
                }
              >
                <>Sign Up</>
              </Button>
              <Button variant={"ghost"} asChild>
                <Link href="/auth/login" className="text-center">
                  Have an account? Sign in
                </Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </WithNavBar>
  );
}

export default Register;
