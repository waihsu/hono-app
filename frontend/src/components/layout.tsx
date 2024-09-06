import React from "react";
import MainNav from "./main-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MainNav name="Football" />
      <div className=" min-h-svh py-5">{children}</div>
      <div className=" mt-10">
        <footer className="border-t py-6 ">
          <div className="text-center text-xs">
            &copy; 2024 Shop,Inc. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
