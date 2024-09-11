import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { cn } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";

import { useAdminStore } from "@/store/use-admin-store";

export default function SingleCustomerView() {
  const { userId } = useParams();
  const { users } = useAdminStore();

  const validUser = users.find((user) => user.id === userId);
  if (!validUser) return null;
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/customers`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="customers lists"
        name={validUser?.username}
      />

      <div></div>
    </BackofficeLayout>
  );
}
