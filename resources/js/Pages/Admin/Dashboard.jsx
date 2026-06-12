import {
  faBookOpen,
  faClipboardList,
  faUsers,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, usePage } from "@inertiajs/react";
import LayoutAdmin from "../../Layouts/Admin";

function formatNumber(value, options = {}) {
  const number = Number(value ?? 0);

  return new Intl.NumberFormat("id-ID", options).format(number);
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AdminDashboard() {
  const { data = {} } = usePage().props;
  const activity = data.activity ?? [];
  const latestRekamGizi = data.latestRekamGizi ?? [];
  const maxActivity = Math.max(
    1,
    ...activity.map((item) => Number(item.total ?? 0))
  );
  const summaryItems = [
    {
      label: "Total Pengguna",
      value: data.banyakPasien,
      icon: faUsers,
      color: "teal",
    },
    {
      label: "Total Data Makanan",
      value: data.banyakMenuMakanan,
      icon: faUtensils,
      color: "green",
    },
    {
      label: "Total Edukasi",
      value: data.banyakInformasi,
      icon: faBookOpen,
      color: "blue",
    },
    {
      label: "Total Riwayat Perhitungan",
      value: data.banyakRekamGizi,
      icon: faClipboardList,
      color: "slate",
    },
  ];

  return (
    <LayoutAdmin>
      <div className="admin-page-stack">
        <section className="admin-page-heading">
          <div>
            <p className="admin-page-heading__eyebrow">Dashboard Admin</p>
            <h2>Ringkasan Sistem Informasi Gizi Diabetes</h2>
            <p>Pantau data pengguna, makanan, edukasi, dan aktivitas perhitungan harian.</p>
          </div>
        </section>

        <section className="admin-stat-grid" aria-label="Ringkasan data admin">
          {summaryItems.map((item) => (
            <article
              key={item.label}
              className={`admin-stat-card admin-stat-card--${item.color}`}
            >
              <span className="admin-stat-card__icon">
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <div className="admin-stat-card__body">
                <strong className="admin-stat-card__value">
                  {formatNumber(item.value)}
                </strong>
                <span className="admin-stat-card__label">{item.label}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="admin-dashboard-grid">
          <article className="admin-panel admin-panel--chart">
            <div className="admin-panel__header">
              <div>
                <h3>Aktivitas Pengguna</h3>
                <p>Jumlah perhitungan gizi dalam 7 hari terakhir</p>
              </div>
            </div>

            <div className="admin-activity-chart" aria-label="Grafik aktivitas pengguna">
              {activity.map((item) => {
                const total = Number(item.total ?? 0);
                const height = Math.max(8, (total / maxActivity) * 100);

                return (
                  <div key={item.label} className="admin-activity-chart__item">
                    <span
                      className="admin-activity-chart__bar"
                      style={{ height: `${height}%` }}
                      title={`${item.label}: ${total} perhitungan`}
                    />
                    <strong>{total}</strong>
                    <small>{item.label}</small>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="admin-panel">
            <div className="admin-panel__header">
              <div>
                <h3>Riwayat Perhitungan Terbaru</h3>
                <p>Data hasil perhitungan pasien terbaru</p>
              </div>
              <Link href="/admin/rekam-gizi" className="admin-link-button">
                Lihat Semua
              </Link>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Pasien</th>
                    <th>Tanggal</th>
                    <th>IMT</th>
                    <th>Status</th>
                    <th>Energi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {latestRekamGizi.map((item) => (
                    <tr key={item.id}>
                      <td>{item.pengguna?.user?.nama || item.nama || "Pasien"}</td>
                      <td>{formatDate(item.tanggal)}</td>
                      <td>{formatNumber(item.imt, { maximumFractionDigits: 1 })}</td>
                      <td>
                        <span className="admin-status-pill">
                          {item.status_gizi || "-"}
                        </span>
                      </td>
                      <td>{formatNumber(item.kalori_total)} kkal</td>
                      <td>
                        <Link
                          href={`/admin/pengguna/${item.pengguna_id}/rekam-gizi/${item.id}`}
                          className="admin-action-link"
                        >
                          Lihat
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {latestRekamGizi.length === 0 && (
              <div className="admin-empty-state">
                Belum ada riwayat perhitungan gizi.
              </div>
            )}
          </article>
        </section>
      </div>
    </LayoutAdmin>
  );
}
