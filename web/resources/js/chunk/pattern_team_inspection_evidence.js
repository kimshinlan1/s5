/*---------------------
* Global var
---------------------- */
var openEvidenceBtn = null;
var numberOfEvidences = 0;
var confirmMsg = '';
/////////////////////////////////////////////////////////////////////////////

/*---------------------
* GLOBAL FUNCTION
---------------------- */

/*---------------------
* Upload file
---------------------- */
function uploadFile(input, block, is_before, albumId) {
    // let inspecionId = $(openEvidenceBtn).attr('data-id');
    if (input.files && input.files[0]) {
        input.files.forEach((_element, index) => {
                var reader = new FileReader();
                reader.onload = function (e) {

                const image = new Image();
                image.src = reader.result;

                if (is_before) {
                    $('#img_before' + block).find('.active').removeClass('active');
                    $('#img_before' + block).children('img').remove();
                    fileId = "file_before_block" + block + "_" + index;
                } else {
                    $('#img_after' + block).find('.active').removeClass('active');
                    $('#img_after' + block).children('img').remove();
                    fileId = "file_after_block" + block + "_" + index;
                }

                let divClass = (index == input.files.length - 1) ? 'item active ' + fileId : 'item ' + fileId;
                let tempImgId = is_before ? '_before_' + index + "_" + block: '_after' + index + "_" + block;
                let img = '<div class="' + divClass + '" id="item' + tempImgId + '" data-id="' + tempImgId + '">' + '<button type="submit" class="close-image" id="removeImage' +
                tempImgId + '" onclick="removeImage(`' + tempImgId + '`,'+albumId+',' +true+')"><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +
                '<img class="img-size" src="' + image.src + '" style="width:100%; position: relative; object-fit: contain;" id="slideImageID" onclick="fullScreen(`' + image.src + '`)"/></div>';

                if (is_before) {
                    $('#img_before' + block).append(img);
                } else {
                    $('#img_after' + block).append(img);
                }
        }
        reader.readAsDataURL(input.files[index]);
        input.value.replace(/^.*\\/, "");
    });

}
}

/*---------------------
* Add Block
---------------------- */
function addBlock() {
    // showLoading();
    let inspectionId = $(openEvidenceBtn).attr('data-id');
    let locationArr = [];
    $('input[id^=hidLocationId_]').each(function(i, l) {
        locationArr.push($(l).val());
    })
    if ($('#noDataId').length > 0) {
        $('#noDataId').remove();
    }
    let params = {
        inspectionId: inspectionId,
        locationArr: locationArr,
        teamId: $('#selectTeamList').val()
    };
    let url = "/pattern_team_inspection/evidence/addblock";
    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        $("#patternEvidenceDialog").find(".evidences-body").append(data);
        let inspectionId = $('#hidNewInspectionId').val();
        $(openEvidenceBtn).attr('data-id', inspectionId);
        let time = $(openEvidenceBtn).attr('data-time');

        $('input[id^=hidInspectionId_]').each(function(i, l) {
            if (i == time) {
                $(l).val(inspectionId);
                $(l).attr('id', 'hidInspectionId_'+inspectionId);
            }
        })
        $("#patternEvidenceDialog").find('.evidences-body').animate({
            scrollTop: $("#patternEvidenceDialog").find('.evidences-body').get(0).scrollHeight
        }, 1500);
    };

    runAjax(url, method, params, doneCallback);
}

/*---------------------
* Delete Block
---------------------- */
function deleteBlock(blockId) {
    let inspectionId = $(openEvidenceBtn).attr('data-id');
    if (confirm(confirmMsg)) {
        let url = "/pattern_team_inspection/evidence/" + blockId + "?inspectionId=" + inspectionId;
        let method = "DELETE";

        let doneCallback = function (_data, _textStatus, _jqXHR) {
            $('#block_'+blockId).remove();
            $('#block_content_'+blockId).remove();
            if ($('.evidences-body').find('.count-block').length == 0) {
                let noDataMsg = $('#messageNoData').val()
                $('.evidences-body').append('<div class="h4" id="noDataId" style="text-align: center;">' + noDataMsg + '</div>');
            }
            showToast($('#toast2'), 2000, true);
        };

        let failCallback = function (jqXHR, _textStatus, _errorThrown) {
            failAjax(jqXHR, _textStatus, _errorThrown);
        };

        runAjax(url, method, null, doneCallback, failCallback);
    }
}

/*---------------------
* Save dialog
---------------------- */
function saveDialog() {
    //
}

/*---------------------
* Load data
---------------------- */
function loadEvidence(inspection_id) {
    // showLoading();
    if ($('#noDataId').length > 0) {
        $('#noDataId').remove();
    }
    let params = {
        inspection_id : inspection_id
    };

    let url = "/pattern_team_inspection/evidence";
    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        $("#patternEvidenceDialog .evidences-body").append(data);
        $("#patternEvidenceDialog").find(".modal-footer #hidInspectionId").val(inspection_id);
        if ($('.evidences-body').find('.count-block').length == 0) {
            let noDataMsg = $('#messageNoData').val()
            $('.evidences-body').append('<div class="h4" id="noDataId" style="text-align: center;">' + noDataMsg + '</div>');
        }
    };

    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    runAjax(url, method, params, doneCallback, failCallback);
}

