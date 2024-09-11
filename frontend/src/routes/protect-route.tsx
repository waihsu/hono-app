import { useTokenStore } from "@/store/use-bear-store";

import { Navigate, Outlet } from "react-router-dom";

export default function ProtectRoute() {
  const { token } = useTokenStore();

  return token ? <Outlet /> : <Navigate to={"/login"} />;
}
