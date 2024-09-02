import React, { useEffect } from "react";

import AdminNav from "./admin-nav";
import AdminFooter from "./admin-footer";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = new WebSocket(`ws://localhost:3000/admin`);
  useEffect(() => {
    socket.onmessage = (ev) => {
      const { type, payload } = JSON.parse(ev.data);
      if (type === "onlineusers") {
        console.log(payload);
      }
    };
  }, []);
  return (
    <div>
      <AdminNav />
      <div className="px-2 sm:container min-h-svh">{children}</div>
      <div className=" mt-10">
        <AdminFooter />
      </div>
    </div>
  );
}
