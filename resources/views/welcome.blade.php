@extends('app')

@section('content')
  <section class="blade-page">
    <div class="blade-card">
      <div>
        <h1 class="blade-title">Gizi Diabetes</h1>
        <p class="blade-subtitle">
          Sistem Informasi Penentuan Gizi Diabetes Melitus.
        </p>
      </div>
      <a class="btn btn-primary" href="{{ route('auth.login.form') }}">Masuk</a>
    </div>
  </section>
@endsection
