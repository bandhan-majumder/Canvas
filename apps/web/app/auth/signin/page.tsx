import Authentication from "@/component/Auth";
import React from "react";

function SignIn() {
  return (
    <div>
      <Authentication isSignIn={true} />
    </div>
  );
}

export default SignIn;
