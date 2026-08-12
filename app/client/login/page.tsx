import { Shell } from "../../components";
import ClientLoginForm from "./ClientLoginForm";

export default async function ClientLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Shell>
      <section className="client-login-page">
        <div>
          <p className="kicker">Client Workspace</p>
          <h1>Welcome to Mosaic.</h1>
          <p>Enter your email to access your private client workspace.</p>
          {error === "not-authorized" && (
            <p className="admin-form-error">This email does not have access to a Mosaic client workspace yet.</p>
          )}
        </div>
        <ClientLoginForm />
      </section>
    </Shell>
  );
}
