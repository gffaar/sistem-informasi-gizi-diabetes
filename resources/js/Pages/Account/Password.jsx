import { usePage } from "@inertiajs/react";
import FormAccountPassword from "../../Forms/AccountPassword";
import FormAccountSettings from "../../Forms/AccountSettings";
import LayoutAdmin from "../../Layouts/Admin";
import LayoutUser from "../../Layouts/User";

export default function AccountPassword() {
  const { user, profil, profilUser } = usePage().props;
  const Layout = user?.role === "admin" ? LayoutAdmin : LayoutUser;

  return (
    <Layout>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Pengaturan</p>
            <p className="page-subtitle">
              Kelola profil dan keamanan akun Anda
            </p>
          </div>
        </div>
        <FormAccountSettings
          user={user}
          profil={profil || user?.pengguna}
          profilUser={profilUser || user?.profil_user}
        />
        <FormAccountPassword />
      </div>
    </Layout>
  );
}
