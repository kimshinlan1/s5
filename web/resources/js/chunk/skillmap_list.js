/****************************************************
 * skillmap_list.js
 *
 ****************************************************/
"use strict";

/* ==============================
    Global Functions
============================== */

/** ------------------
 *    get List
 --------------------- */
window.getSkillmapsTableList = function (params) {
    let url = "/skillmaps_list/list";
    params.data.page =
        params.data.offset > 0
            ? Math.ceil(params.data.offset / CONFIG.get("PAGING")) + 1
            : 1;
        $.get(url + "?" + $.param(params.data))
            .then(function (res) {
                params.success(res);
                let rowCount = $('#skillmapsTable').bootstrapTable('getOptions').totalRows;
                if(!res.isAdmin && res.isModeFree && rowCount > 0)  {
                    $('#skillMapsDetailLink').removeAttr('href');
                    $('#addSkillmapsId').prop("disabled", true);
                    $('.btn.btn-danger.btn-sm.skillMapDeleteBtn').prop("disabled", true);
                    $('.btn.btn-info.btn-sm.btn-copy').prop("disabled", true);
                }
                else{
                    $('#skillMapsDetailLink').attr("href", "/skillmaps_detail");
                    $('#addSkillmapsId').prop("disabled", false);
                    $('.btn.btn-danger.btn-sm.skillMapDeleteBtn').prop("disabled", false);
                    $('.btn.btn-info.btn-sm.btn-copy').prop("disabled", false);
                }
            })
};

/** ------------------
 *    Actions
 --------------------- */
window.skillmapsTableActions = function (_value, row, index) {
    let tableOptions =  $("#skillmapsTable").bootstrapTable('getOptions');
    let no =  ((tableOptions.pageNumber - 1) * tableOptions.pageSize) + (1 + index);
    let userIsModeFree = $("#userIsModeFree").val();
    let confirmDialog = '';
    if (!userIsModeFree) {
        confirmDialog = '#skillmapsConfirmDialog';
    }
    return (
        '<button  style="margin-right: 12px;"  type="button" class="btn btn-sm btn-copy btn-primary" data-type="copy" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target='+ confirmDialog +' >複製</button> ' +
        '<button style="margin-right: 12px;" type="button" class="btn btn-sm btn-edit btn-primary" data-id="' +
        row.id + '" onclick="openEdit(' +row.id+ ' ,' + no + ')" >編集</button> ' +
        '<button type="button" class="btn btn-sm skillMapDeleteBtn btn-danger" data-type="del" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target='+ confirmDialog +'>削除</button>'
    );
};

window.indexNo = function (_value, _row, index) {
    let tableOptions =  $("#skillmapsTable").bootstrapTable('getOptions');
    return ((tableOptions.pageNumber - 1) * tableOptions.pageSize) + (1 + index);
}

/** ------------------
*    Clear dialog
--------------------- */
window.clearDialog = function () {
    $('#skillmapsName').val('');
}


/** ------------------
 *   Edit dialog show
 --------------------- */
window.openEdit = function (id, no) {
    window.location = '/skillmaps_list/' + id + '?no=' + no;
}

/* ==============================
    jQuery
==============================*/
$(function () {
    $("#skillmapsTable").bootstrapTable({
        ajax: "getSkillmapsTableList",
        pagination: "true",
        paginationParts: "['pageList']",
        sidePagination: "server",
        uniqueId: "id",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $("#skillmapsTable"));
        },
    });

    if ($("#errorDialog .modal-body .error-messages").length) {
        $("#errorDialog .modal-body .error-messages").html("");
    }

    /** ------------------
    *   Delete / Copy dialog show
    --------------------- */
    let dialog_type = "";
    $("#skillmapsConfirmDialog").on("show.bs.modal", function (e) {

        let $button = $(e.relatedTarget);
        let id = $button.data("id");
        dialog_type = $button.data("type");
        let data = $("#skillmapsTable").bootstrapTable(
            "getRowByUniqueId", id
        );
        let lineName = data.name == null ? "この物" : data.name;
        $("#skillmapId").val(data.id);
        if (dialog_type == "del" && id) {
            $("#skillmapsConfirmDialog .modal-body .message").html(
                escapeHtml(lineName) + " " + CONFIG.get("DELETE_MESSAGE")
            );
            $("#skillmapsConfirmDialog h5.modal-title").html(
                $("#titleSkillmapDialog").val() + $("#deleteLabel").val()
            );
            $("#skillmapsConfirmDialog").find('#btnOK').addClass('btn-red-color');
            $("#skillmapsConfirmDialog").find('#btnCancel').addClass('btn-cancel');
        } else if (dialog_type == "copy") {
            $("#skillmapsConfirmDialog .modal-body .message").html(
                CONFIG.get("COPY_MESSAGE")
            );
            $("#skillmapsConfirmDialog h5.modal-title").html(
                $("#skillMapCopyDialogLabel").val()
            );
            $("#skillmapsConfirmDialog").find('#btnOK').addClass('btn-primary');
            $("#skillmapsConfirmDialog").find('#btnCancel').addClass('btn-cancel');
        }
    });

    $("#skillmapsConfirmDialog").on("hide.bs.modal", function (e) {
        $("#skillmapsConfirmDialog").find('#btnOK').removeClass('btn-red-color btn-primary');
        $("#skillmapsConfirmDialog h5.modal-title").html("");
    });
    /** ------------------
     *    Delete / Copy
     --------------------- */
    $("#btnOK").on("click", function () {
        let userIsModeFree = $("#userIsModeFree").val();
        if (userIsModeFree) {
            return;
        }
        showLoading();
        let id = $("#skillmapId").val();
        if (dialog_type == "del") {
            $.ajax({
                url: "/skillmaps_list/" + id,
                type: "DELETE",
            })
            .done(function (_skillmaps, _textStatus, _jqXHR) {
                $('#skillmapsTable').bootstrapTable('refresh');
                showToast($('#toast2'), 2000, true);
            })
            .fail(function (jqXHR, _textStatus, _errorThrown) {
                // show errors
                failAjax(jqXHR, _textStatus, _errorThrown);
            })
            .always(function () {
                hideLoading();
                $("#skillmapsConfirmDialog").modal("hide");
            });
        } else if (dialog_type == "copy") {
            let data = {
                id: id,
            };

            showLoading();
            $.ajax({
                url: '/skillmaps_list/copy',
                type: 'POST',
                data: data,
            })
            .done(function (_skillmaps, _textStatus, _jqXHR) {
                $('#skillmapsTable').bootstrapTable('refresh');
                showToast($('#toast1'), 2000, true);
            })
            .fail(function (jqXHR, _textStatus, _errorThrown) {
                // show errors
                failAjax(jqXHR, _textStatus, _errorThrown);
            })
            .always(function () {
                hideLoading();
                $("#skillmapsConfirmDialog").modal("hide");
            });
        }
    });
    
    $("#skillmapsConfirmDialog h5.modal-title").prepend($("#titleSkillmapDialog").val());
});
