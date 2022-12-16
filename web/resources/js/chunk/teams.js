/*****************
 * teams.js
 *****************/
"use strict";

/*========================
 * GLOBAL FUNCTIONS
 =========================*/
let listDepartment = [];

/*============================
 * ACTIONS EDIT AND DELETE
 =============================*/
window.teamTableActions = function (_value, row, _index) {
    return (
        '<button  style="margin-right: 10px;"  type="button" class="btn btn-sm btn-copy" data-id="' +
        row.department_id + '" data-bs-toggle="modal" data-bs-target="#employeeAddDialog">メンバー追加</button> ' +
        '<button style="margin-right: 20px;" type="button" class="btn btn-primary btn-sm" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target="#teamEditDialog" >編集</button> ' +
        '<button type="button" class="btn btn-danger btn-sm" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target="#deleteDialog" >削除</button>'
    );
};

/*=================
 * CLEAR DIALOG
 ==================*/
window.clearDialog = function () {
    $('#teamName').val('');
}

/*=================
 * QUERY PARAMS
 ==================*/
window.queryParams = function (params) {
    params.page = params.offset > 0 ? Math.ceil(params.offset / CONFIG.get("PAGING")) + 1 : 1;
    params.department_id = $('#departmentListID').val();
    let department_ids = [];
    if (params.department_id == "-1") {
        for (let item of listDepartment) {
            department_ids.push(item.id);
        }
    }
    params.department_ids = department_ids;
    return params;
}

/*======================
 * RELOAD DATA TEAM
 =======================*/
 window.reloadDataTeam = function (id) {
    let data = {department_id: id};
    $.ajax({
        type: 'GET',
        url: '/teams/dept_id',
        data: data,
        success: function (res) {
            let html = '';
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#employeeTeamId').html(html);
        }
    });
}

/*==================
 * SAVE DATA TEAM
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
        reloadDataTeam();
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

/*======================
 * SAVE DATA EMPLOYEE
 ========================*/
window.saveDataEmployee = function () {
    $('#employeeForm').removeClass('was-validated');
    $('#employeeForm .form-control').removeClass('is-invalid');
    $('#employeeForm .invalid-feedback').html('');

    let data = {
        name: $("#employeeName").val(),
        email: $("#employeeEmail").val(),
        team_id: $("#employeeTeamId").val(),
        department_id: $("#deptd").val(),
    };

    showLoading();

    // CALL DATABASE UPDATE DATA
    $.ajax({
        url: "/employee",
        type: "POST",
        data: data,
    })
    .done(function (_data, _textStatus, _jqXHR) {
        // SAVE SUCCESSFUL
        $("#employeeAddDialog").modal("hide");
        showToast($('#successAddDialog'), 2000, true);
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // SHOW ERRORS
        showError(jqXHR, 'employee', 'employeeAddDialog', 'errorDialog', 'employeeForm');
    })
    .always(function () {
        // HIDE LOADING
        hideLoading();
    });
}

/*==================
 * DOCUMENT READY
 ===================*/
