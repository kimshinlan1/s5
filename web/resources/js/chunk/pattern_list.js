/****************************************************
 * pattern list.js
 *
 ****************************************************/
"use strict";

/* ==============================
    Global Functions
============================== */

/** ------------------
 *    Actions
 --------------------- */
window.patternListTableActions = function (_value, row, _index) {
    let buttons = ( $('#mode5S').val() == CONFIG.get('5S_MODE').OWNER_COMPANY
    || $('#mode5S').val() == CONFIG.get('5S_MODE').IS_CHARGE ) ?
    (
        '<button style="margin-right: 10px;" type="button" class="btn btn-primary btn-sm" data-id="' +
        row.id +
        '" data-bs-toggle="modal" data-bs-target="" >編集</button> ' +
        '<button type="button" class="btn btn-danger btn-sm" data-id="' +
        row.id +
        '" data-bs-toggle="modal" data-bs-target="#patternListDeleteDialog" >削除</button>'
    ) : ''
    return buttons;
};

/** ------------------
 *    queryParams
--------------------- */
window.queryParams = function (params) {
    params.page = params.offset > 0 ? Math.ceil(params.offset / 10) + 1 : 1;
    if($('#userMode').val() != CONFIG.get('ROLE_ADMIN_ID')) {
        params.company_id = $('#userCompanyId').val();
    } else {
        params.company_id = $("#companyListID").find(":selected").val();
    }
    return params;
};

/* ==============================
    Document Ready
==============================*/
$(function () {
    $.ajax({
        type: "GET",
        url: "/company/list",
        success: function (res) {
            let html = "";
            if (res.currentCompany.mode == 0) {
                for (let e of res.rows) {
                    html +=
                        '<option value="' + e.id + '">' + e.name + "</option>";
                }
            } else {
                html +=
                    '<option value="' +
                    res.currentCompany.id +
                    '" hidden>' +
                    res.currentCompany.name +
                    "</option>";
            }
            $("#companyListID").html(html);

            $("#companyListID").change();
        },
    });

    $("#patternListTable").bootstrapTable({
        pagination: "true",
        paginationParts: "['pageList']",
        sidePagination: "server",
        uniqueId: "id",
        escape: "true",
        queryParams: "queryParams",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $("#patternListTable"));
        },
    });

    if ($("#errorDialog .modal-body .error-messages").length) {
        $("#errorDialog .modal-body .error-messages").html("");
    }
    if($('#userMode').val() != CONFIG.get('ROLE_ADMIN_ID')) {
        $("#patternListTable").bootstrapTable("refresh", {
            url: "/pattern_list/patern_list_by_company",
        });
    }
    $("#companyListID").on("change", function () {
        $("#patternListTable").bootstrapTable("refresh", {
            url: "/pattern_list/patern_list_by_company",
        });
        $("#patternListTable").on(
            "load-success.bs.table.bs.table",
            function (_e, _result, _status, _jqXHR) {
                // hide loading modal
                $(".md-loading").modal("hide");
            }
        );
        $("#patternListTable").on(
            "load-error.bs.table.bs.table",
            function (_e, _status, _jqXHR) {}
        );
    });

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
        $.ajax({
            url: "/pattern_list/" + id,
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
    $('#patternListTable').on('click-row.bs.table', function (row, $element, field) {
        // Redirect to 5S pattern preview page
    })

});
