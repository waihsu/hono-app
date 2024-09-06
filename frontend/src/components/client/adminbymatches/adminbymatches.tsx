import Heading from "@/components/Heading";
import Layout from "@/components/layout";
import MatchCard from "@/components/matches/match-card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function AdminByMatches() {
  const { adminId } = useParams();
  const { matches, admins } = useAppStore();
  const navigate = useNavigate();

  const validMatches = matches.filter((item) => item.user_id === adminId);
  const validAdmin = admins.find((item) => item.id === adminId);
  return (
    <Layout>
      <div className=" container">
        <Heading
          description=""
          name={String(validAdmin?.username)}
          button={
            <Button
              className=" flex items-center gap-x-2 my-3"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft /> Back
            </Button>
          }
        />
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {validMatches &&
            validMatches.map((item) => (
              <Link to={`/${adminId}/matches/${item.id}`} key={item.id}>
                <MatchCard match={item} />
              </Link>
            ))}
        </div>
      </div>
    </Layout>
  );
}
