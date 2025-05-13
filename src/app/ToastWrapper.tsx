// needed to persist toast notifications across server page navigations
"use client";

import { Toaster } from "react-hot-toast";

const ToasterWrapper = () => {
  return <Toaster position="bottom-right" />;
};

export default ToasterWrapper;
