@if(auth()->user()->isModeFree() && !auth()->user()->isAdmin())
    <button class="btn btn-success" style="opacity: 1" disabled>
        {{ __('Common_SkillMap_Free_Badge') }}
    </button>
@endif
@if(auth()->user()->is5SModeFree() && !auth()->user()->isAdmin())
    <button class="btn btn-success" style="opacity: 1" disabled>
        {{ __('Common_5S_Free_Badge') }}
    </button>
@endif
@if(auth()->user()->isModeFree() && auth()->user()->is5SModeFree() && !auth()->user()->isAdmin())
    <button class="btn btn-success" style="opacity: 1" disabled>
        {{ __('Common_Both_Free_Badge') }}
    </button>
@endif