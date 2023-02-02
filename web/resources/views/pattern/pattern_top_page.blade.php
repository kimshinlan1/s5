@extends('layouts.app')

@push('css')
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="Stylesheet"
        type="text/css"/>
    {{-- <link href="{{ mix('/css/pattern.css') }}" rel="stylesheet"/> --}}
    <link href="{{ mix('/css/top_page.css') }}" rel="stylesheet"/>
@endpush

@push('scripts')
    <script src="{!! url('assets/jquery/jquery-3.2.1.slim.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-1.6.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-ui.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery.ui.datepicker-ja.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/chart.min.js') !!}" type="text/javascript"></script>
    <script src="{{ mix('/js/pattern_top_page.js') }}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
    <div class="h-title">5Sトップページ</div>

@if(auth()->user()->isAdmin())
<div class="input-group" style="margin-bottom: 0.5%;">
    <div class="label_header_1">
        <select style="text-align-last: center;" class="form-select form-select-arrow search-box"
        aria-label="Company select" id="companyOptionId" >
            @foreach ($companies as $company )
                <option value="{{ $company['id'] }}">{{ $company['name'] }}</option>
            @endforeach
        </select>
    </div>
</div>
@endif

<div id="topPageChart">

</div>

    {{-- @include('pattern.pattern_top_page_table') --}}

@endsection
