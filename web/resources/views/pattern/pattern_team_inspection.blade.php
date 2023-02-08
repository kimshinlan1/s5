@extends('layouts.app')

@push('css')
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="Stylesheet"
        type="text/css"/>
    <link href="{{ mix('/css/pattern_team_inspection.css') }}" rel="stylesheet"/>
@endpush

@push('scripts')
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
    <script src="{!! url('assets/jquery/jquery.ui.datepicker-ja.min.js') !!}" type="text/javascript"></script>
    <script src="{{ mix('/js/pattern_team_inspection.js') }}"></script>
    <script src="{{ mix('/js/pattern_team_inspection_evidence.js') }}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')

<style>
    body {
        overflow-x: unset;
    }
</style>

    <div class="h-title">{{ __('TeamInspection_Input') }}</div>

    <div class="d-flex justify-content-start mb-4" style="width: 55%;">
        {{-- Department List --}}
        {{-- Add selectbox --}}
        <div class="mt-1 fs-5" style="padding-right: 50px;">{{ __('Department') }}</div>
        <select style="text-align-last: center;" class="form-select form-select-arrow w-50" aria-label="Department select" id="selectDeptList" >
        </select>
    </div>

    <div class="d-flex justify-content-start mb-4" style="width: 55%;">
        {{-- Team List / Team Name --}}
        {{-- Add selectbox --}}
        <div class="mt-1 fs-5" style="padding-right: 15px;">{{ __('Team_Management') }}</div>
        <select style="text-align-last: center;" class="form-select form-select-arrow w-50" aria-label="Team select" id="selectTeamList" >
        </select>
    </div>

    <div id="content"></div>
    <br>

    <button type="button" class="btn btn-success" id="btnSave">{{ __('Common_button_save') }}</button>
    <button type="button" class="btn btn-primary" id="btnAdd">{{ __('TeamInspection_Add_Inspection_Point') }}</button>

    @include('pattern.partials.evidence_dialog')
@endsection
