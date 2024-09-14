import { formatted } from "@/lib/client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  // DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

interface ColumnDefProps {
  ws: WebSocket | null;
  user_id: string;
  username: string;
  email: string;
  account_status: string;
  balance: number;
  token: string;
  adminId: string;
}

export const columns: ColumnDef<ColumnDefProps>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const { balance } = row.original;
      return <div>{formatted(balance)}</div>;
    },
  },
  {
    accessorKey: "account_status",
    header: "Account Status",
    cell: ({ row }) => {
      const { user_id, token, ws, account_status, adminId } = row.original;

      async function updateStatus({
        userId,
        account_status,
      }: {
        userId: string;
        account_status: string;
      }) {
        if (!userId || !account_status)
          return toast({
            title: "All fields must be fill.",
            variant: "destructive",
          });
        if (!ws) return toast({ title: "Websocket con...." });
        const resp = await fetch(`/api/admin/userstatus/${adminId}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Bearer: token,
          },
          body: JSON.stringify({ userId, account_status }),
        });
        if (!resp.ok) {
          const { messg } = await resp.json();
          toast({ title: messg, variant: "destructive" });
        } else {
          const { updatedUserStatus } = await resp.json();
          ws.send(
            JSON.stringify({
              type: "customerstatus",
              message: updatedUserStatus,
              sendTo: "client",
              senderId: adminId,
              receiverId: user_id,
            })
          );
          toast({ title: "successful" });
        }
      }
      return (
        <div>
          <Select
            defaultValue={account_status}
            onValueChange={(value: string) =>
              updateStatus({ userId: user_id, account_status: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {["SUSPENDED", "ACTIVE", "BAN"].map((item, index) => (
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { user_id } = row.original;
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
            <DropdownMenuItem>
              <Link to={`/customers/${user_id}`}>View customer</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`/customers/${user_id}/payments`}>
                View payment details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
