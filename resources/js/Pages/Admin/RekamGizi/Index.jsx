import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import LayoutAdmin from "../../../Layouts/Admin";

function formatNumber(value, options = {}) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
    ...options,
  }).format(Number(value));
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

export default function AdminRekamGiziIndex() {
  const { rekamGizi, filters = {} } = usePage().props;
  const items = rekamGizi?.data ?? [];
  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        "/admin/rekam-gizi",
        { search },
        { preserveState: true, replace: true }
      );
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const goToPage = (url) => {
    router.visit(url, { preserveState: true });
  };

  return (
    <LayoutAdmin>
      <div className="admin-page-stack">
        <section className="admin-page-heading">
          <div>
            <p className="admin-page-heading__eyebrow">Riwayat Gizi</p>
            <h2>Riwayat Perhitungan Gizi</h2>
            <p>Lihat semua hasil perhitungan kebutuhan gizi yang tersimpan.</p>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <input
              type="text"
              placeholder="Cari nama atau username pasien"
              className="admin-search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Pasien</th>
                  <th>Tanggal</th>
                  <th>Usia</th>
                  <th>Jenis Kelamin</th>
                  <th>IMT</th>
                  <th>Status Gizi</th>
                  <th>Energi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-table-title">
                        {item.pengguna?.user?.nama || item.nama || "Pasien"}
                      </div>
                      <span>@{item.pengguna?.user?.username || "-"}</span>
                    </td>
                    <td>{formatDate(item.tanggal)}</td>
                    <td>{item.usia ? `${item.usia} tahun` : "-"}</td>
                    <td>{item.jenis_kelamin || "-"}</td>
                    <td>{formatNumber(item.imt)}</td>
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

          {items.length === 0 && (
            <div className="admin-empty-state">
              Belum ada riwayat perhitungan gizi yang tersimpan.
            </div>
          )}
        </section>

        <div className="admin-pagination">
          {rekamGizi?.prev_page_url && (
            <button
              type="button"
              onClick={() => goToPage(rekamGizi.prev_page_url)}
              className="admin-secondary-button"
            >
              Sebelumnya
            </button>
          )}
          {rekamGizi?.next_page_url && (
            <button
              type="button"
              onClick={() => goToPage(rekamGizi.next_page_url)}
              className="admin-secondary-button"
            >
              Berikutnya
            </button>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}
