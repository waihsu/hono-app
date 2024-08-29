import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useTokenStore } from "@/store/use-bear-store";

export function SignOut() {
  const { setUser, addToken } = useTokenStore();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"} size={"sm"} className="w-full text-start">
          Sign Out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Are you absolutely sure?</DialogTitle>

          <DialogClose asChild>
            <Button
              variant={"outline"}
              size={"sm"}
              className="w-full text-start"
              type="reset"
            >
              Cancle
            </Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            size={"sm"}
            className="w-full text-start"
            type="submit"
            onClick={() => {
              setUser(null);
              addToken("");
            }}
          >
            Sign Out
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
