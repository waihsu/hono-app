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
import SelectCountryLeague from "../select-country-league";

const formSchema = z.object({
  betting_market_id: z.string(),
  outcome: z.string(),
  odd_value: z.string(),
  team_id: z.string(),
});

export default function NewOddForm({
  bettingMarketId,
  data,
}: {
  bettingMarketId: string;
  data: { id: string; name: string }[];
}) {
  const { token } = useTokenStore();
  const [loading, setLoading] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const socket = new WebSocket(`/ws/actions?type=newodd`);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      betting_market_id: bettingMarketId,
      odd_value: "",
      outcome: "",
      team_id: selectedTeamId,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.team_id = selectedTeamId;
    setLoading(true);
    const resp = await fetch("/api/odds", {
      method: "POST",
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
      socket.send(JSON.stringify(newOdd));
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
            data={data}
            name="Team"
            setValue={(value: string) => setSelectedTeamId(value)}
          />
        </div>
        <Button disabled={loading} type="submit">
          {loading ? "loading..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
