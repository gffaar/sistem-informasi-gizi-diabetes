import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBowlFood,
  faCalculator,
  faDroplet,
  faFire,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";
import LayoutUser from "../../../Layouts/User";

const filterOptions = [
  { label: "Semua", value: "" },
  { label: "Pagi", value: "Pagi" },
  { label: "Siang", value: "Siang" },
  { label: "Malam", value: "Malam" },
];

function toNumber(value) {
  const number = Number(String(value ?? "").replace(",", "."));

  return Number.isNaN(number) ? 0 : number;
}

function formatNutritionValue(value, maximumFractionDigits = 1) {
  const rounded = Number(toNumber(value).toFixed(maximumFractionDigits));

  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(maximumFractionDigits).replace(/\.?0+$/, "");
}

function multiplyNutrition(value, portion) {
  return toNumber(value) * toNumber(portion || 1);
}

function parseServingUnit(unit) {
  const rawUnit = String(unit || "porsi").trim();
  const unitMatch = rawUnit.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
  const weightMatch = rawUnit.match(/\((\d+(?:[.,]\d+)?)\s*(g|gr|gram|ml)\)/i);
  const baseAmount = unitMatch ? toNumber(unitMatch[1]) || 1 : 1;
  const label = (unitMatch ? unitMatch[2] : rawUnit)
    .replace(/\([^)]*\)/g, "")
    .trim();

  return {
    baseAmount,
    label: label || "porsi",
    weightAmount: weightMatch ? toNumber(weightMatch[1]) : null,
    weightUnit: weightMatch ? weightMatch[2].toLowerCase() : null,
  };
}

function roundToStep(value, step, minimum = step) {
  if (value <= 0) {
    return minimum;
  }

  return Math.max(minimum, Math.round(value / step) * step);
}

function formatPortionAmount(value, unit) {
  const portion = toNumber(value || 1);
  const { baseAmount, label, weightAmount, weightUnit } = parseServingUnit(unit);
  const normalizedLabel = label.toLowerCase();
  const totalAmount = baseAmount * portion;
  const totalWeight = weightAmount ? weightAmount * portion : null;
  const half = "\u00bd";

  if (/\b(g|gr|gram)\b/.test(normalizedLabel)) {
    return `${roundToStep(totalAmount, 50)} gram`;
  }

  if (/\bml\b/.test(normalizedLabel)) {
    return `${roundToStep(totalAmount, 50)} ml`;
  }

  if (normalizedLabel.includes("porsi")) {
    const roundedPortion = Math.max(0.5, Math.round(totalAmount * 2) / 2);

    if (roundedPortion === 0.5) {
      return `${half} porsi`;
    }

    if (Number.isInteger(roundedPortion)) {
      return `${roundedPortion} porsi`;
    }

    return `${Math.floor(roundedPortion)}${half} porsi`;
  }

  if (totalWeight && weightUnit) {
    const displayUnit = weightUnit === "ml" ? "ml" : "gram";

    return `${roundToStep(totalWeight, 50)} ${displayUnit}`;
  }

  return `${Math.max(1, Math.round(totalAmount))} ${label}`;
}

