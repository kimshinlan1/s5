@extends('auth.auth_master')

@push('css')
    <link href="{{ mix('/css/login.css')}}" rel="stylesheet"> </link>
@endpush

@push('scripts')
    <script src="{{ mix('/js/login.js')}}"></script>
@endpush

@section('content')
    <form class="form-login" method="post" action="{{ route('login.perform') }}">
        <input type="hidden" name="_token" value="{{ csrf_token() }}" />
        <h2 class="color-blue h3 mb-3 fw-normal text-center">{{ __('Techmap_System') }}</h2>
        @include('layouts.messages')
        <div class="row justify-content-md-center">
            <div class="col col-md-6 mb-3">
                <label for="identifier" class="form-label">{{ __('Login_ID') }}</label>
                <input type="identifier" class="form-control" id="identifier" name="identifier" required>
            </div>
        </div>
        <div class="row justify-content-md-center">
            <div class="col col-md-6 mb-3">
                <label for="password" class="form-label">{{ __('Password') }}</label>
                <div class="input-group">
                    <input type="password" class="form-control" name="password" id="password" required>
                    <div class="input-group-addons">
                        <i class="bi bi-eye-slash" id="togglePassword" style="font-size:20px"></i>
                    </div>
                </div>
                @if ($errors->has('password'))
                    <span class="text-danger text-left">{{ $errors->first('password') }}</span>
                @endif
            </div>
        </div>
        <div class="row justify-content-md-center">
            <div class="col col-md-6 mb-3">
                <a href="#" class="link-primary" id="contactID">{{ __('Forgot_Password') }}</a>
            </div>
        </div>

        <button type="submit" class="btn btn-primary">{{ __('Login') }}</button>
    </form>

    <div class="modal" id="contactModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fs-6 fw-bold modal-title text-decoration-underline text-primary">{{ __('Contact_Forgot_Password') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body container">
                    <div class="row text-primary">
                        <div class="col">
                        </div>
                        <div class="col-9">
                            <h2 class="fw-bold text-center">Tel: {{ env('ADMIN_CONTACT_PHONE') }}</h2>
                            <p class="text-center">
                                <span>{{__('Contact_Email:')}}</span>
                                <span>{{ env('ADMIN_CONTACT_EMAIL') }}</span>
                            </p>
                        </div>
                        <div class="col">
                        </div>
                    </div>

                    <div class="row mt-2 text-center">
                        <div class="col fw-bold">
                            <span class="">{{__('Working_Hour')}}</span>
                        </div>
                    </div>

                    <div class="row mt-2">
                        <div class="col fw-bold text-center">
                            <span class="ms-1 ps-4">{{__('Weekend')}}</span>
                            <span>/</span>
                            <span class="">{{ env('WORKING_TIME_1') }}</span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col fw-bold text-center">
                          <span class="">{{__('Weekday')}}</span>
                          <span>/</span>
                          <span class="">{{ env('WORKING_TIME_2') }}</span>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">{{__('Common_button_ok')}}</button>
                </div>
            </div>
        </div>
    </div>

@endsection
