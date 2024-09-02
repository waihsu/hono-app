import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { ArrowLeft, Flag } from "lucide-react";
import { useTokenStore } from "@/store/use-bear-store";
import { useAppStore } from "@/store/use-app-store";
import { toast } from "../ui/use-toast";
import DeleteDialog from "../delete-dialog";
import EditTeamForm from "./edit-team-form";

export default function EditTeam() {
  const { id } = useParams();
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const { teams, removeTeam } = useAppStore();
  const validTeam = teams.find((item) => item.id === id);
  if (!validTeam) return null;
  const onDelete = async () => {
    const resp = await fetch(`/api/teams/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Bearer: token,
      },
    });
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      console.log(messg);
      toast({ title: messg, variant: "destructive" });
    } else {
      const { deletedCountry } = data;
      console.log(deletedCountry);
      removeTeam(deletedCountry);
      toast({ title: "successful" });
      navigate("/backoffice/countries");
    }
  };
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
        description="edit your team"
        name="Edit Team"
      />
      <div>
        <div className=" flex justify-end">
          <DeleteDialog
            children={
              <Button variant={"destructive"}>
                <Flag /> Delete
              </Button>
            }
            onDelete={onDelete}
          />
        </div>
        <div className=" max-w-lg">
          <EditTeamForm team={validTeam} />
        </div>
      </div>
    </BackofficeLayout>
  );
}
