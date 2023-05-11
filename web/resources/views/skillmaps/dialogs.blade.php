<div class="modal" id="exampleModalCenter" tabindex="-1" role="dialog"
aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">分類を追加</h5>
            </div>
            <div class="modal-body" id="modal-body">
                <form id="myForm">
                    <div class="input-group">
                        <div class="col-5">
                            <input type="text" class="form-control" placeholder="分類名" autofocus
                                id="category" required="required" />
                        </div>
                        <div class="col-4">
                            <input type="text" class="form-control" maxlength="3" placeholder="行数"
                                id="rowTable" required="required" />
                        </div>
                        <div class="col-2" style="
                            display: flex;
                            align-items: center;
                            justify-content: center;">
                            {{ __('Common_Add_Line_Text') }}
                        </div>
                    </div>
                    <button type="submit" name="submit" style="display: none;" />
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" data-dismiss="modal"
                id="btnModalCategoryCancel">{{ __('Common_button_cancel') }}</button>
                <button type="button" onclick="validateMyFormSkillMap()" id="btnModalCategoryAdd"
                    class="btn btn-primary">{{ __('SkillMap_Add_Line') }}</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Confirm -->
<div class="modal fade" id="exampleModalConfirm" tabindex="-1" role="dialog"
aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">選択行を削除</h5>
            </div>
            <div class="modal-body" id="modal-body">
                <span>{{ __('SkillMap_Question_Delete_1') }}</span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" data-dismiss="modal"
                id="btnCancelConfirm">{{ __('Common_button_cancel') }}</button>
                <button type="button" onclick="deleteDataSkillMap()"
                    class="btn btn-red-color">{{ __('Common_Delete') }}</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal confirm save data when back page -->
<div class="modal fade" id="backPageModalConfirm" tabindex="-1" role="dialog"
aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">{{ __('Common_Confirm') }}</h5>
            </div>
            <div class="modal-body" id="modal-body">
                <span>{{ __('SkillMap_Question_BackPage') }}</span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-delete" onclick="backPageSaveData(false)">
                    {{ __('SkillMap_Cancel_Save_Button') }}</button>
                <button type="button" onclick="backPageSaveData(true)"
                    class="btn btn-primary">{{ __('Common_button_save') }}</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal confirm save data and export pdf -->
<div class="modal fade" id="saveExportPdf" tabindex="-1" role="dialog"
aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" hidden id="pdf-export1">{{ __('Skillmap_Button_PDF') }}</h5>
                <h5 class="modal-title" hidden id="pdf-export2">{{ __('Skillmap_Radar_Chart_PDF_Output') }}</h5>
            </div>
            <div class="modal-body" id="modal-body">
                <span>{{ __('Skillmap_PDF_Confirm') }}</span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" onclick="cancelExport()">
                    {{ __('Common_button_cancel') }}</button>
                    <button type="button" onclick="saveAndExport()"
                        class="btn btn-primary">{{ __('Common_button_ok') }}</button>

            </div>
        </div>
    </div>
</div>

<!-- Modal confirm save data -->
<div class="modal fade" id="saveData" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">{{ __('SkillMap_Save_Title') }}</h5>
            </div>
            <div class="modal-body" id="modal-body">
                <span>{{ __('Skillmap_Button_Save_Confirm') }}</span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" onclick="cancelSaveDataChange()">
                    {{ __('Common_button_cancel') }}</button>
                    <button type="button" onclick="saveDataChange()"
                        class="btn btn-primary">{{ __('Common_button_ok_save') }}</button>
            </div>
        </div>
    </div>
</div>

{{-- Confirm domPdf dialog --}}
<div class="modal fade" id="domPdfDialogId" tabindex="-1" role="dialog"
    aria-labelledby="domPdfDialogTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('SkillMap_DomPdf_Export_Title')}}</h5>
            </div>
            <div class="modal-body">
                <div class="domPdfMsg">{{ __('SkillMap_Pdf_Export_Message')}}</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" id="domPdfBtnCancel" data-dismiss="modal">{{ __('Common_button_cancel') }}</button>
                <button type="button" class="btn btn-primary" id="domPdfBtnId" value="">{{ __('SkillMap_Pdf_Export_Confirm') }}</button>
            </div>
        </div>
    </div>
</div>
{{-- Confirm snappyPdf dialog --}}
<div id="chartPdfDialogId" class="modal" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header" id="modalHeader">
                <h5 class="modal-title">{{ __('SkillMap_Chart_Pdf_Export_Title')}}</h5>
            </div>
            <div class="modal-body">
                <input type="hidden" class="form-control" value="">
                <div class="snappyPdfMsg">{{ __('SkillMap_Pdf_Export_Message')}}</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" id="chartPdfBtnIdCancel" data-dismiss="modal">{{ __('Common_button_cancel') }}</button>
                <button type="button" class="btn btn-primary" id="chartPdfBtnId" value="">{{ __('SkillMap_Pdf_Export_Confirm') }}</button>
            </div>
        </div>
    </div>
</div>