@extends('layouts.app')

@push('css')
    <link href="{{ mix('/css/my_page.css')}}" rel="stylesheet"> </link>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css" />
@endpush

@push('scripts')
<script src="{{ mix('/js/my_page.js')}}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
<div class="h-title">{{ __('My_Page') }}</div>
<div style="margin-top: -0.2rem;">@include('layouts.mode_badge')</div>
<br>
<table id="userTable" class="table table-hover table-bordered">
    <tbody>
        <tr style="display:none;" id="trUserId" data-value="{{$user->id}}">
            <th scope="row"></th>
            <td></td>
        </tr>
        <tr id="trUserName" data-value="{{$user->name}}">
            <th class="col-5 col-md-6">{{__('My_Page_Name')}}</th>
            <td class="col-7 col-md-6">{{$user->name}}</td>
        </tr>
        <tr id="trUserIdentifier" data-value="{{$user->identifier}}">
            <th scope="row">{{__('User_Login_ID')}}</th>
            <td>{{$user->identifier}}</td>
        </tr>
        <tr id="trUserCompany" data-value="{{$user->company->id}}">
            <th scope="row" >{{__('Company')}}</th>
            <td>{{$user->company->name}}</td>
        </tr>
        <tr id="trUserCompanyMode" data-value="{{$user->company->mode}}">
            <th scope="row" colspan="2" class="align-middle">{{__('Company_mode')}}</th>
        </tr>
        <tr id="trUserCompanyMode" data-value="{{$user->company->mode}}">
            <td style="padding-left: 3rem;">{{__('Company_TechMap_Mode')}}</td>
            <td>
                @if($user->company->mode == Constant::MODE['OWNER_COMPANY']) {{Constant::MODE_NAME['0']}}
                @elseif ($user->company->mode == Constant::MODE['IS_CHARGE']) {{Constant::MODE_NAME['1']}}
                @elseif ($user->company->mode == Constant::MODE['FREE']) {{Constant::MODE_NAME['2']}}
                @endif
            </td>
        </tr>
        <tr id="trUserCompanyMode" data-value="{{$user->company->mode}}">
            <td style="padding-left: 3rem;">{{__('Company_5S_Mode')}}</td>
            <td>
                @if($user->company->mode_5s == Constant::MODE['OWNER_COMPANY']) {{Constant::MODE_NAME['0']}}
                @elseif ($user->company->mode_5s == Constant::MODE['IS_CHARGE']) {{Constant::MODE_NAME['1']}}
                @elseif ($user->company->mode_5s == Constant::MODE['FREE']) {{Constant::MODE_NAME['2']}}
                @endif
            </td>
        </tr>
        <tr style="display:none;" id="trPassword" data-value="{{$user->password}}">
            <th scope="row"></th>
            <td></td>
        </tr>
    </tbody>
</table>
<br />
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-id="{{$user->id}}" data-bs-target="#userEditDialog">
    {{ __('My_Page_Change_User_Information') }}
</button>
<button type="button" class="btn btn-primary" data-bs-toggle="modal"  data-id="{{$user->id}}" data-bs-target="#userChangePasswordDialog">
    {{ __('My_Page_Change_Password') }}
</button>
<div id="userEditDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('アカウント情報変更') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <h5 class="modal-title">{{ __('アカウント情報を入力してください。') }}</h5>
               <br/>
                <form id="userForm">
                    <input type="hidden" name="userId" class="form-control" id="userId" value="{{$user->id}}">
                    <div class="row">
                        <div class="col mb-3">
                            <label for="userName" class="form-label">{{ __('My_Page_Name') }}</label>
                            <div class="input-group has-validation">
                                <input type="text" name="userName" class="form-control" id="userName" value="" maxlength="32" required>
                                <div class="invalid-feedback"></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="saveUserEditBtn">{{ __('Common_button_ok') }}</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>
<div id="userChangePasswordDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('My_Page_Change_Password') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <h5 class="modal-title">{{ __('My_Page_Please_enter_your_password') }}</h5>
               <span id="pwdNote">{{ __('Password_Note')}}</span>
               <br/>
               <br/>
               <form id="userChangePasswordForm">
                <div class="row">
                    <div class="col mb-3">
                        <label for="userOldPassword" class="form-label">{{ __('My_Page_Current_Password') }}</label>
                        <div class="input-group has-validation">
                            <input type="password" name="userOldPassword" class="form-control" id="userOldPassword" value="" maxlength="128" required>
                            <div class="input-group-addon">
                                <i class="bi bi-eye-slash" id="toggleOldPassword" style="font-size:20px"></i>
                            </div>
                            <div class="invalid-feedback"></div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col mb-3">
                        <label for="userNewPassword" class="form-label">{{ __('My_Page_New_Password') }}</label>
                        <div class="input-group has-validation">
                            <input type="password" name="userNewPassword" class="form-control" id="userNewPassword" maxlength="128" value="" required>
                            <div class="input-group-addon">
                                <i class="bi bi-eye-slash" id="toggleNewPassword" style="font-size:20px"></i>
                            </div>
                            <div class="invalid-feedback"></div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col mb-3">
                        <label for="userNewConfirmPassword" class="form-label">{{ __('My_Page_New_Confirm_Password') }}</label>
                        <div class="input-group has-validation">
                            <input type="password" name="userNewConfirmPassword" class="form-control" id="userNewConfirmPassword" maxlength="128" value="" required>
                            <div class="input-group-addon">
                                <i class="bi bi-eye-slash" id="toggleNewConfirmPassword" style="font-size:20px"></i>
                            </div>
                            <div class="invalid-feedback"></div>
                        </div>
                    </div>
                </div>
            </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="changeUserPasswordBtn">{{ __('Common_button_ok') }}</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>

{{-- Translation --}}
<input type="hidden" id="hidAuthUserId" name="hidAuthUserId" value="{{ auth()->user()->id }}"/>

@endsection