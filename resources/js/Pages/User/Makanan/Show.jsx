import { router, usePage } from "@inertiajs/react";
import LayoutUser from "../../../Layouts/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBowlFood,
  faDroplet,
  faFire,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";

function formatNutrition(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "-";
  }

  const rounded = Number(number.toFixed(1));

  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace(/\.?0+$/, "");
}

export default function UserMakananShow() {
  const { makanan } = usePage().props;
  const gambar = makanan.gambar ? `/storage/${makanan.gambar}` : `/no_image.jpg`;
  const nutritionItems = [
    {
      label: "Kalori",
      value: makanan.kalori,
      unit: "kkal",
      icon: faFire,
      highlight: true,
    },
    {
      label: "Karbohidrat",
      value: makanan.karbohidrat,
      unit: "g",
      icon: faBowlFood,
    },
    {
      label: "Protein",
      value: makanan.protein,
      unit: "g",
      icon: faLeaf,
    },
    {
      label: "Lemak",
      value: makanan.lemak,
      unit: "g",
      icon: faDroplet,
    },
    {
      label: "Serat",
      value: makanan.serat,
      unit: "g",
      icon: faLeaf,
    },
  ];

  function handleBack() {
    router.visit("/user/menu-rekomendasi");
  }

  return (
    <LayoutUser>
      <div className="page-stack meal-detail-page">
        <div className="page-header meal-detail-header">
          <button
            type="button"
            onClick={handleBack}
            className="meal-detail-back"
            aria-label="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="page-header__content">
            <p className="page-title">Detail Makanan</p>
            <p className="page-subtitle">Informasi gizi makanan yang dipilih</p>
          </div>
        </div>

        <section className="meal-detail-nutrition-card">
          <img src={gambar} alt={makanan.nama} className="meal-detail-nutrition-image" />

          <div className="meal-detail-nutrition-body">
            <h1>Detail Gizi Makanan per 100 g</h1>
            <p className="meal-detail-food-name">{makanan.nama}</p>

            <div className="meal-detail-nutrition-list" aria-label="Detail gizi makanan">
              {nutritionItems.map((item) => (
                <div
                  key={item.label}
                  className={`meal-detail-nutrition-row ${
                    item.highlight ? "is-highlight" : ""
                  }`}
                >
                  <span className="meal-detail-nutrition-row__icon">
                    <FontAwesomeIcon icon={item.icon} />
                  </span>
                  <span>{item.label}</span>
                  <strong>
                    {formatNutrition(item.value)}{" "}
                    {formatNutrition(item.value) === "-" ? "" : item.unit}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </LayoutUser>
  );
}
