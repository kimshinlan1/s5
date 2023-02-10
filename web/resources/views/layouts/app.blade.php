<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- todo: force http -> https for test (remove when release) --}}
    @if (!app()->environment('production') && strpos(Request::root(), "solutions.com"))
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
    @endif

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ __('Techmap_System') }}</title>

    <!-- Scripts -->
    <script src="{!! url('assets/jquery/jquery.min.js') !!}"></script>
    <script src="{!! url('assets/bootstrap/js/bootstrap-table.min.js') !!}"></script>
    <script src="{!! url('assets/bootstrap/js/bootstrap-table-reorder-rows.min.js') !!}"></script>
    <script src="{!! url('assets/jquery/jquery.tablednd.min.js') !!}"></script>

    @stack('scripts_lib')

    <script src="{{ mix('js/app.js') }}" defer></script>
    <script src="{{ mix('js/pattern_common.js') }}" defer></script>
    <script defer>
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    </script>

    @stack('scripts')

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <!-- Styles -->
    <link rel="stylesheet" href="{!! url('assets/bootstrap/css/bootstrap-table.min.css') !!}">
    <link rel="stylesheet" href="{!! url('assets/font-awesome-4.7.0/css/font-awesome.min.css') !!}">
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    @stack('css')
</head>
<body>
    <div id="app">
        @include('layouts.header')
        <div class="main">
            @section('sidebar')
            @show
            <div class="container">
                @yield('content')
            </div>
            @include('layouts.loading')
            @include('layouts.error')
        </div>
        @include('layouts.message')
    </div>
    <input type="hidden" id="userMode" name="userMode" value="{{auth()->user()->get5sModeUser()}}"/>
    <input type="hidden" id="userCompanyId" name="userCompanyId" value="{{auth()->user()->company_id}}"/>
    <input type="hidden" id="userId" name="userCompanyId" value="{{auth()->user()->id}}"/>
    <input type="hidden" id="techmapMode" name="techmapMode" value="{{auth()->user()->company->mode}}"/>
    <input type="hidden" id="mode5S" name="mode5S" value="{{auth()->user()->company->mode_5s}}"/>

</body>
</html>
