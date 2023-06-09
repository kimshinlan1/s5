@extends('layouts.app')

@push('scripts')
<script src="{{ mix('/js/toppage.js')}}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection
@push('css')
    <link href="{{ mix('/css/top_page.css') }}" rel="stylesheet"/>
@endpush
@section('content')
<div class="row icon-menu">
    @if(auth()->user()->isAdmin())
    <div class="col-sm icon-menu-1">
        <a onclick="setSession('mainMenu1')" id="managementLinkId" class="main-menu list-group-item list-group-item-action style-list @if(request()->path()==='users')active @endif" href="/users">
            <i class="fa fa-cog mx-1" aria-hidden="true"></i>
            {{ __('TopPage_Common_Management') }}
        </a>
        <div class="main-menu-1">
        </div>
    </div>
    @endif
    <div class="col-sm icon-menu-1">
        <a onclick="setSession('mainMenu2')" id="studyPlanLinkId" class="main-menu list-group-item list-group-item-action style-list @if(request()->path()==='study_plan')active @endif" href="/study_plan">
            <i class="fa fa-graduation-cap mx-1" aria-hidden="true"></i>
            {{ __('TopPage_Study_Plan_Management') }}
        </a>
        <div class="main-menu-1">
        </div>
    </div>
    <div class="col-sm icon-menu-1">
        <a onclick="setSession('mainMenu3')" id="skillMapLinkId" class="main-menu list-group-item list-group-item-action @if(str_contains(request()->path(), 'skillmaps'))active @endif" href="{{ route('skillmap_list') }}">
            <i class="fa fa-line-chart mx-1" aria-hidden="true"></i>
            {{ __('TopPage_Skill_Map') }}
        </a>
        <div class="main-menu-1">
            @include('layouts.mode_badge')
        </div>
    </div>
    <div class="col-sm icon-menu-1">
        <a onclick="setSession('mainMenu4')" id="topPageLinkId" class="main-menu list-group-item list-group-item-action style-list @if(request()->path()==='pattern_top_page')active @endif" href="/pattern_top_page">
            <i class="fa fa-bar-chart mx-1" aria-hidden="true"></i>
            {{ __('TopPage_5S_System') }}
        </a>
        <div class="main-menu-1">
            @include('layouts.mode_badge_5s')
        </div>
    </div>
  </div>
@endsection
