import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

import React from "react";

import { Link, useLocation } from "react-router-dom";

// const sidebarNav = [
//   {
//     title: "Dashboard",
//     href: `bacloffice/dashboard`,
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Orders",
//     href: `bacloffice/orders`,
//     icon: ListOrdered,
//   },
//   {
//     title: "Categories",
//     href: `bacloffice/categories`,
//     icon: Boxes,
//   },
//   {
//     title: "Products",
//     href: `bacloffice/products`,
//     icon: Utensils,
//   },
//   {
//     title: "AddonCategories",
//     href: `bacloffice/addoncategories`,
//     icon: Blocks,
//   },
//   {
//     title: "Addons",
//     href: `bacloffice/addons`,
//     icon: Shapes,
//   },
//   {
//     title: "Settings",
//     href: `bacloffice/settings`,
//     icon: Settings,
//   },
// ];

export default function NavLink({
  sidebarNav,
}: {
  sidebarNav: {
    title: string;
    href: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  }[];
}) {
  const location = useLocation();

  return (
    <div className=" hidden lg:flex items-center gap-3 ">
      {sidebarNav.map((item) => (
        <Navlink href={item.href} key={item.href} pathname={location.pathname}>
          {item.title}
        </Navlink>
      ))}
    </div>
  );
}

interface NavlinkProps {
  children: React.ReactNode;
  className?: string;
  pathname: string;
  href: string;
}

function Navlink({
  pathname,
  href,

  className,
  children,
  ...props
}: NavlinkProps) {
  return (
    <Link
      to={href}
      className={
        (cn(className),
        pathname === href
          ? "text-primary font-semibold"
          : "text-muted-foreground")
      }
      {...props}
    >
      {children}
    </Link>
  );
}