/*---------------------
* Display full screen image
---------------------- */
function fullScreen(img_src) {
    $('#imgFullscreen').css({
        'background-image': 'url("' + img_src + '")',
        'background-size': 'contain',
        'background-position': 'center',
    }).show();
}

/*---------------------
* Remove one selected image
---------------------- */
function removeImage(imgID, albumID, isTempImage = false) {
    if (confirm(confirmMsg)) {
        let noImgPath = $('#noImage').val();
        if ($('#item'+imgID).next().length != 0) {
            $('#item'+imgID).next().addClass('active');
        } else {
            $('#item'+imgID).siblings("div:first").addClass('active');
        }
        $('#item'+imgID).remove();
        $('#removeImage'+imgID).remove();

        if (!isTempImage) {
            let url = "/pattern_team_inspection/evidence/image/" + imgID;

            let method = "DELETE";

            let doneCallback = function (_data, _textStatus, _jqXHR) {
                // Check if there is any image in the album. If not, append No-Image to empty album
                if ($(albumID).find('.item').length == 0) {
                    $(albumID).append('<img class="img-size" src="'+noImgPath+'" alt="no-image" style="width:100%;" onclick="" id="noImg">');
                }
                showToast($('#toast2'), 2000, true);
            };

            let failCallback = function (jqXHR, _textStatus, _errorThrown) {
                failAjax(jqXHR, _textStatus, _errorThrown);
            };

            runAjax(url, method, null, doneCallback, failCallback);
        } else {
            if ($(albumID).find('.item').length == 0) {
                $(albumID).append('<img class="img-size" src="'+noImgPath+'" alt="no-image" style="width:100%;" onclick="" id="noImg">');
            }
        }


    }
}

/*---------------------
* Remove a before/after album
---------------------- */
function removeAlbum(albumID, blockID, isBefore) {
    if (confirm(confirmMsg)) {
        let inspectionId = $(openEvidenceBtn).attr('data-id');
        let ids = $.map($('#' + albumID + ' > div'), div => div.dataset['id'] );
        let noImgPath = $('#noImage').val();

        // Append No-Image to empty album
        $('#'+albumID).empty();
        $('#'+albumID).append('<img class="img-size" src="'+noImgPath+'" alt="no-image" style="width:100%;" onclick="" id="noImg">');

        let url = "/pattern_team_inspection/evidence/removeAlbum";
        let method = "POST";
        let params = {
            ids: ids,
            blockID: blockID,
            isBefore: isBefore,
            inspectionId: inspectionId,
        }
        let doneCallback = function (data, _textStatus, _jqXHR) {
            showToast($('#toast2'), 2000, true);
        };
        let failCallback = function (jqXHR, _textStatus, _errorThrown) {
            failAjax(jqXHR, _textStatus, _errorThrown);
        };

        runAjax(url, method, params, doneCallback, failCallback);
    }
}

/*---------------------
* Hide all modals
---------------------- */
function hideAllModals() {
    $("#confirmDialog3").modal('hide');
    $('#patternEvidenceDialog').modal('hide');
    // Fix conflict hen use multi modal
    $("body").find(".modal").each(function(i,e) {
        $(e).hide();
    });
    $("body").find(".modal-backdrop").each(function(i,e) {
        $(e).remove();
    });
}

/*---------------------
* Handle click OK button on confirmmation dialog
* There are 2 cases: close dialog case and save case
*
---------------------- */
/**
 * Handle click OK button on confirmmation dialog. There are 2 cases: delete case and save case
 *
 * @param {bolean} isSaveMode Check mode
 * @return void
 */
