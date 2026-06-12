import { Link, usePage } from "@inertiajs/react";
import LayoutUser from "../../../Layouts/User";
import FormRekamGizi from "../../../Forms/RekamGizi";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UserRekamGiziCreate() {
  const { pengguna } = usePage().props;
  return (
    <LayoutUser>
      <div className="page-stack nutrition-create-page">
        <div className="page-header">
          <Link href={"/"} className="back-link" aria-label="Kembali">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Hitung Kebutuhan Gizi</p>
            <p className="page-subtitle">Isi data diri Anda dengan benar</p>
          </div>
        </div>
        <div className="nutrition-create-scroll">
          <FormRekamGizi pengguna={pengguna} type="user" />
        </div>
      </div>
    </LayoutUser>
  );
}
