import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { useTokenStore } from "@/store/use-bear-store";
import { DropdownProfile } from "./DropDownProfile";

export default function MainNav({ name }: { name: string }) {
  const { user } = useTokenStore();
  return (
    <div className="min-w-full flex justify-between items-center  z-20 shadow-lg py-4 px-4 sm:px-8 sticky top-0 backdrop-blur-sm bg-background/90  supports-[backdrop-filter]:bg-background/10">
      <div className="flex items-center mx-2 py-2 gap-x-3">
        <div className="text-xl sm:text-4xl font-bold">
          <Link to={"/"}>{name}</Link>
        </div>
        {/* <div className="relative">
          <Search className=" absolute top-2 left-2 text-slate-600" />

          <Input
            className="w-full md:w-[300px] pl-9 rounded-full  "
            type="text"
            onChange={(ev) => setSearchName(ev.target.value)}
            placeholder="search a store"
          />
        </div> */}
      </div>
      <div className="flex gap-2 items-center">
        {user ? (
          <DropdownProfile user={user} />
        ) : (
          <span className=" cursor-pointer py-1 rounded-md px-3 text-xs border border-input bg-background shadow-sm hover:bg-accent hover:text-primary">
            <Link to={`/login`}>Login</Link>
          </span>
        )}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
