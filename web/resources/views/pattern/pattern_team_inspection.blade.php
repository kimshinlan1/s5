@extends('layouts.app')

@push('css')
    <link href="{{ mix('/css/pattern_team_inspection.css') }}" rel="stylesheet"/>
@endpush
@push('scripts')
    <script src="{!! url('assets/jquery/jquery-ui.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery.ui.datepicker-ja.min.js') !!}" type="text/javascript"></script>
    <script src="{{ mix('js/pattern_common.js') }}" defer></script>
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
@if (!$teamId)
<div class="d-flex justify-content-between">
    <div class="h-title">{{ __('TeamInspection_Input') }}</div>

    <!-- My Toast -->
    <div class="toast hide align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" id="toast1">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('Message_Save_Success') }}
            </div>
        </div>
    </div>
    <div class="toast hide align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" id="toast2">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('Message_Delete_Success') }}
            </div>
        </div>
    </div>
</div>

<div class="d-flex justify-content-start mt-4" style="width: 55%;">
    {{-- Department List --}}
    {{-- Add selectbox --}}
    <div class="mt-1 fs-5" style="padding-right: 50px;">{{ __('Department') }}</div>
    <select style="text-align-last: center;" class="form-select form-select-arrow w-50" aria-label="Department select" id="selectDeptList" >
    </select>
</div>
<label id="errorLabelNoDeptPattern" style="font-size: 1em; color: red; margin-left: 5.2rem;">{{ __('TeamInspection_Please_Choose_Pattern_For_This_Department') }}</label>
<div class="d-flex justify-content-start mt-4" style="width: 55%;">
    {{-- Team List / Team Name --}}
    {{-- Add selectbox --}}
    <div class="mt-1 fs-5" style="padding-right: 15px;">{{ __('Team_Management') }}</div>
    <select style="text-align-last: center;" class="form-select form-select-arrow w-50" aria-label="Team select" id="selectTeamList" >
    </select>
</div>
<label id="errorLabelNoTeam" style="font-size: 1em; color: red; margin-left: 5.2rem;">{{ __('TeamInspection_Please_Create_Team_This_Department') }}</label>
@else
<div class="d-flex justify-content-between">
    <div class="h-title">{{ $teamName }}{{ __('TeamInspection_5S_Level_Transition') }}</div>

    <!-- My Toast -->
    <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" id="toast1">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('Message_Save_Success') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" id="toast2">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('Message_Delete_Success') }}
            </div>
        </div>
    </div>
</div>
@endif

<input type="hidden" id="hidDeptId" value="{{ $deptId }}"/>
<input type="hidden" id="hidTeamId" value="{{ $teamId }}"/>
<div id="content"></div>

<button type="button" class="btn btn-success" id="btnSave">{{ __('Common_button_save') }}</button>
<button type="button" class="btn btn-primary" id="btnAdd">{{ __('TeamInspection_Add_Inspection_Point') }}</button>

<div><br/></div>
<!-- Modal confirm save data -->
<div class="modal fade" id="modalSaveInspectionData" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('Common_Confirm') }}</h5>
            </div>
            <div class="modal-body">
                <div><span style="font-size: 0.9rem;">{{ __('Confirm_Message_Save_Data') }}</span></div>
            </div>
            <div class="modal-footer">
                <button type="button" onclick="saveInspectionData()"
                    class="btn btn-primary">{{ __('Common_button_ok') }}</button>
                <button type="button" class="btn btn-secondary" onclick="cancelSaveInspectionData()">
                    {{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal confirm remove column -->
<div class="modal fade" id="modalRemoveColumn" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('Common_Confirm') }}</h5>
            </div>
            <div class="modal-body">
                <div><span style="font-size: 0.9rem;">{{ __('TeamInspection_Confirm_Delete') }}</span></div>
            </div>
            <div class="modal-footer">
                <button type="button" onclick="acceptRemoveColumn()"
                    class="btn btn-primary">{{ __('Common_button_ok') }}</button>
                <button type="button" class="btn btn-secondary" onclick="cancelRemoveColumn()">
                    {{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>

@include('pattern.partials.evidence_dialog')
@include('layouts.confirm')

<input type="hidden" id="hidAuthUserId" name="hidAuthUserId" value="{{ auth()->user()->id }}"/>

@endsection
