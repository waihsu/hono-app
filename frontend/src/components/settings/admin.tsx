import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import SettingLayout from "./setting-layout";
import { useAdminStore } from "@/store/use-admin-store";
import { CreateAdminForm } from "./create-admin";
import { useTokenStore } from "@/store/use-bear-store";
import UserCard from "./user-card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import DeleteDialog from "../delete-dialog";
import { useState } from "react";
import { toast } from "../ui/use-toast";

export default function AdminSettings() {
  const { users, updateUser } = useAdminStore();
  const { user, token } = useTokenStore();
  const [loading, setLoading] = useState(false);
  const admins = users.filter((item) => item.user_role === "ADMIN");
  const validUsers = users.filter((item) => item.user_role === "USER");
  if (!user) return null;
  async function onDelete(userId: string) {
    setLoading(true);
    const resp = await fetch(`/api/admin`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Bearer: token,
      },
      body: JSON.stringify({ userId, superAdminId: user?.id }),
    });
    setLoading(false);
    if (!resp.ok) {
      const { messg } = await resp.json();
      toast({ title: messg, variant: "destructive" });
    } else {
      const { removedAdmin } = await resp.json();
      updateUser(removedAdmin);
      toast({ title: "Successful" });
    }
  }
  return (
    <BackofficeLayout>
      <Heading button description="customize admins" name="Admin" />
      <SettingLayout>
        <div className=" lg:max-w-lg ">
          <CreateAdminForm users={validUsers} superAdminId={user.id} />
        </div>
        <Separator className="my-4" />
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {admins &&
            admins.map((user) => (
              <div key={user.id} className="relative">
                <div className="min-w-max">
                  <UserCard user={user} />
                </div>
                <DeleteDialog
                  children={
                    <Button
                      size={"icon"}
                      variant={"destructive"}
                      className=" absolute top-1 right-1 z-20"
                    >
                      {loading ? "deleting..." : <Trash />}
                    </Button>
                  }
                  onDelete={() => onDelete(user.id)}
                />
              </div>
            ))}
        </div>
      </SettingLayout>
    </BackofficeLayout>
  );
}
