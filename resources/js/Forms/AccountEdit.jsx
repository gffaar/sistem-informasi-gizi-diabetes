import { Link, useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faFloppyDisk,
  faGear,
  faLock,
  faMedkit,
  faRotateLeft,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { confirmLogout } from "../Utils/confirmLogout";

function calculateAge(tanggalLahir) {
  if (!tanggalLahir) {
    return "";
  }

  const birthDate = new Date(tanggalLahir);
  if (Number.isNaN(birthDate.getTime())) {
    return "";
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

  return age >= 0 ? age : "";
}

function calculateBmi(beratKg, tinggiCm) {
  const weight = Number(beratKg);
  const height = Number(tinggiCm);

  if (!weight || !height || height <= 0) {
    return "";
  }

  const heightMeter = height / 100;
  return (weight / (heightMeter * heightMeter)).toFixed(2);
}

function bmiLabel(bmi) {
  const value = Number(bmi);

  if (!value) {
    return "Isi berat dan tinggi badan";
  }

  if (value < 18.5) {
    return "Berat badan kurang";
  }

  if (value < 25) {
    return "Normal";
  }

  if (value < 30) {
    return "Berlebih";
  }

  return "Obesitas";
}

export default function FormAccountEdit({
  user = {
    username: "",
    nama: "",
    foto: "",
    role: "user",
  },
  pengguna = null,
  profilUser = null,
  action = "/informasi-data-pribadi-user/update",
  showAccountSettings = true,
}) {
  const initialTanggalLahir =
    profilUser?.tanggal_lahir || pengguna?.tanggal_lahir || "";
  const initialUmur =
    profilUser?.umur ?? calculateAge(initialTanggalLahir) ?? "";

  const { data, setData, post, processing, errors, progress, reset } = useForm({
    username: user?.username || "",
    nama: user?.nama || "",
    jenis_kelamin: profilUser?.jenis_kelamin || pengguna?.jenis_kelamin || "",
    tanggal_lahir: initialTanggalLahir,
    umur: initialUmur,
    tinggi_cm: profilUser?.tinggi_cm ?? pengguna?.tinggi_cm ?? "",
    berat_kg: profilUser?.berat_kg ?? pengguna?.berat_kg ?? "",
    kadar_gula_darah: profilUser?.kadar_gula_darah ?? "",
    riwayat_diabetes: profilUser?.riwayat_diabetes || "",
    aktivitas_fisik: profilUser?.aktivitas_fisik || "",
    foto: null,
  });

  const [preview, setPreview] = useState(
    user?.foto ? `/storage/${user.foto}` : "/no_profile_picture.png",
  );

  const bmi = useMemo(
    () => calculateBmi(data.berat_kg, data.tinggi_cm),
    [data.berat_kg, data.tinggi_cm],
  );
  const showHealthFields = user?.role === "user";

  function submit(e) {
    e.preventDefault();
    post(action);
  }

  function handleTanggalLahirChange(e) {
    const tanggalLahir = e.target.value;
    setData({
      ...data,
      tanggal_lahir: tanggalLahir,
      umur: calculateAge(tanggalLahir),
    });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setData("foto", file);
    setPreview(URL.createObjectURL(file));
  }

  function handleReset() {
    reset();
    setPreview(
      user?.foto ? `/storage/${user.foto}` : "/no_profile_picture.png",
    );
  }

  return (
    <form onSubmit={submit} className="profile-edit-form">
      <section className="profile-edit-card">
        <div className="profile-edit-card__header">
          <span className="profile-edit-card__icon">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <div>
            <h2>Data Pribadi</h2>
            <p>Lengkapi identitas Anda</p>
          </div>
        </div>

        <div className="profile-photo-panel">
          <img
            src={preview}
            alt="Foto Profil"
            className="profile-photo-panel__image"
          />
          <label className="btn btn-soft profile-photo-panel__button">
            <FontAwesomeIcon icon={faCamera} />
            Pilih Foto
            <input
              accept="image/*"
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        {errors.foto && <span className="text-error">{errors.foto}</span>}

        <div className="profile-form-grid">
          <label className="profile-field">
            <span>Nama Lengkap</span>
            <input
              type="text"
              className="input"
              placeholder="Nama lengkap"
              value={data.nama}
              onChange={(e) => setData("nama", e.target.value)}
            />
            {errors.nama && <small className="text-error">{errors.nama}</small>}
          </label>

          {showHealthFields && (
            <>
              <label className="profile-field">
                <span>Jenis Kelamin</span>
                <select
                  value={data.jenis_kelamin}
                  className="select"
                  onChange={(e) => setData("jenis_kelamin", e.target.value)}
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
                {errors.jenis_kelamin && (
                  <small className="text-error">{errors.jenis_kelamin}</small>
                )}
              </label>

              <label className="profile-field">
                <span>Tanggal Lahir</span>
                <input
                  type="date"
                  className="input"
                  value={data.tanggal_lahir}
                  onChange={handleTanggalLahirChange}
                />
                {errors.tanggal_lahir && (
                  <small className="text-error">{errors.tanggal_lahir}</small>
                )}
              </label>

              <label className="profile-field">
                <span>Umur</span>
                <input
                  type="number"
                  className="input"
                  placeholder="Umur"
                  value={data.umur}
                  onChange={(e) => setData("umur", e.target.value)}
                />
                {errors.umur && (
                  <small className="text-error">{errors.umur}</small>
                )}
              </label>
            </>
          )}
        </div>
      </section>

      {showHealthFields && (
        <section className="profile-edit-card">
          <div className="profile-edit-card__header">
            <span className="profile-edit-card__icon profile-edit-card__icon--orange">
              <FontAwesomeIcon icon={faMedkit} />
            </span>
            <div>
              <h2>Data Kesehatan</h2>
              <p>Pantau kondisi tubuh dan risiko diabetes</p>
            </div>
          </div>

          <div className="profile-form-grid">
            <label className="profile-field">
              <span>Berat Badan (kg)</span>
              <input
                step="any"
                type="number"
                className="input"
                placeholder="Contoh: 65"
                value={data.berat_kg}
                onChange={(e) => setData("berat_kg", e.target.value)}
              />
              {errors.berat_kg && (
                <small className="text-error">{errors.berat_kg}</small>
              )}
            </label>

            <label className="profile-field">
              <span>Tinggi Badan (cm)</span>
              <input
                step="any"
                type="number"
                className="input"
                placeholder="Contoh: 165"
                value={data.tinggi_cm}
                onChange={(e) => setData("tinggi_cm", e.target.value)}
              />
              {errors.tinggi_cm && (
                <small className="text-error">{errors.tinggi_cm}</small>
              )}
            </label>

            <div className="profile-bmi-card">
              <span>BMI / IMT Otomatis</span>
              <strong>{bmi || "-"}</strong>
              <small>{bmiLabel(bmi)}</small>
            </div>

            <label className="profile-field">
              <span>Kadar Gula Darah</span>
              <input
                step="any"
                type="number"
                className="input"
                placeholder="mg/dL"
                value={data.kadar_gula_darah}
                onChange={(e) => setData("kadar_gula_darah", e.target.value)}
              />
              {errors.kadar_gula_darah && (
                <small className="text-error">{errors.kadar_gula_darah}</small>
              )}
            </label>

            <label className="profile-field">
              <span>Riwayat Diabetes</span>
              <select
                value={data.riwayat_diabetes}
                className="select"
                onChange={(e) => setData("riwayat_diabetes", e.target.value)}
              >
                <option value="">Pilih riwayat</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
                <option value="Tidak tahu">Tidak tahu</option>
              </select>
              {errors.riwayat_diabetes && (
                <small className="text-error">{errors.riwayat_diabetes}</small>
              )}
            </label>

            <label className="profile-field">
              <span>Aktivitas Fisik</span>
              <select
                value={data.aktivitas_fisik}
                className="select"
                onChange={(e) => setData("aktivitas_fisik", e.target.value)}
              >
                <option value="">Pilih aktivitas</option>
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
              </select>
              {errors.aktivitas_fisik && (
                <small className="text-error">{errors.aktivitas_fisik}</small>
              )}
            </label>
          </div>
        </section>
      )}

      {showAccountSettings && (
        <section className="profile-edit-card">
          <div className="profile-edit-card__header">
            <span className="profile-edit-card__icon profile-edit-card__icon--blue">
              <FontAwesomeIcon icon={faGear} />
            </span>
            <div>
              <h2>Pengaturan Akun</h2>
              <p>Kelola akses masuk aplikasi</p>
            </div>
          </div>

          <div className="profile-form-grid">
            <label className="profile-field">
              <span>Username</span>
              <input
                type="text"
                className="input"
                placeholder="Username"
                value={data.username}
                onChange={(e) => setData("username", e.target.value)}
              />
              {errors.username && (
                <small className="text-error">{errors.username}</small>
              )}
            </label>

            <label className="profile-field">
              <span>Password</span>
              <input
                type="password"
                className="input"
                value="********"
                readOnly
              />
            </label>
          </div>

          <div className="profile-settings-actions">
            <Link href="/account/password" className="btn btn-soft">
              <FontAwesomeIcon icon={faLock} />
              Ubah Password
            </Link>
            <button
              type="button"
              onClick={confirmLogout}
              className="btn btn-error"
            >
              <FontAwesomeIcon icon={faSignOut} />
              Logout
            </button>
          </div>
        </section>
      )}

      {progress && (
        <progress
          className="progress progress-primary w-full"
          value={progress.percentage}
          max="100"
        >
          {progress.percentage}%
        </progress>
      )}

      <div className="profile-form-actions">
        <button className="btn btn-primary" disabled={processing}>
          <FontAwesomeIcon icon={faFloppyDisk} />
          Simpan
        </button>
        <button type="button" onClick={handleReset} className="btn btn-soft">
          <FontAwesomeIcon icon={faRotateLeft} />
          Reset
        </button>
      </div>
    </form>
  );
}
