<div id="deleteDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('Delete') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" name="deleteId" class="form-control" id="deleteId" value="">
                <div class="message"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="deleteBtn">{{ __('OK') }}</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">{{ __('Cancel') }}</button>
            </div>
        </div>
    </div>
</div>