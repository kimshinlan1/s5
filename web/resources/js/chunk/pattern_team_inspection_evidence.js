/*---------------------
* Global var
---------------------- */
var openEvidenceBtn = null;
var numberOfEvidences = 0;
var confirmMsg = '';
var formData = null;
/////////////////////////////////////////////////////////////////////////////

/*---------------------
* GLOBAL FUNCTION
---------------------- */

/*---------------------
* Upload file
---------------------- */
function uploadFile(input, block, is_before, albumId) {
    // let inspecionId = $(openEvidenceBtn).attr('data-id');
    let countBefore = parseInt($('#beforeUploadedIndex').val());
    let countAfter = parseInt($('#afterUploadedIndex').val());

    // Check if file is exists
    if (input.files && input.files[0]) {
        // Loop each file
        input.files.forEach((element, index) => {
            var reader = new FileReader();
            reader.onload = function (_e) {
                const image = new Image();
                image.src = reader.result;

                // Inactive current image, check if No Image in order remove it and set class for temporary image
                if (is_before) {
                    $('#img_before' + block).find('.active').removeClass('active');
                    $('#img_before' + block).children('img').remove();
                    fileId = "file_before_block" + block + "_" + (++countBefore);
                } else {
                    $('#img_after' + block).find('.active').removeClass('active');
                    $('#img_after' + block).children('img').remove();
                    fileId = "file_after_block" + block + "_" + (++countAfter);
                }

                let divClass = (index == input.files.length - 1) ? 'item active ' + fileId : 'item ' + fileId;
                let img = '<div class="' + divClass + '" id="item' + fileId + '" data-id="' + fileId + '">' + '<button type="submit" class="close-image" id="removeImage' +
                fileId + '" onclick="removeImage(`' + fileId + '`,`'+albumId+'`,' +true+',`' + fileId + '`)"><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +
                '<img class="img-size" src="' + image.src + '" style="width:100%; position: relative; object-fit: contain;" id="slideImageID" onclick="fullScreen(`' + image.src + '`)"/></div>';

                if (is_before) {
                    $('#img_before' + block).append(img);
                    formData.append("file_before_block" + block + "_" + (countBefore), element);
                } else {
                    $('#img_after' + block).append(img);
                    formData.append("file_after_block" + block + "_" + (countAfter), element);
                }
                $('#beforeUploadedIndex').val(countBefore);
                $('#afterUploadedIndex').val(countAfter);

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

        $('input[id^=hidInspectionId_]').each(function(i, l) { //todo
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
            addBlock();
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
function removeImage(imgID, albumID, isTempImage = false, fileId = null) {
    if (confirm(confirmMsg)) {
        let noImgPath = $('#noImage').val();
        if ($('#item'+imgID).next().length != 0) {
            $('#item'+imgID).next().addClass('active');
        } else {
            $('#item'+imgID).siblings("div:first").addClass('active');
        }
        $('#item'+imgID).remove();
        $('#removeImage'+imgID).remove();
        if ($(albumID).find('.item').length == 0) {
            $('#'+albumID).append('<img class="img-size" src="'+noImgPath+'" alt="no-image" style="width:100%;" onclick="" id="noImg">');
        }
        // Check if the deleted image is temporarily uploaded or not, if it is  , remove it from formdata so as not to store in DB
        if (formData.has(fileId) & isTempImage) {
            formData.delete(fileId);
        }
        if (!isTempImage) {
            let url = "/pattern_team_inspection/evidence/image/" + imgID;

            let method = "DELETE";

            let doneCallback = function (_data, _textStatus, _jqXHR) {
                // Check if there is any image in the album. If not, append No-Image to empty album
                if ($(albumID).find('.item').length == 0) {
                    $('#'+albumID).append('<img class="img-size" src="'+noImgPath+'" alt="no-image" style="width:100%;" onclick="" id="noImg">');
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

        if (isBefore) {
            $('#'+albumID).find('[class*=file_before_block' + blockID + ']').each((i, ele) => {
                // Check if the deleted image is temporarily uploaded or not, if it is  , remove it from formdata so as not to store in DB
                if (formData.has(ele.dataset.id)) {
                    formData.delete(ele.dataset.id);
                }
            });
        } else {
            $('#' + albumID).find('[class*=file_after_block' + blockID + ']').each((i, ele) => {
                // Check if the deleted image is temporarily uploaded or not, if it is  , remove it from formdata so as not to store in DB
                if (formData.has(ele.dataset.id)) {
                    formData.delete(ele.dataset.id);
                }
            });
        }

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
    $('body').removeClass('modal-open');
    // Fix conflict hen use multi modal
    $("body").find(".modal").each(function(i,e) {
        $(e).hide();
    });
    $("body").find(".modal-backdrop").each(function(i,e) {
        $(e).remove();
    });
    $('body').css({
        'overflow': 'unset',
        'padding-right': 'unset',
    })
}

/**
 * Handle click OK button on confirmmation dialog. There are 2 cases: close dialog case and save case
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

        // Check if evidence dialog contains any blocks. If not, do nothing and close the dialog when click save button
        if (blocks.length > 0) {
            // Loop block
            for (const block of blocks) {
                let blockId = $(block).attr('data-id');
                let keyArrayBefore = [];
                let keyArrayAfter = [];

                $("[class*=file_before_block" + blockId + ']').each((i, ele) => { //todo
                    keyArrayBefore.push(ele.dataset.id);
                    $(ele).addClass('item-count');
                });

                $("[class*=file_after_block" + blockId + ']').each((i, ele) => { //todo
                    keyArrayAfter.push(ele.dataset.id);
                    $(ele).addClass('item-count');
                });

                // Append array key of uploaded images per block
                formData.append("keyArrayBefore_block" + blockId, keyArrayBefore);
                formData.append("keyArrayAfter_block" + blockId, keyArrayAfter);

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
     $("body").find("#patternEvidenceDialog").on("hide.bs.modal", function (e) {
        setTimeout(function() {
            let count = 0;
            let inspectionId = $(openEvidenceBtn).attr('data-id');
            let postfix = $('#registeredInspectionId').val();
            $('.evidences-body').find('.count-block').each (function(i,ele) {
                let isBeforeNotEmpty = $('#' + ele.id).find('#img_before' + ele.dataset.id).find('.item-count').length > 0 ? true : false;
                let isAfterNotEmpty = $('#' + ele.id).find('#img_after' + ele.dataset.id).find('.item-count').length > 0 ? true : false;
                if (isBeforeNotEmpty && isAfterNotEmpty) {
                    count++;
                }
            })

            $('#countEvidence_' + inspectionId).text(count + postfix);
            $("#patternEvidenceDialog").find(".evidences-body").html('');
        }, 10);
    });

    /*---------------------
     * Handle hide event for the confirmation dialog
     ---------------------- */
    $("body").find('#confirmDialog3').on("hide.bs.modal", function (e) {
        $("#confirmDialog3").find('.confirmMessage3').text("");
    });

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
    $("body").off('click').on('click','#openEvidenceBtn', function(e) {
        openEvidenceBtn = e.currentTarget;
        confirmMsg = $('#confirmDeleteMsgId').val();
        formData = new FormData()
    })

    $("body #patternEvidenceDialog").find('#cancelEvidenceBtnId').click(function () {
        if ($("[class*='file_']").length > 0) {
            $("#confirmDialog3").modal('show');
            $("#confirmDialog3").find('#okBtn').attr('data-isSaveMode' , false);
            $("#confirmDialog3").find('.confirmMessage3').text($('#closeDialogMsgId').val());
        } else {
            // Close dialog Case
            hideAllModals();
        }
    });

    $("body #patternEvidenceDialog").find('#btnEvidenceSave').click(function () {
        if ($('.evidences-body').find('.count-block').length > 0) {
            $("#confirmDialog3").modal('show');
            $("#confirmDialog3").find('#okBtn').attr('data-isSaveMode' , true);
            $("#confirmDialog3").find('.confirmMessage3').text($('#confirmSaveMsgId').val());
        }
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