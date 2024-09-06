import { ColumnDef } from "@tanstack/react-table";
// import {
//   DropdownMenu,
//   // DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";
// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Match, Odd, Team } from "@/types/types";
import { toast } from "../ui/use-toast";
import { User } from "@/store/use-bear-store";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import DeleteDialog from "../delete-dialog";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }

interface ColumnType {
  token: string;
  id: string;
  status: string;
  user: User | undefined;
  email: string;
  amount: number;
  match: {
    validAwayTeam: Team | undefined;
    validHomeTeam: Team | undefined;
    match: Match;
  };
  odd: {
    validOddTeam: Team | undefined;
    validOdds: Odd | undefined;
  };
  created_At: Date;
}
// "PENDING" | "WON" | "LOST" | "CANCLED"
export const betColumns: ColumnDef<ColumnType>[] = [
  {
    accessorKey: "email",
    header: "Email",
    // cell: ({ row }) => {
    //   const email = row.original.user?.email;
    //   return (
    //     <div>
    //       <p>{email}</p>
    //     </div>
    //   );
    // },
  },

  {
    accessorKey: "match",
    header: "Match",
    cell: ({ row }) => {
      const { validAwayTeam, validHomeTeam, match } = row.original.match;
      // const {bets} = useAdminStore()
      return (
        <div className="grid grid-cols-3  max-w-xs min-w-40  p-2 border border-border rounded-md w-full">
          <div className="flex w-full justify-center items-center gap-2 ">
            {/* <p className="text-xs sm:text-sm text-center  text-pretty hidden lg:flex">
              {validHomeTeam?.name}
            </p> */}

            <img
              src={validHomeTeam?.image_url}
              alt=""
              className="w-6 h-6 md:w-8 md:h-8 object-center"
            />
          </div>
          <div className="flex items-center justify-center gap-x-2">
            <p className=" text-xs md:text-xl font-bold">
              {match?.home_team_score}
            </p>
            <p className="text-xs md:text-xl font-bold">
              {match?.away_team_scroe}
            </p>
          </div>

          <div className="flex w-full justify-center items-center gap-2">
            <img
              src={validAwayTeam?.image_url}
              alt=""
              className="w-6 h-6 md:w-8 md:h-8 object-center"
            />
            {/* <p className="text-xs sm:text-sm text-center  text-pretty hidden lg:flex">
              {validAwayTeam?.name}
            </p> */}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "odd",
    header: "Odd",
    cell: ({ row }) => {
      const { validOddTeam, validOdds } = row.original.odd;

      return (
        <div className="grid grid-cols-2  max-w-xs min-w-40 gap-2 p-2 border border-border rounded-md w-full">
          <div className="flex w-full justify-center items-center gap-2 ">
            {/* <p className="text-xs sm:text-sm text-center  text-pretty hidden lg:flex">
              {validOddTeam?.name}
            </p> */}

            <img
              src={validOddTeam?.image_url}
              alt=""
              className="w-6 h-6 md:w-8 md:h-8 object-center"
            />
          </div>
          <div className="flex items-center justify-between">
            <p>{validOdds?.outcome}</p>
            <p>{validOdds?.odd_value}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className=" flex justify-end items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status, id, token, user } = row.original;
      const socket = new WebSocket(
        `ws://localhost:3000/ws/actions?type=${user?.id}`
      );
      async function updateStatus({
        betId,
        status,
      }: {
        betId: string;
        status: string;
      }) {
        if (!betId || !status)
          return toast({
            title: "All fields must be fill.",
            variant: "destructive",
          });
        const resp = await fetch(`/api/bets/status`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Bearer: token,
          },
          body: JSON.stringify({ betId, status }),
        });
        if (!resp.ok) {
          const { messg } = await resp.json();
          toast({ title: messg, variant: "destructive" });
        } else {
          const { updatedBet } = await resp.json();
          socket.send(JSON.stringify(updatedBet));
          toast({ title: "successful" });
        }
      }
      return (
        <div>
          <Select
            defaultValue={status}
            onValueChange={(value: string) =>
              updateStatus({ betId: id, status: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {["PENDING", "WON", "LOST", "CANCLED"].map((item, index) => (
                <DeleteDialog
                  key={index}
                  children={
                    <SelectItem value={item} key={index}>
                      {item}
                    </SelectItem>
                  }
                  onDelete={() => updateStatus({ betId: id, status: item })}
                />
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
  {
    accessorKey: "created_At",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.created_At;
      return <div>{format(date, "MM/dd/yyyy")}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const date = new Date(row.getValue(columnId));
      // console.log(date.getDate() === filterValue.getDate());
      return date.getDate() === filterValue.getDate();
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <DotsHorizontalIcon className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>

  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
