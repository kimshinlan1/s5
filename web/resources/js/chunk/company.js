/****************************************************
 * company.js
 *
 ****************************************************/
"use strict";

/* ==============================
    Global Functions
============================== */

/** ------------------
 *    get List
 --------------------- */
window.getCompanyTableList = function (params) {
    let url = "/company/list";
    params.data.page =
        params.data.offset > 0
            ? Math.ceil(params.data.offset / CONFIG.get("PAGING")) + 1
            : 1;
    $.get(url + "?" + $.param(params.data))
        .then(function (res) {
            params.success(res);
        })
        .catch(function (jqXHR, _textStatus, _errorThrown) {
            if (
                jqXHR.responseJSON &&
                jqXHR.status == 500 &&
                jqXHR.responseJSON.message
            ) {
                // Check and show other error on page error 500 (handled in server)
                handleSystemError();
            }
        });
};

/** ------------------
 *    Actions
 --------------------- */
window.companyTableActions = function (_value, row, _index) {
    let html = '<button style="margin-right: 20px;" type="button" class="btn btn-primary btn-sm" data-id="' +
    row.id + '" data-bs-toggle="modal" data-bs-target="#companyEditDialog" >編集</button> ';

    if (row.mode != 0) {
        html += '<button type="button" class="btn btn-danger btn-sm" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target="#companyDeleteDialog">削除</button>';
    }
    return html;
};

/** ------------------
*    Show name mode
--------------------- */
window.formatterDataMode = function (_value, row, _index) {
    let type = "管理者";
    if (row.mode == 1) {
        type = "有償契約";
    } else if (row.mode == 2) {
        type = "無償契約";
    }
    return type;
}

/** ------------------
*    Show 5s mode
--------------------- */
window.formatter5sMode = function (_value, row, _index) {
    let type = "管理者";
    if (row.mode_5s == 1) {
        type = "有償契約";
    } else if (row.mode_5s == 2) {
        type = "無償契約";
    }
    return type;
}

/** ------------------
*    Clear dialog
--------------------- */
window.clearDialog = function () {
    $('#companyName').val('');
    $('#companyNo').val('');
    $('#companyMode').val('');
    $('#5sMode').val('');
}

/** ------------------
*    Save data
--------------------- */
window.saveData = function () {
    $('#companyForm').removeClass('was-validated');
    $('#companyForm .form-control').removeClass('is-invalid');
    $('#companyForm .invalid-feedback').html('');
    let id = $("#companyId").val();
    let name = $("#companyName").val();
    let no = $("#companyNo").val();
    let mode = 0;
    let mode_5s = 0;
    let rowData = $("#companyTable").bootstrapTable("getRowByUniqueId", id);
    let isSetMode = false;
    let isSetMode5s = false;
    let dialog = '#successAddDialog';
    if (rowData) {
        if (rowData.mode != 0) {
            isSetMode = true;
        }
        if (rowData.mode_5s != 0) {
            isSetMode5s = true;
        }
    } else {
        isSetMode = true;
        isSetMode5s = true;
    }

    if (isSetMode) {
        if ($('#companyMode_isCharge').is(':checked')) {
            mode = 1;
        } else {
            mode = 2;
        }
    }
    if (isSetMode5s) {
        if ($('#5sMode_isCharge').is(':checked')) {
            mode_5s = 1;
        } else {
            mode_5s = 2;
        }
    }
    let data = {
        name: name,
        no: no,
        mode: mode,
        mode_5s: mode_5s,
    };
    if (id) {
        dialog = '#successUpdateDialog';
        data.id = id;
    }

    showLoading();

    // save
    $.ajax({
        url: id ? "/company/" + id : "/company",
        type: id ? "PUT" : "POST",
        data: data,
    })
        .done(function (_data, _textStatus, _jqXHR) {
            $("#companyEditDialog").modal("hide");
            showToast($(dialog), 2000, true);
            $("#companyTable").bootstrapTable("refresh");
        })
        .fail(function (jqXHR, _textStatus, _errorThrown) {
            // show errors
            showError(jqXHR, 'company', 'companyEditDialog', 'errorDialog');
        })
        .always(function () {
            // hide loading
            hideLoading();
        });
}

