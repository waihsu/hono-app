import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "../ui/use-toast";
import { useAppStore } from "@/store/use-app-store";
import SelectCountryLeague from "../select-country-league";
import { Odd } from "@/types/types";

const formSchema = z.object({
  id: z.string(),
  betting_market_id: z.string(),
  outcome: z.string(),
  odd_value: z.string(),
  team_id: z.string(),
});

export default function EditOddForm({
  odd,
  data,
}: {
  odd: Odd;
  data: { id: string; name: string }[];
}) {
  const { addOdd } = useAppStore();
  const { token } = useTokenStore();
  const [loading, setLoading] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: odd.id,
      betting_market_id: odd.betting_market_id,
      odd_value: String(odd.odd_value),
      outcome: odd.outcome,
      team_id: odd.team_id,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.team_id = selectedTeamId;
    setLoading(true);
    const resp = await fetch("/api/odds", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Bearer: token,
      },
      body: JSON.stringify(values),
    });
    setLoading(false);
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      console.log(messg);
      toast({ title: messg, variant: "destructive" });
    } else {
      const { newOdd } = data;
      console.log(newOdd);
      addOdd(newOdd);
      toast({ title: "successful" });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="outcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g Over/Under" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="odd_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g 1.5" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <SelectCountryLeague
            value={odd.team_id}
            data={data}
            name="Team"
            setValue={(value: string) => setSelectedTeamId(value)}
          />
        </div>
        <Button disabled={loading} type="submit">
          {loading ? "loading..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}
