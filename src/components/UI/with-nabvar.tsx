"use client";

import React, { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WithNavBar = ({ children, classes }: any) => {
  const [navHeight, setNavHeight] = useState(57);

  useEffect(() => {
    const navBar = document.querySelector("header");
    if (navBar) {
      setNavHeight(navBar.offsetHeight);
    }
  }, []);

  return (
    <div
      className={`absolute top-0 min-h-[100svh] w-full w-full justify-center ${classes}`}
      style={{
        paddingTop: `calc(${navHeight}px + env(safe-area-inset-top))`,
      }}
    >
      {children}
    </div>
  );
};

export default WithNavBar;