function handleConfirmOkBtn(isSaveMode) {
    if (isSaveMode) {
        // Save Case
        let blocks = $('.evidences-body').find('.count-block');
        let inspecionId = $(openEvidenceBtn).attr('data-id');
        let problemBeforeArray = [];
        let problemAfterArray = [];
        let blockIdArray = [];
        let formData = new FormData();

        // Check if evidence dialog contains any blocks. If not, do nothing and close the dialog when click save button
        if (blocks.length > 0) {
            // Loop block
            for (const block of blocks) {
                let blockId = $(block).attr('data-id');
                let beforeFiles = $(block).find(".file-before")[0].files;
                let countAfter = 0, countBefore = 0;

                // Loop before album
                for (let i = 0; i < beforeFiles.length; i++) {
                    // Check if uploaded image still exists or not
                    if($(".file_before_block" + blockId + "_" + i).length > 0) {
                        // Add item-count class in order to distinguish existing and non-exisiting uploaded image for calculating number of evidences
                        $(".file_before_block" + blockId + "_" + i).addClass('item-count');
                        // Append existing uploaded images in before album
                        formData.append("file_before_block" + blockId + "_" + i, beforeFiles[i]);
                        countBefore++;
                    }
                }
                // Loop after album
                let afterFiles = $(block).find(".file-after")[0].files;
                for (let i = 0; i < afterFiles.length; i++) {
                    // Check if uploaded image still exists or not
                    if($(".file_after_block" + blockId + "_" + i).length > 0) {
                        // Add item-count class in order to distinguish existing and non-exisiting uploaded image for calculating number of evidences
                        $(".file_after_block" + blockId + "_" + i).addClass('item-count');
                        // Append existing uploaded images in after album
                        formData.append("file_after_block" + blockId + "_" + i, afterFiles[i]);
                        countAfter++;
                    }
                }
                // Append number of uploaded images per block
                formData.append("countBeforeImg_block" + blockId, countBefore);
                formData.append("countAfterImg_block" + blockId, countAfter);

                // Add text area and block ids contents to array
                let problemBefore = $(blocks).find('#problemBefore' + blockId).val();
                let problemAfter = $(blocks).find('#problemAfter' + blockId).val();
                problemBeforeArray.push(problemBefore);
                problemAfterArray.push(problemAfter);
                blockIdArray.push(blockId);
            }
            // Append data for saving text area content
            formData.append("count", blocks.length);
            formData.append("before", problemBeforeArray);
            formData.append("after", problemAfterArray);
            formData.append("blockIds", blockIdArray);
            formData.append("inspecionId", inspecionId);

            let url = "/pattern_team_inspection/evidence/save";
            let method = "POST";

            let doneCallback = function (data, _textStatus, _jqXHR) {
                hideAllModals();
                showToast($('#toast1'), 2000, true);
            };
            let failCallback = function (jqXHR, _textStatus, _errorThrown) {
                failAjax(jqXHR, _textStatus, _errorThrown);
            };

            runAjax(url, method, formData, doneCallback, failCallback, false);
        } else {
            $('#patternEvidenceDialog').find('#hideEvidenceBtnId').click();
        }
    }
    else {
        // Close dialog Case
        hideAllModals();
    }
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
        let id = $(e.relatedTarget).attr("data-id");
        loadEvidence(id);
    });

    /*---------------------
     * Handle hide event for the evidence dialog
     ---------------------- */
     $("body").find('#patternEvidenceDialog').on("hide.bs.modal", function (e) {
        let inspectionId = $(openEvidenceBtn).attr('data-id');
        let postfix = $('#registeredInspectionId').val();
        $('#countEvidence_' + inspectionId).text($('.item-count').length + postfix);
        $("#patternEvidenceDialog").find(".evidences-body").html('');
    });

    /*---------------------
     * Handle hide event for the confirmation dialog
     ---------------------- */
     $("body").find('#confirmDialog3').on("hide.bs.modal", function (e) {
        $("#confirmDialog3").find('.confirmMessage3').text("");
    });

    /*---------------------
     * Handle show event for the confirmation dialog
     ---------------------- */
    //  $("body").find('#confirmDialog3').on("show.bs.modal", function (e) {
    //     let btn = e.currentTarget;
    //     $("#confirmDialog3").find('#okBtn').attr("data-previous-id", btn.id);
    // });

    /*---------------------
     * Click add block
     ---------------------- */
    $("#btnEvidenceAddBlock").on("click", function (_e) {
        addBlock();
    });

    /*---------------------
     * Close button on error dialog
     ---------------------- */
    $("body").on('click','#errorDialog button', function() {
        $('#errorDialog').modal('hide');
    })

    /*---------------------
     * Close button on confirmation dialog
     ---------------------- */
    $("body").on('click','#confirmDialog button', function() {
        $('#confirmDialog').modal('hide');
    })

    /*---------------------
     * Handle hide event for the confirmation dialog
     ---------------------- */
    $("#confirmDialog").on("hide.bs.modal", function () {
        $("#confirmDialog").find(".modal-body").html('');
    });

    /*---------------------
     * Get current clicked evidence link selector
     * Set common value here
     ---------------------- */
    $("body").on('click','#openEvidenceBtn', function(e) {
        openEvidenceBtn = e.currentTarget;
        confirmMsg = $('#confirmQuestionMsgId').val();
    })

    $("body #patternEvidenceDialog").find('#cancelEvidenceBtnId').click(function () {
        $("#confirmDialog3").modal('show');
        $("#confirmDialog3").find('#okBtn').attr('data-isSaveMode' , false);
        $("#confirmDialog3").find('.confirmMessage3').text($('#closeDialogMsgId').val());
    });

    $("body #patternEvidenceDialog").find('#btnEvidenceSave').click(function () {
        $("#confirmDialog3").modal('show');
        $("#confirmDialog3").find('#okBtn').attr('data-isSaveMode' , true);
        $("#confirmDialog3").find('.confirmMessage3').text($('#confirmSaveMsgId').val());
    });

    $("body #confirmDialog3").find('#okBtn').click(function (e) {
        // Check add or close dialog mode
        let isSaveMode = $("#confirmDialog3").find('#okBtn').attr('data-isSaveMode') == "true" ? true : false;
        handleConfirmOkBtn(isSaveMode);
    });

    // Click Cancel
    $("#confirmDialog3").find('#cancelBtn').click(function () {
        $("#confirmDialog3").modal('hide');
    });

 });