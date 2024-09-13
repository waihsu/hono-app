import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";
import CountryCard from "./country-card";

export default function Countries() {
  const { countries } = useAdminStore();
  // console.log(countries);
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/countries/new`}
          >
            <PlusCircle /> New Country
          </Link>
        }
        description="customize countries"
        name="Countries"
      />
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {countries &&
          countries.map((item) => (
            <Link to={`/countries/${item.id}`} key={item.id}>
              <CountryCard name={item.name} image_url={item.flag} />
            </Link>
          ))}
      </div>
    </BackofficeLayout>
  );
}
