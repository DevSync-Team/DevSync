import { SigninForm } from "@/screens";
import React, { Suspense } from "react";

const SignInPage = () => {
  return (
    <Suspense>
      <SigninForm />
    </Suspense>
  );
};

export default SignInPage;
