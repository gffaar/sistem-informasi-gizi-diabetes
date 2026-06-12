import { Link, router, usePage } from "@inertiajs/react";
import LayoutAdmin from "../../../Layouts/Admin";
import Swal from "sweetalert2";

export default function AdminPenggunaShow() {
  const { pengguna } = usePage().props;

  const handleDelete = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus pasien ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/admin/pengguna/${pengguna.id}`);
      }
    });
  };

  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Detail Pengguna</p>
            <p className="page-subtitle">Informasi dasar pasien</p>
          </div>
        </div>
        <div className="card">
          <figure className="pt-6">
            {pengguna.user?.foto ? (
              <img src={`/storage/${pengguna.user.foto}`} alt="Foto Profil" className="h-28 w-28 rounded-full object-cover" />
            ) : (
              <img src={`/no_profile_picture.png`} alt="Foto Profil" className="h-28 w-28 rounded-full object-cover" />
            )}
          </figure>
          <div className="card-body">
            <h2 className="card-title">{pengguna.user?.nama || "Pasien"}</h2>
            <p>Jenis Kelamin: {pengguna.jenis_kelamin}</p>
            <p>Tanggal Lahir: {pengguna.tanggal_lahir}</p>
            <p>Tinggi Badan: {pengguna.tinggi_cm} cm</p>
            <p>Berat Badan: {pengguna.berat_kg} kg</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href={`/admin/pengguna/${pengguna.id}/menu-rekomendasi`}
            className="btn btn-primary"
          >
            Menu Rekomendasi
          </Link>
          <Link
            href={`/admin/pengguna/${pengguna.id}/rekam-gizi`}
            className="btn btn-primary"
          >
            Rekam Gizi
          </Link>
          <button onClick={handleDelete} className="btn btn-error">
            Hapus
          </button>
        </div>
      </div>
    </LayoutAdmin>
  );
}
