import AdminMobileNav from "./admin-mobile-nav";
import NavLink from "./nav-link";
import { DropdownProfile } from "./DropDownProfile";
import { User } from "@/store/use-bear-store";
import { Link } from "react-router-dom";
import { LucideProps } from "lucide-react";

interface AdminNavProps {
  sidebarNav: {
    title: string;
    href: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  }[];
  user: User;
}

export default function AdminNav({ sidebarNav, user }: AdminNavProps) {
  return (
    <div className=" min-w-full flex justify-between items-center  z-20 shadow-lg py-4 px-8 sticky top-0 backdrop-blur-sm bg-background/90  supports-[backdrop-filter]:bg-background/10">
      <div className="lg:hidden">
        <AdminMobileNav name="Backoffice" sidebarNav={sidebarNav} />
      </div>
      <div>
        <NavLink sidebarNav={sidebarNav} />
      </div>

      <div className="flex gap-2 items-center">
        {user ? (
          <DropdownProfile user={user} betItemsLength={0} />
        ) : (
          <span className=" cursor-pointer py-1 rounded-md px-3 text-xs border border-input bg-background shadow-sm hover:bg-accent hover:text-primary">
            <Link to={`/login`}>Login</Link>
          </span>
        )}
      </div>
    </div>
  );
}
