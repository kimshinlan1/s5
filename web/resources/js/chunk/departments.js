/****************************************************
 * departments.js
 *
 ****************************************************/
 "use strict";

 /* ==============================
     Global Functions
 ============================== */

/** ------------------
  *    Actions
  --------------------- */
window.departmentTableActions = function (_value, row, _index) {
    return (
        '<button  style="margin-right: 10px;"  type="button" class="btn btn-sm btn-copy" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target="#teamEditDialog">係追加</button> ' +
         '<button style="margin-right: 10px;" type="button" class="btn btn-primary btn-sm" data-id="' +
         row.id + '" data-bs-toggle="modal" data-bs-target="#departmentEditDialog" >編集</button> ' +
         '<button type="button" class="btn btn-danger btn-sm" data-id="' +
         row.id + '" data-bs-toggle="modal" data-bs-target="#departmentDeleteDialog" >削除</button>'
     );
};

/** ------------------
  *    queryParams
--------------------- */
window.queryParams = function (params) {
    params.page = params.offset > 0 ? Math.ceil(params.offset / 10) + 1 : 1;
    params.company_id = $('#companyListID').val();

    return params;
}

/*==================
 * Save team data
 ===================*/
 window.saveData = function () {
    $('#teamForm').removeClass('was-validated');
    $('#teamForm .form-control').removeClass('is-invalid');
    $('#teamForm .invalid-feedback').html('');
    let id = $("#teamId").val();
    let name = $("#teamName").val();
    let department_id = $("#teamDepartment").val();
    let data = null;
    let dialog = '#successAddDialog';
    if (id) {
        dialog = '#successUpdateDialog';
        data = {
            id: id,
            name: name,
            department_id: department_id,
        };
    } else {
        data = {
            name: name,
            department_id: department_id,
        };
    }
    showLoading();

    // CALL DATABASE UPDATE DATA
    $.ajax({
        url: id ? "/teams/" + id : "/teams",
        type: id ? "PUT" : "POST",
        data: data,
    })
    .done(function (_data, _textStatus, _jqXHR) {
        // SAVE SUCCESSFUL
        $("#teamEditDialog").modal("hide");
        showToast($(dialog), 2000, true);
        $("#teamTable").bootstrapTable("refresh");
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // SHOW ERRORS
        showError(jqXHR, 'team', 'teamEditDialog', 'errorDialog', 'teamForm');
    })
    .always(function () {
        // HIDE LOADING
        hideLoading();
    });
}

/** ------------------
  *    indexNo
--------------------- */
window.indexNo = function (_value, _row, index) {
    let tableOptions =  $("#departmentTable").bootstrapTable('getOptions');
    return ((tableOptions.pageNumber - 1) * tableOptions.pageSize) + (1 + index);
}

/** ------------------
 *    Clear dialog
 --------------------- */
window.clearDialog = function () {
    $('#departmentName').val('');
    $('#teamName').val('');
}

/** ------------------
 *    Reload Data Department
 --------------------- */
window.reloadDataDepartment = function () {
    $.ajax({
        type: 'GET',
        url: '/departments/list',
        success: function (res) {
            let html = '';

            for (let e of res.rows) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#employeeDepartmentId').html(html);
        }
    });
}

/** ------------------
 *    Save data department
 --------------------- */
