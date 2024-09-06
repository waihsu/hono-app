import { Link, useNavigate } from "react-router-dom";

import { DropdownProfile } from "./DropDownProfile";
import { Button } from "./ui/button";
import { FileStack } from "lucide-react";
import { useBetCartStore } from "@/store/use-bet-cart";
import AdminMobileNav from "./admin-mobile-nav";
import NavLink from "./nav-link";
import { clientNav } from "@/lib/data";
import { useAppStore } from "@/store/use-app-store";

export default function MainNav({ name }: { name: string }) {
  const { currentUser } = useAppStore();

  const { betsItems } = useBetCartStore();
  const navigate = useNavigate();
  const validBetsItems = betsItems.filter(
    (item) => item.userId === currentUser?.id
  );
  if (!currentUser) return null;
  return (
    <div className="min-w-full flex justify-between items-center  z-20 shadow-lg py-4 px-4 sm:px-8 sticky top-0 backdrop-blur-sm bg-background/90  supports-[backdrop-filter]:bg-background/10">
      <div className="flex items-center mx-2 py-2 gap-x-3">
        <div className="text-xl sm:text-3xl font-bold hidden lg:block">
          <Link to={"/"}>{name}</Link>
        </div>
        <div className="lg:hidden">
          <AdminMobileNav name="Football" sidebarNav={clientNav} />
        </div>
        <div>
          <NavLink sidebarNav={clientNav} />
        </div>
      </div>
      <div className="flex gap-1 items-center">
        {currentUser ? (
          <>
            <Button variant={"default"} size={"sm"}>
              {currentUser?.balance} Ks
            </Button>
            <Button
              className="hidden sm:flex items-center"
              variant={"link"}
              onClick={() => navigate(`/carts/${currentUser.id}`)}
            >
              <FileStack size={30} />
              {validBetsItems.length}
            </Button>
            <DropdownProfile
              user={currentUser}
              betItemsLength={betsItems.length}
            />
          </>
        ) : (
          <span className=" cursor-pointer py-1 rounded-md px-3 text-xs border border-input bg-background shadow-sm hover:bg-accent hover:text-primary">
            <Link to={`/login`}>Login</Link>
          </span>
        )}
      </div>
    </div>
  );
}
