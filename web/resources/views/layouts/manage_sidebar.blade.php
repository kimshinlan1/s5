<div class="sidebar" style="display: none;">
    <div class="list-group list-group-flush">
        @if(auth()->user()->isAdmin())
        <a class="list-group-item list-group-item-action @if(request()->path()==='users')active @endif" href="/users">{{ __('User_Management') }}</a>
        <a class="list-group-item list-group-item-action @if(request()->path()==='company')active @endif" href="/company">{{ __('Company_Management') }}</a>
        @endif
        <a class="list-group-item list-group-item-action @if(request()->path()==='departments')active @endif" href="/departments">{{ __('Department_Management') }}</a>
        <a style="padding-left: 30px;" class="list-group-item list-group-item-action @if(request()->path()==='teams')active @endif" href="/teams">{{ __('Team_Management') }}</a>
        <a class="list-group-item list-group-item-action @if(request()->path()==='pattern_detail')active @endif" href="/pattern_detail">{{ __('Pattern_Detail_5S_Checklist_Pattern_Input') }}</a>
        <a class="list-group-item list-group-item-action @if(str_contains(request()->path(), 'skillmaps'))active @endif" href="{{ route('skillmap_list') }}">{{ __('SkillMap') }}</a>
    </div>
</div>