<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <link rel="icon" href="/icons/512.png" type="image/png" />

  <title>Gizi Diabetes</title>
  @hasSection('content')
    @vite(['resources/css/app.css'])
  @else
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    @inertiaHead
  @endif
</head>

<body>
  @hasSection('content')
    <main class="blade-shell">
      @yield('content')
    </main>
  @else
    @inertia
  @endif
</body>

</html>
