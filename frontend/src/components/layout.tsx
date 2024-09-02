import React from "react";
import MainNav from "./main-nav";

import MainFooter from "./main-footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MainNav name="Football" />
      <div>
        {children}
        <MainFooter />
      </div>
    </div>
  );
}
