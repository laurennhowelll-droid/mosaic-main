"use client";

import { useActionState } from "react";
import { sendClientLoginLink } from "../actions";

export default function ClientLoginForm() {
  const [state, formAction, pending] = useActionState(sendClientLoginLink, null);

  return (
    <form className="admin-login-form client-login-form" action={formAction}>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send My Login Link →"}
      </button>
      {state?.error && <p className="admin-form-error">{state.error}</p>}
      {state?.success && <p className="start-form-message start-form-message-success">{state.success}</p>}
    </form>
  );
}