export default function UserRekomendasiIndex() {
  const {
    menuRekomendasi = [],
    filters = {},
    hasMenuMakanan = true,
    needsDailyCalculation = false,
    total = {
      kalori: 0,
      karbohidrat: 0,
      protein: 0,
      lemak: 0,
    },
  } = usePage().props;
  const [search, setSearch] = useState(filters.search || "");
  const hasRecommendations = menuRekomendasi.length > 0;
  const summaryItems = [
    {
      label: "Total Kalori",
      value: formatNutritionValue(total.kalori),
      unit: "kkal",
      icon: faFire,
    },
    {
      label: "Karbohidrat",
      value: formatNutritionValue(total.karbohidrat),
      unit: "g",
      icon: faBowlFood,
    },
    {
      label: "Protein",
      value: formatNutritionValue(total.protein),
      unit: "g",
      icon: faLeaf,
    },
    {
      label: "Lemak",
      value: formatNutritionValue(total.lemak),
      unit: "g",
      icon: faDroplet,
    },
  ];

  useEffect(() => {
    if (needsDailyCalculation) {
      return undefined;
    }

    const delayDebounce = setTimeout(() => {
      router.get(
        `/user/menu-rekomendasi`,
        { search },
        { preserveState: true, replace: true },
      );
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, needsDailyCalculation]);

  return (
    <LayoutUser>
      <div className="page-stack food-recommendation-page">
        <div className="page-header food-recommendation-header">
          <Link href={"/"} className="back-link" aria-label="Kembali">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Rekomendasi Makanan</p>
            <p className="page-subtitle">Menu makanan sesuai kebutuhan Anda</p>
          </div>
        </div>

        {!needsDailyCalculation && (
          <div className="food-filter-tabs" aria-label="Filter waktu makan">
            {filterOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className={`food-filter-tabs__button ${
                  search === option.value ? "is-active" : ""
                }`}
                onClick={() => setSearch(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <div className="food-recommendation-scroll">
          {needsDailyCalculation ? (
            <section className="empty-state food-recommendation-empty">
              <p className="empty-state__title">Belum ada rekomendasi makanan hari ini</p>
              <p className="empty-state__text">
                Belum ada rekomendasi makanan hari ini. Silakan hitung kebutuhan
                gizi terlebih dahulu.
              </p>
              <Link href="/user/rekam-gizi/create" className="btn btn-primary">
                <FontAwesomeIcon icon={faCalculator} />
                Hitung Sekarang
              </Link>
            </section>
          ) : !hasRecommendations ? (
            <section className="empty-state food-recommendation-empty">
              <p className="empty-state__title">
                {hasMenuMakanan
                  ? "Belum ada menu rekomendasi"
                  : "Data makanan belum tersedia"}
              </p>
              <p className="empty-state__text">
                {hasMenuMakanan
                  ? "Rekomendasi akan muncul setelah menu berhasil dibuat."
                  : "Admin perlu menambahkan data makanan terlebih dahulu."}
              </p>
            </section>
          ) : (
            <>
              <section className="food-summary-grid" aria-label="Ringkasan total gizi">
                {summaryItems.map((item) => (
                  <div key={item.label} className="food-summary-card">
                    <span className="food-summary-card__icon">
                      <FontAwesomeIcon icon={item.icon} />
                    </span>
                    <div>
                      <span>{item.label}</span>
                      <strong>
                        {item.value} <small>{item.unit}</small>
                      </strong>
                    </div>
                  </div>
                ))}
              </section>

              <section className="food-recommendation-list">
                {menuRekomendasi.map((menu) => {
                  const makanan = menu.menu_makanan;
                  if (!makanan) {
                    return null;
                  }

                  const gambar = makanan.gambar
                    ? `/storage/${makanan.gambar}`
                    : `/no_image.jpg`;
                  const calories = multiplyNutrition(makanan.kalori, menu.jumlah);
                  const nutrition = [
                    {
                      label: "Karbo",
                      value: multiplyNutrition(makanan.karbohidrat, menu.jumlah),
                      unit: "g",
                    },
                    {
                      label: "Protein",
                      value: multiplyNutrition(makanan.protein, menu.jumlah),
                      unit: "g",
                    },
                    {
                      label: "Lemak",
                      value: multiplyNutrition(makanan.lemak, menu.jumlah),
                      unit: "g",
                    },
                  ];

                  return (
                    <Link
                      key={menu.id}
                      href={`/user/menu-makanan/${makanan.id}`}
                      className="food-recommendation-card"
                    >
                      <img src={gambar} alt={makanan.nama} />
                      <div className="food-recommendation-card__body">
                        <div className="food-recommendation-card__top">
                          <p>{makanan.nama}</p>
                          <span>{menu.waktu_makan}</span>
                        </div>
                        <span className="food-recommendation-card__portion">
                          {formatPortionAmount(menu.jumlah, makanan.satuan)}
                        </span>
                        <strong className="food-recommendation-card__calories">
                          {formatNutritionValue(calories)} kkal
                        </strong>
                        <div className="food-recommendation-card__nutrition">
                          {nutrition.map((item) => (
                            <span key={item.label}>
                              <small>{item.label}</small>
                              <strong>
                                {formatNutritionValue(item.value)} {item.unit}
                              </strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </section>
            </>
          )}
        </div>
      </div>
    </LayoutUser>
  );
}
