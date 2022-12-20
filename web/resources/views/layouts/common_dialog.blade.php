{{-- IN THIS FILE, PLACE ALL THE COMMON REGISTRATION DIALOGS --}}

{{-- Team Registration Dialog --}}
<div id="teamEditDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title add" style="display:none;">{{ __('Common_button_add') }}</h5>
                <h5 class="modal-title edit" style="display:none;">{{ __('Common_Edit') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h6 class="form-label">{{ __('Team_please_enter_your_team_information') }}</h6>
                <br>
                <form id="teamForm">
                    <input type="hidden" name="teamId" class="form-control" id="teamId" value="">
                    <div class="row">
                        <div class="mb-3">
                            <label for="teamName" class="form-label">{{ __('Team_Name') }}</label>
                            <div class="input-group has-validation">
                                <input type="text" name="teamName" class="form-control" id="teamName" value="" required>
                                <div class="invalid-feedback"></div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="teamDepartment" class="form-label">{{ __('Department') }}</label>
                            <div class="input-group has-validation">
                                <select class="form-select form-select-arrow" aria-label="Department select" id="teamDepartment" style="text-align-last: center;">
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="saveTeamBtn">{{ __('Common_button_ok') }}</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">{{ __('Common_button_cancel') }}</button>
            </div>
        </div>
    </div>
</div>