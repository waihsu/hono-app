import React from "react";
import MainNav from "./main-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MainNav name="Football" />
      {children}
    </div>
  );
}
