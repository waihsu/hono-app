import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import NewRunningLeageForm from "./new-running-league-form";

export default function NewRunningLeague() {
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/runningleagues`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="create a running league"
        name="New Running Leagues"
      />
      <div>
        <NewRunningLeageForm />
      </div>
    </BackofficeLayout>
  );
}
