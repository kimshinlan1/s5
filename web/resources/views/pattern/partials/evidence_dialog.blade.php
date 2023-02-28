
{{-- Team Evidence Dialog --}}


<style>
    #imgFullscreen {
        display: none;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat no-repeat;
        /* background-position: center center; */
        background-color: rgba(0, 0, 0, 0.425);
        background-size: 100% 100%;
    }
</style>


<div id="patternEvidenceDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title text-danger fw-bold fs-1">{{ __('Evidence_Title') }}</h4>
            </div>

            {{-- Render evidence data here from inspectionId  --}}
            <div class="modal-body evidences-body"></div>

            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnEvidenceSave">{{ __('Common_button_save') }}</button>
                <button type="button" class="btn btn-primary" id="btnEvidenceAddBlock">{{ __('Evidence_Add_Block_Btn') }}</button>
                <button type="button" id="cancelEvidenceBtnId" class="btn btn-secondary" data-bs-dismiss="modal" >{{ __('Common_button_cancel') }}</button>

                {{-- Hidden --}}
                <input type="hidden" id="hidInspectionId" value=""/>
            </div>
        </div>
    </div>
</div>

{{-- Show image full screen on click --}}
<div id="imgFullscreen" onclick="this.style.display='none';"></div>

