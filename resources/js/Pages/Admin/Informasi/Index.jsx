import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LayoutAdmin from "../../../Layouts/Admin";

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
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function AdminInformasiIndex() {
  const { informasis, filters = {} } = usePage().props;
  const items = informasis?.data ?? [];
  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        "/admin/informasi",
        { search },
        { preserveState: true, replace: true }
      );
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const goToPage = (url) => {
    router.visit(url, { preserveState: true });
  };

  const confirmDelete = (informasi) => {
    Swal.fire({
      title: "Hapus edukasi?",
      text: `Artikel ${informasi.judul} akan dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/admin/informasi/${informasi.id}`);
      }
    });
  };

  return (
    <LayoutAdmin>
      <div className="admin-page-stack">
        <section className="admin-page-heading admin-page-heading--inline">
          <div>
            <p className="admin-page-heading__eyebrow">Kelola Edukasi</p>
            <h2>Edukasi Diabetes</h2>
            <p>Kelola artikel edukasi kesehatan untuk pengguna aplikasi.</p>
          </div>
          <Link href="/admin/informasi/create" className="admin-primary-button">
            Tambah Edukasi
          </Link>
        </section>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <input
              type="text"
              placeholder="Cari judul edukasi"
              className="admin-search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((informasi) => (
                  <tr key={informasi.id}>
                    <td>
                      <div className="admin-table-title">{informasi.judul}</div>
                      <span>{informasi.deskripsi}</span>
                    </td>
                    <td>
                      <span className="admin-status-pill">
                        {informasi.kategori || "Edukasi Diabetes"}
                      </span>
                    </td>
                    <td>{formatDate(informasi.created_at)}</td>
                    <td>
                      <div className="admin-table-actions">
                        <Link
                          href={`/admin/informasi/${informasi.id}`}
                          className="admin-action-link"
                        >
                          Lihat
                        </Link>
                        <Link
                          href={`/admin/informasi/${informasi.id}/edit`}
                          className="admin-action-link admin-action-link--edit"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="admin-action-link admin-action-link--danger"
                          onClick={() => confirmDelete(informasi)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className="admin-empty-state">
              Belum ada edukasi diabetes. Tambahkan artikel edukasi baru.
            </div>
          )}
        </section>

        <div className="admin-pagination">
          {informasis?.prev_page_url && (
            <button
              type="button"
              onClick={() => goToPage(informasis.prev_page_url)}
              className="admin-secondary-button"
            >
              Sebelumnya
            </button>
          )}
          {informasis?.next_page_url && (
            <button
              type="button"
              onClick={() => goToPage(informasis.next_page_url)}
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
