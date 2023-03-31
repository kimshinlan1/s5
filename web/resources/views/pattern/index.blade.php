@extends('layouts.app')

@push('css')
    <link href="{{ mix('/css/pattern_list_customer.css') }}" rel="stylesheet"/>
@endpush

@push('scripts')
    <script src="{{ mix('/js/pattern_list.js') }}"></script>
    <script src="{{ mix('js/pattern_common.js') }}" defer></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
    <div class="d-flex justify-content-between">
        <div class="h-title">{{ __('Pattern_List') }}</div>
        <div style="margin-top: -0.2rem;">@include('layouts.mode_badge_5s')</div>
        <!-- My Toast -->
        @include('layouts.success')
    </div>
    <br />
    <table id="patternListTable" class="table table-sm table-striped">
        <thead class="table-light">
            <tr style="text-align: center;">
                <th data-field="id" data-visible="false">{{ __('Pattern_ID') }}</th>
                <th data-align="center" data-field="no">{{ __('Pattern_ID') }}</th>
                <th data-field="name">{{ __('Pattern_Name') }}</th>
                <th data-field="note">{{ __('Pattern_Note') }}</th>
                @if (Auth::user()->isAdmin() || (Auth::user()->isUser() && !Auth::user()->is5SModeFree()))
                    <th data-width="120" data-formatter="patternListTableActions" data-cell-style="cellStyle"></th>
                @endif
            </tr>
        </thead>
    </table>
    <br />

    {{-- Button Add/Edit Dialog --}}
    <button type="button" class="btn btn-primary" id="patternListAdd">
        {{ __('Common_button_add') }}
    </button>

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
