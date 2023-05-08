@if(auth()->user()->is5SModeFree())
    <button class="btn btn-warning free-badge" style="opacity: 1" disabled>
        {{ __('Common_Free_Badge_Title') }}
    </button>
@endif
@if(!auth()->user()->is5SModeFree() && !auth()->user()->isAdmin())
    <button class="btn btn-success paid-badge" style="opacity: 1" disabled>
        {{ __('Common_Paid_Badge_Title') }}
    </button>
@endif