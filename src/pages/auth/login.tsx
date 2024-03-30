import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import Button, { ButtonSize } from "~/components/UI/button";
import Separator from "~/components/UI/separator";
import useInput from "../../hooks/useInput";
import { type FormEvent } from "react";
import { useRouter } from "next/router";
import WithNavBar from "~/components/UI/with-nabvar";

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
          // Toast failed
          // setError("Failed! Check your input and try again.");
          console.log("Failed", res);
        }
      })
      .catch((error) => {
        console.error("Error during sign in:", error);
      });
  };

  return (
    <WithNavBar>
      <div className="mx-auto max-w-lg space-y-6 rounded p-4 shadow-md">
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
                />
              </div>
              <Button type="submit" size={ButtonSize.full}>
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
                    <button onClick={() => void signIn(provider.id)}>
                      Sign in with {provider.name}
                    </button>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </WithNavBar>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const csrfToken = await getCsrfToken(context);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { csrfToken, providers: providers ?? [] },
  };
}

export default Login;
