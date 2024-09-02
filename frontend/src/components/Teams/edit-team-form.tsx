import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "../ui/use-toast";
import { useAppStore } from "@/store/use-app-store";
import ReactFileDropZone from "../react-drop-zone";
import SelectCountryLeague from "../select-country-league";
import { Team } from "@/types/types";
import { Label } from "../ui/label";

export default function EditTeamForm({ team }: { team: Team }) {
  const { addTeam, countries, leagues } = useAppStore();
  const { token } = useTokenStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState(team.country_id);
  const [leagueId, setLeagueId] = useState(team.league_id);
  const [loading, setLoading] = useState(false);

  // 2. Define a submit handler.
  async function onSubmit() {
    if (!selectedFile) return;
    if (!name || !countryId || !leagueId)
      return toast({
        title: `All fields must be fill. ${!name ? "name need" : ""} ${
          !leagueId ? "league need" : ""
        } ${!countryId ? "country need" : ""}`,
        variant: "destructive",
      });
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", name);
    formData.append("countryId", countryId);
    formData.append("leagueId", leagueId);
    setLoading(true);
    const resp = await fetch("/api/teams", {
      method: "POST",
      headers: {
        Bearer: token,
      },
      body: formData,
    });
    setLoading(false);
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      console.log(messg);
      toast({ title: messg, variant: "destructive" });
    } else {
      const { newTeam } = data;
      console.log(newTeam);
      addTeam(newTeam);
      toast({ title: "successful" });
    }
  }

  return (
    <div>
      <div className="space-y-8">
        {/* Countries */}
        <div>
          <Label>Countries</Label>
          <SelectCountryLeague
            value={countryId}
            data={countries}
            name="Countries"
            setValue={setCountryId}
          />
        </div>
        {/* Leagues */}
        <div>
          <Label>Leagues</Label>
          <SelectCountryLeague
            value={leagueId}
            data={leagues}
            name="Leagues"
            setValue={setLeagueId}
          />
        </div>

        <div>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            placeholder="e.g Chinese"
          />
        </div>

        <ReactFileDropZone
          image_url={team.image_url}
          onFileSelected={setSelectedFile}
          selectedFile={selectedFile as File}
        />

        <Button disabled={loading} onClick={onSubmit}>
          {loading ? "loading..." : "Create"}
        </Button>
      </div>
    </div>
  );
}
