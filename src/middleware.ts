import withAuth from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(_req) {
    // console.log(req.nextauth.token);
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({}) => {
        // TODO: find better way to handle middleware on only protected pages
        // return !!token;
        return true;
      },
    },
  },
);
