@extends('layouts.app')

@push('scripts')
    <script src="{{ mix('/js/users.js')}}"></script>
@endpush

@push('css')
    <link href="{{ mix('/css/users.css')}}" rel="stylesheet"> </link>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
<div class="d-flex">
    <div class="h-title">{{ __('User_Management') }}</div>
    <div style="margin-top: -0.2rem;">@include('layouts.mode_badge')</div>
    <!-- My Toast -->
    @include('layouts.success')
</div>
<br/>
<table
    id="userTable"
    class="table table-sm table-striped"
    >
    <thead class="table-light">
        <tr style="text-align: center;">
            <th data-field="id" data-visible="false">ID</th>
            <th data-field="role_id" data-visible="false">RoleID</th>
            <th data-field="company_id" data-visible="false">CompanyId</th>
            <th data-field="identifier" data-width="270" data-width="310" class="word-wrap">{{ __('User_Login_ID') }}</th>
            <th data-field="name" data-width="270" class="word-wrap">{{ __('User_Name') }}</th>
            <th data-width="180" data-field="company.name" class="word-wrap" data-formatter="customCell">{{ __('Company') }}</th>
            <th data-width="180" data-field="updated_at" data-formatter="dateFormatter">{{ __('User_Update_Date') }}</th>
            <th data-width="130" data-formatter="userTableActions"></th>
        </tr>
    </thead>
</table>
<br />

{{-- Add/Edit Dialog --}}
<button type="button" class="btn btn-primary" id="btnAdd">
    {{ __('Common_button_add') }}
</button>
<div id="userEditDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title add" style="display:none;">{{ __('Common_button_add') }}</h5>
                <h5 class="modal-title edit" style="display:none;">{{ __('Common_Edit') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h6 class="form-label">{{ __('Please enter your user information') }}</h6>
                <br>
                <form id="userForm">
                    <input type="hidden" name="userId" class="form-control" id="userId" value="">
                    <div class="row">
                        <div class="col mb-3">
                            <label for="userIdentifier" class="form-label">{{ __('User_Login_ID') }}</label>
                            <div class="input-group has-validation">
                                <input type="text" name="userIdentifier" class="form-control" id="userIdentifier" value="" required>
                                <div class="invalid-feedback"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col mb-3">
                                <label for="userPassword" class="form-label">{{ __('User_Password') }}</label>
                                <a id="createPwdId" href="#" class="px-3">{{ __('Generate_Password')}}</a>
                                <div class="input-group has-validation">
                                    <input type="text" name="userPassword" class="form-control" id="userPassword" value="">
                                    <span id="pwdNote">{{ __('Password_Note')}}</span>
                                <div class="invalid-feedback"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col mb-3">
                                <input type="hidden" name="userDecryptPassword" class="form-control" id="userDecryptPassword" value="">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col mb-3">
                            <label for="userName" class="form-label">{{ __('User_Name') }}</label>
                            <div class="input-group has-validation">
                                <input type="text" name="userName" class="form-control" id="userName" value="" required>
                                <div class="invalid-feedback"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col mb-3">
                            <label for="companyId" class="form-label">{{ __('Company') }}</label>
                            <select name="companyId" id="companyId" class="form-control" required>
                            </select>
                        </div>
                    </div>
                    <div class="row d-none">
                        <div class="col mb-3">
                            <div class="form-check has-validation">
                                 <input class="form-check-input" type="checkbox" value="" name="userRoleId" id="userRoleId">
                                 <label class="form-check-label" for="userRoleId">
                                    {{ __('Administrator') }}
                                </label>
                                <div class="invalid-feedback"></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="saveUserBtn">{{ __('Common_button_ok') }}</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>

{{-- Delete Dialog --}}
<div id="userDeleteDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('Common_Delete') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" name="deleteUserId" class="form-control" id="deleteUserId" value="">
                <div class="message"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="deleteUserBtn">{{ __('Common_button_ok') }}</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>

@include('layouts.confirm')
{{-- Translation --}}
<input type="hidden" id="hidRoleAdmin" name="hidRoleAdmin" value="{{ __('Administrator') }}"/>
<input type="hidden" id="hidAuthUserId" name="hidAuthUserId" value="{{ auth()->user()->id }}"/>
<input type="hidden" id="hidAuthUserRole" name="hidAuthUserRole" value="{{ auth()->user()->role_id }}"/>
<input type="hidden" id="hidAuthUserIdentifier" name="hidAuthUserIdentifier" value="{{ auth()->user()->identifier }}"/>

@endsection

