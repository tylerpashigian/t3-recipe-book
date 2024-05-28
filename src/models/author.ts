import { User } from "@prisma/client";

export type Author = Pick<User, "id" | "name" | "username"> & {
  profilePicture: string | null | undefined;
};
