import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faAt,
  faCakeCandles,
  faCalendarDays,
  faEnvelope,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import LayoutUser from "../../Layouts/User";

const fallbackPhoto = "/no_profile_picture.png";

function displayValue(value, fallback = "-") {
  return value || fallback;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function calculateAge(dateValue) {
  if (!dateValue) {
    return null;
  }

  const birthDate = new Date(dateValue);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="account-info-item">
      <span className="account-info-item__icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{displayValue(value)}</strong>
      </div>
    </div>
  );
}

export default function AccountProfileUser() {
  const { user, profil, profilUser } = usePage().props;
  const healthProfile = profil || user?.pengguna || {};
  const accountProfile = profilUser || user?.profil_user || {};
  const profilePhoto = user?.foto ? `/storage/${user.foto}` : fallbackPhoto;
  const gender =
    accountProfile?.jenis_kelamin || healthProfile?.jenis_kelamin || "";
  const birthDate =
    accountProfile?.tanggal_lahir || healthProfile?.tanggal_lahir || "";
  const age =
    accountProfile?.umur ?? healthProfile?.umur ?? calculateAge(birthDate);

  return (
    <LayoutUser>
      <div className="account-info-page">
        <header className="account-info-header">
          <Link href="/account" className="account-info-back">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Kembali</span>
          </Link>

          <div>
            <h1>Informasi Pengguna</h1>
            <p>Detail akun pengguna yang sedang login</p>
          </div>
        </header>

        <section className="account-info-card">
          <div className="account-info-profile">
            <img src={profilePhoto} alt="Foto Profil" />
          </div>

          <div className="account-info-grid">
            <InfoItem
              icon={faUser}
              label="Nama Lengkap"
              value={user?.nama}
            />
            <InfoItem
              icon={faAt}
              label="Username"
              value={user?.username}
            />
            <InfoItem
              icon={faEnvelope}
              label="Email"
              value={user?.email}
            />
            <InfoItem
              icon={faVenusMars}
              label="Jenis Kelamin"
              value={gender}
            />
            <InfoItem
              icon={faCalendarDays}
              label="Tanggal Lahir"
              value={formatDate(birthDate)}
            />
            <InfoItem
              icon={faCakeCandles}
              label="Umur"
              value={age !== null && age !== undefined ? `${age} tahun` : "-"}
            />
          </div>
        </section>
      </div>
    </LayoutUser>
  );
}
