@extends('layouts.app')

@push('css')
    <link href="{{ mix('/css/pattern_list_customer.css') }}" rel="stylesheet"/>
@endpush

@push('scripts')
    <script src="{{ mix('js/pattern_common.js') }}" defer></script>
    <script src="{{ mix('/js/pattern_list_customer.js') }}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
    @include('layouts.confirm')
    <div class="d-flex justify-content-between">
        <div class="h-title">
            <span style="margin-right: 0.5rem">{{ __('Pattern_List_Customer') }}</span>
            @if(auth()->user()->is5SModeFree())
            <button class="btn btn-warning free-badge" style="opacity: 1;" disabled>
                {{ __('Common_Free_Badge_Title') }}
            </button>
            @endif
            @if(!auth()->user()->is5SModeFree() && !auth()->user()->isAdmin())
                <button class="btn btn-success paid-badge" style="opacity: 1;" disabled>
                    {{ __('Common_Paid_Badge_Title') }}
                </button>
            @endif
        </div>
        <!-- My Toast -->
        @include('layouts.success')
    </div>
    @if (Auth::user()->isAdmin())
        <div class="d-flex justify-content-start mb-4">
            <div class="mt-1 fs-5">{{ __('Company_List') }}</div>
            <select class="form-select form-select-arrow w-25 mx-3" aria-label="Company select" id="companyListID"
                style="text-align-last: center;">
            </select>
        </div>
    @endif
    <input type="hidden" id="hidLoginCompanyId" value="{{ auth()->user()->company()->first()->id }}"/>

    <table id="patternListTable" class="table table-sm table-striped">
        <thead class="table-light">
            <tr style="text-align: center;">
                <th data-field="id" data-visible="false">{{ __('Pattern_ID') }}</th>
                <th data-width="50" data-field="no" >{{ __('Pattern_ID') }}</th>
                <th data-width="120" data-field="name">{{ __('Pattern_Name') }}</th>
                <th data-field="note">{{ __('Pattern_Note') }}</th>
                <th data-field="deptName" data-cell-style="deptCheckListStyle">{{ __('Deparment_Name') }}</th>
                @if (Auth::user()->isAdmin() || (Auth::user()->isUser() && !Auth::user()->is5SModeFree()))
                    <th data-width="120" class="th-action" data-formatter="patternListTableActions" data-cell-style="cellStyle"></th>
                @endif
            </tr>
        </thead>
    </table>
    <br />

    {{-- Button Add/Edit Dialog --}}
    @if (Auth::user()->isAdmin() || (Auth::user()->isUser() && !Auth::user()->is5SModeFree()))
        <button type="button" class="btn btn-primary" id="patternListAdd">
            {{ __('Common_button_add') }}
        </button>
    @endif

    {{-- Delete Dialog --}}
    <div id="patternListDeleteDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ __('Pattern_Delete_Dialog_Title') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="deletePatternListId" class="form-control" id="deletePatternListId"
                        value="">
                    <div class="message"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-cancel"
                    data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
                    <button type="button" class="btn btn-red-color"
                        id="deletePatternListBtn">{{ __('Common_Delete') }}</button>
                </div>
            </div>
        </div>
    </div>
@endsection
