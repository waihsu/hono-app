import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import NewLeageForm from "./new-league-form";

export default function NewLeague() {
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/leagues`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="create a league"
        name="New Leagues"
      />
      <div>
        <NewLeageForm />
      </div>
    </BackofficeLayout>
  );
}
