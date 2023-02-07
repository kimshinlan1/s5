@extends('layouts.app')

@push('scripts')
{{-- <script src="{{ mix('/js/toppage.js')}}"></script> --}}
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
<div class="row">
    <div class="col-sm">
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='users')active @endif" href="/users">{{ __('User_Management') }}</a>
    </div>
    <div class="col-sm">
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='study_plan')active @endif" href="/study_plan">{{ __('Study_Plan_Management') }}</a>
    </div>
    <div class="col-sm">
        <a class="list-group-item list-group-item-action @if(str_contains(request()->path(), 'skillmaps'))active @endif" href="{{ route('skillmap_list') }}">{{ __('SkillMap') }}</a>
    </div>
    <div class="col-sm">
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='pattern_top_page')active @endif" href="/pattern_top_page">{{ __('Pattern_Top_Page') }}</a>
    </div>
  </div>
@endsection
