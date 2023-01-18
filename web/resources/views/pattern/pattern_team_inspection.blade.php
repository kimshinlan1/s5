@extends('layouts.app')

@push('css')
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="Stylesheet"
        type="text/css"/>
    <link href="{{ mix('/css/pattern_team_inspection.css') }}" rel="stylesheet"/>
@endpush

@push('scripts')
    <script src="{!! url('assets/jquery/jquery-3.2.1.slim.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-1.6.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-ui.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery.ui.datepicker-ja.min.js') !!}" type="text/javascript"></script>
    <script src="{{ mix('/js/pattern_team_inspection.js') }}"></script>
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

    <div class="h-title">5S入力画面</div>

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

    <input type="hidden" id="hidDeptId" value=""/>
    <input type="hidden" id="hidTeamId" value=""/>

    <div id="content"></div>

    <br>

    <button type="button" class="btn btn-success" id="btnSave">保存</button>

    <button type="button" class="btn btn-primary" id="btnAdd">点検箇所の追加</button>


@endsection
