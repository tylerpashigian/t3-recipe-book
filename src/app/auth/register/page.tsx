"use client";

import React from "react";

import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

import WithNavBar from "~/components/UI/with-nabvar";
import { Button } from "~/components/UI/button";
import { Input } from "~/components/UI/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/card";
import { useForm } from "@tanstack/react-form";
import { AuthFormModel } from "~/models/user";

function Register() {
  const router = useRouter();

  const form = useForm<AuthFormModel>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: ({ value }) => {
      handleSubmit(value);
    },
  });

  const handleSubmit = (value: AuthFormModel) => {
    const userData = {
      username: value.username,
      password: value.password,
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
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void form.handleSubmit();
                }}
                className="flex flex-col gap-4"
              >
                <form.Field
                  name="username"
                  validators={{
                    onChange: ({ value }) =>
                      value === "" ? "Please enter a username" : undefined,
                  }}
                >
                  {(field) => (
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
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length ? (
                        <p className="mt-1 text-sm text-red-600">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "Password is required";
                      if (value.length < 6)
                        return "Password must be at least 6 characters";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
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
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors.length ? (
                        <p className="pt-2 text-red-500">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChangeListenTo: ["password"],
                    onChange: ({ value, fieldApi }) => {
                      const password = fieldApi.form.getFieldValue("password");
                      if (!value) return "Please confirm your password";
                      if (value !== password) return "Passwords do not match";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
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
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors.length &&
                      field._getMeta()?.isTouched ? (
                        <p className="pt-2 text-red-500">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>

                <form.Subscribe
                  selector={(state) =>
                    [
                      state.canSubmit,
                      state.isSubmitting,
                      state.isTouched,
                      state.isDirty,
                    ] as const
                  }
                >
                  {([canSubmit, isSubmitting, isTouched, isDirty]) => {
                    const isDisabled =
                      (!canSubmit || isSubmitting) && isTouched && isDirty;
                    return (
                      <div className="mt-2 flex flex-col gap-4">
                        <Button
                          type="submit"
                          size={"full"}
                          disabled={
                            // Disable button if inputs are invalid while typing
                            isDisabled
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
                    );
                  }}
                </form.Subscribe>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </WithNavBar>
  );
}

export default Register;
