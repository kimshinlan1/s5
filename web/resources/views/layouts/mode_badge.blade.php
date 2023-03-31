@if(auth()->user()->isModeFree())
    <button class="btn btn-warning" style="opacity: 1" disabled>
        {{ __('Common_Free_Badge') }}
    </button>
@endif
@if(!auth()->user()->isModeFree() && !auth()->user()->isAdmin())
    <button class="btn btn-success" style="opacity: 1" disabled>
        {{ __('Common_Paid_Badge') }}
    </button>
@endif