import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function FormDaftar() {
  const { data, setData, post, processing, progress, errors } = useForm({
    username: "",
    password: "",
    password_confirmation: "",
    nama: "",
    jenis_kelamin: "Laki-laki",
    tanggal_lahir: "",
    tinggi_cm: "",
    berat_kg: "",
    foto: null,
  });

  const [preview, setPreview] = useState(null);
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

    if (!data.password) {
      nextErrors.password = "Password wajib diisi.";
    } else if (data.password.length < 6) {
      nextErrors.password = "Password minimal 6 karakter.";
    }

    if (!data.password_confirmation) {
      nextErrors.password_confirmation = "Konfirmasi password wajib diisi.";
    } else if (data.password !== data.password_confirmation) {
      nextErrors.password_confirmation = "Konfirmasi password tidak sama.";
    }

    setClientErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function submit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    post("/daftar");
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setData("foto", file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={submit}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Daftar Akun</legend>

        <label className="label">Username</label>
        <input
          type="text"
          className="input"
          placeholder="Username"
          autoComplete="username"
          required
          value={data.username}
          onChange={(e) => updateField("username", e.target.value)}
        />
        {fieldError("username") && (
          <span className="text-error">{fieldError("username")}</span>
        )}

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Minimal 6 karakter"
          autoComplete="new-password"
          minLength={6}
          required
          value={data.password}
          onChange={(e) => updateField("password", e.target.value)}
        />
        {fieldError("password") && (
          <span className="text-error">{fieldError("password")}</span>
        )}

        <label className="label">Konfirmasi Password</label>
        <input
          type="password"
          className="input"
          placeholder="Ulangi password"
          autoComplete="new-password"
          minLength={6}
          required
          value={data.password_confirmation}
          onChange={(e) => updateField("password_confirmation", e.target.value)}
        />
        {fieldError("password_confirmation") && (
          <span className="text-error">
            {fieldError("password_confirmation")}
          </span>
        )}

        <label className="label">Nama</label>
        <input
          type="text"
          className="input"
          placeholder="Nama"
          autoComplete="name"
          required
          value={data.nama}
          onChange={(e) => updateField("nama", e.target.value)}
        />
        {fieldError("nama") && (
          <span className="text-error">{fieldError("nama")}</span>
        )}

        <label className="label">Jenis Kelamin</label>
        <select
          value={data.jenis_kelamin}
          className="select"
          required
          onChange={(e) => updateField("jenis_kelamin", e.target.value)}
        >
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
        {fieldError("jenis_kelamin") && (
          <span className="text-error">{fieldError("jenis_kelamin")}</span>
        )}
        <label className="label">Tanggal Lahir</label>
        <input
          type="date"
          className="input"
          placeholder="Tanggal Lahir"
          required
          value={data.tanggal_lahir}
          onChange={(e) => updateField("tanggal_lahir", e.target.value)}
        />
        {fieldError("tanggal_lahir") && (
          <span className="text-error">{fieldError("tanggal_lahir")}</span>
        )}

        <label className="label">Tinggi CM</label>
        <input
          step="any"
          type="number"
          className="input"
          placeholder="Tinggi CM"
          min="1"
          required
          value={data.tinggi_cm}
          onChange={(e) => updateField("tinggi_cm", e.target.value)}
        />
        {fieldError("tinggi_cm") && (
          <span className="text-error">{fieldError("tinggi_cm")}</span>
        )}

        <label className="label">Berat KG</label>
        <input
          step="any"
          type="number"
          className="input"
          placeholder="Berat KG"
          min="1"
          required
          value={data.berat_kg}
          onChange={(e) => updateField("berat_kg", e.target.value)}
        />
        {fieldError("berat_kg") && (
          <span className="text-error">{fieldError("berat_kg")}</span>
        )}

        <label className="label">Foto</label>
        <input
          accept="image/*"
          type="file"
          className="file-input"
          onChange={handleImageChange}
        />
        {fieldError("foto") && (
          <span className="text-error">{fieldError("foto")}</span>
        )}

        {preview && (
          <div className="mb-4">
            <p className="text-sm mb-1">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full object-cover rounded"
            />
          </div>
        )}

        {progress && (
          <progress value={progress.percentage} max="100">
            {progress.percentage}%
          </progress>
        )}

        <button className="btn btn-primary w-full mt-4" disabled={processing}>
          {processing ? "Mendaftarkan..." : "Daftar"}
        </button>
      </fieldset>
    </form>
  );
}
