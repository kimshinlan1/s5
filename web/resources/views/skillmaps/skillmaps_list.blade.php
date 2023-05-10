@extends('layouts.app')

@push('scripts')
<script src="{{ mix('/js/skillmap_list.js')}}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
<div class="d-flex justify-content-between">
    <div class="h-title">
        <span style="margin-right: 0.5rem"> {{ __('SkillMap_List') }} </span>
        @if(auth()->user()->isModeFree())
        <button class="btn btn-warning free-badge" style="opacity: 1; margin-top: -0.4rem; background-color:#EE7E00" disabled>
            {{ __('Common_Free_Badge_Title') }}
        </button>
        @endif
        @if(!auth()->user()->isModeFree() && !auth()->user()->isAdmin())
            <button class="btn btn-success paid-badge" style="opacity: 1; margin-top: -0.4rem; background-color:#0B97C1" disabled>
                {{ __('Common_Paid_Badge_Title') }}
            </button>
        @endif
    </div>
    <!-- My Toast -->
    <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast1">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('SkillMap_List_Copy') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast2">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('Message_Delete_Successful') }}
            </div>
        </div>
    </div>
</div>
<br/>
<table
    id="skillmapsTable"
    class="table table-sm table-striped"
    >
    <thead class="table-light">
        <tr style="text-align: center;">
            <th data-field="id" data-visible="false">ID</th>
            <th data-align="center" data-formatter="indexNo">No.</th>
            <th data-field="department.name" class="word-wrap">{{ __('Department') }}</th>
            <th data-field="name" class="word-wrap">{{ __('SkillMap_Line_Name') }}</th>
            <th class="text-align-webkit-center" data-width="188" data-formatter="skillmapsTableActions"></th>
        </tr>
    </thead>
</table>
<br />

{{-- Add Dialog --}}
<a href="/skillmaps_detail" id="skillMapsDetailLink">
<button type="button" class="btn btn-primary" data-bs-toggle="modal" id="addSkillmapsId">
    {{ __('Common_button_add') }}
</button>
</a>

{{-- Edit Dialog --}}
<div id="skillmapsEditDialog"></div>

{{-- Confirm Dialog --}}
<div id="skillmapsConfirmDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" name="skillmapId" class="form-control" id="skillmapId" value="">
                <div class="message"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" id="btnCancel" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
                <button type="button" class="btn" id="btnOK">{{ __('Common_Delete') }}</button>
            </div>
        </div>
    </div>
</div>
<input type="hidden" id="isCompanyId" name="isCompanyId" value="{{ auth()->user()->company_id }}"/>
<input type="hidden" id="userId" name="userId" value="{{ auth()->user()->id }}"/>
<input type="hidden" id="userIsModeFree" name="userIsModeFree" value="{{ auth()->user()->isModeFree() }}"/>
@endsection
