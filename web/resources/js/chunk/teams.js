/*****************
 * teams.js
 *****************/
"use strict";

/*========================
 * GLOBAL FUNCTIONS
 =========================*/
let listDepartment = [];

/*-----------------------------
 * ACTIONS EDIT AND DELETE
 ------------------------------*/
window.teamTableActions = function (_value, row, _index) {
    return (
        '<button style="margin-right: 20px;" type="button" class="btn btn-primary btn-sm" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target="#teamEditDialog" >編集</button> ' +
        '<button type="button" class="btn btn-danger btn-sm" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target="#deleteDialog" >削除</button>'
    );
};

/*-----------------
 * CLEAR DIALOG
 ------------------*/
window.clearDialog = function () {
    $('#teamName').val('');
    $('#teamDepartment').find('option').first().prop('selected', true);
}

/*-----------------
 * QUERY PARAMS
 ------------------*/
 window.queryParams = function (params) {
    params.page = params.offset > 0 ? Math.ceil(params.offset / 10) + 1 : 1;
    params.department_id = $('#departmentListID').val();
    return params;
}

/*--------------------------------
 * RELOAD SELECT BOX ON DIALOG
 ---------------------------------*/
window.reloadSelectBox = function () {
    $.ajax({
        type: 'GET',
        url: '/department/list',
        success: function (res) {
            listDepartment = res.rows;
            $('#departmentListID').change();
        }
    });
}

/*--------------------
 * SAVE DATA TEAM 
 ---------------------*/
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
        window.reloadSelectBox();
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

/*============
 * JQUERY
 =============*/
$(function () {
    // GET NAME AND LIST OF COMPANY
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

    // GET NAME AND LIST OF DEPARTMENTS
    $.ajax({
        type: 'GET',
        url: '/departments/list',
        success: function (res) {
            let html = '';
            listDepartment = res.rows;
            for (let e of res.rows) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#departmentListID').html(html);
            $('#departmentListID').change();
        }
    });
    
    // SHOW DATA TABLE
    $("#teamTable").bootstrapTable({
        uniqueId: "id",
        escape: "true",
        queryParams:"queryParams",
        reorderableRows: "true",
        useRowAttrFunc: "true",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $("#teamTable"));
        },
    });

    if ($("#errorDialog .modal-body .error-messages").length) {
        $("#errorDialog .modal-body .error-messages").html("");
    }

    $('#companyListID').on('change',function () {
        $.ajax({
            type: 'GET',
            url: '/teams/comp_list?company_id='+parseInt($(this).val()),
            success: function (res) {
                let html = '';
                listDepartment = res;
                for (let e of res) {
                    html += '<option value="' + e.id + '">' + e.name + '</option>';
                }
    
                $('#departmentListID').html(html);
    
                $('#departmentListID').change();
            }
        });
    });

    $('#departmentListID').on('change',function () {
        $('#teamTable').bootstrapTable('refresh', {url:'/teams/dept_list'});
        $('#teamTable').on('load-success.bs.table.bs.table', function (_e, _result, _status, _jqXHR) {
            // HIDE LOADING MODAL
            $('.md-loading').modal('hide');
        });
        $('#teamTable').on('load-error.bs.table.bs.table', function (_e, _status, _jqXHR) {});
    });

    $('#departmentListID').change(function () {
        // ADD DATA TO SELECT BOX DEPARTMENT ON DIALOG ADD/EDIT
        let html = '';
        for (let e of listDepartment) {
            html += '<option value="' + e.id + '">' + e.name + '</option>';
        }
        $('#teamDepartment').html(html);
        $('#teamTable').bootstrapTable('refresh', {url:'/teams/dept_list'});
        $('#teamTable').on('load-success.bs.table.bs.table', function (_e, result, _status, _jqXHR) {
            // HIDE LOADING MODAL
            $('.md-loading').modal('hide');
            $('#totalTeam').val(result.total);
        });
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
            $("#teamDepartment").val($('#departmentListID').val());
        }
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
            $("#teamTable").bootstrapTable("remove", {
                field: "id",
                values: [team.id],
            }).bootstrapTable('refresh');
            window.reloadSelectBox();
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
});