import { Card } from "../ui/card";

export default function LeagueCard({
  name,
  image_url,
}: {
  name: string;
  image_url: string;
}) {
  return (
    <Card className="h-32 flex flex-col justify-center items-center">
      <div>
        <img src={image_url} alt="" className="w-7 h-7  object-center" />
      </div>
      <p className=" text-center">{name}</p>
    </Card>
  );
}
