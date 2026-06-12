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

export default function FormAccountSettings({
  user = null,
  profil = null,
  profilUser = null,
  action = "/account/update",
}) {
  const { data, setData, post, processing, errors, progress, reset } = useForm({
    nama: user?.nama || "",
    tanggal_lahir: profilUser?.tanggal_lahir || profil?.tanggal_lahir || "",
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

    setClientErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function submit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    post(action, {
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
    <form onSubmit={submit} className="profile-edit-form">
      <section className="profile-edit-card">
        <div className="profile-edit-card__header">
          <span className="profile-edit-card__icon">
            <FontAwesomeIcon icon={faUserGear} />
          </span>
          <div>
            <h2>Profil User</h2>
            <p>Ubah nama, tanggal lahir, dan foto profil</p>
          </div>
        </div>

        <div className="profile-photo-panel">
          <img
            src={preview}
            alt="Preview Foto Profil"
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
            <span>Nama Lengkap</span>
            <input
              type="text"
              className="input"
              placeholder="Nama lengkap"
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
            <span>Tanggal Lahir</span>
            <input
              type="date"
              className="input"
              value={data.tanggal_lahir}
              onChange={(e) => updateField("tanggal_lahir", e.target.value)}
            />
            {fieldError("tanggal_lahir") && (
              <small className="text-error">
                {fieldError("tanggal_lahir")}
              </small>
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
          <button className="btn btn-primary" disabled={processing}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {processing ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </div>
      </section>
    </form>
  );
}
