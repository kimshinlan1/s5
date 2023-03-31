@extends('layouts.app')

@push('css')
    <link href="{{ mix('/css/pattern_top_page.css') }}" rel="stylesheet"/>
@endpush

@push('scripts')
    <script src="{!! url('assets/jquery/jquery-ui.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery.ui.datepicker-ja.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/chart.min.js') !!}" type="text/javascript"></script>
    <script src="{{ mix('js/pattern_common.js') }}" defer></script>
    <script src="{{ mix('/js/pattern_top_page.js') }}"></script>
    <script src="{{ mix('/js/pattern_team_inspection_evidence.js') }}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
    <div class="d-flex justify-content-between">
        <div class="h-title">
            <span style="margin-right: 0.5rem"> {{ __('Pattern_TopPage_Management') }} </span>
            @if(auth()->user()->is5SModeFree())
            <button class="btn btn-warning" style="opacity: 1; margin-top: -0.4rem;" disabled>
                {{ __('Common_Free_Badge') }}
            </button>
            @endif
            @if(!auth()->user()->is5SModeFree() && !auth()->user()->isAdmin())
                <button class="btn btn-success" style="opacity: 1; margin-top: -0.4rem;" disabled>
                    {{ __('Common_Paid_Badge') }}
                </button>
            @endif
        </div>
        @include('layouts.success')
    </div>

@if(auth()->user()->isAdmin())
<div class="" style="margin-bottom: 0.5%;">
    <div class="d-flex justify-content-start mb-4">
        <div class="mt-1 fs-5">{{ __('Company_List') }}</div>
        <select style="text-align-last: center;" class="form-select form-select-arrow w-25 mx-3"
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
@include('pattern.partials.evidence_dialog')
@include('layouts.confirm')
@include('layouts.error')

    {{-- @include('pattern.pattern_top_page_table') --}}

@endsection
