import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import NewMatchForm from "./new-match-form";

export default function NewMatch() {
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/matches`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="create a match"
        name="Create Match"
      />
      <div className=" max-w-lg">
        <NewMatchForm />
      </div>
    </BackofficeLayout>
  );
}
