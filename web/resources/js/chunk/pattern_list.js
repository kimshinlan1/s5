/****************************************************
 * pattern list.js
 *
 ****************************************************/
"use strict";

/* ==============================
    Global Functions
============================== */

/** ------------------
 *    get List
 --------------------- */
 window.getTableList = function (params) {
    let url = "pattern_list/data";
    params.data.page =
    params.data.offset > 0
        ? Math.ceil(params.data.offset / CONFIG.get("PAGING")) + 1
        : 1;
    $.get(url + "?" + $.param(params.data))
    .then(function (res) {
        params.success(res);
    })
};

/** ------------------
 *    Actions
 --------------------- */
window.patternListTableActions = function (_value, row, _index) {
    let buttons = ( $('#mode5S').val() == CONFIG.get('5S_MODE').OWNER_COMPANY
    || $('#mode5S').val() == CONFIG.get('5S_MODE').IS_CHARGE ) ?
    (
        '<button type="button" style="margin-left: 6px;" class="btn btn-primary btn-sm" data-id="' +
        row.id +
        '" onclick="redirectToEdit(' +row.id+ ')" id="patternListEdit">編集</button> ' +
        '<button type="button" style="margin-left: 6px;" class="btn btn-danger btn-sm" data-id="' +
        row.id +
        '" data-bs-toggle="modal" data-bs-target="#patternListDeleteDialog" >削除</button>'
    ) : ''
    return buttons;
};

/** ------------------
 *    Add styles/classes to button cells
 --------------------- */
window.cellStyle = function (value, row, index) {
    return {
        classes: 'justify-content-around',
    }
}

/** ------------------
 *   Open Edit tab
 --------------------- */
 window.redirectToEdit = function (id) {
    window.location = '/pattern_detail/' + id;
}

/* ==============================
    Document Ready
==============================*/
$(function () {
    $("#patternListTable").bootstrapTable({
        ajax: "getTableList",
        pagination: "true",
        paginationParts: "['pageList']",
        sidePagination: "server",
        uniqueId: "id",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $("#patternListTable"));
        },
    });

    if ($("#errorDialog .modal-body .error-messages").length) {
        $("#errorDialog .modal-body .error-messages").html("");
    }

    /** ------------------
    *   Delete dialog show
    --------------------- */
    $("#patternListDeleteDialog").on("show.bs.modal", function (e) {
        showDialogDelete('#patternListTable', '#deletePatternListId', '#patternListDeleteDialog', e);
    });

    /** ------------------
    *    Delete
    --------------------- */
    $("#deletePatternListBtn").on("click", function () {
        showLoading();
        let id = $("#deletePatternListId").val();
        let compID = $('#companyListID').val() ? $('#companyListID').val() : $('#userCompanyId').val();
        $.ajax({
            url: "/pattern_list/" + id + "?companyId=" + compID + "&pageDest=" + CONFIG.get("PAGE_PATTERN_LIST"),
            type: "DELETE",
        })
            .done(function (_department, _textStatus, _jqXHR) {
                $("#patternListTable").bootstrapTable("refresh");
                showToast($("#toast2"), 3000, true);
            })
            .fail(function (jqXHR, _textStatus, _errorThrown) {
                // show errors
                failAjax(jqXHR, _textStatus, _errorThrown);
            })
            .always(function () {
                hideLoading();
                $("#patternListDeleteDialog").modal("hide");
            });
    });

    // Handle click on row event
    $('#patternListTable').on('click-cell.bs.table', function (field, value, row, $el) {
        // Redirect to 5S pattern preview page
        if (row !== undefined) {
            window.location = '/pattern_preview/' + $el.id + "?pageDest=" + CONFIG.get("PAGE_PATTERN_LIST");
        }
    })

    $('#patternListAdd').on('click', function() {
        window.location = '/pattern_detail';
    });

});
