import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function TeamCard({
  name,
  image_url,
}: {
  name: string;
  image_url: string;
}) {
  return (
    <Card className="aspect-square">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={image_url} alt="" className="w-full h-full object-center" />
      </CardContent>
    </Card>
  );
}
