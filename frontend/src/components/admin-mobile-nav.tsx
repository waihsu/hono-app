import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";

import { LucideIcon, LucideProps } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Link, useLocation } from "react-router-dom";

export default function AdminMobileNav({
  name,
  sidebarNav,
}: {
  name: string;
  sidebarNav: {
    title: string;
    href: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  }[];
}) {
  const location = useLocation();
  // console.log(location.pathname);
  const [open, setOpen] = React.useState(false);

  if (!sidebarNav.length) return null;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetTitle className="text-xl sm:text-3xl">{name}</SheetTitle>
        <SheetDescription>backoffice</SheetDescription>

        {/* <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6 "> */}
        <div className="flex flex-col space-y-3 ml-4 mt-4">
          {sidebarNav &&
            sidebarNav.map((item, index) => (
              <MobileLink
                pathname={location.pathname}
                key={index}
                href={item.href}
                onOpenChange={setOpen}
                icon={item.icon}
                name={item.title}
                // className={"flex items-center"}
              />
            ))}
        </div>

        {/* </ScrollArea> */}
        <Separator className=" my-4" />
        {/* <p className="mb-4">Themes</p> */}
        {/* <ColorThemes setOpen={setOpen} /> */}
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps {
  onOpenChange?: (open: boolean) => void;
  name: string;
  className?: string;
  pathname: string;
  icon: LucideIcon;
  href: string;
}

function MobileLink({
  pathname,
  href,
  onOpenChange,
  className,
  name,
  icon: Icon,
  ...props
}: MobileLinkProps) {
  // const navigate = useNavigate()
  return (
    <Link
      to={href}
      onClick={() => {
        // navigate(href)
        onOpenChange?.(false);
      }}
      className={
        (cn(className),
        pathname.startsWith(href)
          ? "text-primary font-semibold"
          : "text-muted-foreground")
      }
      {...props}
    >
      <div className="flex items-center gap-x-2">
        <Icon />
        <p>{name}</p>
      </div>
    </Link>
  );
}
