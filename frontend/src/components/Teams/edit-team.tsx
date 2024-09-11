import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { ArrowLeft, Flag } from "lucide-react";
import { useTokenStore } from "@/store/use-bear-store";
import { useAdminStore } from "@/store/use-admin-store";
import { toast } from "../ui/use-toast";
import DeleteDialog from "../delete-dialog";
import EditTeamForm from "./edit-team-form";

export default function EditTeam() {
  const { teamId } = useParams();
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const { teams, removeTeam } = useAdminStore();
  const validTeam = teams.find((item) => item.id === teamId);
  if (!validTeam) return null;
  const onDelete = async () => {
    const resp = await fetch(`/api/teams/${teamId}`, {
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
      const { deletedTeam } = data;
      console.log(deletedTeam);
      removeTeam(deletedTeam);
      toast({ title: "successful" });
      navigate("/teams");
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
            to={`/teams`}
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
        <div className="container">
          <EditTeamForm team={validTeam} />
        </div>
      </div>
    </BackofficeLayout>
  );
}
