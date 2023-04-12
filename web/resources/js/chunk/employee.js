/****************************************************
 * departments.js
 *
 ****************************************************/
 "use strict";

 /* ==============================
     Global Functions
 ============================== */

 let listDepartment = [];
 let countEmployee = 0;
 const queryString = window.location.search;
 const urlParams = new URLSearchParams(queryString);
 /** ------------------
  *    Actions
  --------------------- */
 window.employeeTableActions = function (_value, row, _index) {
     return (
         '<button style="margin-right: 20px;" type="button" class="btn btn-primary btn-sm" data-id="' +
         row.id + '" data-bs-toggle="modal" data-bs-target="#employeeEditDialog" >編集</button> ' +
         '<button type="button" class="btn btn-danger btn-sm" data-id="' +
         row.id + '" data-bs-toggle="modal" data-bs-target="#employeeDeleteDialog" >削除</button>'
     );
 };

 /** ------------------
 *    Clear dialog
 --------------------- */
 window.clearDialog = function () {
    $('#employeeName').val('');
    $('#employeeDepartmentId').find('option').first().prop('selected', true);
}

window.queryParams = function (params) {
    params.page = params.offset > 0 ? Math.ceil(params.offset / CONFIG.get('PAGING')) + 1 : 1;
    params.team_id = $('#teamSearchTable').val();
    params.department_id = $('#departmentSearchTable').val();
    if($('#userId').val() != CONFIG.get('ROLE_ADMIN_ID')) {
        params.company_id = $('#userCompanyId').val();
    } else {
        params.company_id = $("#companySearchTable").find(":selected").val();
    }

    return params;
}

 /** ------------------
 *  Employee Order
 --------------------- */
window.employeeOrder = function (_value, _row, index) {
    let tableOptions =  $("#employeeTable").bootstrapTable('getOptions');
    return ((tableOptions.pageNumber - 1) * tableOptions.pageSize) + (1 + index);
}

 /** ------------------
 *  Reload select box on dialog
 --------------------- */
 window.reloadSelectBox = function () {
    $.ajax({
        type: 'GET',
        url: '/departments/list',
        success: function (res) {
            listDepartment = res.rows;
            $('#departmentSearchTable').change();
        }
    });
}

/** ------------------
 *  Save data employee
 --------------------- */
window.saveData = function () {
	$('#employeeForm').removeClass('was-validated');
    $('#employeeForm .form-control').removeClass('is-invalid');
    $('#employeeForm .invalid-feedback').html('');

    let id = $("#employeeId").val();
    let name = $("#employeeName").val();
    let email = $("#employeeEmail").val();
    let department_id = $("#employeeDepartmentId").val();
    let team_id = $("#employeeTeamId").val();
    let data = null;
    let dialog = '#successAddDialog';
    if (id) {
        dialog = '#successUpdateDialog';
        data = {
            id: id,
            name: name,
            email: email,
            department_id: department_id,
            team_id: team_id,
        };
    } else {
        data = {
            name: name,
            email: email,
            department_id: department_id,
            team_id: team_id,
        };
    }

    showLoading();

    // save
    $.ajax({
        url: id ? "/employee/" + id : "/employee",
        type: id ? "PUT" : "POST",
        data: data,
    })
        .done(function (_data, _textStatus, _jqXHR) {
            $("#employeeEditDialog").modal("hide");
            showToast($(dialog), 2000, true);
            $("#employeeTable").bootstrapTable("refresh");
            window.reloadSelectBox();
        })
        .fail(function (jqXHR, _textStatus, _errorThrown) {
            // show errors
            showError(jqXHR, 'employee', 'employeeEditDialog', 'errorDialog', 'employeeForm');
        })
        .always(function () {
            // hide loading
            hideLoading();
        });
}

/** ------------------
 *  Load department list
 --------------------- */

window.loadDeptListByComp = function(id, deptID = null) {
    let teamId = urlParams.get('teamId');
    let url = '/departments/list/' + id;
    let method = "GET";
    let params = {};
    let doneCallback = function (res, _textStatus, _jqXHR) {
        let html = '<option value=""> </option>';
            listDepartment = res;
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }

            $('#departmentSearchTable').html(html);
            $('#employeeDepartmentId').html(html);
            let deptId = deptID ? deptID : $("#departmentSearchTable").find(":selected").val();
            if (deptID) {
                $("#departmentSearchTable").val(deptID);
            }
            loadTeamListByDept(deptId, teamId);
    };

    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    runAjax(url, method, params, doneCallback, failCallback, null, true);
}

