@extends('layouts.app')

@push('scripts')
<script src="{{ mix('/js/departments.js')}}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
<div class="d-flex justify-content-between">
    <div class="h-title">{{ __('Department_Management') }}</div>
    <!-- My Toast -->
    @include('layouts.success')
    <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast2">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('Message_Delete_Successful') }}
            </div>
        </div>
    </div>
</div>
@if (Auth::user()->isAdmin())
    <div class="d-flex justify-content-start mb-4">
        <div class="mt-1 fs-5">{{ __('Company_List') }}</div>
        <select class="form-select form-select-arrow w-25 mx-3" aria-label="Company select" id="companyListID" style="text-align-last: center;">
        </select>
    </div>
@else
    <div class="d-flex justify-content-start mb-4">
        <div class="mt-1 fs-5" hidden>{{ __('Company_List') }}</div>
        <select class="form-select form-select-arrow w-25 mx-2" aria-label="Company select" id="companyListID" style="text-align-last: center;" hidden>
        </select>
    </div>
@endif
@include('layouts.confirm')
<table
    id="departmentTable"
    class="table table-sm table-striped"
    >
    <thead class="table-light">
        <tr style="text-align: center;">
            <th data-field="id" data-visible="false">ID</th>
            <th data-field="company_id" data-visible="false">Company ID</th>
            <th data-align="center" data-visible="false" data-field="no" data-cell-style="idStyle">{{ __('Department_ID') }}</th>
            <th data-width="120" data-field="name" class="word-wrap" data-cell-style="departmentStyle">{{ __('Deparment_Name') }}</th>
            {{-- <th data-width="140" data-formatter="department5SChecklistActions" data-cell-style="checkListStyle">{{ __('Deparment_5S_Checklist') }}</th> --}}
            <th data-width="80" class="text-align-webkit-center" data-formatter="departmentTableActions" data-cell-style="buttonStyle"></th>
        </tr>
    </thead>
</table>
<br />

{{-- Button Add/Edit Dialog --}}
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#departmentEditDialog">
    {{ __('Department_Button_Add') }}
</button>

{{-- Add/Edit Dialog Employee--}}
<div id="departmentAddDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title add">{{ __('Department_Button_Add') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h6 class="form-label">{{ __('Employee_Input_Information_Label') }}</h6>
                <br>
                <form id="employeeForm">
                    <input type="hidden" name="employeeId" class="form-control" id="employeeId" value="">
                    <div class="row">
                        <div class="mb-3">
                            <label for="employeeName" class="form-label">{{ __('Common_User_Name') }}</label>
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
                            <label for="employeeDepartmentId" class="form-label">{{ __('Department') }}</label>
                            <div class="input-group has-validation">
                                <select class="form-select form-select-arrow" aria-label="Department select" id="employeeDepartmentId" style="text-align-last: center;">
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

{{-- Add/Edit Dialog Department--}}
<div id="departmentEditDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title add" style="display:none;">{{ __('Common_Add_Label') }}</h5>
                <h5 class="modal-title edit" style="display:none;">{{ __('Common_Edit_Label') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h6 class="form-label">{{ __('Please enter your department information') }}</h6>
                <br>
                <form id="departmentForm">
                    <input type="hidden" name="departmentId" class="form-control" id="departmentId" value="">
                    <input type="hidden" name="no" class="form-control" id="noID" value="">
                    <input type="hidden" name="company" class="form-control" id="companyId" value="">
                    <div class="row">
                        <div class="col mb-3">
                            <label for="departmentName" class="form-label">{{ __('Deparment_Name') }}</label>
                            <div class="input-group has-validation">
                                <input type="text" name="departmentName" class="form-control" id="departmentName" value="" required>
                                <div class="invalid-feedback"></div>
                            </div>
                            <label style="display: none;" for="departmentName" class="form-label">{{ __('Deparment_Name') }}</label>
                            <div style="display: none;" class="input-group has-validation">
                                <input type="text" name="departmentName" class="form-control" id="departmentName" value="" required>
                                <div class="invalid-feedback"></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
                <button type="button" class="btn btn-primary" id="saveDepartmentBtn">{{ __('Common_button_ok') }}</button>
            </div>
        </div>
    </div>
</div>

{{-- Delete Dialog --}}
<div id="departmentDeleteDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('Common_Delete_Label') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" name="deleteDepartmentId" class="form-control" id="deleteDepartmentId" value="">
                <div class="message"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
                <button type="button" class="btn btn-red-color" id="deleteDepartmentBtn">{{ __('Common_button_ok') }}</button>
            </div>
        </div>
    </div>
</div>

{{-- Registration Dialog --}}
@include('layouts.common_dialog')

@endsection
