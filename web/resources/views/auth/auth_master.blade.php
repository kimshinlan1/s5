<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Scripts -->
    <script src="{!! url('assets/jquery/jquery.min.js') !!}"></script>
    <script src="{{ mix('js/app.js') }}" defer></script>
    @stack('scripts')
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css" />
    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    @stack('css')
    <title>{{ __('Techmap_System') }}</title>
</head>
<body>
    <main>
      <div class="container">
          <div class="header" style="box-shadow:none !important">
              <nav class="navbar navbar-expand-md navbar-light">
                  <a class="navbar-brand navbar-brand d-sm-flex align-items-center align-self-stretch" href="https://kaizen-base.co.jp/">
                    <span style="width: 360px !important;" class="site-logo h-100"></span>
                  </a>
                  <h1 class="h3" style="color:white; margin-top: 20px;padding-left: 0.4rem;">{{ __('Techmap_System') }}</h1>
              </nav>
          </div>
          @yield('content')
      </div>
    </main>
</body>
</html>