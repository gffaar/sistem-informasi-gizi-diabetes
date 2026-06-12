import { useForm } from "@inertiajs/react";

export default function FormRekomendasi({
  pengguna = {
    id: "",
    user_id: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    tinggi_cm: "",
    berat_kg: "",
  },
  rekomendasi = {
    id: 0,
    pengguna_id: 0,
    menu_makanan_id: 0,
    jumlah: 1,
    waktu_makan: "",
  },
  makanans = [],
  type = "admin",
}) {
  const { data, setData, post, processing, errors, progress } = useForm({
    pengguna_id: pengguna?.id || "",
    menu_makanan_id: rekomendasi.menu_makanan_id || "",
    jumlah: rekomendasi.jumlah || 1,
    waktu_makan: rekomendasi.waktu_makan || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "admin") {
      post(`/admin/pengguna/${pengguna.id}/menu-rekomendasi`);
    } else {
      post(`/user/menu-rekomendasi`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Menu Rekomendasi</legend>

        <label className="label">Makanan</label>
        <select
          value={data.menu_makanan_id}
          className="select"
          onChange={(e) => setData("menu_makanan_id", e.target.value)}
          disabled={makanans.length === 0}
        >
          <option value="">Pilih Makanan</option>
          {makanans.map((makanan) => (
            <option key={makanan.id} value={makanan.id}>
              {makanan.nama} ({makanan.kalori} kalori)
            </option>
          ))}
        </select>
        {errors.menu_makanan_id && (
          <span className="text-error">{errors.menu_makanan_id}</span>
        )}

        <label className="label">Jumlah</label>
        <input
          type="number"
          step="any"
          className="input"
          placeholder="Jumlah"
          value={data.jumlah}
          onChange={(e) => setData("jumlah", e.target.value)}
        />
        {errors.jumlah && <span className="text-error">{errors.jumlah}</span>}

        <label className="label">Waktu Makan</label>
        <select
          value={data.waktu_makan}
          className="select"
          onChange={(e) => setData("waktu_makan", e.target.value)}
        >
          <option value="">Pilih Waktu Makan</option>
          <option value="Pagi">Pagi</option>
          <option value="Siang">Siang</option>
          <option value="Malam">Malam</option>
        </select>
        {errors.waktu_makan && (
          <span className="text-error">{errors.waktu_makan}</span>
        )}

        {progress && (
          <progress value={progress.percentage} max="100">
            {progress.percentage}%
          </progress>
        )}

        {makanans.length === 0 && (
          <p className="empty-state__text text-center">
            Data makanan belum tersedia.
          </p>
        )}

        <button
          className="btn btn-primary w-full mt-4"
          disabled={processing || makanans.length === 0}
        >
          {processing ? "Menyimpan..." : "Simpan"}
        </button>
      </fieldset>
    </form>
  );
}
