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
    $('#employeeDepartment').find('option').first().prop('selected', true);
}

window.queryParams = function (params) {
    params.page = params.offset > 0 ? Math.ceil(params.offset / 10) + 1 : 1;
    params.team_id = $('#teamSearchTable').val();

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
    let department_id = $("#employeeDepartment").val();
    let team_id = $("#employeeTeam").val();
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

window.loadDeptListByComp = function(id) {
    $.ajax({
        type: 'GET',
        url: '/departments/list/' + id,
        success: function (res) {
            let html = '';
            listDepartment = res;
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }

            $('#departmentSearchTable').html(html);
            $('#employeeDepartment').html(html);
            let deptId = $("#departmentSearchTable").find(":selected").val();
            loadTeamListByDept(deptId);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus + ': ' + errorThrown);
        },
    });
}

/** ------------------
 *  Load team list
 --------------------- */

 window.loadTeamListByDept = function(id, ele = null) {
    let data = {id:id};
    $.ajax({
        type: 'GET',
        url: '/teams/dept_list',
        data: data,
        success: function (res) {
            let html = '';
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }

            if (ele != null) {
                $('#' + ele).html(html);
            }
            else {
                $('#teamSearchTable').html(html);
                $('#employeeTeam').html(html);
            }
            $('#teamSearchTable').change();

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
    let compID = $("#companySearchTable").find(":selected").val();
    loadDeptListByComp(compID);
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
        let compID = $("#companySearchTable").find(":selected").val();
        $.ajax({
            type: 'GET',
            url: '/departments/list/{id}',
            success: function (res) {
                loadDeptListByComp(compID);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ': ' + errorThrown);
            },
        });
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
            .done(function (_data, _textStatus, _jqXHR) {
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
        $('#employeeTable').bootstrapTable('refresh', {url:'employee/team_list'});
        $('#employeeTable').on('load-success.bs.table.bs.table', function (_e, result, _status, _jqXHR) {
            // hide loading modal
            $('.md-loading').modal('hide');
            $('#totalEmployee').val(result.total);
        });
    });

    $('#employeeDepartment').on('change', function () {
        let id = $('#employeeDepartment').find(":selected").val();
        loadTeamListByDept(id, 'employeeTeam');
    });

     /** ------------------
      *    Edit dialog show
      --------------------- */
     $("#employeeEditDialog").on("show.bs.modal", function (e) {
        let $button = $(e.relatedTarget);
        let id = $button.data("id");
        $('#employeeName').trigger('focus');
         if (id) {
            let rowData = $("#employeeTable").bootstrapTable(
                 "getRowByUniqueId", id
             );
             $('#employeeId').val(id);
             $("#employeeName").val(rowData.name);
             $("#employeeEmail").val(rowData.email);
             $("#employeeDepartment").val(rowData.department_id);
             $("#employeeTeam").val(rowData.team_id);
             $("#employeeEditDialog .modal-title.add").hide();
             $("#employeeEditDialog .modal-title.edit").show();
         } else {
            clearDialog();
            $("#employeeEditDialog .modal-title.edit").hide();
            $("#employeeEditDialog .modal-title.add").show();
            // $("#employeeDepartment").val($('#departmentSearchTable').val());
         }
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