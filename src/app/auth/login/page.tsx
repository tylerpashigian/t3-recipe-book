"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { getProviders, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";

import Separator from "~/components/UI/separator";
import WithNavBar from "~/components/UI/with-nabvar";
import { Button } from "~/components/UI/button";
import { Input } from "~/components/UI/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/card";
import { AuthFormModel } from "~/models/user";
import { getLoginRedirectUrl } from "~/utils/login-redirect";

const Login = () => {
  const getRedirectTo = () => getLoginRedirectUrl(window.location.href);

  const form = useForm<AuthFormModel>({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: ({ value }) => {
      return handleSubmit(value);
    },
  });

  const [providers, setProviders] =
    useState<Awaited<ReturnType<typeof getProviders>>>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      if (res) {
        setProviders(res);
      }
    };

    fetchProviders().catch((error) => console.log(error));
  }, []);

  const handleSubmit = (value: AuthFormModel) => {
    return signIn("credentials", {
      username: value.username,
      password: value.password,
      redirectTo: getRedirectTo(),
      redirect: false,
    })
      .then((res) => {
        if (res?.ok && !res?.error) {
          window.location.assign(getRedirectTo());
        } else {
          toast.error("Failed to login! Check your input and try again.");
          console.log("Failed", res);
        }
      })
      .catch((error) => {
        console.error("Error during sign in:", error);
        toast.error("Unable to sign in. Please try again.");
      });
  };

  const has3rdPartyProviders = Object.values(providers ?? {}).some(
    (provider) => provider.name !== "credentials",
  );

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
              Welcome back to your recipe collection
            </p>
          </div>

          <Card className="border border-border bg-forked-background shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {has3rdPartyProviders ? (
                <>
                  {Object.values(providers ?? {}).map((provider) => (
                    <div key={provider.name} className="">
                      {provider.name !== "credentials" ? (
                        <Button
                          variant={"outline"}
                          size={"full"}
                          onClick={() =>
                            void signIn(provider.id, {
                              redirectTo: getRedirectTo(),
                            })
                          }
                        >
                          Sign in with {provider.name}
                        </Button>
                      ) : null}
                    </div>
                  ))}

                  <div className="relative">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-forked-background px-2 text-sm">
                      or
                    </span>
                  </div>
                </>
              ) : null}

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
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) =>
                      value === "" ? "Please enter a password" : undefined,
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
                      />
                    </div>
                  )}
                </form.Field>

                <form.Subscribe
                  selector={(state) =>
                    [
                      state.canSubmit,
                      state.isSubmitting,
                      state.isTouched,
                    ] as const
                  }
                >
                  {([canSubmit, isSubmitting, isTouched]) => {
                    const isDisabled = !canSubmit || isSubmitting || !isTouched;
                    return (
                      <Button
                        type="submit"
                        size={"full"}
                        className="mt-2"
                        disabled={isDisabled}
                      >
                        Sign In
                      </Button>
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
};

export default Login;
