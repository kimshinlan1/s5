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
            <div class="main-menu-1">
                @if(auth()->user()->isModeFree())
                    <button class="btn btn-success rounded-0 border-0" style="opacity: 1; background-color:#EE7E00" disabled>
                        {{ __('Common_Free_Badge_Title') }}
                    </button>
                @endif
                @if(!auth()->user()->isModeFree() && !auth()->user()->isAdmin())
                    <button class="btn btn-success rounded-0 border-0" style="opacity: 1; background-color:#0B97C1" disabled>
                        {{ __('Common_Paid_Badge_Title') }}
                    </button>
                @endif
            </div>
        </a>
       
    </div>
    <div class="col-sm icon-menu-1">
        <a onclick="setSession('mainMenu4')" id="topPageLinkId" class="main-menu list-group-item list-group-item-action style-list @if(request()->path()==='pattern_top_page')active @endif" href="/pattern_top_page">
            <i class="fa fa-bar-chart mx-1" aria-hidden="true"></i>
            {{ __('TopPage_5S_System') }}
            <div class="main-menu-1">
                @if(auth()->user()->is5SModeFree())
                <button class="btn btn-success rounded-0 border-0" style="opacity: 1; background-color: #EE7E00" disabled>
                    {{ __('Common_Free_Badge_Title') }}
                </button>
                @endif
                @if(!auth()->user()->is5SModeFree() && !auth()->user()->isAdmin())
                    <button class="btn btn-success rounded-0 border-0" style="opacity: 1; background-color:#0B97C1" disabled>
                        {{ __('Common_Paid_Badge_Title') }}
                    </button>
                @endif
            </div>
        </a>
        
    </div>
  </div>
@endsection
