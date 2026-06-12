import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LayoutAdmin from "../../../Layouts/Admin";

function calculateAge(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const birthDate = new Date(dateValue);

  if (Number.isNaN(birthDate.getTime())) {
    return "-";
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

  return age >= 0 ? age : "-";
}

function getProfile(pasien) {
  return pasien.user?.profil_user || pasien.user?.profilUser || {};
}

export default function AdminPenggunaIndex() {
  const { pasiens, filters = {} } = usePage().props;
  const items = pasiens?.data ?? [];
  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        "/admin/pengguna",
        { search },
        { preserveState: true, replace: true }
      );
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const goToPage = (url) => {
    router.visit(url, { preserveState: true });
  };

  const confirmDelete = (pasien) => {
    Swal.fire({
      title: "Hapus pengguna?",
      text: `Akun ${pasien.user?.nama || "pengguna"} akan dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/admin/pengguna/${pasien.id}`);
      }
    });
  };

  return (
    <LayoutAdmin>
      <div className="admin-page-stack admin-page-stack--screen">
        <section className="admin-page-heading">
          <div>
            <p className="admin-page-heading__eyebrow">Kelola Pengguna</p>
            <h2>Data Pengguna</h2>
            <p>Pantau data pasien dan akses riwayat perhitungan gizi pengguna.</p>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <input
              type="text"
              placeholder="Cari nama atau username"
              className="admin-search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Umur</th>
                  <th>Jenis Kelamin</th>
                  <th>Riwayat Diabetes</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((pasien) => {
                  const profile = getProfile(pasien);
                  const age = profile.umur ?? calculateAge(
                    profile.tanggal_lahir || pasien.tanggal_lahir
                  );
                  const gender =
                    profile.jenis_kelamin || pasien.jenis_kelamin || "-";
                  const diabetesHistory =
                    profile.riwayat_diabetes || pasien.riwayat_diabetes || "-";

                  return (
                    <tr key={pasien.id}>
                      <td>
                        <div className="admin-table-title">
                          {pasien.user?.nama || "Pasien"}
                        </div>
                        <span>@{pasien.user?.username || "-"}</span>
                      </td>
                      <td>{pasien.user?.email || "-"}</td>
                      <td>{age === "-" ? "-" : `${age} tahun`}</td>
                      <td>{gender}</td>
                      <td>
                        <span className="admin-status-pill">
                          {diabetesHistory}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <Link
                            href={`/admin/pengguna/${pasien.id}`}
                            className="admin-action-link"
                          >
                            Lihat
                          </Link>
                          <Link
                            href={`/admin/pengguna/${pasien.id}/rekam-gizi`}
                            className="admin-action-link admin-action-link--edit"
                          >
                            Riwayat
                          </Link>
                          <button
                            type="button"
                            className="admin-action-link admin-action-link--danger"
                            onClick={() => confirmDelete(pasien)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className="admin-empty-state">
              Data pengguna kosong. Pengguna yang mendaftar akan tampil di sini.
            </div>
          )}
        </section>

        <div className="admin-pagination">
          {pasiens?.prev_page_url && (
            <button
              type="button"
              onClick={() => goToPage(pasiens.prev_page_url)}
              className="admin-secondary-button"
            >
              Sebelumnya
            </button>
          )}
          {pasiens?.next_page_url && (
            <button
              type="button"
              onClick={() => goToPage(pasiens.next_page_url)}
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
