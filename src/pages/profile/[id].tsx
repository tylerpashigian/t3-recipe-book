import React from "react";

import superjson from "superjson";
import prisma from "../../utils/prisma";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { User, Recipe } from "@prisma/client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/UI/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/UI/tabs";

import { FaUser } from "react-icons/fa6";

import { appRouter } from "../../server/api/root";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { Button } from "~/components/UI/button";

type Props = {
  user: User;
  recipes: Recipe[];
};

const Profile = ({ user, recipes }: Props) => {
  return (
    <div className="mx-auto w-full">
      <div className="overflow-hidden bg-white dark:bg-gray-900">
        <div className="relative h-32 bg-gray-300 md:h-40">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform">
            <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900">
              <AvatarImage alt="User Avatar" src={user.image ?? ""} />
              <AvatarFallback>
                <FaUser />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="px-4 pb-4 pt-16 text-center">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          {user.username ? (
            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
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
                  <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                    <Button variant={"link"}>{recipe.name}</Button>
                  </Link>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson,
  });
  const id = context.params?.id;

  if (!id || typeof id != "string") throw Error("Failed to load user");

  const { user, recipes } = await helpers.user.getUser.fetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      user,
      recipes,
    },
  };
};

export default Profile;
