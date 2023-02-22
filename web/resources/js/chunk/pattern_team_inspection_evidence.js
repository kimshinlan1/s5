/*---------------------
* Global var
---------------------- */


/////////////////////////////////////////////////////////////////////////////


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
                if (is_before) {
                    $('#img_before' + block).find('.active').removeClass('active');
                } else {
                    $('#img_after' + block).find('.active').removeClass('active');
                }

                for (let i = 0; i < data.length; i++) {
                    let divClass = (i == data.length - 1) ? 'item active' : 'item';
                    let img = '<div class="' + divClass + '" id="item' + data[i]['id'] + '" data-id="' + data[i]['id'] + '">' + '<button type="submit" class="close-image" id="removeImage' +
                    data[i]['id'] + '" onclick="removeImage(' + data[i]['id'] + ')"><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +
                    '<img src="' + data[i]['img_path'] + '" style="width:100%; height: 250px; position: relative" id="slideImageID"/></div>';

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
        // print out error
    }

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
function deleteBlock(blockId) {
    // todo:
    if (confirm('Do you want to delete this block?')) {

        // todo: call ajax delete from DB
        let params = {
            id: blockId
        };
        let url = "/pattern_team_inspection/evidence/" + blockId;
        let method = "DELETE";

        let doneCallback = function (_data, _textStatus, _jqXHR) {
            $('#block_'+blockId).remove();
            $('#block_content_'+blockId).remove();
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

function removeImage(imgID) {
    if ($('#item'+imgID).next().length != 0) {
        $('#item'+imgID).next().addClass('active');
    } else {
        $('#item'+imgID).siblings("div:first").addClass('active');
    }
    $('#item'+imgID).remove();
    $('#removeImage'+imgID).remove();
    let url = "/pattern_team_inspection/evidence/image/" + imgID;
    let method = "DELETE";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        console.log("TCL: doneCallback -> data", data)
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    runAjax(url, method, null, doneCallback, failCallback);
}

function removeAlbum(albumID) {
    let ids = {};
    ids = $.map($('#' + albumID + ' > div'), div => div.dataset['id'] )
    console.log("TCL: removeAlbum -> ids", ids)
    $('#'+albumID).empty();

    let url = "/pattern_team_inspection/evidence/removeAlbum";
    let method = "POST";
    let params = {
        ids: ids
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
    $("#patternEvidenceDialog").on("hide.bs.modal", function (e) {
        $("#patternEvidenceDialog").find(".modal-body").html('');
    });

    /*---------------------
     * Click add block
     ---------------------- */
    $("#btnEvidenceAddBlock").on("click", function (e) {
        addBlock();
    });

    // $("body").on('click','#removeImage1', function() {
    //     alert("123");
    // })


 });