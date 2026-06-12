import { Link, usePage } from "@inertiajs/react";
import LayoutAdmin from "../../../../Layouts/Admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AdminPenggunaRekamGiziIndex() {
  const { pengguna, rekamGizi } = usePage().props;
  const records = rekamGizi ?? [];

  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Rekam Gizi Pasien</p>
            <p className="page-subtitle">
              Riwayat pengukuran {pengguna.user?.nama || "pasien"}
            </p>
          </div>
        </div>
        <div className="content-card-grid">
          {records.map((rg) => (
            <div key={rg.id} className="card">
              <div className="card-body">
                <h2 className="card-title">{rg.tanggal}</h2>
                <p>IMT: {rg.imt}</p>
                <p>Status Gizi: {rg.status_gizi}</p>
                <div className="card-actions justify-end">
                  <Link
                    href={`/admin/pengguna/${pengguna.id}/rekam-gizi/${rg.id}`}
                    className="btn btn-primary"
                  >
                    Lihat
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {records.length === 0 && (
          <section className="empty-state">
            <p className="empty-state__title">Belum ada rekam gizi</p>
            <p className="empty-state__text">
              Tambahkan hasil pengukuran untuk pasien ini.
            </p>
          </section>
        )}
      </div>
      <div className="fixed bottom-20 right-10">
        <Link
          href={`/admin/pengguna/${pengguna.id}/rekam-gizi/create`}
          className="btn btn-outline btn-primary btn-circle"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>
    </LayoutAdmin>
  );
}
