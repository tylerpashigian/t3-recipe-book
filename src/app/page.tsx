import { Metadata } from "next";

import LandingPage from "~/components/landing-page";

export const metadata: Metadata = {
  title: "Forked Recipe Book",
  description: "Recipe Book built on the T3 Stack",
};

const Home = () => {
  return <LandingPage />;
};

export default Home;
