import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import NewCountryForm from "./new-country-form";

export default function NewCountry() {
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/countries`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="create a Country"
        name="Create Country"
      />
      <div>
        <NewCountryForm />
      </div>
    </BackofficeLayout>
  );
}
