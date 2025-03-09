import React from "react";

import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa6";

import { api } from "~/trpc/server";
import { Button } from "~/components/UI/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/UI/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/UI/tabs";

type Props = {
  params: Promise<{ id: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Profile",
  description: "User Profile",
};

const Profile = async ({ params }: Props) => {
  // TODO: find a way to reuse this with client components
  const { id } = await params;
  const { user, recipes } = await api.user.getUser({ id: id });

  if (!user) {
    toast.error("User not found");
  }

  return (
    <>
      <main className="mx-auto flex w-full flex-col">
        <div className="overflow-hidden bg-white dark:bg-gray-900">
          <div className="relative h-32 bg-gray-300 md:h-40">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900">
                <AvatarImage alt="User Avatar" src={user?.image ?? ""} />
                <AvatarFallback>
                  <FaUser />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="px-4 pb-4 pt-16 text-center">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            {user?.username ? (
              <p className="text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex w-full flex-col items-center rounded-b-xl bg-white dark:bg-gray-900">
          <Tabs className="flex flex-col items-center" defaultValue="recipes">
            <TabsList className="">
              <TabsTrigger value="recipes">
                Recipes
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  {recipes.length}
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="recipes">
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe) => {
                  return (
                    <Button variant={"link"} key={recipe.id} asChild>
                      <Link href={`/recipe/${recipe.id}`}>{recipe.name}</Link>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default Profile;
