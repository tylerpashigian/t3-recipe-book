"use client";

import { useEffect, useState, type FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import toast from "react-hot-toast";
import { BuiltInProviderType } from "next-auth/providers";

import useInput from "../../../hooks/useInput";
import Separator from "~/components/UI/separator";
import WithNavBar from "~/components/UI/with-nabvar";
import { Button } from "~/components/UI/button";
import { Input } from "~/components/UI/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/card";

const Login = () => {
  const router = useRouter();

  const [providers, setProviders] = useState<
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | never[]
  >([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      if (res) {
        setProviders(res);
      }
    };

    fetchProviders().catch((error) => console.log(error));
  }, []);

  // TODO: replace with TanStack Form
  const { inputValue: username, valueHandler: usernameHandler } = useInput(
    (value: string) => value.trim() !== "",
    "",
  );

  const { inputValue: password, valueHandler: passwordHandler } = useInput(
    (value: string) => value.trim() !== "",
    "",
  );

  const callbackUrl = `http${
    process.env.NODE_ENV === "production" ? "s" : ""
  }://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn("credentials", {
      username,
      password,
      callbackUrl,
      redirect: false,
    })
      .then((res) => {
        if (res?.ok && !res?.error) {
          void router.push("/");
        } else {
          toast.error("Failed to login! Check your input and try again.");
          console.log("Failed", res);
        }
      })
      .catch((error) => {
        console.error("Error during sign in:", error);
      });
  };

  const has3rdPartyProviders = Object.values(providers).some(
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
                  {Object.values(providers).map((provider) => (
                    <div key={provider.name} className="">
                      {provider.name !== "credentials" ? (
                        <Button
                          variant={"outline"}
                          size={"full"}
                          onClick={() =>
                            void signIn(provider.id, { callbackUrl: "/" })
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
                  />
                </div>

                <Button type="submit" size={"full"} className="mt-2">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </WithNavBar>
  );
};

export default Login;