window.saveDataDepartment = function () {
    let id = $("#departmentId").val();
    let name = $("#departmentName").val();
    let no = $("#noID").val();
    let company_id = $('#companyListID').find(":selected").val();
    let data = null;
    let dialog = '#successAddDialog';
    if (id) {
        dialog = '#successUpdateDialog';
        data = {
            id: id,
            name: name,
            no: no,
            company_id: company_id
        };
    } else {
        data = {
            name: name,
            no: "",
            company_id: company_id
        };
    }

    showLoading();

    // save
    $.ajax({
        url: id ? "/departments/" + id : "/departments",
        type: id ? "PUT" : "POST",
        data: data,
    }).done(function (result, _textStatus, _jqXHR) {
        if(!result['valid']){
            $('#departmentName').addClass('is-invalid').siblings('.invalid-feedback').html(result['errors']);
        }
        else {
            reloadDataDepartment();
            $("#departmentEditDialog").modal("hide");
            showToast($(dialog), 2000, true);
            $("#departmentTable").bootstrapTable("refresh");
        }}).fail(function (jqXHR, _textStatus, _errorThrown) {
            // show errors
            if (jqXHR.responseJSON && jqXHR.responseJSON.errors) {
                if(jqXHR.status == 500 || jqXHR.status == 404) {
                    $("#departmentEditDialog").modal('hide');
                    $('#errorDialog .modal-body .error-messages').html(jqXHR.responseJSON.errors);
                    $("#errorDialog").modal('show');
                } else {
                    for (let error in jqXHR.responseJSON.errors) {
                        $('#' + window.toCamelCase('department_' + error)).addClass('is-invalid').siblings('.invalid-feedback').html(jqXHR.responseJSON.errors[error]);
                    }
                }
            } else if (jqXHR.responseJSON && jqXHR.status == 500 && jqXHR.responseJSON.message) {
                // Check and show other error on page error 500 (handled in server)
                handleSystemError($("#departmentEditDialog"));
            }
        }).always(function () {
            // hide loading
            hideLoading();
        });
}

/** ------------------
 *    Save data employee
 --------------------- */
window.saveDataEmployee = function () {
    $('#employeeForm').removeClass('was-validated');
    $('#employeeForm .form-control').removeClass('is-invalid');
    $('#employeeForm .invalid-feedback').html('');

    let data = {
        name: $("#employeeName").val(),
        email: $("#employeeEmail").val(),
        department_id:  $("#employeeDepartmentId").val(),
    };

    showLoading();

    // save
    $.ajax({
        url: "/employee",
        type: "POST",
        data: data,
    })
    .done(function (_data, _textStatus, _jqXHR) {
        $("#departmentAddDialog").modal("hide");
        showToast($('#successAddDialog'), 2000, true);
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors
        showError(jqXHR, 'employee', 'departmentAddDialog', 'errorDialog', 'employeeForm');
    })
    .always(function () {
        // hide loading
        hideLoading();
    });
}

/** ------------------
 *  Load department list
 --------------------- */
 window.loadDeptListByComp = function(id) {
    $.ajax({
        type: 'GET',
        url: '/departments/list/' + id,
        success: function (res) {
            let html = '<option value=""> </option>';
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }

            $('#teamDepartment').html(html);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus + ': ' + errorThrown);
        },
    });
}

