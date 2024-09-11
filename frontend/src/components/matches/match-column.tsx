import { Team } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import TeamCard from "../team-card";
import { format } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { toast } from "../ui/use-toast";
import {
  DropdownMenu,
  // DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

interface MatchColumn {
  ws: WebSocket | null;
  id: string;
  admin_id: string | undefined;
  token: string;
  isPublish: boolean;
  home_team: Team | undefined;
  away_team: Team | undefined;
  match_date: Date;
  match_status: "SCHEDULED" | "ONGOING" | "FINISHED" | "TIMED";
  home_team_score: number;
  away_team_scroe: number;
}

export const matchColumns: ColumnDef<MatchColumn>[] = [
  {
    id: "select",
    header: "Publish",
    cell: ({ row }) => {
      const { admin_id, id, isPublish, token, ws } = row.original;
      // console.log(isPublish);

      if (!admin_id || !ws) return;
      const createPublishMatch = async ({
        admin_id,
        match_id,
      }: {
        admin_id: string;
        match_id: string;
      }) => {
        const resp = await fetch(`/api/publish`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Bearer: token,
          },
          body: JSON.stringify({ admin_id, match_id }),
        });
        if (!resp.ok) {
          const { messg } = await resp.json();
          toast({ title: messg, variant: "destructive" });
        } else {
          const { publishedMatch } = await resp.json();
          ws.send(
            JSON.stringify({
              type: "publishmatch",
              message: publishedMatch,
              sendTo: "client",
            })
          );
        }
      };
      return (
        <Checkbox
          checked={isPublish}
          onCheckedChange={() => createPublishMatch({ admin_id, match_id: id })}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "match_date",
    header: "Date",
    cell: ({ row }) => {
      const { match_date } = row.original;
      return (
        <div>
          <p>{format(match_date, "MM/dd/yyyy'")}</p>
        </div>
      );
    },
  },
  {
    header: "Label",
    cell: ({ row }) => {
      const { home_team, away_team, home_team_score, away_team_scroe } =
        row.original;
      if (!home_team || !away_team) return null;
      return (
        <div className="grid grid-cols-3  min-w-40  p-2 border border-border rounded-md w-full">
          <TeamCard
            image_url={home_team?.image_url}
            name={home_team.shortName}
          />
          <div className="flex items-center justify-center gap-x-2">
            <p className=" text-xs md:text-xl font-bold">{home_team_score}</p>
            <p className="text-xs md:text-xl font-bold">{away_team_scroe}</p>
          </div>

          <TeamCard
            image_url={away_team.image_url}
            name={away_team.shortName}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "match_status",
    header: "Match Status",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link to={`/matches/${id}`}>
              <DropdownMenuItem>Edit match</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
