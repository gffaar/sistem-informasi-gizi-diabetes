import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFloppyDisk, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function FormAccountPassword({
  id,
  title = "Password",
  description = "Gunakan minimal 6 karakter dan konfirmasi password baru",
}) {
  const { data, setData, put, processing, errors, progress, reset } = useForm({
    old_password: "",
    password: "",
    password_confirmation: "",
  });
  const [clientErrors, setClientErrors] = useState({});

  const fieldError = (field) => clientErrors[field] || errors[field];

  function updateField(field, value) {
    setData(field, value);
    setClientErrors((current) => {
      const next = { ...current };
      delete next[field];

      if (field === "password") {
        delete next.password_confirmation;
      }

      return next;
    });
  }

  function validateForm() {
    const nextErrors = {};

    if (!data.old_password) {
      nextErrors.old_password = "Password lama wajib diisi.";
    }

    if (!data.password) {
      nextErrors.password = "Password baru wajib diisi.";
    } else if (data.password.length < 6) {
      nextErrors.password = "Password baru minimal 6 karakter.";
    }

    if (!data.password_confirmation) {
      nextErrors.password_confirmation = "Konfirmasi password baru wajib diisi.";
    } else if (data.password !== data.password_confirmation) {
      nextErrors.password_confirmation = "Konfirmasi password baru tidak sama.";
    }

    setClientErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function submit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    put("/account/password", {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  }

  return (
    <form onSubmit={submit} className="profile-edit-form">
      <section id={id} className="profile-edit-card">
        <div className="profile-edit-card__header">
          <span className="profile-edit-card__icon profile-edit-card__icon--blue">
            <FontAwesomeIcon icon={faLock} />
          </span>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        <div className="profile-form-grid">
          <label className="profile-field">
            <span>Password Lama</span>
            <div className="admin-password-input">
              <input
                type="password"
                className="input"
                placeholder="Password lama"
                autoComplete="current-password"
                value={data.old_password}
                onChange={(e) => updateField("old_password", e.target.value)}
              />
              <FontAwesomeIcon icon={faEye} />
            </div>
            {fieldError("old_password") && (
              <small className="text-error">{fieldError("old_password")}</small>
            )}
          </label>

          <label className="profile-field">
            <span>Password Baru</span>
            <div className="admin-password-input">
              <input
                type="password"
                className="input"
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
                minLength={6}
                value={data.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
              <FontAwesomeIcon icon={faEye} />
            </div>
            {fieldError("password") && (
              <small className="text-error">{fieldError("password")}</small>
            )}
          </label>

          <label className="profile-field">
            <span>Konfirmasi Password Baru</span>
            <div className="admin-password-input">
              <input
                type="password"
                className="input"
                placeholder="Ulangi password baru"
                autoComplete="new-password"
                minLength={6}
                value={data.password_confirmation}
                onChange={(e) =>
                  updateField("password_confirmation", e.target.value)
                }
              />
              <FontAwesomeIcon icon={faEye} />
            </div>
            {fieldError("password_confirmation") && (
              <small className="text-error">
                {fieldError("password_confirmation")}
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
          <button
            className="btn btn-primary admin-password-save-button"
            disabled={processing}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {processing ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>
      </section>
    </form>
  );
}
