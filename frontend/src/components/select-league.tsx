import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminStore } from "@/store/use-admin-store";

interface SelectCountryLeagueProps {
  name: string;
  setValue: (value: string) => void;
}

export default function SelectLeague({
  name,
  setValue,
}: SelectCountryLeagueProps) {
  const { leagues } = useAdminStore();
  return (
    <div>
      <Select onValueChange={(value) => setValue(value)}>
        <SelectTrigger>
          <SelectValue placeholder={name} />
        </SelectTrigger>
        <SelectContent>
          {leagues.map((item, index) => (
            <SelectItem value={item.name} key={index}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
