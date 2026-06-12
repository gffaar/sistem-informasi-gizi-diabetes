import { Link, usePage } from "@inertiajs/react";
import {
  faBolt,
  faDroplet,
  faFireFlameCurved,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import LayoutUser from "../../Layouts/User";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function calculateAge(tanggalLahir) {
  if (!tanggalLahir) {
    return null;
  }

  const birthDate = new Date(tanggalLahir);
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

function calculateBmi(weight, height) {
  const berat = Number(weight);
  const tinggi = Number(height);

  if (!berat || !tinggi || tinggi <= 0) {
    return null;
  }

  const tinggiMeter = tinggi / 100;
  return (berat / (tinggiMeter * tinggiMeter)).toFixed(2);
}

function calculateBmr(weight, height, age, gender) {
  const berat = Number(weight);
  const tinggi = Number(height);
  const umur = Number(age);

  if (!berat || !tinggi || !umur || !gender) {
    return null;
  }

  if (gender === "Laki-laki") {
    return Math.round(66 + 13.7 * berat + 5 * tinggi - 6.8 * umur);
  }

  if (gender === "Perempuan") {
    return Math.round(655 + 9.6 * berat + 1.8 * tinggi - 4.7 * umur);
  }

  return null;
}

const DEFAULT_EDUCATION_IMAGE = "/images/default-diabetes-education.png";

function getEducationImage(gambar) {
  if (!gambar) {
    return DEFAULT_EDUCATION_IMAGE;
  }

  const imagePath = String(gambar);

  if (
    imagePath.startsWith("/") ||
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  return `/storage/${imagePath}`;
}

function getEducationCategory(informasi) {
  if (informasi.kategori) {
    return informasi.kategori;
  }

  const text = `${informasi.judul || ""} ${informasi.deskripsi || ""}`.toLowerCase();

  if (
    text.includes("makan") ||
    text.includes("diet") ||
    text.includes("karbo") ||
    text.includes("porsi")
  ) {
    return "Pola Makan";
  }

  if (
    text.includes("gizi") ||
    text.includes("nutrisi") ||
    text.includes("kalori")
  ) {
    return "Gizi";
  }

  return "Diabetes";
}

export default function UserDashboard() {
  const {
    rekamGiziTerbaru,
    pengguna,
    profilUser,
    user,
    riwayatGulaDarah = [],
    informasiEdukasi = [],
  } = usePage().props;
  const chartHistory = Array.isArray(riwayatGulaDarah)
    ? riwayatGulaDarah.filter(Boolean)
    : [];
  const educationItems = Array.isArray(informasiEdukasi)
    ? informasiEdukasi.filter(Boolean)
    : [];
  const kalori = rekamGiziTerbaru ? parseInt(rekamGiziTerbaru.kalori_total) : 0;
  const gulaDarah = rekamGiziTerbaru ? rekamGiziTerbaru.kadar_gula_darah : 0;
  const profile = {
    berat: profilUser?.berat_kg ?? pengguna?.berat_kg ?? null,
    tinggi: profilUser?.tinggi_cm ?? pengguna?.tinggi_cm ?? null,
    umur:
      profilUser?.umur ??
      calculateAge(profilUser?.tanggal_lahir || pengguna?.tanggal_lahir),
    jenisKelamin: profilUser?.jenis_kelamin || pengguna?.jenis_kelamin || null,
  };
  const bmi = calculateBmi(profile.berat, profile.tinggi);
  const bmr = calculateBmr(
    profile.berat,
    profile.tinggi,
    profile.umur,
    profile.jenisKelamin
  );
  const incompleteProfileText = "Lengkapi data profil";
  const chartRecords = chartHistory.length
    ? chartHistory
    : [{ tanggal: "Belum ada data", kadar_gula_darah: gulaDarah || 0 }];
  const gulaDarahChartData = {
    labels: chartRecords.map((record) => {
      if (record.tanggal === "Belum ada data") {
        return record.tanggal;
      }

      return new Date(record.tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
    }),
    datasets: [
      {
        label: "Kadar Gula (mg/dL)",
        data: chartRecords.map((record) => Number(record.kadar_gula_darah || 0)),
        borderColor: "#10B981",
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return "rgba(16, 185, 129, 0.12)";
          }

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.28)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0.02)");

          return gradient;
        },
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: "#10B981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 4,
        tension: 0.35,
      },
    ],
  };
  const gulaDarahChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          boxHeight: 8,
          boxWidth: 8,
          color: "#10B981",
          font: {
            size: 11,
            weight: "600",
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Kadar Gula: ${context.raw} mg/dL`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(148, 163, 184, 0.16)",
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <LayoutUser>
      <div className="page-stack dashboard-page">
        <section className="dashboard-hero">
          <div>
            <p>Aplikasi Gizi Diabetes</p>
            <h1 className="text-2xl font-bold">
              Halo, {pengguna?.user?.nama || user?.nama}
            </h1>
            <p>Jaga pola makan, jaga kesehatan.</p>
          </div>
        </section>

        <section className="metric-grid" aria-label="Informasi kesehatan otomatis">
          <div className="metric-card metric-card--calories">
            <div className="metric-card__top">
              <p className="metric-card__label">Kebutuhan Kalori</p>
              <span className="metric-card__icon">
                <FontAwesomeIcon icon={faFireFlameCurved} />
              </span>
            </div>
            <p className="metric-card__value">{kalori}</p>
            <p className="metric-card__unit">kkal</p>
          </div>
          <div className="metric-card metric-card--sugar">
            <div className="metric-card__top">
              <p className="metric-card__label">Kadar Gula Darah</p>
              <span className="metric-card__icon">
                <FontAwesomeIcon icon={faDroplet} />
              </span>
            </div>
            <p className="metric-card__value">{gulaDarah}</p>
            <p className="metric-card__unit">mg/dL</p>
          </div>
          <div className="metric-card metric-card--bmi">
            <div className="metric-card__top">
              <p className="metric-card__label">BMI / IMT</p>
              <span className="metric-card__icon">
                <FontAwesomeIcon icon={faGaugeHigh} />
              </span>
            </div>
            <p
              className={`metric-card__value ${
                bmi ? "" : "metric-card__value--hint"
              }`}
            >
              {bmi || incompleteProfileText}
            </p>
            <p className="metric-card__unit">{bmi ? "kg/m2" : "Profil"}</p>
          </div>
          <div className="metric-card metric-card--bmr">
            <div className="metric-card__top">
              <p className="metric-card__label">BMR</p>
              <span className="metric-card__icon">
                <FontAwesomeIcon icon={faBolt} />
              </span>
            </div>
            <p
              className={`metric-card__value ${
                bmr ? "" : "metric-card__value--hint"
              }`}
            >
              {bmr || incompleteProfileText}
            </p>
            <p className="metric-card__unit">{bmr ? "kkal/hari" : "Profil"}</p>
          </div>
        </section>

        <section className="blood-sugar-chart-card" aria-label="Grafik gula darah">
          <div className="blood-sugar-chart-card__header">
            <div>
              <p className="blood-sugar-chart-card__title">Grafik Gula Darah</p>
              <p className="blood-sugar-chart-card__subtitle">
                Kadar Gula (mg/dL)
              </p>
            </div>
            <select
              aria-label="Filter periode grafik gula darah"
              className="blood-sugar-chart-card__filter"
              defaultValue="7"
            >
              <option value="7">7 Hari</option>
            </select>
          </div>
          <div className="blood-sugar-chart-card__canvas">
            <Line data={gulaDarahChartData} options={gulaDarahChartOptions} />
          </div>
        </section>

        <section
          className="education-section"
          aria-labelledby="education-section-title"
        >
          <div className="education-section__header">
            <h2 id="education-section-title" className="section-title">
              Informasi Edukasi Diabetes
            </h2>
            <Link href="/user/informasi" className="education-section__see-all">
              Lihat Semua <span aria-hidden="true">&gt;</span>
            </Link>
          </div>

          {educationItems.length > 0 ? (
            <div
              className="education-scroll"
              role="list"
              aria-label="Daftar informasi edukasi diabetes"
            >
              {educationItems.map((informasi, index) => (
                <Link
                  key={informasi.id ?? `education-${index}`}
                  href={
                    informasi.id
                      ? `/user/informasi/${informasi.id}`
                      : "/user/informasi"
                  }
                  className="education-card"
                  role="listitem"
                >
                  <img
                    src={getEducationImage(informasi.gambar)}
                    alt={informasi.judul || "Informasi edukasi diabetes"}
                    className="education-card__image"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = DEFAULT_EDUCATION_IMAGE;
                    }}
                  />
                  <div className="education-card__body">
                    <h3 className="education-card__title">
                      {informasi.judul}
                    </h3>
                    <p className="education-card__text">
                      {informasi.deskripsi ||
                        "Baca informasi singkat seputar diabetes dan pola hidup sehat."}
                    </p>
                    <span className="education-card__label">
                      {getEducationCategory(informasi)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="education-empty-state">
              Belum ada informasi edukasi.
            </div>
          )}
        </section>
      </div>
    </LayoutUser>
  );
}
