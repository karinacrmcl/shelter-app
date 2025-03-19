import { useForm, SubmitHandler } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { useSigninMutation } from "../../../store/api/authApi";
import s from "./AuthForm.module.scss";

type FormInputs = {
  email: string;
  name: string;
};

export default function AuthForm() {
  const [signIn, { isLoading, isError }] = useSigninMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await signIn(data).unwrap();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form className={s.container} onSubmit={handleSubmit(onSubmit)}>
      <h3>Sign in</h3>

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Invalid email address",
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        {...register("name", {
          required: "Name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
          },
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      {isError && <p className={s.error}>Login failed. Please try again.</p>}
    </form>
  );
}
