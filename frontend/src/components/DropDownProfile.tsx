import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { SignOut } from "./signout-button";
import { Button } from "./ui/button";
import { BadgeMinus, BadgePlus, ChartColumn, FileStack } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CurrentUser } from "@/store/use-app-store";

export function DropdownProfile({
  user,
  betItemsLength,
}: {
  user: CurrentUser;
  betItemsLength: number;
}) {
  const navigate = useNavigate();
  // console.log(user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className=" cursor-pointer py-1 rounded-md px-3 text-xs border border-input bg-background shadow-sm hover:bg-accent hover:text-primary">
          {user.username}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className=" flex items-center  gap-2">
          <ThemeToggle />
          <Button
            className="sm:hidden "
            variant={"outline"}
            size={"icon"}
            onClick={() => navigate(`/carts/${user.id}`)}
          >
            <FileStack />
            {betItemsLength}
          </Button>
        </div>
        <DropdownMenuSeparator />
        <div>
          {user.user_role === "ADMIN" || user.user_role === "SUPERADMIN" ? (
            <Button
              variant={"link"}
              className="w-full"
              onClick={() => navigate("/backoffice/dashboard")}
            >
              <ChartColumn /> Backoffice
            </Button>
          ) : (
            <></>
          )}
          <Button
            variant={"link"}
            className="w-full"
            onClick={() => navigate("/deposit")}
          >
            <BadgePlus /> Deposite
          </Button>
          <Button
            variant={"link"}
            className="w-full"
            onClick={() => navigate("/withdraw")}
          >
            <BadgeMinus /> Withdraw
          </Button>
        </div>
        <div>
          <SignOut />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
