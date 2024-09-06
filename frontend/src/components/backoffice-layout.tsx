import React, { useEffect } from "react";

import AdminNav from "./admin-nav";
import AdminFooter from "./admin-footer";
import { useAdminStore } from "@/store/use-admin-store";
import { useTokenStore } from "@/store/use-bear-store";
import { Navigate } from "react-router-dom";
import { adminNav, sidebarNav } from "@/lib/data";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = new WebSocket(`ws://localhost:3000/admin`);
  const { getAdminAppData, addBet, setOnlineUserIds, addTransation } =
    useAdminStore();
  const { token, user } = useTokenStore();

  useEffect(() => {
    socket.onmessage = (ev) => {
      const { type, payload } = JSON.parse(ev.data);
      if (type === "onlineusers") {
        // console.log(payload);
        setOnlineUserIds(payload);
      } else if (type === `newbet${user?.id}`) {
        // console.log("payload", payload);
        addBet(JSON.parse(payload));
      } else if (type === `tran${user?.id}`) {
        addTransation(JSON.parse(payload));
      }
    };
  }, []);

  useEffect(() => {
    if (token) {
      getAdminAppData({ token, userId: String(user?.id) });
    }
  }, []);
  if (!user) return null;
  if (user.role === "SUPERADMIN") {
    return (
      <div>
        <AdminNav sidebarNav={sidebarNav} user={user} />
        <div className="px-2 sm:container min-h-svh">{children}</div>
        <div className=" mt-10">
          <AdminFooter />
        </div>
      </div>
    );
  } else if (user.role === "ADMIN") {
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
