import React from "react";
import AuthForm from "../../widgets/auth/form/AuthForm";
import s from "./Auth.module.scss";

export default function Auth() {
  return (
    <div className={s.container}>
      <AuthForm />
    </div>
  );
}
