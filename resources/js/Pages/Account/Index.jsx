import { Link, usePage } from "@inertiajs/react";
import LayoutAdmin from "../../Layouts/Admin";
import LayoutUser from "../../Layouts/User";
import AdminProfileForm from "../../Forms/AdminProfile";
import FormAccountPassword from "../../Forms/AccountPassword";
import { confirmLogout } from "../../Utils/confirmLogout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faCircleUser,
  faGear,
  faKitMedical,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const fallbackPhoto = "/no_profile_picture.png";

function displayValue(value, fallback = "-") {
  return value || fallback;
}

export default function AccountIndex() {
  const { user, supportsEmail = false } = usePage().props;
  const profilePhoto = user?.foto ? `/storage/${user.foto}` : fallbackPhoto;
  const isAdmin = user?.role === "admin";
  const profileMenu = [
    {
      href: "/account/profil-user",
      label: "Profil",
      icon: faCircleUser,
      tone: "profile-legacy-menu-card--teal",
    },
    {
      href: "/user/rekam-gizi",
      label: "Data Kesehatan",
      icon: faKitMedical,
      tone: "profile-legacy-menu-card--teal",
    },
    {
      href: "/account/password",
      label: "Pengaturan",
      icon: faGear,
      tone: "profile-legacy-menu-card--teal",
    },
  ];

  if (isAdmin) {
    return (
      <LayoutAdmin>
        <div className="page-stack admin-settings-page">
          <div className="admin-settings-panel-stack">
            <AdminProfileForm user={user} supportsEmail={supportsEmail} />
            <FormAccountPassword
              id="ubah-password"
              title="Ubah Password"
              description="Perbarui keamanan akun"
            />
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutUser>
      <div className="profile-legacy-screen" aria-labelledby="profile-title">
        <header className="profile-legacy-header">
          <div>
            <h1 id="profile-title">Profil</h1>
            <p>Akses profil dan pengaturan akun</p>
          </div>
        </header>

        <section className="profile-legacy-card">
          <div className="profile-legacy-hero">
            <div className="profile-legacy-avatar">
              <img src={profilePhoto} alt="Foto Profil" />
            </div>
          </div>

          <div className="profile-legacy-body">
            <div className="profile-legacy-identity">
              <h2>{displayValue(user?.nama, "User")}</h2>
              <p>@{displayValue(user?.username, "user")}</p>
            </div>

            <nav className="profile-legacy-menu" aria-label="Menu profil">
              {profileMenu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`profile-legacy-menu-card ${item.tone}`}
                >
                  <span className="profile-legacy-menu-icon">
                    <FontAwesomeIcon icon={item.icon} />
                  </span>
                  <span className="profile-legacy-menu-label">
                    {item.label}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="profile-legacy-menu-arrow"
                  />
                </Link>
              ))}

              <button
                type="button"
                onClick={confirmLogout}
                className="profile-legacy-menu-card profile-legacy-menu-card--danger"
              >
                <span className="profile-legacy-menu-icon">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </span>
                <span className="profile-legacy-menu-label">Keluar</span>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="profile-legacy-menu-arrow"
                />
              </button>
            </nav>
          </div>
        </section>
      </div>
    </LayoutUser>
  );
}
