import React from "react";
import { SidebarNav } from "./setting-sidebar";
import { settingSidebar } from "@/lib/data";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 container">
      <aside className="-mx-4 lg:w-1/5">
        <SidebarNav items={settingSidebar} />
      </aside>
      <div className="w-full">{children}</div>
    </div>
  );
}
