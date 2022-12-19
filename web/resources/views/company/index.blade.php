@extends('layouts.app')

@push('scripts')
    <script src="{{ mix('/js/company.js') }}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
    <div class="d-flex justify-content-between">
        <div class="h-title">{{ __('Company_Management') }}</div>
        @include('layouts.success')
    </div>
    <br/>
    <table id="companyTable" class="table table-sm table-striped">
        <thead class="table-light">
            <tr style="text-align: center;">
                <th data-field="id" data-visible="false" rowspan="2"></th>
                <th data-field="no" class="word-wrap align-middle" rowspan="2">{{ __('Company_No') }}</th>
                <th data-field="name" class="word-wrap align-middle" rowspan="2">{{ __('Company_Name') }}</th>
                <th data-field="mode" data-formatter="formatterDataMode" colspan="2">{{ __('Company_Mode') }}</th>
                <th data-width="130" data-formatter="companyTableActions" rowspan="2"></th>
            </tr>
            <tr style="text-align: center;">
                <th data-field="mode" data-width="240" data-formatter="formatterDataMode">{{ __('Company_TechMap_Mode') }}</th>
                <th data-field="mode_5s" data-width="240" data-formatter="formatter5sMode">{{ __('Company_5S_Mode') }}</th>
            </tr>
        </thead>
    </table>
    <br />

    {{-- Add/Edit Dialog --}}
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#companyEditDialog">
        {{ __('Common_button_add') }}
    </button>

    <div id="companyEditDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title add" style="display:none;">{{ __('Common_button_add') }}</h5>
                    <h5 class="modal-title edit" style="display:none;">{{ __('Common_Edit') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h6 class="form-label">{{ __('Please enter your company information') }}</h6>
                    <form id="companyForm">
                        <input type="hidden" name="companyId" class="form-control" id="companyId" value="">
                        <div class="row">
                            <div class="col mb-3">
                                <label for="companyNo" class="form-label"><strong>{{ __('Company_No') }}</strong></label>
                                <div class="input-group has-validation">
                                    <input type="text" name="companyNo" class="form-control" id="companyNo" value="" required>
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col mb-3">
                                <label for="companyName" class="form-label"><strong>{{ __('Company_Name') }}</strong></label>
                                <div class="input-group has-validation">
                                    <input type="text" name="companyName" class="form-control" id="companyName" value="" required>
                                    <div class="invalid-feedback"></div>
                                </div>
                            </div>
                        </div>

                        {{-- Company Mode --}}
                        <label for="companyMode" class="form-label"><strong>{{ __('Company_Mode') }}</strong></label>
                        <div class="row mx-4">
                            {{-- Techmap mode --}}
                            <label for="companyMode" class="form-label"
                                id="companyModeLabel"><strong>{{ __('Company_TechMap_Mode') }}</strong></label>
                            <div class="d-flex justify-content-between" style="width: 350px; padding-left: 20px;" >
                                <div class="form-check" style="padding-left: 3rem;">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="companyMode_free" checked>
                                    <label class="form-check-label" for="companyMode_free">
                                        <strong>{{ __('Company_Free_Contract') }}</strong>
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="companyMode_isCharge">
                                    <label class="form-check-label" for="companyMode_isCharge">
                                        <strong>{{ __('Company_Paid_Contract') }}</strong>
                                    </label>
                                </div>
                            </div>
                            {{-- 5S mode --}}
                            <label for="5sMode" class="form-label"
                                id="5sModeLabel"><strong>{{ __('Company_5S_Mode') }}</strong></label>
                            <div class="d-flex justify-content-between" style="width: 350px; padding-left: 20px;" >
                                <div class="form-check" style="padding-left: 3rem;">
                                    <input class="form-check-input" type="radio" name="5sMode" id="5sMode_free" checked>
                                    <label class="form-check-label" for="5sMode_free">
                                        <strong>{{ __('Company_Free_Contract') }}</strong>
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="5sMode" id="5sMode_isCharge">
                                    <label class="form-check-label" for="5sMode_isCharge">
                                        <strong>{{ __('Company_Paid_Contract') }}</strong>
                                    </label>
                                </div>
                            </div>
                        </div>


                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                        id="saveCompanyBtn">{{ __('Common_button_ok') }}</button>
                    <button type="button" class="btn btn-primary"
                        data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
                </div>
            </div>
        </div>
    </div>

    {{-- Delete Dialog --}}
    <div id="companyDeleteDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ __('Common_Delete') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="deleteCompanyId" class="form-control" id="deleteCompanyId" value="">
                    <div class="message"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                        id="deleteCompanyBtn">{{ __('Common_button_ok') }}</button>
                    <button type="button" class="btn btn-primary"
                        data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
                </div>
            </div>
        </div>
    </div>
@endsection
