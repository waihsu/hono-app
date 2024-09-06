import Layout from "@/components/layout";
import { useAppStore } from "@/store/use-app-store";
import React from "react";

export default function TransationHistroy() {
  const { userTransations } = useAppStore();
  console.log(userTransations);
  return (
    <Layout>
      <div></div>
    </Layout>
  );
}
