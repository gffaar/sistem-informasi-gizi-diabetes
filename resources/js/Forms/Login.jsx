import { useForm } from "@inertiajs/react";

export default function FormLogin() {
  const { data, setData, post, processing, errors } = useForm({
    username: "",
    password: "",
  });

  function submit(e) {
    e.preventDefault();
    post("/login");
  }

  return (
    <form onSubmit={submit}>
      <fieldset className="fieldset">
        <h2 className="page-title text-center">Welcome To Selamat datang </h2>
        <p className="page-subtitle text-center">Masuk untuk melanjutkan</p>
        <label className="label">Username</label>
        <input
          type="text"
          className="input"
          placeholder="Username"
          value={data.username}
          onChange={(e) => setData("username", e.target.value)}
        />
        {errors.username && (
          <span className="text-error">{errors.username}</span>
        )}

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
        />
        {errors.password && (
          <span className="text-error">{errors.password}</span>
        )}

        <button className="btn btn-primary w-full mt-4" disabled={processing}>
          {processing ? "Masuk..." : "Login"}
        </button>
      </fieldset>
    </form>
  );
}