/* ==============================
    jQuery
==============================*/
$(function () {
    $("#companyTable").bootstrapTable({
        ajax: "getCompanyTableList",
        pagination: "true",
        paginationParts: "['pageList']",
        sidePagination: "server",
        uniqueId: "id",
        escape: "true",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $("#companyTable"));
        },
    });

    if ($("#errorDialog .modal-body .error-messages").length) {
        $("#errorDialog .modal-body .error-messages").html("");
    }

    /** ------------------
     *    Edit dialog show
     --------------------- */
    $("#companyEditDialog").on("show.bs.modal", function (e) {
        let $button = $(e.relatedTarget);
        let id = $button.data("id");
        if (id) {
            let rowData = $("#companyTable").bootstrapTable(
                "getRowByUniqueId", id
            );
            $('#companyId').val(id);
            $('#companyNo').val(rowData.no);
            $("#companyName").val(rowData.name);

            if (rowData.mode == 1) {
                $('#companyMode_isCharge').prop("checked", true);
                $('#companyMode_free').prop("checked", false);
                $(".form-check").attr("hidden", false);
                $("#companyModeLabel").attr("hidden", false);
            } else if (rowData.mode == 2) {
                $('#companyMode_isCharge').prop("checked", false);
                $('#companyMode_free').prop("checked", true);
                $(".form-check").attr("hidden", false);
                $("#companyModeLabel").attr("hidden", false);
            } else if (rowData.mode == 0) {
                $(".form-check").attr("hidden", true);
                $("#companyModeLabel").attr("hidden", true);
            }

            if (rowData.mode_5s == 1) {
                $('#5sMode_isCharge').prop("checked", true);
                $('#5sMode_free').prop("checked", false);
                $(".form-check").attr("hidden", false);
                $("#5sModeLabel").attr("hidden", false);
            } else if (rowData.mode_5s == 2) {
                $('#5sMode_isCharge').prop("checked", false);
                $('#5sMode_free').prop("checked", true);
                $(".form-check").attr("hidden", false);
                $("#5sModeLabel").attr("hidden", false);
            } else if (rowData.mode_5s == 0) {
                $(".form-check").attr("hidden", true);
                $("#5sModeLabel").attr("hidden", true);
            }

            $("#companyEditDialog .modal-title.add").hide();
            $("#companyEditDialog .modal-title.edit").show();
        } else {
            clearDialog();
            $("#companyEditDialog .modal-title.edit").hide();
            $("#companyEditDialog .modal-title.add").show();

            $('#companyMode_isCharge').prop("checked", false);
            $('#5sMode_isCharge').prop("checked", false);
            $('#companyMode_free').prop("checked", true);
            $('#5sMode_free').prop("checked", true);
            $(".form-check").attr("hidden", false);
            $("#companyModeLabel").attr("hidden", false);
            $("#5sModeLabel").attr("hidden", false);
        }
    });

    $("#companyEditDialog input").keypress(function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.saveData();
        }
    });

    /** ------------------
     *   Edit dialog hide
     --------------------- */
    dialogModalHide("#companyEditDialog", "#companyForm");

    /** ------------------
     *   Save. Handle event when clicking OK button
     --------------------- */
    $("#saveCompanyBtn").on("click", function () {
        window.saveData();
    });

    /** ------------------
    *   Delete dialog show
    --------------------- */
    $("#companyDeleteDialog").on("show.bs.modal", function (e) {
        showDialogDelete('#companyTable', '#deleteCompanyId', '#companyDeleteDialog', e);
    });

    /** ------------------
     *    Delete
     --------------------- */
    $("#deleteCompanyBtn").on("click", function () {
        showLoading();
        let id = $("#deleteCompanyId").val();
        $.ajax({
            url: "/company/" + id,
            type: "DELETE",
        })
            .done(function (company, _textStatus, _jqXHR) {
                $("#companyTable").bootstrapTable("remove", {
                    field: "id",
                    values: [company.id],
                }).bootstrapTable('refresh');
            })
            .fail(function (jqXHR, _textStatus, _errorThrown) {
                // show errors
                failAjax(jqXHR, _textStatus, _errorThrown);
            })
            .always(function () {
                hideLoading();
                $("#companyDeleteDialog").modal("hide");
            });
    });
});
