import React from "react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { DatePickerWithRange } from "../date-picker-with-range";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { ArrowLeftRight, CreditCard, Users } from "lucide-react";
import BackofficeItemCard from "../backoffice-item-card";

export default function BackofficeDashboard() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  //   console.log(date);

  return (
    <BackofficeLayout>
      <Heading button description="" name="Dashboard" />
      <div>
        <div>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <BackofficeItemCard
            icon={
              <Users className="h-4 w-4 md:h-8 md:w-8 text-muted-foreground" />
            }
            name="Total Users"
            value="1000"
          />
          <BackofficeItemCard
            icon={
              <CreditCard className="h-4 w4 md:h-8 md:w-8 text-muted-foreground" />
            }
            name="Bets"
            value="300"
          />
          <BackofficeItemCard
            icon={
              <ArrowLeftRight className="h-4 w4 md:h-8 md:w-8 text-muted-foreground" />
            }
            name="Transations"
            value="2000"
          />
        </div>
        <div className=" my-10">{/* <Overview prices={prices} /> */}</div>
      </div>
    </BackofficeLayout>
  );
}
