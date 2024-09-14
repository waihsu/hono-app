import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { DataTable } from "../data-table";
import { columns } from "./customer-columns";
import { useAdminStore } from "@/store/use-admin-store";
import { useTokenStore } from "@/store/use-bear-store";

export default function Customers() {
  const { users, ws } = useAdminStore();
  const { token, user: Admin } = useTokenStore();

  if (!Admin?.id || !token) return null;

  const validUserData = users.map((user) => ({
    ws: ws,
    user_id: user.id,
    username: user.username,
    email: user.email,
    account_status: user.account_status,
    balance: user.balance,
    token: token,
    adminId: Admin.id,
  }));
  // console.log(users);
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/dashboard`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="customers lists"
        name="Customers"
      />

      <div className="w-full">
        <DataTable columns={columns} data={validUserData} />
      </div>
    </BackofficeLayout>
  );
}
