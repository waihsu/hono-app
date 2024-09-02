import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage({
  blob,
  name,
}: {
  blob: Blob;
  name: string;
}) {
  const imageRef = ref(storage, `images/${name}`);
  const bookUrl = await uploadBytesResumable(imageRef, blob);
  const image_url = await getDownloadURL(imageRef);
  return image_url;
}
