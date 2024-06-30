import { type FormEvent } from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";

import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import toast from "react-hot-toast";

import Separator from "~/components/UI/separator";
import WithNavBar from "~/components/UI/with-nabvar";
import useInput from "../../hooks/useInput";
import { Button } from "~/components/UI/button";
import { Input } from "~/components/UI/input";

const Login = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

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
        if (res?.ok) {
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

  return (
    <WithNavBar>
      <main className="flex flex-col">
        <div className="container flex flex-col items-center justify-center gap-12 py-8 md:py-16">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Enter your username and password to login to your account
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="bg-white px-8 pb-8 pt-6">
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
                  />
                </div>
                <Button type="submit" size={"full"}>
                  <>Login</>
                </Button>
              </div>
            </form>
            <Separator />
            <div className="flex w-full justify-center space-y-4 pt-6">
              {Object.values(providers).map((provider) => (
                <div key={provider.name} className="">
                  {provider.name !== "credentials" ? (
                    <>
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          void signIn(provider.id, { callbackUrl: "/" })
                        }
                      >
                        Sign in with {provider.name}
                      </Button>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </WithNavBar>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  return {
    props: { csrfToken, providers: providers ?? [] },
  };
}

export default Login;
