/****************************************************
 * pattern list customer.js
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
        '<button type="button" style="margin-left: 6px;" class="btn btn-primary btn-sm" data-id="' +
        row.id +
        '" onclick="redirectToEdit(' +row.id+ ',' + row.deptId +',' + row.company_id +')" id="patternListEdit">編集</button> ' +
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
 window.redirectToEdit = function (id, deptId, compId) {
    window.location = '/pattern_dept_setting/' + id + '?departmentId=' + deptId  + '&companyId=' + compId;
}

/** ------------------`
 *    queryParams
--------------------- */
window.queryParams = function (params) {
    params.page = params.offset > 0 ? Math.ceil(params.offset / 10) + 1 : 1;
    if($('#companyListID').length) {
        params.company_id = $("#companyListID").find(":selected").val();
    } else {
        params.company_id = $('#hidLoginCompanyId').val();
    }
    return params;
};

/* ==============================
    Document Ready
==============================*/
$(function () {

    // Setting company list
    if($('#companyListID').length) {
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
    }

    // Setting datatable
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

    $("#patternListTable").bootstrapTable("refresh", {
        url: "/pattern_list/patern_list_by_company",
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
        let compID = $('#companyListID').val() ? $('#companyListID').val() : $('#userCompanyId').val();
        $.ajax({
            url: "/pattern_list/" + id + "?companyId=" + compID + "&pageDest=" + CONFIG.get("PAGE_PATTERN_LIST_CUSTOMER"),
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
        if (row) {
            window.location = '/pattern_preview/' + $el.id + '?departmentId=' + $el.deptId + '&companyId=' + $el.company_id + "&pageDest=" + CONFIG.get("PAGE_PATTERN_LIST_CUSTOMER");
        }
    })
    $('#patternListAdd').on('click', function() {
        window.location = '/pattern_dept_setting';
    });

});
