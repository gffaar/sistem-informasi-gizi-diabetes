import { Link, router, usePage } from "@inertiajs/react";
import {
  faEye,
  faMagnifyingGlass,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LayoutAdmin from "../../../Layouts/Admin";

function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
  }).format(Number(value));
}

export default function AdminMakananIndex() {
  const { makanans, filters = {} } = usePage().props;
  const items = makanans?.data ?? [];
  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        "/admin/menu-makanan",
        { search },
        { preserveState: true, replace: true }
      );
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const goToPage = (url) => {
    router.visit(url, { preserveState: true });
  };

  const confirmDelete = (makanan) => {
    Swal.fire({
      title: "Hapus data makanan?",
      text: `Data ${makanan.nama} akan dihapus dari daftar makanan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/admin/menu-makanan/${makanan.id}`);
      }
    });
  };

  return (
    <LayoutAdmin>
      <div className="admin-page-stack admin-page-stack--screen admin-food-page">
        <section className="admin-page-heading admin-page-heading--inline admin-food-heading">
          <div>
            <p className="admin-page-heading__eyebrow">Kelola Data</p>
            <h2>Data Makanan</h2>
            <p>Kelola makanan dan kandungan gizi yang digunakan sistem rekomendasi.</p>
          </div>
          <Link href="/admin/menu-makanan/create" className="admin-primary-button admin-food-add-button">
            <FontAwesomeIcon icon={faPlus} />
            <span>Tambah Data</span>
          </Link>
        </section>

        <section className="admin-panel admin-food-panel">
          <div className="admin-toolbar admin-food-toolbar">
            <label className="admin-food-search">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="admin-food-search__icon"
              />
              <input
                type="text"
                placeholder="Cari nama makanan"
                className="admin-search-input admin-food-search__input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <div className="admin-table-wrap admin-food-table-wrap">
            <table className="admin-data-table admin-food-table">
              <colgroup>
                <col className="admin-food-table__name" />
                <col className="admin-food-table__number" />
                <col className="admin-food-table__number" />
                <col className="admin-food-table__number" />
                <col className="admin-food-table__number" />
                <col className="admin-food-table__number" />
                <col className="admin-food-table__category" />
                <col className="admin-food-table__actions" />
              </colgroup>
              <thead>
                <tr>
                  <th>Nama Makanan</th>
                  <th>Kalori</th>
                  <th>Karbohidrat</th>
                  <th>Protein</th>
                  <th>Lemak</th>
                  <th>Serat</th>
                  <th>Kategori</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((makanan) => (
                  <tr key={makanan.id}>
                    <td>
                      <div className="admin-table-title">{makanan.nama}</div>
                      <span>{makanan.satuan || "Per porsi"}</span>
                    </td>
                    <td>{formatNumber(makanan.kalori)} kkal</td>
                    <td>{formatNumber(makanan.karbohidrat)} gr</td>
                    <td>{formatNumber(makanan.protein)} gr</td>
                    <td>{formatNumber(makanan.lemak)} gr</td>
                    <td>
                      {makanan.serat === null || makanan.serat === undefined
                        ? "-"
                        : `${formatNumber(makanan.serat)} gr`}
                    </td>
                    <td>
                      <span className="admin-food-badge">{makanan.kategori}</span>
                    </td>
                    <td>
                      <div className="admin-table-actions admin-food-actions">
                        <Link
                          href={`/admin/menu-makanan/${makanan.id}`}
                          className="admin-action-link admin-food-action"
                        >
                          <FontAwesomeIcon icon={faEye} />
                          <span>Lihat</span>
                        </Link>
                        <Link
                          href={`/admin/menu-makanan/${makanan.id}/edit`}
                          className="admin-action-link admin-action-link--edit admin-food-action"
                        >
                          <FontAwesomeIcon icon={faPen} />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          className="admin-action-link admin-action-link--danger admin-food-action"
                          onClick={() => confirmDelete(makanan)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          <span>Hapus</span>
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
              Data makanan kosong. Tambahkan data makanan untuk mulai mengelola rekomendasi.
            </div>
          )}
        </section>

        <div className="admin-pagination">
          {makanans?.prev_page_url && (
            <button
              type="button"
              onClick={() => goToPage(makanans.prev_page_url)}
              className="admin-secondary-button"
            >
              Sebelumnya
            </button>
          )}
          {makanans?.next_page_url && (
            <button
              type="button"
              onClick={() => goToPage(makanans.next_page_url)}
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
