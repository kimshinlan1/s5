/*---------------------
* Global var
---------------------- */


/////////////////////////////////////////////////////////////////////////////


/*---------------------
* Upload file
---------------------- */
function uploadFile(block, is_before) {
    // todo: upload by ajax (select multi files => auto upload after selected)
    let inspecionId = $("#patternEvidenceDialog").find(".modal-footer #hidInspectionId").val();

}

/*---------------------
* Delete
---------------------- */
function deleteEvidence(block, is_before) {
    // todo:
}

/*---------------------
* Add Block
---------------------- */
function addBlock() {
    // todo:

    // showLoading();

    let params = {};
    let url = "/pattern_team_inspection/evidence/addblock";
    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        $("#patternEvidenceDialog").find(".modal-body").append(data);
    };

    runAjax(url, method, params, doneCallback);
}

/*---------------------
* Delete Block
---------------------- */
function deleteBlock(block) {
    // todo:
    if (confirm('Do you want to delete this block?')) {

        // todo: call ajax delete from DB

        $('#block_'+block).remove();
        $('#block_content_'+block).remove();


    }
}

/*---------------------
* Save dialog
---------------------- */
function saveDialog() {
    // todo:
}

/*---------------------
* Load data
---------------------- */
function loadEvidence(inspection_id) {
    showLoading();

    let params = {
        inspection_id : inspection_id
    };

    let url = "/pattern_team_inspection/evidence";
    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        // $("#patternEvidenceDialog .modal-body").empty();
        $("#patternEvidenceDialog .modal-body").append(data);
        $("#patternEvidenceDialog").find(".modal-footer #hidInspectionId").val(inspection_id);
    };

    runAjax(url, method, params, doneCallback);
}

function fullScreen(img_src) {
    $('#imgFullscreen').css({
        'background-image': 'url("' + img_src + '")',
    }).show();
}

/////////////////////////////////////////////////////////////////////////////

/*
 * DOCUMENT READY
 */
 $(function () {

    /*---------------------
     * DIALOG ON SHOW/HIDE
     ---------------------- */
    $("#patternEvidenceDialog").on("show.bs.modal", function (e) {
        let id = $(e.relatedTarget).data("id");
        loadEvidence(id);

    });
    $("#patternEvidenceDialog").on("hide.bs.modal", function (e) {
        $("#patternEvidenceDialog").find(".modal-body").html('');
    });

    /*---------------------
     * Click add block
     ---------------------- */
    $("#btnEvidenceAddBlock").on("click", function (e) {
        addBlock();
    });


 });