import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function FormMakanan({
  makanan = {
    id:"",
    nama: "",
    kategori: "",
    kalori: "",
    karbohidrat: "",
    protein: "",
    lemak: "",
    satuan: "",
    gambar: null,
  },
  type = "create",
}) {
  const { data, setData, post, processing, errors, progress } = useForm({
    nama: makanan.nama || "",
    kategori: makanan.kategori || "",
    kalori: makanan.kalori || "",
    karbohidrat: makanan.karbohidrat || "",
    protein: makanan.protein || "",
    lemak: makanan.lemak || "",
    satuan: makanan.satuan || "",
    gambar: null,
    _method: type === "create" ? "POST" : "PUT",
  });

  const [preview, setPreview] = useState(makanan.gambar ? `/storage/${makanan.gambar}` : null);

  function submit(e) {
    e.preventDefault();
    if (type === "create") {
      post("/admin/menu-makanan");
    } else {
      post(`/admin/menu-makanan/${makanan.id}`);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setData("gambar", file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={submit}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Menu Makanan</legend>

        <label className="label">Nama</label>
        <input
          type="text"
          className="input"
          placeholder="Nama"
          value={data.nama}
          onChange={(e) => setData("nama", e.target.value)}
        />
        {errors.nama && <span className="text-error">{errors.nama}</span>}

        <label className="label">Kategori</label>
        <select
          value={data.kategori}
          className="select"
          onChange={(e) => setData("kategori", e.target.value)}
        >
          <option value="">Pilih Kategori</option>
          <option value="Karbo">Karbo</option>
          <option value="Protein">Protein</option>
          <option value="Lemak">Lemak</option>
          <option value="Sayur">Sayur</option>
          <option value="Buah">Buah</option>
          <option value="Lain-lain">Lain-lain</option>
        </select>
        {errors.kategori && (
          <span className="text-error">{errors.kategori}</span>
        )}

        <label className="label">Kalori</label>
        <input
          step="any"
          type="number"
          className="input"
          placeholder="Kalori"
          value={data.kalori}
          onChange={(e) => setData("kalori", e.target.value)}
        />
        {errors.kalori && <span className="text-error">{errors.kalori}</span>}

        <label className="label">Karbohidrat</label>
        <input
          step="any"
          type="number"
          className="input"
          placeholder="Karbohidrat"
          value={data.karbohidrat}
          onChange={(e) => setData("karbohidrat", e.target.value)}
        />
        {errors.karbohidrat && (
          <span className="text-error">{errors.karbohidrat}</span>
        )}

        <label className="label">Protein</label>
        <input
          step="any"
          type="number"
          className="input"
          placeholder="Protein"
          value={data.protein}
          onChange={(e) => setData("protein", e.target.value)}
        />
        {errors.protein && <span className="text-error">{errors.protein}</span>}

        <label className="label">Lemak</label>
        <input
          step="any"
          type="number"
          className="input"
          placeholder="Lemak"
          value={data.lemak}
          onChange={(e) => setData("lemak", e.target.value)}
        />
        {errors.lemak && <span className="text-error">{errors.lemak}</span>}

        <label className="label">Satuan</label>
        <input
          type="text"
          className="input"
          placeholder="Satuan"
          value={data.satuan}
          onChange={(e) => setData("satuan", e.target.value)}
        />
        {errors.satuan && <span className="text-error">{errors.satuan}</span>}

        <label className="label">Gambar</label>
        <input
          accept="image/*"
          type="file"
          className="file-input"
          onChange={handleImageChange}
        />
        {errors.gambar && <span className="text-error">{errors.gambar}</span>}

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
          {processing ? "Menyimpan..." : "Simpan"}
        </button>
      </fieldset>
    </form>
  );
}
