import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";
import { ProfileForm } from "./profile-form";
import SettingLayout from "./setting-layout";

export default function Settings() {
  return (
    <BackofficeLayout>
      <Heading button description="customize your data" name="Setting" />

      <SettingLayout>
        <ProfileForm />
      </SettingLayout>
    </BackofficeLayout>
  );
}
