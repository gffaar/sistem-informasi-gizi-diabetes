import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import FormAccountEdit from "../../../Forms/AccountEdit";
import LayoutUser from "../../../Layouts/User";
import LayoutAdmin from "../../../Layouts/Admin";

export default function InformasiDataPribadiUserIndex() {
  const { user, profil, profilUser } = usePage().props;
  const Layout = user?.role === "admin" ? LayoutAdmin : LayoutUser;

  return (
    <Layout>
      <div className="page-stack">
        <div className="page-header">
          <Link href="/account" className="back-link" aria-label="Kembali">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Informasi Data Pribadi </p>
            <p className="page-subtitle">
              Kelola data pribadi, kesehatan, dan akun
            </p>
          </div>
        </div>
        <FormAccountEdit
          pengguna={profil || user.pengguna}
          profilUser={profilUser || user.profil_user}
          user={user}
          action="/informasi-data-pribadi-user/update"
          showAccountSettings={false}
        />
      </div>
    </Layout>
  );
}
