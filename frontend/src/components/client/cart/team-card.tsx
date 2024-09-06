export default function TeamCard({
  name,
  image_url,
}: {
  name: string;
  image_url: string;
}) {
  return (
    <div className="flex w-full justify-center items-center gap-2">
      <p className="text-xs sm:text-sm text-center  text-pretty">{name}</p>

      <img
        src={image_url}
        alt=""
        className="w-6 h-6 sm:w-12 sm:h-12 object-center"
      />
    </div>
  );
}
