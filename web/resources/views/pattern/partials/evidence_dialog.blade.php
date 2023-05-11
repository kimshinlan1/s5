
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


<div id="patternEvidenceDialog" class="modal" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title fw-bold fs-1" style="margin: 0 auto;">{{ __('Evidence_Title') }}</h4>
                <button type="button" id="closeEvidenceBtnId" class="btn btn-secondary">&times;</button>
            </div>

            {{-- Render evidence data here from inspectionId  --}}
            <div class="modal-body evidences-body"></div>

            <div class="modal-footer" style="display: flex;">
                <div style="margin-right: auto;">
                    <button type="button" class="btn btn-red-color" onclick="deleteBlock()" id="btnEvidenceAddBlock" style="width: 125px;">{{ __('Evidence_Remove_Block_Btn') }}</button>
                    <button type="button" class="btn btn-primary" id="btnEvidenceAddBlock" style="width: 125px;">{{ __('Evidence_Add_Block_Btn') }}</button>
                </div>
                <div>
                    <button type="button" id="cancelEvidenceBtnId" class="btn btn-danger" style="width: 125px;">{{ __('Common_button_cancel') }}</button>
                    <button type="button" class="btn btn-primary" id="btnEvidenceSave" style="width: 125px;">{{ __('Common_button_save') }}</button>
                </div>
                {{-- Hidden --}}
                <input type="hidden" id="hidInspectionId" value=""/>
            </div>
        </div>
    </div>
</div>

{{-- Show image full screen on click --}}
<div id="imgFullscreen" onclick="this.style.display='none';"></div>

