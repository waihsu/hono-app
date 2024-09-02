import { Odd } from "@/types/types";

import OddCard from "./odd-card";

export default function OddCardList({
  odds,
  className,
}: {
  odds: Odd[];
  className: string;
}) {
  return (
    <div className={className}>
      {odds && odds.map((item) => <OddCard odd={item} key={item.id} />)}
    </div>
  );
}
