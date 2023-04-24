@extends('layouts.app')

@push('scripts')
<script src="{{ mix('/js/pattern_department.js')}}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
<div class="d-flex justify-content-between">
    <div class="h-title">{{ __('Pattern_Department_Management') }}</div>
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
    id="patternDepartmentTable"
    class="table table-sm table-striped"
    >
    <thead class="table-light">
        <tr style="text-align: center;">
            <th data-field="id" data-visible="false">ID</th>
            <th data-field="company_id" data-visible="false">Company ID</th>
            <th data-align="center" data-visible="false" data-field="no" data-cell-style="idStyle">{{ __('Department_ID') }}</th>
            <th data-width="120" data-field="name" class="word-wrap" data-cell-style="departmentStyle">{{ __('Deparment_Name') }}</th>
            <th data-width="140" data-formatter="department5SChecklistActions" data-cell-style="checkListStyle">{{ __('Deparment_5S_Checklist') }}</th>
        </tr>
    </thead>
</table>
<br />

{{-- Registration Dialog --}}
@include('layouts.common_dialog')

@endsection
