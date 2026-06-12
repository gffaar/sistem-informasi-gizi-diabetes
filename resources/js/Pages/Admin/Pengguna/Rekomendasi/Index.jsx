import { Link, router, usePage } from "@inertiajs/react";
import LayoutAdmin from "../../../../Layouts/Admin";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AdminPenggunaRekomendasiIndex() {
  const { pengguna, rekamGizi, menuRekomendasi = [], filters = {}, total = {}, hasMenuMakanan = true } =
    usePage().props;

  const [search, setSearch] = useState(filters.search || "");
  const canGenerate = Boolean(rekamGizi?.id) && hasMenuMakanan;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        `/admin/pengguna/${pengguna.id}/menu-rekomendasi`,
        { search },
        { preserveState: true, replace: true }
      );
    }, 300); // debounce agar tidak terlalu sering request

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus makanan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/admin/pengguna/${pengguna.id}/menu-rekomendasi/${id}`);
      }
    });
  };
  
    const handleOtomatis = () => {
      Swal.fire({
        title: "Apakah Anda yakin ingin membuat otomatis menu rekomendasi?",
        text: "Menu rekomendasi akan diotomatiskan sesuai dengan data rekam gizi. Semua menu rekomendasi sebelumnya akan dihapus!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0f766e",
        cancelButtonColor: "#dc2626",
        confirmButtonText: "Ya, buatkan!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          router.post(`/admin/pengguna/${pengguna.id}/menu-rekomendasi/otomatis-pilih/${rekamGizi.id}`);
        }
      });
    };

  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Data Menu Rekomendasi</p>
            <p className="page-subtitle">
              Menu harian untuk {pengguna.user?.nama || "pasien"}
            </p>
          </div>
        </div>
        <div className="segmented-control">
          <button
            className={`btn ${search == "" ? "btn-primary" : "btn-soft"}`}
            onClick={() => setSearch("")}
          >
            Semua
          </button>
          <button
            className={`btn ${search == "Pagi" ? "btn-primary" : "btn-soft"}`}
            onClick={() => setSearch("Pagi")}
          >
            Pagi
          </button>
          <button
            className={`btn ${search == "Siang" ? "btn-primary" : "btn-soft"}`}
            onClick={() => setSearch("Siang")}
          >
            Siang
          </button>
          <button
            className={`btn ${search == "Malam" ? "btn-primary" : "btn-soft"}`}
            onClick={() => setSearch("Malam")}
          >
            Malam
          </button>
        </div>
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Nama</th>
                <th>Kalori</th>
                <th>Karbohidrat</th>
                <th>Protein</th>
                <th>Lemak</th>
                <th>Banyak</th>
                <th>Waktu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {menuRekomendasi.map((menu) => {
                const makanan = menu.menu_makanan;

                if (!makanan) {
                  return null;
                }

                return (
                <tr key={menu.id}>
                  <th>
                    {makanan.gambar ? (
                      <img
                        src={`/storage/${makanan.gambar}`}
                        alt="Makanan"
                        style={{ minWidth: "100px", maxWidth: "100px" }}
                      />
                    ) : (
                      <img
                        src={`/no_image.jpg`}
                        alt="Makanan"
                        style={{ minWidth: "100px", maxWidth: "100px" }}
                      />
                    )}
                  </th>
                  <td>{makanan.nama}</td>
                  <td>{makanan.kalori * menu.jumlah}</td>
                  <td>{makanan.karbohidrat * menu.jumlah}</td>
                  <td>{makanan.protein * menu.jumlah}</td>
                  <td>{makanan.lemak * menu.jumlah}</td>
                  <td>{menu.jumlah} x {makanan.satuan}</td>
                  <td>{menu.waktu_makan}</td>
                  <td>
                    <button
                      onClick={() => {
                        handleDelete(menu.id);
                      }}
                      className="btn btn-error"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
                );
              })}
              {menuRekomendasi.length === 0 && (
                <tr>
                  <td colSpan="9">
                    <section className="empty-state">
                      <p className="empty-state__title">
                        Belum ada menu rekomendasi
                      </p>
                      <p className="empty-state__text">
                        {hasMenuMakanan
                          ? "Tambahkan manual atau buat otomatis dari rekam gizi terbaru."
                          : "Tambahkan data makanan terlebih dahulu."}
                      </p>
                    </section>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>Total</th>
                <th>{total.kalori ?? 0}</th>
                <th>{total.karbohidrat ?? 0}</th>
                <th>{total.protein ?? 0}</th>
                <th>{total.lemak ?? 0}</th>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <th></th>
                <th>Kebutuhan</th>
                <th>{rekamGizi?.kalori_total ?? 0}</th>
                <th>{rekamGizi?.karbohidrat ?? 0}</th>
                <th>{rekamGizi?.protein ?? 0}</th>
                <th>{rekamGizi?.lemak ?? 0}</th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
          <button
            className="btn btn-primary m-4"
            onClick={handleOtomatis}
            disabled={!canGenerate}
          >
            Otomatis
          </button>
        </div>
      </div>
      <div className="fixed bottom-20 right-10">
        <Link
          href={`/admin/pengguna/${pengguna.id}/menu-rekomendasi/create`}
          className="btn btn-outline btn-primary btn-circle"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>
    </LayoutAdmin>
  );
}
