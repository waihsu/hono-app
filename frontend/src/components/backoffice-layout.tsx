import React from "react";

import AdminNav from "./admin-nav";
import AdminFooter from "./admin-footer";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminNav />
      <div className="container">{children}</div>
      <div className=" mt-10">
        <AdminFooter />
      </div>
    </div>
  );
}
