import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faLightbulb,
  faNotesMedical,
  faPersonWalking,
  faRulerVertical,
  faScaleBalanced,
  faUserClock,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <small className="text-error">{message}</small>;
}

function NutritionField({ icon, label, children, error }) {
  return (
    <div className="nutrition-input-card">
      <span className="nutrition-input-card__icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <div className="nutrition-input-card__body">
        <span className="nutrition-input-card__label">{label}</span>
        {children}
        <FieldError message={error} />
      </div>
    </div>
  );
}

export default function FormRekamGizi({
  pengguna = {
    id: "",
    user: { nama: "" },
    user_id: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    tinggi_cm: "",
    berat_kg: "",
  },
  rekamGizi = {
    id: "",
    nama: "",
    usia: "",
    riwayat_diabetes: "",
    pengguna_id: "",
    imt: "",
    status_gizi: "",
    bmr: "",
    tee: "",
    kalori_total: "",
    karbohidrat: "",
    protein: "",
    lemak: "",
    kadar_gula_darah: "",
    tanggal: "",
  },
  type = "admin",
}) {
  const isUserForm = type === "user";

  function hitungUsia(tanggalLahir) {
    if (!tanggalLahir) {
      return "";
    }

    const sekarang = new Date();
    const lahir = new Date(tanggalLahir);

    if (Number.isNaN(lahir.getTime())) {
      return "";
    }

    let usia = sekarang.getFullYear() - lahir.getFullYear();
    const bulan = sekarang.getMonth() - lahir.getMonth();
    const hari = sekarang.getDate() - lahir.getDate();

    if (bulan < 0 || (bulan === 0 && hari < 0)) {
      usia--;
    }

    return usia;
  }

  const { data, setData, post, processing, errors, progress } = useForm({
    nama: rekamGizi.nama || pengguna?.user?.nama || "",
    riwayat_diabetes: rekamGizi.riwayat_diabetes || "",
    pengguna_id: rekamGizi.pengguna_id || "",
    berat_kg: pengguna?.berat_kg || "",
    tinggi_cm: pengguna?.tinggi_cm || "",
    usia: hitungUsia(pengguna?.tanggal_lahir) || "",
    jenis_kelamin: pengguna?.jenis_kelamin || "",
    kadar_gula_darah: rekamGizi.kadar_gula_darah || "",
    aktivitas: "",
  });

  function submit(e) {
    e.preventDefault();
    if (type === "admin") {
      post(`/admin/pengguna/${pengguna.id}/rekam-gizi`);
    } else {
      post("/user/rekam-gizi");
    }
  }

  if (!pengguna?.id) {
    return (
      <section className="empty-state">
        <p className="empty-state__title">Data profil belum lengkap</p>
        <p className="empty-state__text">
          Lengkapi data pribadi sebelum menghitung kebutuhan gizi.
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="nutrition-form">
      <fieldset className="fieldset nutrition-form-card">
        <legend className="fieldset-legend nutrition-form-legend">
          Input Data
        </legend>

        <div className="nutrition-input-list">
          {isUserForm ? (
            <div className="nutrition-profile-grid">
              <NutritionField icon={faUserClock} label="Umur" error={errors.usia}>
                <div className="nutrition-profile-field__value">
                  <input
                    type="number"
                    placeholder="Mengikuti profil"
                    readOnly
                    value={data.usia}
                  />
                  <small>Tahun</small>
                </div>
              </NutritionField>

              <NutritionField
                icon={faVenusMars}
                label="Jenis Kelamin"
                error={errors.jenis_kelamin}
              >
                <div className="nutrition-profile-field__value">
                  <input
                    type="text"
                    placeholder="Mengikuti profil"
                    readOnly
                    value={data.jenis_kelamin}
                  />
                </div>
              </NutritionField>
            </div>
          ) : (
            <>
              <NutritionField icon={faUserClock} label="Umur" error={errors.usia}>
                <label className="input nutrition-input-control">
                  <input
                    type="number"
                    className="grow"
                    placeholder="Usia"
                    value={data.usia}
                    onChange={(e) => setData("usia", e.target.value)}
                  />
                  <small>Tahun</small>
                </label>
              </NutritionField>

              <NutritionField
                icon={faVenusMars}
                label="Jenis Kelamin"
                error={errors.jenis_kelamin}
              >
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`btn w-full btn-sm ${
                      data.jenis_kelamin === "Laki-laki"
                        ? "btn-primary"
                        : "btn-soft"
                    }`}
                    onClick={() => setData("jenis_kelamin", "Laki-laki")}
                  >
                    Laki-Laki
                  </button>
                  <button
                    type="button"
                    className={`btn w-full btn-sm ${
                      data.jenis_kelamin === "Perempuan"
                        ? "btn-primary"
                        : "btn-soft"
                    }`}
                    onClick={() => setData("jenis_kelamin", "Perempuan")}
                  >
                    Perempuan
                  </button>
                </div>
              </NutritionField>
            </>
          )}

          <NutritionField
            icon={faScaleBalanced}
            label="Berat Badan"
            error={errors.berat_kg}
          >
            <label className="input nutrition-input-control">
              <input
                type="number"
                className="grow"
                placeholder="Berat Badan"
                value={data.berat_kg}
                onChange={(e) => setData("berat_kg", e.target.value)}
              />
              <small>kg</small>
            </label>
          </NutritionField>

          <NutritionField
            icon={faRulerVertical}
            label="Tinggi Badan"
            error={errors.tinggi_cm}
          >
            <label className="input nutrition-input-control">
              <input
                type="number"
                className="grow"
                placeholder="Tinggi Badan"
                value={data.tinggi_cm}
                onChange={(e) => setData("tinggi_cm", e.target.value)}
              />
              <small>cm</small>
            </label>
          </NutritionField>

          <NutritionField
            icon={faPersonWalking}
            label="Aktivitas"
            error={errors.aktivitas}
          >
            <select
              value={data.aktivitas}
              className="select nutrition-input-control"
              onChange={(e) => setData("aktivitas", e.target.value)}
            >
              <option value="">Pilih Aktivitas</option>
              <option value="Sangat Ringan">Sangat Ringan</option>
              <option value="Ringan">Ringan</option>
              <option value="Sedang">Sedang</option>
              <option value="Berat">Berat</option>
            </select>
          </NutritionField>

          <NutritionField
            icon={faNotesMedical}
            label="Riwayat Diabetes"
            error={errors.riwayat_diabetes}
          >
            <select
              value={data.riwayat_diabetes}
              className="select nutrition-input-control"
              onChange={(e) => setData("riwayat_diabetes", e.target.value)}
            >
              <option value="">Pilih Riwayat Diabetes</option>
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </NutritionField>

          <NutritionField
            icon={faDroplet}
            label="Kadar Gula Darah"
            error={errors.kadar_gula_darah}
          >
            <label className="input nutrition-input-control">
              <input
                type="number"
                className="grow"
                placeholder="Kadar Gula Darah"
                value={data.kadar_gula_darah}
                onChange={(e) => setData("kadar_gula_darah", e.target.value)}
              />
              <small>mg/dl</small>
            </label>
          </NutritionField>
        </div>

        <div className="nutrition-tip-card">
          <FontAwesomeIcon icon={faLightbulb} />
          <p>
            Pastikan semua data diisi dengan benar agar hasil perhitungan lebih
            akurat.
          </p>
        </div>

        {progress && (
          <progress
            className="progress progress-primary w-full"
            value={progress.percentage}
            max="100"
          >
            {progress.percentage}%
          </progress>
        )}

        <button className="btn btn-primary nutrition-submit-btn" disabled={processing}>
          {processing ? "Menghitung..." : "Hitung Sekarang"}
        </button>
      </fieldset>
    </form>
  );
}
