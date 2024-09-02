import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import NewTeamForm from "./new-team-form";

export default function NewTeam() {
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/teams`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="create a Team"
        name="Create Team"
      />
      <div className=" max-w-lg">
        <NewTeamForm />
      </div>
    </BackofficeLayout>
  );
}
