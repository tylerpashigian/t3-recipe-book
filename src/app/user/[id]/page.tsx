import React from "react";

import { Metadata } from "next";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa6";

import { api } from "~/trpc/server";
import WithNavBar from "~/components/UI/with-nabvar";
import RecipeTable from "~/components/recipe/recipe-table";
import { Card, CardContent } from "~/components/UI/card";
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

  const displayName = user?.name ?? user?.username;

  return (
    <WithNavBar classes="bg-forked-neutral">
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Card className="mb-8 border border-border bg-forked-background">
          <CardContent className="p-8">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900">
                <AvatarImage alt="User Avatar" src={user?.image ?? ""} />
                <AvatarFallback>
                  <FaUser />
                </AvatarFallback>
              </Avatar>

              <div className="w-full flex-1 md:w-auto">
                <div className="mb-4 flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {displayName ? (
                      <h1 className="mb-1 text-3xl font-bold text-foreground">
                        {displayName}
                      </h1>
                    ) : null}
                    {user?.email ? (
                      <p className="text-forked-secondary-foreground">
                        {user?.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {recipes.length}
                    </div>
                    <div className="text-sm text-forked-secondary-foreground">
                      Recipes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex w-full flex-col items-center rounded-b-xl dark:bg-gray-900">
          <Tabs className="flex flex-col items-center" defaultValue="recipes">
            <TabsList className="mb-4">
              <TabsTrigger value="recipes">
                Recipes
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  {recipes.length}
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="recipes">
              <RecipeTable
                isLoading={false}
                recipes={recipes.map((recipe) => ({
                  id: recipe.id,
                  name: recipe.name,
                  description: recipe.description,
                  categories: recipe.categories,
                  favoriteCount: recipe._count.favorites,
                  servings: recipe.servings,
                  prepTime: recipe.prepTime,
                  cookTime: recipe.cookTime,
                }))}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </WithNavBar>
  );
};

export default Profile;
