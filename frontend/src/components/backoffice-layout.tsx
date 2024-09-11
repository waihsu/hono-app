import React from "react";

import AdminNav from "./admin-nav";
import AdminFooter from "./admin-footer";
import { useTokenStore } from "@/store/use-bear-store";
import { Navigate } from "react-router-dom";
import { adminNav, sidebarNav } from "@/lib/data";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useTokenStore();

  if (!user) return null;
  if (user.user_role === "SUPERADMIN") {
    return (
      <div>
        <AdminNav sidebarNav={sidebarNav} user={user} />
        <div className="px-2 sm:container min-h-svh">{children}</div>
        <div className=" mt-10">
          <AdminFooter />
        </div>
      </div>
    );
  } else if (user.user_role === "ADMIN") {
    return (
      <div>
        <AdminNav user={user} sidebarNav={adminNav} />
        <div className="px-2 sm:container min-h-svh">{children}</div>
        <div className=" mt-10">
          <AdminFooter />
        </div>
      </div>
    );
  }

  return <Navigate to="/" />;
}
