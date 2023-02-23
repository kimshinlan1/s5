{{-- Confirm dialog --}}
<div id="confirmDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('Notification')}}</h5>
            </div>
            <div class="modal-body">
                <input type="hidden" class="form-control" value="">
                <div class="confirmMessage"></div>
            </div>
            <div class="modal-footer">
                <button type="button" id="okBtn" class="btn btn-primary" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>

{{-- Confirm dialog 2 --}}
<div id="confirmDialog2" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('Notification')}}</h5>
            </div>
            <div class="modal-body">
                <input type="hidden" class="form-control" value="">
                <div class="confirmMessage"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">{{ __('Common_button_ok') }}</button>
            </div>
        </div>
    </div>
</div>

{{-- Confirm dialog 3 --}}
<div id="confirmDialog3" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('Notification')}}</h5>
            </div>
            <div class="modal-body">
                <input type="hidden" class="form-control" value="">
                <div class="confirmMessage3"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="okBtn" value="" data-deptid="" data-patternid="" data-isPattern="" data-compId="" data-bs-dismiss="modal">{{ __('Common_button_ok') }}</button>
                <button type="button" class="btn btn-primary" id="cancelBtn" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>