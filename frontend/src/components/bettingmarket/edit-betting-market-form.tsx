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
import { toast } from "@/components/ui/use-toast";
import { BettingMarket } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAdminStore } from "@/store/use-admin-store";

const formSchema = z.object({
  id: z.string(),
  publish_match_id: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  market_type: z.string(),
  market_status: z.string(),
});

export default function EditBettingMarketForm({
  bettingMarket,
}: {
  bettingMarket: BettingMarket;
}) {
  const { ws, updateBettingMarket } = useAdminStore();
  const { token } = useTokenStore();
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: bettingMarket.id,
      publish_match_id: bettingMarket.publish_match_id,
      market_type: bettingMarket.market_type,
      market_status: bettingMarket.market_status,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!ws) return;
    setLoading(true);
    const resp = await fetch("/api/bettingmarkets", {
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
      const { updatedBettingMarket } = data;

      ws.send(
        JSON.stringify({
          type: "editbettingmarket",
          message: updatedBettingMarket,
          sendTo: "client",
        })
      );
      updateBettingMarket(updatedBettingMarket);
      toast({ title: "successful" });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="market_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g., "Match Winner", "Total Goals"'
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="market_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Market Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OPEN">OPEN</SelectItem>
                  <SelectItem value="CLOSE">CLOSE</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {loading ? "loading..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}