/* ==============================
     jQuery
 ==============================*/
 $(function () {
    $.ajax({
        type: 'GET',
        url: '/company/list',
        success: function (res) {
            let html = '';
            if(res.currentCompany.mode == 0) {
                for (let e of res.rows) {
                    html += '<option value="' + e.id + '">' + e.name + '</option>';
                }
            }
            else {
                html += '<option value="' + res.currentCompany.id + '" hidden>' + res.currentCompany.name + '</option>';
            }
            $('#companyListID').html(html);

            $('#companyListID').change();
        }
    });

    $("#departmentTable").bootstrapTable({
        pagination: "true",
        paginationParts: "['pageList']",
        sidePagination: "server",
        uniqueId: "id",
        escape: "true",
        queryParams:"queryParams",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $("#departmentTable"));
        },
    });

    if ($("#errorDialog .modal-body .error-messages").length) {
        $("#errorDialog .modal-body .error-messages").html("");
    }

    $('#companyListID').on('change',function () {
        $('#departmentTable').bootstrapTable('refresh', {url:'/departments/comp_list'});
        $('#departmentTable').on('load-success.bs.table.bs.table', function (_e, _result, _status, _jqXHR) {
            // hide loading modal
            $('.md-loading').modal('hide');
        });
        $('#departmentTable').on('load-error.bs.table.bs.table', function (_e, _status, _jqXHR) {});
    });

    reloadDataDepartment();

    /** ------------------
      *    Add dialog show
    --------------------- */
    $("#departmentAddDialog").on("show.bs.modal", function (e) {
        let $button = $(e.relatedTarget);
        let id = $button.data("id");
        let rowData = $("#departmentTable").bootstrapTable("getRowByUniqueId", id);
        $("#employeeDepartmentId").val(rowData.id);
        $("#employeeName").val('');
        $("#employeeEmail").val('');
    });

    /*---------------------
     * Show Registration Team Dialog
     ---------------------- */
     $("#teamEditDialog").on("show.bs.modal", function (e) {
        clearDialog();
        let id = $('#companyListID').val();
        $("#teamEditDialog .modal-title.edit").hide();
        $("#teamEditDialog .modal-title.add").show();
        loadDeptListByComp(id)
        setTimeout(function (){
            $('#teamName').focus();
        }, 100);
    });

    /*---------------------
     * Hide Registration Team Dialog
     ---------------------- */
     dialogModalHide("#teamEditDialog", "#teamForm");

    /*----------------------------------------------
     * Save team data
     -----------------------------------------------*/
    $("#saveTeamBtn").on("click", function () {
        window.saveData();
    });

    /** ------------------
      *    Save. Handle event when clicking OK button
    --------------------- */
    $("#saveEmployeeBtn").on("click", function () {
        window.saveDataEmployee();
    });

    /** ------------------
      *    Edit dialog show
    --------------------- */
    $("#departmentEditDialog").on("show.bs.modal", function (e) {
        let $button = $(e.relatedTarget);
        let id = $button.data("id");
        if (id) {
            let rowData = $("#departmentTable").bootstrapTable(
                "getRowByUniqueId", id
            );
            $('#departmentId').val(id);
            $("#departmentName").val(rowData.name);
            $("#noID").val(rowData.no)
            $("#departmentEditDialog .modal-title.add").hide();
            $("#departmentEditDialog .modal-title.edit").show();
        } else {
            clearDialog();
            $("#departmentEditDialog .modal-title.edit").hide();
            $("#departmentEditDialog .modal-title.add").show();
        }
    });

    /** ------------------
      *    Edit dialog hide
    --------------------- */
    $("#departmentEditDialog").on("hide.bs.modal", function (_e) {
        // reset form
        $("#departmentEditDialog").removeClass('was-validated');
        $("#departmentEditDialog" + ' .form-control').val('').removeClass('is-invalid');
        $("#departmentEditDialog" + ' .invalid-feedback').html('');
    });

    /** ------------------
      *    Handle event when clicking OK button
    --------------------- */
    $("#saveDepartmentBtn").on("click", function () {
        window.saveDataDepartment();
    });


    /** ------------------
    *   Delete dialog show
    --------------------- */
    $("#departmentDeleteDialog").on("show.bs.modal", function (e) {
        showDialogDelete('#departmentTable', '#deleteDepartmentId', '#departmentDeleteDialog', e);
    });

    /** ------------------
     *    Delete
     --------------------- */
    $("#deleteDepartmentBtn").on("click", function () {
        showLoading();
        let id = $("#deleteDepartmentId").val();
        $.ajax({
            url: "/departments/" + id,
            type: "DELETE",
        })
            .done(function (_department, _textStatus, _jqXHR) {
                reloadDataDepartment();
                $("#departmentTable").bootstrapTable("refresh");
                showToast($('#toast2'), 3000, true);
            })
            .fail(function (jqXHR, _textStatus, _errorThrown) {
                // show errors
                failAjax(jqXHR, _textStatus, _errorThrown);
            })
            .always(function () {
                hideLoading();
                $("#departmentDeleteDialog").modal("hide");
            });
    });

    /** ------------------
     *    Event input enter of field name department
     --------------------- */
    $("#departmentName").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.saveDataDepartment();
        }
    });

    /** ------------------
     *    Event input enter of field name employee
     --------------------- */
    $("#employeeName").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.saveDataEmployee();
        }
    });

    /** ------------------
     *    Event input enter of field email employee
     --------------------- */
    $("#employeeEmail").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.saveDataEmployee();
        }
    });
 });
