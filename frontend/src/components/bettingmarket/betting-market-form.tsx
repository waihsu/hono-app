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
import { useParams } from "react-router-dom";
import { useAdminStore } from "@/store/use-admin-store";

const formSchema = z.object({
  publish_match_id: z.string(),
  market_type: z.string(),
});

export default function BettingMarketForm() {
  const { publishMatchId } = useParams();
  const { token } = useTokenStore();
  const { addBettingMarket, ws } = useAdminStore();
  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publish_match_id: publishMatchId,
      market_type: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!ws) return;
    setLoading(true);
    const resp = await fetch("/api/bettingmarkets", {
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
      const { newBettingMarket } = data;
      addBettingMarket(newBettingMarket);
      ws.send(
        JSON.stringify({
          type: "newbettingmarket",
          message: newBettingMarket,
          sendTo: "client",
        })
      );
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
        <Button disabled={loading} type="submit">
          {loading ? "loading..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
