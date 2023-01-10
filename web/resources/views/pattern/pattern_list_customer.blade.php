@extends('layouts.app')

@push('scripts')
    <script src="{{ mix('/js/pattern_list_customer.js') }}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
    <div class="d-flex justify-content-between">
        <div class="h-title">{{ __('Pattern_List_Customer') }}</div>
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

    <table id="patternListTable" class="table table-sm table-striped">
        <thead class="table-light">
            <tr style="text-align: center;">
                <th data-align="center" data-width="200" data-field="id" data-visible="false">{{ __('Pattern_ID') }}</th>
                <th data-align="center" data-width="200" data-field="no">{{ __('Pattern_ID') }}</th>
                <th data-field="name" data-width="350" class="word-wrap">{{ __('Pattern_Name') }}</th>
                <th data-field="note" class="word-wrap">{{ __('Pattern_Note') }}</th>
                <th data-field="deptName" class="word-wrap">{{ __('Deparment_Name') }}</th>
                @if (Auth::user()->isAdmin() || (Auth::user()->isUser() && !Auth::user()->is5SModeFree()))
                    <th data-width="120" data-formatter="patternListTableActions" data-cell-style="cellStyle"></th>
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
                    <h5 class="modal-title">{{ __('Common_Delete') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="deletePatternListId" class="form-control" id="deletePatternListId"
                        value="">
                    <div class="message"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                        id="deletePatternListBtn">{{ __('Common_button_ok') }}</button>
                    <button type="button" class="btn btn-primary"
                        data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
                </div>
            </div>
        </div>
    </div>
@endsection
