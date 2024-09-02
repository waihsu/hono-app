import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectCountryLeagueProps {
  data: { id: string; name: string }[];
  name: string;
  setValue: (value: string) => void;
  value?: string;
}

export default function SelectCountryLeague({
  data,
  name,
  setValue,
  value,
}: SelectCountryLeagueProps) {
  return (
    <div>
      <Select
        value={value}
        onValueChange={(value) => setValue(value)}
        defaultValue={value}
      >
        <SelectTrigger>
          <SelectValue placeholder={name} />
        </SelectTrigger>
        <SelectContent>
          {data.map((item) => (
            <SelectItem value={item.id} key={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
