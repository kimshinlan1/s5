@extends('layouts.app')

@push('scripts')
<script src="{{ mix('/js/teams.js')}}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
<div class="d-flex justify-content-between">
    <div class="h-title">{{ __('Team_Management') }}</div>
    <!-- My Toast -->
    <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast1">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('Common_Delete_Successful') }}
            </div>
        </div>
    </div>
    @include('layouts.success')
</div>
@if (Auth::user()->isAdmin())
<div style="display:flex">
    <div class="d-flex justify-content-start" style="width: 50%;">
        <div class="mt-1 fs-5" style="padding-right: 15px;">{{ __('Company_List') }}</div>
        <select style="text-align-last: center;" class="form-select form-select-arrow w-50" aria-label="Company select" id="companyListID" >
        </select>
    </div>
    <div class="d-flex justify-content-start" style="width: 50%">
        <div class="mt-1 fs-5" style="padding-right: 15px;">{{ __('Department') }}</div>
        <select style="text-align-last: center;" class="form-select form-select-arrow w-50" aria-label="Department select" id="departmentListID" >
        </select>
    </div>
</div>
@else
<div class="d-flex justify-content-start">
    <div class="col-1 mt-1 fs-5">{{ __('Department') }}</div>
    <select style="text-align-last: center;" class="form-select form-select-arrow w-25" aria-label="Department select" id="departmentListID" >
    </select>
</div>
@endif
<input type="hidden" id="hidCompanyId" value="{{ auth()->user()->company_id }}"/>

<br>
<table
    id="teamTable"
    class="table table-sm table-striped"
    >
    <thead class="table-light">
        <tr style="text-align: center;">
            <th data-field="id" data-visible="false">ID</th>
            <th data-field="no">{{ __('Team_No') }}</th>
            <th data-field="name" class="word-wrap">{{ __('Common_Name') }}</th>
            <th data-field="department.name" class="word-wrap">{{ __('Department') }}</th>
            <th data-width="240" data-formatter="teamTableActions"></th>
        </tr>
    </thead>
</table>
<br />

{{-- Add/Edit Dialog Team --}}
<button type="button" class="btn btn-primary" id="btnAdd">
    {{ __('Common_button_add') }}
</button>

{{-- Registration Dialog --}}
@include('layouts.common_dialog')
{{-- Delete Dialog --}}
@include('layouts.delete_dialog')

{{-- Add Dialog Employee--}}
<div id="employeeAddDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title add">{{ __('Common_button_add') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h6 class="form-label">{{ __('Employee_Input_Information_Label') }}</h6>
                <br>
                <form id="employeeForm">
                    <input type="hidden" name="employeeId" class="form-control" id="employeeId" value="">
                    <input type="hidden" name="deptd" class="form-control" id="deptd" value="">
                    <div class="row">
                        <div class="mb-3">
                            <label for="employeeName" class="form-label">{{ __('Employee_Name') }}</label>
                            <div class="input-group has-validation">
                                <input type="text" name="employeeName" class="form-control" id="employeeName" value="" required>
                                <div class="invalid-feedback"></div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="employeeEmail" class="form-label">{{ __('Common_Email') }}</label>
                            <div class="input-group has-validation">
                                <input type="text" name="employeeEmail" class="form-control" id="employeeEmail" value="" required>
                                <div class="invalid-feedback"></div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="employeeTeamId" class="form-label">{{ __('Team') }}</label>
                            <div class="input-group has-validation">
                                <select class="form-select form-select-arrow" aria-label="Team select" id="employeeTeamId" style="text-align-last: center;">
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="saveEmployeeBtn">{{ __('Common_button_ok') }}</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>

<input type="hidden" id="totalTeam" name="totalTeam" value=""/>
@endsection
