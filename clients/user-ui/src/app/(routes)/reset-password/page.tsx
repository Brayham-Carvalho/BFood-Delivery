import ResetPasword from "@/src/shared/Auth/ResetPassword";
import React from "react";

const Page = ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  const activationToken = searchParams["verify"] ?? "";
  return (
    <div>
      <ResetPasword activationToken={activationToken} />
    </div>
  );
};

export default Page;
