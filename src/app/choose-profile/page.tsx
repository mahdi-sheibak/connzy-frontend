"use client";
import { useState } from "react";

import { ChooseProfileType } from "@/components/choose-profile/choose-type";
import { ChooseProfileForm } from "@/components/choose-profile/form";
import { USER_TYPE } from "@/enum";

export default function ChooseProfilePage() {
  const [userType, setUserType] = useState<USER_TYPE>(USER_TYPE.CUSTOMER);

  return (
    <section className="flex flex-col gap-5 px-3 items-center">
      <ChooseProfileType
        userType={userType}
        onChange={(newUserType) => setUserType(newUserType)}
      />

      <ChooseProfileForm userType={userType} />
    </section>
  );
}
