import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faFloppyDisk,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const fallbackPhoto = "/no_profile_picture.png";

function imageUrl(user) {
  return user?.foto ? `/storage/${user.foto}` : fallbackPhoto;
}

export default function AdminProfileForm({ user = null, supportsEmail = false }) {
  const { data, setData, post, processing, errors, progress, reset } = useForm({
    nama: user?.nama || "",
    username: user?.username || "",
    email: user?.email || "",
    foto: null,
  });
  const [preview, setPreview] = useState(imageUrl(user));
  const [clientErrors, setClientErrors] = useState({});

  const fieldError = (field) => clientErrors[field] || errors[field];

  function updateField(field, value) {
    setData(field, value);
    setClientErrors((current) => {
      const next = { ...current };
      delete next[field];

      return next;
    });
  }

  function validateForm() {
    const nextErrors = {};

    if (!data.nama.trim()) {
      nextErrors.nama = "Nama wajib diisi.";
    }

    if (!data.username.trim()) {
      nextErrors.username = "Username wajib diisi.";
    }

    if (supportsEmail && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      nextErrors.email = "Email tidak valid.";
    }

    setClientErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function submit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    post("/account/update", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => reset("foto"),
    });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setClientErrors((current) => ({
        ...current,
        foto: "Foto profil harus berupa gambar.",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setClientErrors((current) => ({
        ...current,
        foto: "Ukuran foto profil maksimal 2 MB.",
      }));
      return;
    }

    updateField("foto", file);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <form id="profil-admin" onSubmit={submit} className="profile-edit-form">
      <section className="profile-edit-card admin-account-card">
        <div className="profile-edit-card__header">
          <span className="profile-edit-card__icon">
            <FontAwesomeIcon icon={faUserGear} />
          </span>
          <div>
            <h2>Profil Admin</h2>
            <p>Kelola informasi akun admin</p>
          </div>
        </div>

        <div className="profile-photo-panel">
          <img
            src={preview}
            alt="Foto Profil Admin"
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
        {fieldError("foto") && (
          <span className="text-error">{fieldError("foto")}</span>
        )}

        <div className="profile-form-grid">
          <label className="profile-field">
            <span>Nama</span>
            <input
              type="text"
              className="input"
              placeholder="Nama admin"
              autoComplete="name"
              required
              value={data.nama}
              onChange={(e) => updateField("nama", e.target.value)}
            />
            {fieldError("nama") && (
              <small className="text-error">{fieldError("nama")}</small>
            )}
          </label>

          <label className="profile-field">
            <span>Username</span>
            <input
              type="text"
              className="input"
              placeholder="Username admin"
              autoComplete="username"
              required
              value={data.username}
              onChange={(e) => updateField("username", e.target.value)}
            />
            {fieldError("username") && (
              <small className="text-error">{fieldError("username")}</small>
            )}
          </label>

          <label className="profile-field profile-field--wide">
            <span>Email</span>
            <input
              type="email"
              className="input"
              placeholder={
                supportsEmail ? "Email admin" : "Email belum tersedia"
              }
              autoComplete="email"
              disabled={!supportsEmail}
              value={supportsEmail ? data.email : user?.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
            />
            {!supportsEmail && (
              <small className="form-hint">
                Email belum tersedia pada struktur akun saat ini.
              </small>
            )}
            {fieldError("email") && (
              <small className="text-error">{fieldError("email")}</small>
            )}
          </label>
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

        <div className="profile-settings-actions">
          <button
            className="btn btn-primary admin-profile-save-button"
            disabled={processing}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {processing ? "Menyimpan..." : "Simpan Profil Admin"}
          </button>
        </div>
      </section>
    </form>
  );
}
