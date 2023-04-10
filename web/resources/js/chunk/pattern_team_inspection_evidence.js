/*---------------------
* Global var
---------------------- */
var openEvidenceBtn = null;
var numberOfEvidences = 0;
var confirmMsg = '';
var formData = null;
var isAddNewEvidenceOpen = false;
/////////////////////////////////////////////////////////////////////////////

/*---------------------
* GLOBAL FUNCTION
---------------------- */

/**
 * Config create/update date with calendar
 */
function configCalendarById(id) {
    $('#' + id).datepicker({
        autoclose: true,
        defaultDate: new Date(),
        dateFormat: 'yy年mm月dd日',
        language: 'ja',
        changeYear: true
    });
}

function triggerCalendar(id) {
    configCalendarById(id);
    $('#' + id).datepicker("show");
}

/*---------------------
* Upload file
---------------------- */
function uploadFile(input, block, is_before, albumId) {
    let countBefore = parseInt($('#beforeUploadedIndex').val());
    let countAfter = parseInt($('#afterUploadedIndex').val());
    // Check if file is exists
    if (input.files && input.files[0]) {
        // Inactive current image, check if No Image in order remove it and set class for temporary image
        if (is_before) {
            $('#img_before' + block).find('.active').removeClass('active');
            $('#img_before' + block).children('img').remove();
        } else {
            $('#img_after' + block).find('.active').removeClass('active');
            $('#img_after' + block).children('img').remove();
        }
        // Loop each file
        input.files.forEach((element, index) => {
            let reader = new FileReader();
            reader.onload = function (_e) {
                let fileId = is_before ? "file_before_block" + block + "_" + (++countBefore) : "file_after_block" + block + "_" + (++countAfter);
                const image = new Image();
                image.src = reader.result;

                let deleteImageTooltipMsg = $('#deleteMsgTooltipId').val();
                let divClass = (index == input.files.length - 1) ? 'item active ' + fileId : 'item ' + fileId;
                let img = '<div class="' + divClass + '" id="item' + fileId + '" data-id="' + fileId + '">' + '<button type="submit" title="' + deleteImageTooltipMsg + '" class="close-image" id="removeImage' +
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
    setTimeout(() => {
        input.value = null;
    }, 100);
}

/*---------------------
* Add Block
---------------------- */
function addBlock() {
    let inspectionId = $(openEvidenceBtn).attr('data-id');
    let locationArr = [];
    let mode5s = $('#mode5S').val();
    if ($('.evidences-body').find('.count-block').length > 0 && mode5s == CONFIG.get('5S_MODE').FREE )  {
       $('#errorDialog').modal('show');
       $('#errorDialog').find('.error-messages').text($('#onlyOneBlockForFreeAccId').val());
    }
    else {
        $('input[id^=hidLocationId_]').each(function(i, l) {
            locationArr.push($(l).val());
        })
        if ($('#noDataId').length > 0) {
            $('#noDataId').remove();
        }
        let params = {
            inspectionId: inspectionId,
            locationArr: locationArr,
            teamId: $('#selectTeamList').val() ? $('#selectTeamList').val() : $('#hidTeamId').val()
        };
        let url = "/pattern_team_inspection/evidence/addblock";
        let method = "GET";

        let doneCallback = function (data, _textStatus, _jqXHR) {
            $("#patternEvidenceDialog").find(".evidences-body").append(data);
            $('.evidences-body').find('#noDataTextId').remove();
            let inspectionId = $('#hidNewInspectionId').val();
            $(openEvidenceBtn).attr('data-id', inspectionId);
            $(openEvidenceBtn).attr('data-countevidenceid', 'countEvidence_' + inspectionId);
            let time = $(openEvidenceBtn).attr('data-time');

            $('input[id^=hidInspectionId_]').each(function(i, l) {
                if (i == time) {
                    $(l).val(inspectionId);
                    $(l).attr('id', 'hidInspectionId_'+inspectionId);
                }
            })

            $($("[id*='point_avg_1s_']")[time]).attr('id', 'point_avg_1s_' + inspectionId);
            $($("[id*='point_avg_2s_']")[time]).attr('id', 'point_avg_2s_' + inspectionId);
            $($("[id*='point_avg_3s_']")[time]).attr('id', 'point_avg_3s_' + inspectionId);
            $($("[id*='point_avg_4s_']")[time]).attr('id', 'point_avg_4s_' + inspectionId);
            $($("[id*='point_avg_5s_']")[time]).attr('id', 'point_avg_5s_' + inspectionId);
            $($("[id*='countEvidence_']")[time]).attr('id', 'countEvidence_' + inspectionId);
            $($("[id*='countEvidence_']")[time]).attr('data-id', inspectionId);
            $($("[id*='countEvidence_']")[time]).attr('data-countevidenceid', 'countEvidence_' + inspectionId);

            $('.col_order_' + time).each((_i, e) => {
                let dataInspectionId = $(e).find('.selPointValue').attr('data-inspection_id');
                let id = $(e).find('.selPointValue').attr('id');
                let newId = id.replace(dataInspectionId, inspectionId);
                $(e).find('.selPointValue').attr('id', newId);
                $(e).find('.selPointValue').attr('data-inspection_id', inspectionId);
            });

            $($('.date_' + (parseInt(time) + 1))).find("[id*='txtInspectionDate']").attr('id', 'txtInspectionDate_' + inspectionId);

            $("#patternEvidenceDialog").find('.evidences-body').animate({
                scrollTop: $("#patternEvidenceDialog").find('.evidences-body').get(0).scrollHeight
            }, 1500);
        };

        runAjax(url, method, params, doneCallback);
    }
}

/*---------------------
* Delete Block
---------------------- */
function deleteBlock() {
    let blockIds = $('input[type="checkbox"]:checked').map(function() {
        return $(this).attr('data-id');
    }).get();
    if (blockIds.length == 0) {
        $('#confirmDialog2').modal('show');
        $('#confirmDialog2').find('.confirmMessage').html($('#noSelectedBlock').val());
        return;
    }
    let inspectionId = $(openEvidenceBtn).attr('data-id');
    if (confirm(confirmMsg)) {
        let url = "/pattern_team_inspection/evidence/removeBLocks?inspectionId=" + inspectionId;
        let method = "POST";

        let data = {
            ids : blockIds
        }
        let doneCallback = function (_data, _textStatus, _jqXHR) {
            blockIds.forEach(blockId => {
                $('#block_'+blockId).remove();
                $('#block_content_'+blockId).remove();
            });

            if ($('.evidences-body').find('.count-block').length == 0) {
                let noDataMsg = $('#messageNoData').val()
                $('.evidences-body').append('<div class="h4" id="noDataTextId" style="text-align: center;">' + noDataMsg + '</div>');
            }
        };

        let failCallback = function (jqXHR, _textStatus, _errorThrown) {
            failAjax(jqXHR, _textStatus, _errorThrown);
        };

        runAjax(url, method, data, doneCallback, failCallback);
    }
}

/*---------------------
* Load Evidence
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
        if ($('.evidences-body').find('.count-block').length == 0 && !isAddNewEvidenceOpen) {
            let noDataMsg = $('#messageNoData').val()
            $('.evidences-body').append('<div class="h4" id="noDataTextId" style="text-align: center;">' + noDataMsg + '</div>');
        }
        if (isAddNewEvidenceOpen) {
            addBlock();
            isAddNewEvidenceOpen = false;
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
        if (formData.has(fileId) && isTempImage) {
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

/*---------------------
* Get Count Evidence
---------------------- */
function getCountEvidence() {
    let count = 0;
    $('.evidences-body').find('.count-block').each (function(_i,ele) {
        let isBeforeNotEmpty = $('#' + ele.id).find('#img_before' + ele.dataset.id).find('.item-count').length > 0 ? true : false;
        let isAfterNotEmpty = $('#' + ele.id).find('#img_after' + ele.dataset.id).find('.item-count').length > 0 ? true : false;
        if (isBeforeNotEmpty && isAfterNotEmpty) {
            count++;
        }
    })
    return count;
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
        let dateBeforeArray = [];
        let dateAfterArray = [];
        let locationBeforeArray = [];
        let locationAfterArray = [];
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
                // Add text area and block ids contents to array
                let dateCreateBefore = $.datepicker.formatDate("yy-mm-dd", $(blocks).find('#dateCreateBefore' + blockId).datepicker("getDate"));
                if (dateCreateBefore == '') {
                    let parts = $(blocks).find('#dateCreateBefore' + blockId).val().split("年").join("-").split("月").join("-").split("日");
                    dateCreateBefore = parts[0];
                }
                let dateCreateAfter = $.datepicker.formatDate("yy-mm-dd", $(blocks).find('#dateCreateAfter' + blockId).datepicker("getDate"));
                if (dateCreateAfter == '') {
                    let parts = $(blocks).find('#dateCreateAfter' + blockId).val().split("年").join("-").split("月").join("-").split("日");
                    dateCreateAfter = parts[0];
                }
                dateBeforeArray.push(dateCreateBefore);
                dateAfterArray.push(dateCreateAfter);
                // Add text area and block ids contents to array
                let locationBefore = $(blocks).find('#locationBefore' + blockId).val();
                let locationAfter = $(blocks).find('#locationAfter' + blockId).val();
                locationBeforeArray.push(locationBefore);
                locationAfterArray.push(locationAfter);

                blockIdArray.push(blockId);
            }
            // Append data for saving text area content
            formData.append("count", blocks.length);
            formData.append("before", problemBeforeArray);
            formData.append("after", problemAfterArray);
            formData.append("dateBeforeArray", dateBeforeArray);
            formData.append("dateAfterArray", dateAfterArray);
            formData.append("locationBeforeArray", locationBeforeArray);
            formData.append("locationAfterArray", locationAfterArray);
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
            hideAllModals();
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
    $("#datepicker").datepicker({
        dateFormat: "dd/mm/yy",
        minDate: 0 // to set minimum date as today
    });
    $("#btnUpload").on("click", function(){
        $(".file-after").val("");
    });
    /*---------------------
     * DIALOG ON SHOW/HIDE
     ---------------------- */
    let isShown = false;
    let isFirstShown = true;
    $("#patternEvidenceDialog").on("show.bs.modal", function (e) {
        let id = $(e.relatedTarget).attr("data-id");

        loadEvidence(id);
        if (isFirstShown) {
            isFirstShown = false;
        } else {
            isShown = true;
        }
    });

    /*---------------------
     * Handle hide event for the evidence dialog
     ---------------------- */
     $("body").find("#patternEvidenceDialog").on("hide.bs.modal", function (e) {
        setTimeout(function() {
            if (!isShown) {
                $('.evidences-body').find('#noDataTextId').remove();
                let inspectionId = $(openEvidenceBtn).attr('data-id');
                let countEvidenceId = $(openEvidenceBtn).attr('data-countEvidenceId');
                let key = $(openEvidenceBtn).attr('data-time');
                let count = getCountEvidence();
                let postfix = $('#registeredInspectionId').val();

                $('#' + countEvidenceId).text(count + postfix);
                $("#patternEvidenceDialog").find(".evidences-body").html('');
                if ($('#' + countEvidenceId).length > 0) $('#' + countEvidenceId).attr('data-count', count);

                // Disable open evidence button in Top Page if there is no evidence
                if ($('#openEvidenceBtn' + key).length > 0 && count == 0) {
                    $('#openEvidenceBtn' + key).prop("disabled", true);
                    $('#openEvidenceBtn' + key).removeClass("btn-evidence");
                    $('#openEvidenceBtn' + key).addClass("btn-secondary");
                }

                // Disable open evidence button in Top Page if there is at least 1 evidence
                if ($('#openEvidenceBtn' + key).length > 0 && count > 0) {
                    $('#openEvidenceBtn' + key).prop("disabled", false);
                    $('#openEvidenceBtn' + key).removeClass("btn-secondary");
                    $('#openEvidenceBtn' + key).addClass("btn-evidence");
                }

                let params = {
                    count : count,
                    inspectionId : inspectionId,
                };

                let url = "/pattern_team_inspection/update_count_evidence";
                let method = "POST";

                let doneCallback = function (_data, _textStatus, _jqXHR) {

                };

                let failCallback = function (jqXHR, _textStatus, _errorThrown) {
                    failAjax(jqXHR, _textStatus, _errorThrown);
                };

                runAjax(url, method, params, doneCallback, failCallback);
            } else {
                isShown = false;
            }
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
     * Get current clicked evidence link selector
     * Set common value here
     ---------------------- */
    $("body").on('click','#openEvidenceBtn', function(e) {
        isAddNewEvidenceOpen = true
        openEvidenceBtn = e.currentTarget;
        confirmMsg = $('#confirmDeleteMsgId').val();
        formData = new FormData()
    })

    /*---------------------
     * Get current clicked evidence link selector
     * Set common value here
     ---------------------- */
    $("body").on('click','.openEvidenceBtn', function(e) {
        openEvidenceBtn = e.currentTarget;
        confirmMsg = $('#confirmDeleteMsgId').val();
        formData = new FormData()
    })

    /*---------------------
     * Handle close evidence dialog button
     ---------------------- */
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

    /*---------------------
     * Handle close evidence dialog button
     ---------------------- */
    $("body #patternEvidenceDialog").find('#closeEvidenceBtnId').click(function () {
        if ($("[class*='file_']").length > 0) {
            $("#confirmDialog3").modal('show');
            $("#confirmDialog3").find('#okBtn').attr('data-isSaveMode' , false);
            $("#confirmDialog3").find('.confirmMessage3').text($('#closeDialogMsgId').val());
        } else {
            // Close dialog Case
            hideAllModals();
        }
    });

    /*---------------------
     * Handle save button in evidence dialog
     ---------------------- */
    $("body #patternEvidenceDialog").find('#btnEvidenceSave').click(function () {
        if ($('.evidences-body').find('.count-block').length > 0) {
            $("#confirmDialog3").modal('show');
            $("#confirmDialog3").find('#okBtn').attr('data-isSaveMode' , true);
            $("#confirmDialog3").find('.confirmMessage3').text($('#confirmSaveMsgId').val());
        } else {
            hideAllModals();
        }
    });

    /*---------------------
     * Handle OK button in confirmation dialog
     ---------------------- */
    $("body #confirmDialog3").find('#okBtn').click(function (e) {
        // Check add or close dialog mode
        let isSaveMode = $("#confirmDialog3").find('#okBtn').attr('data-isSaveMode') == "true" ? true : false;
        handleConfirmOkBtn(isSaveMode);
    });

    // Click Cancel
    $("#confirmDialog3").find('#cancelBtn').click(function () {
        $("#confirmDialog3").modal('hide');
    });

    // Click Ok button on confirm dialog 2
    $("#confirmDialog2").find('#dialogOkBtn2').click(function () {
        $("#confirmDialog2").modal('hide');
    });;
 });
