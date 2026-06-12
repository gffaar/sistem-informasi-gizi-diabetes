import { Link } from "@inertiajs/react";
import FormLogin from "../Forms/Login";
import LayoutMain from "../Layouts/Main";
import Logo from "../Assets/512.png";

export default function Login() {
  return (
    <LayoutMain>
      <div className="app-auth">
        <div className="auth-card">
          <img src={Logo} alt="Logo" className="auth-logo" />
          <FormLogin />
          <p className="auth-text text-center mt-4">
            Belum punya akun silahkan{" "}
            <Link className="auth-link" href="/daftar">
              Daftar Disini
            </Link>
          </p>
        </div>
      </div>
    </LayoutMain>
  );
}
