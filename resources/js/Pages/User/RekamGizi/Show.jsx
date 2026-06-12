import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import LayoutUser from "../../../Layouts/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import {
  faArrowLeft,
  faBowlFood,
  faChevronDown,
  faCircleCheck,
  faDroplet,
  faFire,
  faFloppyDisk,
  faLeaf,
  faNotesMedical,
  faPersonWalking,
  faRotateLeft,
  faRulerVertical,
  faScaleBalanced,
  faTableList,
  faUserClock,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";

function formatNumber(value, decimals = 1) {
  const rounded = Number(value || 0).toFixed(decimals);

  return rounded.endsWith(".0") ? parseInt(rounded) : rounded;
}

function displayValue(value, fallback = "-") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
}

function displayUnit(value, unit) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return `${value} ${unit}`;
}

function inferActivity(rekamGizi) {
  const bmr = Number(rekamGizi?.bmr || 0);
  const tee = Number(rekamGizi?.tee || 0);

  if (!bmr || !tee) {
    return "-";
  }

  const ratio = tee / bmr;
  const factors = [
    { label: "Sangat Ringan", value: 1.2 },
    { label: "Ringan", value: 1.4 },
    { label: "Sedang", value: 1.7 },
    { label: "Berat", value: 2.0 },
  ];

  return factors.reduce((closest, item) =>
    Math.abs(item.value - ratio) < Math.abs(closest.value - ratio)
      ? item
      : closest,
  ).label;
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="nutrition-data-item">
      <span className="nutrition-data-item__icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function ResultItem({ icon, label, value, unit, highlight = false }) {
  return (
    <div className={`nutrition-result-item ${highlight ? "is-highlight" : ""}`}>
      <span className="nutrition-result-item__icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {unit && <small>{unit}</small>}
      </div>
    </div>
  );
}

export default function UserRekamGiziShow() {
  const { rekamGizi } = usePage().props;
  const [savingResult, setSavingResult] = useState(false);
  const kaloriTotal = Number(rekamGizi?.kalori_total || 0);
  const beratBadan = Number(rekamGizi?.berat_badan || 0);
  const serat = rekamGizi?.serat ?? (kaloriTotal ? (kaloriTotal / 1000) * 14 : 0);
  const airMl = rekamGizi?.cairan ?? (beratBadan ? beratBadan * 30 : 0);
  const aktivitas = inferActivity(rekamGizi);

  const summaryData = [
    {
      icon: faUserClock,
      label: "Umur",
      value: displayUnit(rekamGizi.usia, "tahun"),
    },
    {
      icon: faVenusMars,
      label: "Jenis Kelamin",
      value: displayValue(rekamGizi.jenis_kelamin),
    },
    {
      icon: faScaleBalanced,
      label: "Berat Badan",
      value: displayUnit(rekamGizi.berat_badan, "kg"),
    },
    {
      icon: faRulerVertical,
      label: "Tinggi Badan",
      value: displayUnit(rekamGizi.tinggi_badan, "cm"),
    },
    {
      icon: faPersonWalking,
      label: "Aktivitas",
      value: aktivitas,
    },
    {
      icon: faNotesMedical,
      label: "Riwayat Diabetes",
      value: displayValue(rekamGizi.riwayat_diabetes),
    },
    {
      icon: faDroplet,
      label: "Kadar Gula Darah",
      value:
        rekamGizi.kadar_gula_darah === null ||
        rekamGizi.kadar_gula_darah === undefined
          ? "-"
          : `${formatNumber(rekamGizi.kadar_gula_darah)} mg/dl`,
    },
  ];

  const resultData = [
    {
      icon: faFire,
      label: "Energi",
      value: kaloriTotal ? parseInt(kaloriTotal) : 0,
      unit: "kkal",
      highlight: true,
    },
    {
      icon: faBowlFood,
      label: "Karbohidrat",
      value: formatNumber(rekamGizi.karbohidrat),
      unit: "gr",
    },
    {
      icon: faBowlFood,
      label: "Protein",
      value: formatNumber(rekamGizi.protein),
      unit: "gr",
    },
    {
      icon: faBowlFood,
      label: "Lemak",
      value: formatNumber(rekamGizi.lemak),
      unit: "gr",
    },
    {
      icon: faLeaf,
      label: "Serat",
      value: formatNumber(serat),
      unit: "gr",
    },
    {
      icon: faDroplet,
      label: "Cairan",
      value: formatNumber(airMl, 0),
      unit: "ml",
    },
  ];

  function saveResult() {
    if (savingResult) {
      return;
    }

    setSavingResult(true);

    router.post(
      `/user/rekam-gizi/${rekamGizi.id}/simpan-hasil`,
      {},
      {
        preserveScroll: true,
        onSuccess: async () => {
          await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Data nutrisi harian berhasil disimpan.",
            timer: 1600,
            showConfirmButton: false,
            confirmButtonColor: "#0f766e",
          });

          router.visit("/user/menu-rekomendasi");
        },
        onError: () => {
          setSavingResult(false);
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Data nutrisi harian belum berhasil disimpan.",
            confirmButtonColor: "#0f766e",
          });
        },
      },
    );
  }

  return (
    <LayoutUser>
      <div className="page-stack nutrition-result-page">
        <div className="page-header">
          <Link
            href="/user/rekam-gizi/create"
            className="back-link"
            aria-label="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Hasil Perhitungan</p>
            <p className="page-subtitle">Ringkasan kebutuhan gizi harian</p>
          </div>
        </div>

        <section className="nutrition-success-card">
          <span>
            <FontAwesomeIcon icon={faCircleCheck} />
          </span>
          <div>
            <h2>Perhitungan Selesai</h2>
          </div>
        </section>

        <details className="nutrition-summary-accordion">
          <summary className="nutrition-summary-accordion__trigger">
            <span className="nutrition-summary-accordion__icon">
              <FontAwesomeIcon icon={faTableList} />
            </span>
            <span className="nutrition-summary-accordion__text">
              <strong>Ringkasan Data</strong>
              <small>Klik untuk melihat detail</small>
            </span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="nutrition-summary-accordion__chevron"
            />
          </summary>

          <div className="nutrition-summary-accordion__content">
            <div className="nutrition-data-grid nutrition-data-grid--compact">
              {summaryData.map((item) => (
                <InfoItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        </details>

        <section className="nutrition-section-card">
          <div className="nutrition-section-header">
            <div>
              <h2>Hasil Nutrisi Harian</h2>
            </div>
          </div>

          <div className="nutrition-mini-note">Estimasi kebutuhan gizi harian</div>

          <div className="nutrition-result-grid">
            {resultData.map((item) => (
              <ResultItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value}
                unit={item.unit}
                highlight={item.highlight}
              />
            ))}
          </div>
        </section>

        <div className="nutrition-result-actions">
          <Link href="/user/rekam-gizi/create" className="btn btn-soft">
            <FontAwesomeIcon icon={faRotateLeft} />
            Hitung Ulang
          </Link>
          <button
            type="button"
            className="btn btn-primary"
            disabled={savingResult}
            onClick={saveResult}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {savingResult ? "Menyimpan..." : "Simpan Hasil"}
          </button>
        </div>
      </div>
    </LayoutUser>
  );
}
