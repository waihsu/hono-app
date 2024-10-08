import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { SignOut } from "./signout-button";
import { User } from "@/types/types";

export function DropdownProfile({ user }: { user: User }) {
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
        </div>
        <DropdownMenuSeparator />
        <div>
          <SignOut />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
