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
        '<button  style="margin-right: 10px;"  type="button" class="btn btn-sm btn-primary" data-id="' +
        row.department_id + '" data-team_id="' + row.id +
        '" data-bs-toggle="modal" data-bs-target="#employeeAddDialog">メンバー追加</button> ' +
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

/*==================
 * DOCUMENT READY
 ===================*/
$(function () {
    /*----------------------------------
     * GET NAME AND LIST OF COMPANY
     -----------------------------------*/
    if ($('#companyListID')) {
        // GET NAME AND LIST OF COMPANY
        loadCompanyList($('#companyListID'));


        // ONCHANGE COMPANY => UPDATE DEPARTMENT LIST
        $('#companyListID').on('change',function () {
            $.ajax({
                type: 'GET',
                url: '/teams/comp_list?company_id='+parseInt($(this).val()),
                success: function (res) {
                    let html = '';
                    html += '<option value=-1></option>';
                    listDepartment = res;
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
            html += '<option value=-1></option>';
            listDepartment = res;
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
        $('#teamDepartmentId').html(html);
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
       clearDialog();
       let $button = $(e.relatedTarget);
       let id = $button.attr('data-id');
       let teamId = $button.attr('data-team_id');
       $("#deptd").val(id);
       $("#employeeName").val('');
       $("#employeeEmail").val('');
       loadTeamListByDept(id, teamId)
       setTimeout(function (){
           $('#teamName').focus();
       }, 100);
    });

    /** ------------------
    *  Load team list
    --------------------- */
    window.loadTeamListByDept = function(id, teamId) {
        $.ajax({
            type: 'GET',
            url: '/teams/list/' + id,
            success: function (res) {
                let html = '';
                for (let e of res) {
                    html += (teamId == e.id) ? '<option value="' + e.id + '" selected>' + e.name + '</option>' : '<option value="' + e.id + '">' + e.name + '</option>';
                }
                $('#employeeTeamId').html(html);
            },
            error: function(textStatus, errorThrown) {
            },
        });
    }

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
        $('#errorLabelNoDepartment').hide();
        let $button = $(e.relatedTarget);
        let id = $button.data("id");
        let departmentId = $('#departmentListID').val();
        $('#errorLabelNoDepartment').html('');
        if (id) {
            let rowData = $("#teamTable").bootstrapTable(
                "getRowByUniqueId", id
            );
            $('#teamId').val(id);
            $("#teamName").val(rowData.name);
            $("#teamDepartmentId").val(rowData.department_id);
            $("#teamEditDialog .modal-title.add").hide();
            $("#teamEditDialog .modal-title.edit").show();
        } else {
            clearDialog();
            $("#teamEditDialog .modal-title.edit").hide();
            $("#teamEditDialog .modal-title.add").show();
            $("#teamDepartmentId").val(departmentId);
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
        window.saveDataTeam();
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
            window.saveDataTeam();
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

    /*-------------------------------------------
     * HANDLE CLICK ON ROW EVENT
     --------------------------------------------*/
    $('#teamTable').on('click-cell.bs.table', function (_field, _value, row, $el) {
        // Redirect to 5S pattern preview page
        if (row !== undefined) {
            window.location = window.location = '/employee/?companyId=' + $el.company_id + '&deptId=' + $el.department_id + '&teamId=' + $el.id;
        }
    })

    /**
     * Concatenate dialog title and page name
     */
    $("#teamEditDialog h5.modal-title").prepend($("#titleTeamDialog").val());
    $("#deleteDialog h5.modal-title").prepend($("#titleTeamDialog").val());
});
