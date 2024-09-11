import { Payment } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "../ui/use-toast";
import { User } from "@/store/use-bear-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

export type Transation = {
  id: string;
  admin_id: string | undefined;
  ws: WebSocket | null;
  amount: number;
  token: string;
  name: string;
  user: User | undefined;
  email: string;
  transfer_id: string | null;
  transation_status: "PENDING" | "COMPLETED" | "FAILED";
  phone_number: string;
  payment: Payment | undefined;
  created_At: Date;
};

export const TransationColumns: ColumnDef<Transation>[] = [
  {
    accessorKey: "created_At",
    header: "Created At",
    cell: ({ row }) => {
      const { created_At } = row.original;
      return (
        <div className=" min-w-32">
          <h1>{format(created_At, "MM/dd/yyyy")}</h1>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const date = new Date(row.getValue(columnId));
      console.log(date);
      // console.log(date.getDate() === filterValue.getDate());
      return date.getDate() === filterValue.getDate();
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    // cell: ({ row }) => {
    //   const { user } = row.original;
    //   return (
    //     <div>
    //       <h1>{user?.email}</h1>
    //     </div>
    //   );
    // },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    accessorKey: "transfer_id",
    header: "Transfer ID",
  },
  {
    accessorKey: "transation_status",
    header: "Transaction Status",
    cell: ({ row }) => {
      const { token, user, ws, id, transation_status, admin_id } = row.original;

      async function updateTransation({
        transationId,
        status,
      }: {
        transationId: string;
        status: string;
      }) {
        if (!transationId || !status || !ws)
          return toast({
            title: "All fields must be fill.",
            variant: "destructive",
          });
        const resp = await fetch(`/api/transactions`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Bearer: token,
          },
          body: JSON.stringify({ transationId, status }),
        });
        if (!resp.ok) {
          const { messg } = await resp.json();
          toast({ title: messg, variant: "destructive" });
        } else {
          const { updatedTransatrion } = await resp.json();
          ws.send(
            JSON.stringify({
              type: "updatetransation",
              message: updatedTransatrion,
              sendTo: "singleclient",
              senderId: admin_id,
              receiverId: user?.id,
            })
          );
          toast({ title: "successful" });
        }
      }
      return (
        <div>
          <Select
            defaultValue={transation_status}
            onValueChange={(value: string) =>
              updateTransation({ transationId: id, status: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {["PENDING", "COMPLETED", "FAILED"].map((item, index) => (
                <SelectItem value={item} key={index}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { user, payment } = row.original;
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(user?.id))}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <div>
                <p>{payment?.payment_name}</p>
                <p>{payment?.name}</p>
                <p>{payment?.payment_number}</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
