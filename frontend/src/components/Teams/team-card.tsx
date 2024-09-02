export default function TeamCard({
  name,
  image_url,
}: {
  name: string;
  image_url: string;
}) {
  return (
    <div className="bg-card border p-4 flex flex-col justify-center items-center gap-2 rounded-md">
      <div>{name}</div>
      <div className="rounded-full overflow-hidden w-32 h-32 ">
        <img src={image_url} alt="" className="w-full h-full object-center" />
      </div>
    </div>
  );
}
