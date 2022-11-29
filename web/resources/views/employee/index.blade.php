@extends('layouts.app')

@push('scripts')
<script src="{{ mix('/js/employee.js')}}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
<div class="d-flex justify-content-between">
    <div class="h-title">{{ __('Employee') }}</div>
    <!-- My Toast -->
    <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast1">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('Employee_List_Delete') }}
            </div>
        </div>
    </div>
    @include('layouts.success')
</div>
<div class="d-flex justify-content-start">
    <div class="col-1 mt-1 fs-5">{{ __('Department') }}</div>
    <select style="text-align-last: center;" class="form-select form-select-arrow w-25" aria-label="Department select" id="departmentSearchTable" >
    </select>
</div>
<br>
<table
    id="employeeTable"
    class="table table-sm table-striped"
    >
    <thead class="table-light">
        <tr style="text-align: center;">
            <th data-field="id" data-visible="false" data-sortable="true">ID</th>
            <th data-field="no" data-sortable="true">{{ __('Employee_No') }}</th>
            <th data-field="name" class="word-wrap" data-sortable="true">{{ __('Common_Name') }}</th>
            <th data-field="email" data-sortable="true" class="word-wrap">{{ __('Common_Email') }}</th>
            <th data-field="department.name" data-sortable="true" class="word-wrap">{{ __('Department') }}</th>
            <th data-width="130" data-sortable="true" data-formatter="employeeTableActions">　</th>
        </tr>
    </thead>
</table>
<br />

{{-- Add/Edit Dialog --}}
<label style="color: orange; font-size: 12px;" for="btnAdd" class="form-label">{{ __('Deparment_Count_Employee') }}</label>
<br />
<button type="button" class="btn btn-primary" id="btnAdd">
    {{ __('Common_button_add') }}
</button>

<div id="employeeEditDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title add" style="display:none;">{{ __('Common_button_add') }}</h5>
                <h5 class="modal-title edit" style="display:none;">{{ __('Common_Edit') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h6 class="form-label">{{ __('Employee_Input_Information_Label') }}</h6>
                <br>
                <form id="employeeForm">
                    <input type="hidden" name="employeeId" class="form-control" id="employeeId" value="">
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
                            <label for="employeeDepartment" class="form-label">{{ __('Department') }}</label>
                            <div class="input-group has-validation">
                                <select class="form-select form-select-arrow" aria-label="Department select" id="employeeDepartment" style="text-align-last: center;">
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

{{-- Delete Dialog --}}
<div id="employeeDeleteDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('Common_Delete') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" name="deleteEmployeeId" class="form-control" id="deleteEmployeeId" value="">
                <div class="message"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="deleteEmployeeBtn">{{ __('Common_button_ok') }}</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>

<input type="hidden" id="totalEmployee" name="totalEmployee" value=""/>
@endsection
