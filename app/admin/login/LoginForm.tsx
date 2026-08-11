"use client";

import { useActionState } from "react";
import { signInAdmin } from "../actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAdmin, { error: "" });

  return (
    <form className="admin-login-form" action={formAction}>
      <label>
        Email
        <input required type="email" name="email" autoComplete="email" />
      </label>
      <label>
        Password
        <input required type="password" name="password" autoComplete="current-password" />
      </label>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Signing In..." : "Sign In"}
      </button>
      {state?.error && <p className="admin-form-error">{state.error}</p>}
    </form>
  );
}
