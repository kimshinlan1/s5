<div class="sidebar" style="display: none;">
    <div class="list-group list-group-flush">
        <!-- Management -->
        @if(auth()->user()->isAdmin())
        <a id="managementMenuId" href="#" data-toggle="collapse" aria-expanded="false" style="background-color: cornflowerblue" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between align-items-center">
                <span class="menu-collapsed">{{ __('Manage') }}</span>
                <i class="fa fa-caret-right" aria-hidden="true" id="icon1"></i>
            </div>
        </a>
        <div id='subManagementMenuId' class="collapse sidebar-submenu">
            <a class="list-group-item list-group-item-action style-list @if(request()->path()==='users')active @endif" href="/users">{{ __('User_Management') }}</a>
            <a class="list-group-item list-group-item-action style-list @if(request()->path()==='company')active @endif" href="/company">{{ __('Company_Management') }}</a>
            <a class="list-group-item list-group-item-action style-list @if(request()->path()==='departments')active @endif" href="/departments">{{ __('Department_Management') }}</a>
            <a style="padding-left: 50px;" class="list-group-item list-group-item-action style-list @if(request()->path()==='teams')active @endif" href="/teams">{{ __('Team_Management') }}</a>
            <a style="padding-left: 50px;" class="list-group-item list-group-item-action style-list @if(request()->path()==='employee')active @endif" href="/employee">{{ __('Employee') }}</a>
        </div>
        @endif

        <!-- Study Plan -->
        <a id="studyPlanMenuId" href="#" data-toggle="collapse" aria-expanded="false" style="background-color: cornflowerblue" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between align-items-center">
                <span class="menu-collapsed">{{ __('TopPage_Study_Plan_Management') }}</span>
                <i class="fa fa-caret-right" aria-hidden="true" id="icon2"></i>
            </div>
        </a>
        <div id='subStudyPlanMenuId' class="collapse sidebar-submenu">
            <a href="#" class="list-group-item list-group-item-action text-black">
                <span class="menu-collapsed">Sub1</span>
            </a>
            <a href="#" class="list-group-item list-group-item-action text-black">
                <span class="menu-collapsed">Sub2</span>
            </a>
        </div>

        <!-- Skill Map -->
        <a id="skillMapMenuId" href="#" data-toggle="collapse" aria-expanded="false" style="background-color: cornflowerblue" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between align-items-center">
                <span class="menu-collapsed">{{ __('SkillMapMenu') }}</span>
                <i class="fa fa-caret-right" aria-hidden="true" id="icon3"></i>

            </div>
        </a>
        <div id='subSkillMapMenuId' class="collapse sidebar-submenu">
            <a class="list-group-item list-group-item-action style-list @if(str_contains(request()->path(), 'skillmaps'))active @endif" href="{{ route('skillmap_list') }}">{{ __('SkillMap') }}</a>
        </div>

        <!-- 5S Management -->
        <a id="menu5sId" href="#" data-toggle="collapse" aria-expanded="false" style="background-color: cornflowerblue" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between align-items-center">
                <span class="menu-collapsed">{{ __('5s_Manage') }}</span>
                <i class="fa fa-caret-right" aria-hidden="true" id="icon4"></i>
            </div>
        </a>
        <div id='submenu5sId' class="collapse sidebar-submenu">
            <a class="list-group-item list-group-item-action style-list @if(request()->path()==='pattern_top_page')active @endif" href="/pattern_top_page">{{ __('Pattern_Top_Page') }}</a>
            <a class="list-group-item list-group-item-action style-list @if(str_contains(request()->path(),'pattern_team_inspection'))active @endif" href="/pattern_team_inspection">{{ __('Pattern_Team_Inspection') }}</a>
            <a class="list-group-item list-group-item-action style-list @if(str_contains(request()->path(), 'pattern_dept_setting'))active @endif" href="/pattern_dept_setting">{{ __('Pattern_Dept_Setting') }}</a>
            @if(!auth()->user()->is5SModeFree())
            <a class="list-group-item list-group-item-action style-list @if(request()->path()==='pattern_list_customer')active @endif" href="/pattern_list_customer">{{ __('Pattern_List_Customer') }}</a>
            @endif
            @if(auth()->user()->isAdmin())
            <a class="list-group-item list-group-item-action style-list @if(request()->path()==='pattern_list')active @endif" href="/pattern_list">{{ __('Pattern_List') }}</a>
            <a class="list-group-item list-group-item-action style-list @if(str_contains(request()->path(), 'pattern_detail'))active @endif" href="/pattern_detail">{{ __('Pattern_Detail_5S_Checklist_Pattern_Input') }}</a>
            @endif
        </div>
    </div>
</div>
