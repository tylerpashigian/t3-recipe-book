import React, { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WithNavBar = ({ children, classes }: any) => {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const navBar = document.querySelector("header");
    if (navBar) {
      setNavHeight(navBar.offsetHeight);
    }
  }, []);

  return (
    <div
      className={`absolute top-0 min-h-[calc(100dvh)] w-full justify-center ${classes}`}
      style={{
        paddingTop: `${navHeight}px`,
      }}
    >
      {children}
    </div>
  );
};

export default WithNavBar;
