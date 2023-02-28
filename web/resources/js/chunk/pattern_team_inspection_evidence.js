/*---------------------
* Global var
---------------------- */
var openEvidenceBtn = null;

/////////////////////////////////////////////////////////////////////////////

/*---------------------
* GLOBAL FUNCTION
---------------------- */

/*---------------------
* Upload file
---------------------- */
function uploadFile(input, block, is_before) {
    // let inspecionId = $("#patternEvidenceDialog").find(".modal-footer #hidInspectionId").val();
    let inspecionId = $(openEvidenceBtn).attr('data-id');
    let locations = [];
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            let formData = new FormData();
            input.files.forEach((_element, index) => {
                formData.append("file" + index, input.files[index]);
            });
            formData.append('block_id', block);
            formData.append('inspection_id', inspecionId);
            formData.append('is_before', is_before);
            formData.append('count_file', input.files.length);
            formData.append('team_id', $('#selectTeamList').val());
            $('input[id^=hidLocationId_]').each(function(i, l) {
                locations.push($(l).val());
            })
            formData.append('countLocation',  $('input[id^=hidLocationId_]').length);
            formData.append('locations',  locations);


            let url = "/pattern_team_inspection/evidence/saveImage";
            let method = "POST";

            let doneCallback = function (data, _textStatus, _jqXHR) {
                let albumID = '';
                if (is_before) {
                    $('#img_before' + block).find('.active').removeClass('active');
                    $('#img_before' + block).children('img').remove();
                    albumID = 'img_before' + block;
                } else {
                    $('#img_after' + block).find('.active').removeClass('active');
                    $('#img_after' + block).children('img').remove();
                    albumID = 'img_after' + block;
                }

                for (let i = 0; i < data.imgs.length; i++) {
                    let divClass = (i == data.imgs.length - 1) ? 'item active' : 'item';
                    let img = '<div class="' + divClass + '" id="item' + data.imgs[i]['id'] + '" data-id="' + data.imgs[i]['id'] + '">' + '<button type="submit" class="close-image" id="removeImage' +
                    data.imgs[i]['id'] + '" onclick="removeImage(' + data.imgs[i]['id'] + ','+albumID+')"><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +
                    '<img class="img-size" src="' + data.imgs[i]['img_path'] + '" style="width:100%; position: relative; object-fit: contain;" id="slideImageID" onclick="fullScreen(`' + data.imgs[i]['img_path'] + '`)"/></div>';

                    if (is_before) {
                        $('#img_before' + block).append(img);
                    } else {
                        $('#img_after' + block).append(img);
                    }
                }
                $(openEvidenceBtn).attr('data-id', data.inspectionId);
                let time = $(openEvidenceBtn).attr('data-time');

                $('input[id^=hidInspectionId_]').each(function(i, l) {
                    if (i == time) {
                       $(l).val(data.inspectionId);
                       $(l).attr('id', 'hidInspectionId_'+data.inspectionId);
                    }
                })

            };
            let failCallback = function (jqXHR, _textStatus, _errorThrown) {
                failAjax(jqXHR, _textStatus, _errorThrown);
            };

            runAjax(url, method, formData, doneCallback, failCallback, false);
        };

        reader.readAsDataURL(input.files[0]);
        input.value.replace(/^.*\\/, "");
    } else {
        $("#confirmDialog").modal("show");
        $(".confirmMessage").html($('#noFileUpload').val());
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
    };

    runAjax(url, method, params, doneCallback);
}

/*---------------------
* Delete Block
---------------------- */
function deleteBlock(blockId) {
    let inspectionId = $(openEvidenceBtn).attr('data-id');
    if (confirm('Do you want to delete this block?')) {
        let url = "/pattern_team_inspection/evidence/" + blockId + "?inspectionId=" + inspectionId;
        let method = "DELETE";

        let doneCallback = function (_data, _textStatus, _jqXHR) {
            $('#block_'+blockId).remove();
            $('#block_content_'+blockId).remove();
            if ($('.evidences-body').find('.count-block').length == 0) {
                let noDataMsg = $('#messageNoData').val()
                $('.evidences-body').append('<div class="h4" id="noDataId" style="text-align: center;">' + noDataMsg + '</div>');
            }
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
    // todo:
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
function removeImage(imgID, albumID) {
    if ($('#item'+imgID).next().length != 0) {
        $('#item'+imgID).next().addClass('active');
    } else {
        $('#item'+imgID).siblings("div:first").addClass('active');
    }
    $('#item'+imgID).remove();
    $('#removeImage'+imgID).remove();
    let url = "/pattern_team_inspection/evidence/image/" + imgID;
    let method = "DELETE";

    let doneCallback = function (_data, _textStatus, _jqXHR) {
        let noImgPath = $('#noImage').val();
        if ($(albumID).find('.item').length == 0) {
            $(albumID).append('<img class="img-size" src="'+noImgPath+'" alt="no-image" style="width:100%;" onclick="" id="noImg">');
        }
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    runAjax(url, method, null, doneCallback, failCallback);
}

/*---------------------
* Remove a before/after album
---------------------- */
function removeAlbum(albumID, blockID, isBefore) {
    let inspectionId = $(openEvidenceBtn).attr('data-id');
    let ids = {};
    ids = $.map($('#' + albumID + ' > div'), div => div.dataset['id'] )
    let noImgPath = $('#noImage').val();
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
        console.log("TCL: doneCallback -> data", data)
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    runAjax(url, method, params, doneCallback, failCallback);
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
    $("#patternEvidenceDialog").on("hide.bs.modal", function (e) {
        $("#patternEvidenceDialog").find(".evidences-body").html('');
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
     * Handle save event
     ---------------------- */
    $('#btnEvidenceSave').click(function() {
        let blocks = $('.evidences-body').find('.count-block');
        let data = {};
        let problemBeforeArray = [];
        let problemAfterArray = [];
        let blockIdArray = [];

        if (blocks.length > 0) {
            for (const block of blocks) {
                let blockId = $(block).attr('data-id');
                let problemBefore = $(blocks).find('#problemBefore' + blockId).val();
                let problemAfter = $(blocks).find('#problemAfter' + blockId).val();

                problemBeforeArray.push(problemBefore);
                problemAfterArray.push(problemAfter);
                blockIdArray.push(blockId);
            }
        }
        data['count'] = blocks.length;
        data['before'] = problemBeforeArray;
        data['after'] = problemAfterArray;
        data['blockIds'] = blockIdArray;
        let url = "/pattern_team_inspection/evidence/save";
        let method = "POST";

        let doneCallback = function (data, _textStatus, _jqXHR) {
            $('#patternEvidenceDialog').find('#cancelEvidenceBtnId').click();
        };
        let failCallback = function (jqXHR, _textStatus, _errorThrown) {
            failAjax(jqXHR, _textStatus, _errorThrown);
        };

        runAjax(url, method, data, doneCallback, failCallback, false);
    })

    /*---------------------
     * Get current clicked evidence link selector
     ---------------------- */
    $("body").on('click','#openEvidenceBtn', function(e) {
        openEvidenceBtn = e.currentTarget;
    })
 });