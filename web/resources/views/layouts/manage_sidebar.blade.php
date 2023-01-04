<div class="sidebar" style="display: none;">
    <div class="list-group list-group-flush">
        <a style="background-color: cornflowerblue" class="list-group-item list-group-item-action">{{ __('Manage') }}</a>
        @if(auth()->user()->isAdmin())
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='users')active @endif" href="/users">{{ __('User_Management') }}</a>
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='company')active @endif" href="/company">{{ __('Company_Management') }}</a>
        @endif

        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='departments')active @endif" href="/departments">{{ __('Department_Management') }}</a>
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='teams')active @endif" href="/teams">{{ __('Team_Management') }}</a>
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='employee')active @endif" href="/employee">{{ __('Employee') }}</a>

        @if(auth()->user()->isAdmin())
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='pattern_list')active @endif" href="/pattern_list">{{ __('Pattern_List') }}</a>
        <a class="list-group-item list-group-item-action style-list @if(str_contains(request()->path(), 'pattern_detail'))active @endif" href="/pattern_detail">{{ __('Pattern_Detail_5S_Checklist_Pattern_Input') }}</a>
        @endif
       
        <a class="list-group-item list-group-item-action style-list @if(str_contains(request()->path(), 'skillmaps'))active @endif" href="{{ route('skillmap_list') }}">{{ __('SkillMap') }}</a>

        <a style="background-color: cornflowerblue" class="list-group-item list-group-item-action">{{ __('5s_Manage') }}</a>
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='pattern_top_page')active @endif" href="/pattern_top_page">{{ __('Pattern_Top_Page') }}</a>
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='pattern_team_inspection')active @endif" href="/pattern_team_inspection">{{ __('Pattern_Team_Inspection') }}</a>
        <a class="list-group-item list-group-item-action style-list @if(str_contains(request()->path(), 'pattern_dept_setting'))active @endif" href="/pattern_dept_setting">{{ __('Pattern_Dept_Setting') }}</a>
        <a class="list-group-item list-group-item-action style-list @if(request()->path()==='pattern_list_customer')active @endif" href="/pattern_list_customer">{{ __('Pattern_List_Customer') }}</a>
    </div>
</div>