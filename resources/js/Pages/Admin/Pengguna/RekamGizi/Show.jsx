import Swal from "sweetalert2";
import LayoutAdmin from "../../../../Layouts/Admin";
import { router, usePage } from "@inertiajs/react";
import { PolarAreaChart } from "../../../../Components/Chart/PolarArea";

export default function AdminPenggunaRekamGiziShow() {
  const { pengguna, rekamGizi } = usePage().props;

  const handleDelete = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus rekam gizi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(
          `/admin/pengguna/${pengguna.id}/rekam-gizi/${rekamGizi.id}`,
        );
      }
    });
  };

  const chartData = {
    labels: ["Kalori", "Karbohidrat", "Protein", "Lemak", "IMT", "BMR", "TEE"],
    datasets: [
      {
        label: "Hasil Rekam Gizi",
        data: [
          rekamGizi.kalori_total,
          rekamGizi.karbohidrat,
          rekamGizi.protein,
          rekamGizi.lemak,
          rekamGizi.imt,
          rekamGizi.bmr,
          rekamGizi.tee,
        ],
        backgroundColor: [
          "rgba(15, 118, 110, 0.55)",
          "rgba(21, 94, 117, 0.55)",
          "rgba(197, 138, 19, 0.55)",
          "rgba(22, 132, 87, 0.55)",
          "rgba(2, 132, 199, 0.5)",
          "rgba(100, 116, 139, 0.5)",
          "rgba(220, 38, 38, 0.38)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 10,
          usePointStyle: true,
        },
      },
    },
    scales: {
      r: {
        ticks: {
          display: false,
        },
      },
    },
  };
  const userData = [
    {
      label: "Usia",
      value: `${rekamGizi.usia} tahun`,
    },
    {
      label: "Tinggi Badan",
      value: `${rekamGizi.tinggi_badan} cm`,
    },
    {
      label: "Berat Badan",
      value: `${rekamGizi.berat_badan} kg`,
    },
    {
      label: "Gula Darah Terakhir",
      value: `${rekamGizi.kadar_gula_darah} mg/dL`,
    },
    {
      label: "BMR",
      value: rekamGizi.bmr,
    },
    {
      label: "TEE",
      value: rekamGizi.tee,
    },
  ];

  return (
    <LayoutAdmin>
      <div className="admin-record-screen">
        <section className="admin-record-header">
          <div>
            <p className="admin-record-header__eyebrow">Rekam Gizi Pasien</p>
            <h2>Rekam Gizi Pasien</h2>
            <p>Hasil pengukuran {rekamGizi.tanggal}</p>
          </div>
          <button onClick={handleDelete} className="btn btn-error">
            Hapus
          </button>
        </section>

        <section className="admin-record-layout">
          <div className="admin-record-main">
            <section className="admin-record-metrics" aria-label="Ringkasan gizi">
              <article className="admin-record-metric">
                <p>Kalori Harian</p>
                <strong>{parseInt(rekamGizi.kalori_total)}</strong>
                <span>kkal</span>
              </article>
              <article className="admin-record-metric">
                <p>IMT</p>
                <strong>{rekamGizi.imt}</strong>
                <span>{rekamGizi.status_gizi}</span>
              </article>
            </section>

            <section className="admin-record-card admin-record-patient-card">
              <div className="admin-record-card__header">
                <div>
                  <h3>{rekamGizi.nama}</h3>
                  <p>Informasi data pasien</p>
                </div>
              </div>
              <div className="admin-record-data-grid">
                {userData.map((item) => (
                  <div key={item.label} className="admin-record-data-item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="admin-record-card admin-record-chart-card">
            <div className="admin-record-card__header">
              <div>
                <h3>Distribusi Gizi</h3>
                <p>Perbandingan hasil rekam gizi pasien</p>
              </div>
            </div>
            <div className="admin-record-chart">
              <PolarAreaChart data={chartData} options={chartOptions} />
            </div>
          </section>
        </section>
      </div>
    </LayoutAdmin>
  );
}
