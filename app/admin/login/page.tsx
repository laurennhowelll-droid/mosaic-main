import { Shell } from "../../components";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <Shell>
      <section className="admin-login-page">
        <div>
          <p className="kicker">Mosaic Admin</p>
          <h1>Owner sign in.</h1>
          <p>Private access for reviewing inquiries and managing the Mosaic lead pipeline.</p>
        </div>
        <LoginForm />
      </section>
    </Shell>
  );
}
