import React, { type FormEvent } from "react";
import useInput from "../../hooks/useInput";
import Button, { ButtonStyle } from "~/components/UI/button";
import Link from "next/link";
import { useRouter } from "next/router";

function Register() {
  const router = useRouter();
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
    fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          void router.push("/auth/login");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mx-auto mt-10 max-w-lg space-y-6 rounded p-4 shadow-md">
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
            <input
              className="focus:shadow-outline w-full appearance-none rounded border border-gray-200 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
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
            <input
              className="focus:shadow-outline w-full appearance-none rounded border border-gray-200 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
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
            <input
              className="focus:shadow-outline w-full appearance-none rounded border border-gray-200 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="paconfirmPasswordsconfirmPasswordsword"
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
            style={
              confirmPasswordInputIsInvalid || passwordInputIsInvalid
                ? ButtonStyle.disabled
                : ButtonStyle.primary
            }
            disabled={confirmPasswordInputIsInvalid || passwordInputIsInvalid}
          >
            <>Sign Up</>
          </Button>
          <Link href="/auth/login" className="text-center">
            Have an account? Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