$(function () {
    /*----------------------------------
     * GET NAME AND LIST OF COMPANY
     -----------------------------------*/
    if ($('#companyListID')) {
        // GET NAME AND LIST OF COMPANY
        $.ajax({
            type: 'GET',
            url: '/company/list',
            success: function (res) {
                let html = '';
                if (res.currentCompany.mode == 0) {
                    for (let e of res.rows) {
                        html += '<option value="' + e.id + '">' + e.name + '</option>';
                    }
                } else {
                    html += '<option value="' + res.currentCompany.id + '" hidden>' + res.currentCompany.name + '</option>';
                }
                $('#companyListID').html(html);
            }
        });

        // ONCHANGE COMPANY => UPDATE DEPARTMENT LIST
        $('#companyListID').on('change',function () {
            $.ajax({
                type: 'GET',
                url: '/teams/comp_list?company_id='+parseInt($(this).val()),
                success: function (res) {
                    let html = '';
                    listDepartment = res;
                    html += '<option value=-1></option>';
                    for (let e of res) {
                        html += '<option value="' + e.id + '">' + e.name + '</option>';
                    }
                    $('#departmentListID').html(html);
                    $('#departmentListID').change();
                }
            });
        });
    }

    /*---------------------
     * SHOW DATA TABLE
     -----------------------*/
    $("#teamTable").bootstrapTable({
        pagination: "true",
        paginationParts: "['pageList']",
        sidePagination: "server",
        uniqueId: "id",
        escape: "true",
        queryParams:"queryParams",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $("#teamTable"));
        },
    });

    if ($("#errorDialog .modal-body .error-messages").length) {
        $("#errorDialog .modal-body .error-messages").html("");
    }

    /*-------------------------
     * INIT DEPARTMENT LIST
     --------------------------*/
    $.ajax({
        type: 'GET',
        url: '/teams/comp_list?company_id='+parseInt($("#hidCompanyId").val()),
        success: function (res) {
            let html = '';
            listDepartment = res;
            html += '<option value=-1></option>';
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#departmentListID').html(html);
            $('#departmentListID').change();
        }
    });

    /*----------------------------------------------
     * ONCHANGE DEPARTMENT => UPDATE TEAM TABLE
     -----------------------------------------------*/
    $('#departmentListID').change(function () {
        // ADD DATA TO SELECT BOX DEPARTMENT ON DIALOG ADD/EDIT
        let html = '';
        for (let e of listDepartment) {
            html += '<option value="' + e.id + '">' + e.name + '</option>';
        }
        $('#teamDepartment').html(html);
        //RELOAD AND UPDATE TEAM TABLE
        $('#teamTable').bootstrapTable('refresh', {url:'/teams/dept_list'});
        $('#teamTable').on('load-success.bs.table.bs.table', function (_e, result, _status, _jqXHR) {
            // HIDE LOADING MODAL
            $('.md-loading').modal('hide');
            $('#totalTeam').val(result.total);
        });
    });

    /*------------------------------
     * SHOW DIALOG ADD EMPLOYEE
     -------------------------------*/
    $("#employeeAddDialog").on("show.bs.modal", function (e) {
        let $button = $(e.relatedTarget);
        let id = $button.data("id");
        reloadDataTeam(id);
        $("#deptd").val(id);
        $("#employeeName").val('');
        $("#employeeEmail").val('');
    });

    /*----------------------------------------------
     * SAVE HANDLE EVENT WHEN CLICKING OK BUTTON
     -----------------------------------------------*/
    $("#saveEmployeeBtn").on("click", function () {
        window.saveDataEmployee();
    });

    /*---------------------
     * EDIT DIALOG SHOW
     ---------------------- */
    $("#teamEditDialog").on("show.bs.modal", function (e) {
        let $button = $(e.relatedTarget);
        let id = $button.data("id");
        if (id) {
            let rowData = $("#teamTable").bootstrapTable(
                "getRowByUniqueId", id
            );
            $('#teamId').val(id);
            $("#teamName").val(rowData.name);
            $("#teamDepartment").val(rowData.department_id);
            $("#teamEditDialog .modal-title.add").hide();
            $("#teamEditDialog .modal-title.edit").show();
        } else {
            clearDialog();
            $("#teamEditDialog .modal-title.edit").hide();
            $("#teamEditDialog .modal-title.add").show();
            $("#teamDepartment").val(listDepartment[0].id);
        }
        setTimeout(function (){
            $('#teamName').focus();
        }, 100);
    });

    /*---------------------
     * CLICK BUTTON ADD
     ----------------------*/
    $('#btnAdd').on('click', function() {
        $("#teamEditDialog").modal('show');
    });

    /*--------------------------
     * USER EDIT DIALOG HIDE
     ---------------------------*/
    dialogModalHide("#teamEditDialog", "#teamForm");

    /*----------------------------------------------
     * SAVE HANDLE EVENT WHEN CLICKING OK BUTTON
     -----------------------------------------------*/
    $("#saveTeamBtn").on("click", function () {
        window.saveData();
    });

    /*------------------------
     * DELETE DIALOG SHOW
     -------------------------*/
    $("#deleteDialog").on("show.bs.modal", function (e) {
        showDialogDelete('#teamTable', '#deleteId', '#deleteDialog', e);
    });

    /*---------------------
     * DELETE DATA TEAM
     ----------------------*/
    $("#deleteBtn").on("click", function () {
        showLoading();
        let id = $("#deleteId").val();
        $.ajax({
            url: "/teams/" + id,
            type: "DELETE",
        })
        .done(function (team, _textStatus, _jqXHR) {
            // DELETE SUCCESSFUL
            reloadDataTeam();
            $("#teamTable").bootstrapTable("remove", {
                field: "id",
                values: [team.id],
            }).bootstrapTable('refresh');
            showToast($('#toast1'), 3000, true);
        })
        .fail(function (jqXHR, _textStatus, _errorThrown) {
            // SHOW ERRORS
            failAjax(jqXHR, _textStatus, _errorThrown);
        })
        .always(function () {
            // HIDE LOADING
            hideLoading();
            // HIDE DIALOG DELETE
            $("#deleteDialog").modal("hide");
        });
    });

    /*-------------------------------------------
     * EVENT INPUT ENTER OF FIELD NAME TEAM
     --------------------------------------------*/
    $("#teamName").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.saveData();
        }
    });

    /*-------------------------------------------
     * EVENT INPUT ENTER OF FIELD NAME EMPLOYEE
     --------------------------------------------*/
     $("#employeeName").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.saveDataEmployee();
        }
    });

    /*-------------------------------------------
     * EVENT INPUT ENTER OF FIELD EMAIL EMPLOYEE
     --------------------------------------------*/
    $("#employeeEmail").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.saveDataEmployee();
        }
    });
});