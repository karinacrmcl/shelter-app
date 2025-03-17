import React from "react";
import s from "./AuthForm.module.scss";

type Props = {};

export default function AuthForm({}: Props) {
  return (
    <form className={s.container}>
      <h3>Sign in</h3>
      <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="filled-basic" label="Filled" variant="filled" />
    </form>
  );
}