/** ------------------
 *  Load team list
 --------------------- */

 window.loadTeamListByDept = function(id, ele = null) {
    let data = {department_id: id};
    $.ajax({
        type: 'GET',
        url: '/teams/dept_id',
        async: false,
        data: data,
        success: function (res) {
            let html = '<option value=""> </option>';
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            if (ele != null) {
                $('#teamSearchTable').html(html);
                $("#teamSearchTable").val(ele).change();
                $('#employeeTeamId').html(html);
            }
            else {
                $('#teamSearchTable').html(html);
                $('#employeeTeamId').html(html);
                $('#teamSearchTable').change();
            }
        },
        error: function(_jqXHR, textStatus, errorThrown) {
        },
    });
}

 /* ==============================
     Document Ready
 ==============================*/
 $(function () {
    let compID = $("#userCompanyId").val();
    let deptId = urlParams.get('deptId');
    let companyId = urlParams.get('companyId');
    if(companyId) {
        $('#companySearchTable').val(companyId);
        loadDeptListByComp(companyId, deptId);
    } else {
        loadDeptListByComp(compID);
    }

    $("#employeeTable").bootstrapTable({
        uniqueId: "id",
        escape: "true",
        queryParams:"queryParams",
        reorderableRows: "true",
        useRowAttrFunc: "true",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $("#employeeTable"));
        },
    });

    $("#companySearchTable").on('change', function() {
        let compId = $("#companySearchTable").find(":selected").val();
        loadDeptListByComp(compId);
    });

    if ($("#errorDialog .modal-body .error-messages").length) {
         $("#errorDialog .modal-body .error-messages").html("");
    }

    /** ------------------
      *    Get on row re-order event
    --------------------- */
    $("#employeeTable").on('reorder-row.bs.table', function(_data, row1, _row2) {
        for(let i=0; i<row1.length; i++) {
            row1[i].employee_order = i+1;
        }
        const obj = Object.assign({}, row1)
        showLoading();
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            url: "/employee/update_order",
            type: "POST",
            data: obj,
        })
            .done(function (_value, _textStatus, _jqXHR) {
                $("#employeeTable").bootstrapTable("refresh");
            })
            .fail(function (jqXHR, _textStatus, _errorThrown) {
                // show errors
                showError(jqXHR, 'employee', 'employeeEditDialog', 'errorDialog', 'employeeForm');
            })
            .always(function () {
                // hide loading
                hideLoading();
            });
    });

    $('#departmentSearchTable').on('change', function () {
        let id = $('#departmentSearchTable').find(":selected").val();
        loadTeamListByDept(id, 'teamSearchTable');
    });

    $('#teamSearchTable').on('change', function () {
        $('#employeeTable').bootstrapTable('refresh', {url:'employee/team_id'});
        $('#employeeTable').on('load-success.bs.table.bs.table', function (_e, result, _status, _jqXHR) {
            // hide loading modal
            $('.md-loading').modal('hide');
            $('#totalEmployee').val(result.total);
        });
    });

    $('#employeeDepartmentId').on('change', function () {
        let id = $('#employeeDepartmentId').find(":selected").val();
        loadTeamListByDept(id, 'employeeTeamId');
    });

     /** ------------------
      *    Edit dialog show
      --------------------- */
     $("#employeeEditDialog").on("show.bs.modal", function (e) {
        let $button = $(e.relatedTarget);
        let id = $button.data("id");
         if (id) {
            let rowData = $("#employeeTable").bootstrapTable(
                 "getRowByUniqueId", id
             );
             $('#employeeId').val(id);
             $("#employeeName").val(rowData.name);
             $("#employeeEmail").val(rowData.email);
             $("#employeeDepartmentId").val(rowData.department_id);
             loadTeamListByDept(rowData.department_id, 'employeeTeamId');
             setTimeout(function (){
                $("#employeeTeamId").val(rowData.team_id);
            }, 500);

             $("#employeeEditDialog .modal-title.add").hide();
             $("#employeeEditDialog .modal-title.edit").show();
         } else {
            clearDialog();
            $("#employeeEditDialog .modal-title.edit").hide();
            $("#employeeEditDialog .modal-title.add").show();
         }
        setTimeout(function (){
            $('#employeeName').focus();
        }, 100);
     });

    /** ------------------
      *    Click Button Add
      --------------------- */
    $('#btnAdd').on('click', function() {
        let departmentId = $('#departmentSearchTable').val();
        for (let e of listDepartment) {
            if (departmentId == e.id) {
                countEmployee = e.employee_cnt;
                break;
            }
        }
        if (countEmployee >= CONFIG.get("MAX_EMPLOYEES")) {
            $('#errorDialog .modal-body .error-messages').html(CONFIG.get('MESSAGE_ADD_EMP_ERROR'));
            $("#errorDialog").modal('show');
        } else {
            $("#employeeEditDialog").modal('show');
        }
    });

    /** ------------------
     *    User edit dialog hide
     --------------------- */
    dialogModalHide("#employeeEditDialog", "#employeeForm");
     /** ------------------
      *    Save. Handle event when clicking OK button
      --------------------- */
    $("#saveEmployeeBtn").on("click", function () {
        window.saveData();
    });


      /** ------------------
      *   Delete dialog show
      --------------------- */
      $("#employeeDeleteDialog").on("show.bs.modal", function (e) {
        showDialogDelete('#employeeTable', '#deleteEmployeeId', '#employeeDeleteDialog', e);
    });

    /** ------------------
     *    Delete
     --------------------- */
    $("#deleteEmployeeBtn").on("click", function () {
        showLoading();
        let id = $("#deleteEmployeeId").val();
        $.ajax({
            url: "/employee/" + id,
            type: "DELETE",
        })
            .done(function (employee, _textStatus, _jqXHR) {
                $("#employeeTable").bootstrapTable("remove", {
                    field: "id",
                    values: [employee.id],
                }).bootstrapTable('refresh');
                window.reloadSelectBox();
                showToast($('#toast1'), 3000, true);
            })
            .fail(function (jqXHR, _textStatus, _errorThrown) {
                // show errors
                failAjax(jqXHR, _textStatus, _errorThrown);
            })
            .always(function () {
                hideLoading();
                $("#employeeDeleteDialog").modal("hide");
            });
    });

    /** ------------------
     *    Event input enter of field name employee
     --------------------- */
    $("#employeeName").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.saveData();
        }
    });

    /** ------------------
     *    Event input enter of field email employee
    --------------------- */
    $("#employeeEmail").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.saveData();
        }
    });
 });
