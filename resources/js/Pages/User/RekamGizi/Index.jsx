import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarDays,
  faChevronRight,
  faCircleCheck,
  faCircleExclamation,
  faPlus,
  faScaleBalanced,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import LayoutUser from "../../../Layouts/User";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const textValue = String(value);
  const dateTimeMatch = textValue.match(
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/,
  );

  if (dateTimeMatch) {
    return `${dateTimeMatch[1]} ${dateTimeMatch[2]}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const pad = (number) => String(number).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-").concat(
    " ",
    [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(
      ":",
    ),
  );
}

function formatImt(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return value ?? "-";
  }

  return Number.isInteger(number)
    ? number
    : number.toFixed(2).replace(/\.?0+$/, "");
}

function statusTone(status = "") {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("normal")) {
    return {
      className: "is-normal",
      icon: faCircleCheck,
    };
  }

  if (normalizedStatus.includes("obesitas")) {
    return {
      className: "is-warning",
      icon: faCircleExclamation,
    };
  }

  return {
    className: "is-neutral",
    icon: faCircleCheck,
  };
}

export default function UserRekamGiziIndex() {
  const { rekamGizi } = usePage().props;
  const records = Array.isArray(rekamGizi) ? rekamGizi : [];

  return (
    <LayoutUser>
      <div className="page-stack nutrition-history-page">
        <div className="page-header nutrition-history-header">
          <Link href={"/"} className="back-link" aria-label="Kembali">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Riwayat Hasil Perhitungan</p>
            <p className="page-subtitle">
              Pantau perkembangan status gizi Anda
            </p>
          </div>
        </div>

        <div className="nutrition-history-scroll">
          <div className="nutrition-history-list">
            {records.map((rg) => {
              const badge = statusTone(rg.status_gizi ?? "");

              return (
                <Link
                  key={rg.id}
                  href={`/user/rekam-gizi/${rg.id}`}
                  className="nutrition-history-card"
                >
                  <span className="nutrition-history-card__icon">
                    <FontAwesomeIcon icon={faCalendarDays} />
                  </span>

                  <div className="nutrition-history-card__content">
                    <div className="nutrition-history-card__top">
                      <h2>{formatDateTime(rg.tanggal)}</h2>
                      <span
                        className={`nutrition-status-badge ${badge.className}`}
                      >
                        <FontAwesomeIcon icon={badge.icon} />
                        {rg.status_gizi ?? "-"}
                      </span>
                    </div>

                    <div className="nutrition-history-card__meta">
                      <p>
                        <FontAwesomeIcon icon={faScaleBalanced} />
                        <span>
                          IMT: <strong>{formatImt(rg.imt)}</strong>
                        </span>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faShieldHalved} />
                        <span>
                          Status Gizi:{" "}
                          <strong className={badge.className}>
                            {rg.status_gizi ?? "-"}
                          </strong>
                        </span>
                      </p>
                    </div>
                  </div>

                  <span className="nutrition-history-card__arrow">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </span>
                </Link>
              );
            })}
          </div>

          {records.length === 0 && (
            <section className="empty-state">
              <p className="empty-state__title">
                Belum ada riwayat perhitungan gizi.
              </p>
            </section>
          )}
        </div>
      </div>
      <div className="nutrition-history-fab-stack">
        <Link
          href={`/user/rekam-gizi/create`}
          className="nutrition-history-fab"
        >
          <span>
            <FontAwesomeIcon icon={faPlus} />
          </span>
          Tambah Data
        </Link>
      </div>
    </LayoutUser>
  );
}
