<div class="sidebar" style="display: none;">
    <div class="list-group list-group-flush">
        <!-- Home -->
        <a href="/" id="mainMenuTop" onclick = hideCollapse() aria-expanded="false" style="background-color: cornflowerblue" class=" d-flex justify- list-group-item list-group-item-action">{{__('Main_Menu_Top')}}</a>
        <!-- Management -->
        <a id="mainMenu1" href="javascript:void(0);" data-toggle="collapse" aria-expanded="false" style="background-color: cornflowerblue" class="list-group-item list-group-item-action menu" onclick="toggleMenu(1)">
            <div class="d-flex w-100 justify-content-between align-items-center">
                <span class="menu-collapsed">{{ __('Manage') }}</span>
                <i class="fa fa-caret-right" aria-hidden="true" id="icon1"></i>
            </div>
        </a>
        <div id='subMenu1' class="collapse sidebar-submenu">
            @if(auth()->user()->isAdmin())
            <a class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='company')active @endif" href="/company">{{ __('Company_Management') }}</a>
            <a class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='users')active @endif" href="/users">{{ __('User_Management') }}</a>
            <a id="subDeptMenu" href="javascript:void(0);" onclick="event.stopPropagation(); toggleDeptMenu()" style="pointer-events: auto;" data-toggle="collapse" aria-expanded="false" class="d-flex justify-content-between align-items-center list-group-item list-group-item-action style-list">{{ __('Department_Management') }}
                <i class="fa fa-caret-right" aria-hidden="true" id="subIcon1"></i>
            </a>

            <div id='extraSubDeptMenuId' class="collapse sidebar-submenu">
                <a style="padding-left: 50px;" class="list-group-item list-group-item-action style-lis middle-click @if(request()->path()==='departments')active @endif" href="/departments">{{ __('Department_Menu') }}</a>
                <a style="padding-left: 50px;" class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='teams')active @endif" href="/teams">{{ __('Team_Management') }}</a>
                <a style="padding-left: 50px;" class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='employee')active @endif" href="/employee">{{ __('Employee') }}</a>
            </div>
            @else
            <a class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='departments')active @endif" href="/departments">{{ __('Department_Menu') }}</a>
            <a class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='teams')active @endif" href="/teams">{{ __('Team_Management') }}</a>
            <a class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='employee')active @endif" href="/employee">{{ __('Employee') }}</a>
            @endif


        </div>

        <!-- Study Plan -->
        <a id="mainMenu2" href="#" data-toggle="collapse" aria-expanded="false" style="background-color: cornflowerblue" class="list-group-item list-group-item-action menu" onclick="toggleMenu(2)">
            <div class="d-flex w-100 justify-content-between align-items-center">
                <span class="menu-collapsed">{{ __('TopPage_Study_Plan_Management') }}</span>
                <i class="fa fa-caret-right" aria-hidden="true" id="icon2"></i>
            </div>
        </a>
        <div id='subMenu2' class="collapse sidebar-submenu">
            <a class="list-group-item list-group-item-action style-list middle-click" href="javascript:void(0);">設定なし 1</a>
            <a class="list-group-item list-group-item-action style-list middle-click" href="javascript:void(0);">設定なし 2</a>
        </div>

        <!-- Skill Map -->
        <a id="mainMenu3" href="javascript:void(0);" data-toggle="collapse" aria-expanded="false" style="background-color: cornflowerblue" class="list-group-item list-group-item-action menu" onclick="toggleMenu(3)">
            <div class="d-flex w-100 justify-content-between align-items-center">
                <span class="menu-collapsed">{{ __('SkillMapMenu') }}</span>
                <i class="fa fa-caret-right" aria-hidden="true" id="icon3"></i>
            </div>
        </a>
        <div id='subMenu3' class="collapse sidebar-submenu">
            <a class="list-group-item list-group-item-action style-list middle-click @if(str_contains(request()->path(), 'skillmaps_list'))active @endif" href="{{ route('skillmap_list') }}">{{ __('SkillMap') }}</a>
            <a class="list-group-item list-group-item-action style-list middle-click @if(str_contains(request()->path(), 'skillmaps_detail'))active @endif" href="/skillmaps_detail">{{ __('SkillMap_Detail') }}</a>
        </div>

        <!-- 5S Management -->
        <a id="mainMenu4" href="javascript:void(0);" data-toggle="collapse" aria-expanded="false" style="background-color: cornflowerblue" class="list-group-item list-group-item-action menu" onclick="toggleMenu(4)">
            <div class="d-flex w-100 justify-content-between align-items-center">
                <span class="menu-collapsed">{{ __('5s_Manage') }}</span>
                <i class="fa fa-caret-right" aria-hidden="true" id="icon4"></i>
            </div>
        </a>
        <div id='subMenu4' class="collapse sidebar-submenu">
            <a class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='pattern_top_page')active @endif" href="/pattern_top_page">{{ __('Pattern_Top_Page') }}</a>
            <a class="list-group-item list-group-item-action style-list middle-click @if(str_contains(request()->path(),'pattern_team_inspection'))active @endif" href="/pattern_team_inspection">{{ __('Pattern_Team_Inspection') }}</a>
            <a class="list-group-item list-group-item-action style-list middle-click @if(str_contains(request()->path(), 'pattern_dept_setting'))active @endif" href="/pattern_dept_setting">{{ __('Pattern_Dept_Setting') }}</a>
            <a class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='pattern_list_customer')active @endif" href="/pattern_list_customer">{{ __('Pattern_List_Customer_Menu') }}</a>
            <a class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='pattern_departments')active @endif" href="/pattern_departments">{{ __('Pattern_Department_Management') }}</a>
            @if(auth()->user()->isAdmin())
            <a class="list-group-item list-group-item-action style-list middle-click @if(request()->path()==='pattern_list')active @endif" href="/pattern_list">{{ __('Pattern_List') }}</a>
            <a class="list-group-item list-group-item-action style-list middle-click @if(str_contains(request()->path(), 'pattern_detail'))active @endif" href="/pattern_detail">{{ __('Pattern_Detail_5S_Checklist_Pattern_Input') }}</a>
            @endif
        </div>
    </div>
</div>
