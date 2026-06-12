import { Link, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarDays,
  faChevronRight,
  faFireFlameCurved,
  faHeartbeat,
} from "@fortawesome/free-solid-svg-icons";
import LayoutUser from "../../../Layouts/User";

function formatDate(value) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCategory(informasi) {
  if (informasi.kategori) {
    return informasi.kategori;
  }

  const text = `${informasi.judul || ""} ${informasi.deskripsi || ""}`.toLowerCase();

  if (
    text.includes("olahraga") ||
    text.includes("aktivitas") ||
    text.includes("jalan") ||
    text.includes("senam") ||
    text.includes("latihan")
  ) {
    return "Olahraga";
  }

  if (
    text.includes("makan") ||
    text.includes("gizi") ||
    text.includes("nutrisi") ||
    text.includes("diet") ||
    text.includes("karbo") ||
    text.includes("kalori")
  ) {
    return "Pola Makan";
  }

  return "Tips Kesehatan";
}

function getCategoryTone(category) {
  if (category === "Olahraga") {
    return "sport";
  }

  if (category === "Tips Kesehatan") {
    return "tips";
  }

  return "food";
}

export default function UserInformasiIndex() {
  const { informasis } = usePage().props;

  const goToPage = (url) => {
    router.visit(url, { preserveState: true });
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    router.visit("/");
  };

  return (
    <LayoutUser>
      <div className="page-stack info-page">
        <div className="page-header">
          <button type="button" onClick={goBack} className="back-link" aria-label="Kembali">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="page-header__content">
            <p className="page-title">Informasi</p>
            <p className="page-subtitle">Artikel edukasi diabetes</p>
          </div>
        </div>

        <section className="info-hero">
          <div className="info-hero__content">
            <p className="info-hero__title">Informasi Diabetes</p>
            <p className="info-hero__text">
              Temukan panduan praktis seputar pola makan, olahraga, dan tips
              menjaga gula darah.
            </p>
          </div>
          <div className="info-hero__icon">
            <FontAwesomeIcon icon={faHeartbeat} />
          </div>
        </section>

        <section className="info-article-section">
          <div className="info-section-header">
            <div className="info-section-title">
              <span className="info-section-title__icon">
                <FontAwesomeIcon icon={faFireFlameCurved} />
              </span>
              <h2>Artikel</h2>
            </div>
          </div>
          <div className="info-list">
            {informasis.data.map((informasi) => {
              const category = getCategory(informasi);
              const categoryTone = getCategoryTone(category);

              return (
                <Link
                  href={`/user/informasi/${informasi.id}`}
                  key={informasi.id}
                  className="info-list-card"
                >
                  <img
                    src={
                      informasi.gambar
                        ? `/storage/${informasi.gambar}`
                        : "/no_image.jpg"
                    }
                    alt={informasi.judul}
                    className="info-list-card__image"
                  />
                  <div className="info-list-card__body">
                    <span
                      className={`info-list-card__badge info-list-card__badge--${categoryTone}`}
                    >
                      {category}
                    </span>
                    <h2 className="info-list-card__title">{informasi.judul}</h2>
                    <p className="info-list-card__text">{informasi.deskripsi}</p>
                    <p className="info-list-card__date">
                      <FontAwesomeIcon icon={faCalendarDays} />
                      <span>{formatDate(informasi.created_at)}</span>
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="info-list-card__arrow"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {informasis.data.length === 0 && (
          <p className="py-8 text-center text-slate-500">
            Belum ada informasi.
          </p>
        )}

        <div className="info-pagination">
          {informasis.prev_page_url && (
            <button
              onClick={() => goToPage(informasis.prev_page_url)}
              className="btn btn-primary"
            >
              Previous
            </button>
          )}
          {informasis.next_page_url && (
            <button
              onClick={() => goToPage(informasis.next_page_url)}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </LayoutUser>
  );
}
