import React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { User } from "@/types/types";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import { useAdminStore } from "@/store/use-admin-store";

export default function UserCard({ user }: { user: User }) {
  const { payments } = useAdminStore();
  const validPayment = payments.filter(
    (payment) => payment.admin_id === user.id
  );
  console.log(validPayment);
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card>
          <CardHeader>
            <CardTitle>{user.email}</CardTitle>
          </CardHeader>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{user.username}</h4>
            <div className="text-sm">
              {validPayment &&
                validPayment.map((item) => (
                  <div key={item.id}>
                    <p>{item.payment_name}</p>
                    <p>{item.name}</p>
                    <p>{item.payment_number}</p>
                  </div>
                ))}
            </div>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {/* {format(use)} */}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
