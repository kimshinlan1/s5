/*---------------------
* Global var
---------------------- */


/////////////////////////////////////////////////////////////////////////////

/*---------------------
* GLOBAL FUNCTION
---------------------- */

/*---------------------
* Upload file
---------------------- */
function uploadFile(input, block, is_before) {
    // todo: upload by ajax (select multi files => auto upload after selected)
    let inspecionId = $("#patternEvidenceDialog").find(".modal-footer #hidInspectionId").val();

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

                for (let i = 0; i < data.length; i++) {
                    let divClass = (i == data.length - 1) ? 'item active' : 'item';
                    let img = '<div class="' + divClass + '" id="item' + data[i]['id'] + '" data-id="' + data[i]['id'] + '">' + '<button type="submit" class="close-image" id="removeImage' +
                    data[i]['id'] + '" onclick="removeImage(' + data[i]['id'] + ','+albumID+')"><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +
                    '<img src="' + data[i]['img_path'] + '" style="width:100%; height: 350px; position: relative" id="slideImageID"/></div>';

                    if (is_before) {
                        $('#img_before' + block).append(img);
                    } else {
                        $('#img_after' + block).append(img);
                    }
                }

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
    if ($('#noDataId').length > 0) {
        $('#noDataId').remove();
    }
    let params = {};
    let url = "/pattern_team_inspection/evidence/addblock";
    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        $("#patternEvidenceDialog").find(".evidences-body").append(data);
    };

    runAjax(url, method, params, doneCallback);
}

/*---------------------
* Delete Block
---------------------- */
function deleteBlock(blockId) {
    if (confirm('Do you want to delete this block?')) {

        let params = {
            id: blockId
        };
        let url = "/pattern_team_inspection/evidence/" + blockId;
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

        runAjax(url, method, params, doneCallback, failCallback);
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

    runAjax(url, method, params, doneCallback);
}

/*---------------------
* Display full screen image
---------------------- */
function fullScreen(img_src) {
    $('#imgFullscreen').css({
        'background-image': 'url("' + img_src + '")',
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
            $(albumID).append('<img src="'+noImgPath+'" alt="no-image" style="width:100%; height: 350px;" onclick="" id="noImg">');
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
    let ids = {};
    ids = $.map($('#' + albumID + ' > div'), div => div.dataset['id'] )
    let noImgPath = $('#noImage').val();
    $('#'+albumID).empty();
    $('#'+albumID).append('<img src="'+noImgPath+'" alt="no-image" style="width:100%; height: 350px;" onclick="" id="noImg">');

    let url = "/pattern_team_inspection/evidence/removeAlbum";
    let method = "POST";
    let params = {
        ids: ids,
        blockID: blockID,
        isBefore: isBefore
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
        let id = $(e.relatedTarget).data("id");
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


 });