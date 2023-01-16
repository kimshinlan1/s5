/****************************************************
 * departments.js
 *
 ****************************************************/
 "use strict";

 /* ==============================
     Global Functions
 ============================== */
var checkPatternOnly = false;
var patternOldSelectedValue = '';
var checkDeptPattern = '';
var isEmptyOption = false;
var isExistedOption = false;
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
  *    5S Checklist Actions
  --------------------- */
window.department5SChecklistActions = function (_value, row, _index) {
    let options = '<select class=" form-select px-2" id="checklist5sID' + row.id + '" onchange="selectPattern(' + row.id + ')" style="width: 50%; padding: 0; background-position: right 0.2rem center; display: inline-block;margin-inline-end: 30px;">';
    options += '<option> </option>';
    let selectedDeptPatternId = row.dept_pattern_id;
    if (row.dept_pattern_id) {
        checkPatternOnly = true;
        checkDeptPattern = row.id;
    }

    $.ajax({
        url: '/pattern_list/getlist_by_department/' + row.company_id,
        type: 'GET',
        async: false
    })
    .done(function (_data, _textStatus, _jqXHR) {
        let dataId = -1;
        let btn = '';
        _data.forEach(ele => {
            if (!ele.isPattern && ele.id == selectedDeptPatternId) {
                options += "<option value=" + ele.id + " data-deptId=" + ele.deptId + " data-isPattern=" + ele.isPattern + " data-companyId=" + row.company_id + " selected>" + ele.name + "</option>";
                dataId = 1;
                btn = '<button type="button" id="editPatternBtn' + row.id + '" class="btn btn-secondary btn-sm" style="width: 55px;" data-id="'+dataId+'" data-isPattern="'+ ele.isPattern
                +'" data-companyId="'+ row.company_id +'" data-deptId="'+ ele.deptId +'" data-patternId="'+ selectedDeptPatternId +'" data-selectedPatternId="'+ selectedDeptPatternId +'" onClick="openEditDeptPattern(' + row.id + ')">編集</button> ';
            } else {
                options += "<option value=" + ele.id + " data-deptId=" + ele.deptId + " data-isPattern=" + ele.isPattern + " data-companyId=" + row.company_id + ">" + ele.name + "</option>";
            }
        });
            btn = btn ? btn : '<button type="button" id="editPatternBtn' + row.id + '" class="btn btn-secondary btn-sm" style="width: 55px;" data-id="'+dataId+'" data-isPattern="" data-companyId="" data-deptId="" data-patternId="" data-selectedPatternId="'+ selectedDeptPatternId +'" onClick="openEditDeptPattern(' + row.id + ')">編集</button> ';

        options += " </select>";

        options += btn;
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // SHOW ERRORS
        failAjax(jqXHR, _textStatus, _errorThrown);
    });
    return options;
};

/** ------------------
  *    Add classes / css for 5s pattern checklist column
--------------------- */
window.checkListStyle = function(value, row, index) {
    let width = isIpad() ? '20%' : '25%';
    return {
        classes: 'text-center',
        css: {
            width: width
        }
    }
}

/** ------------------
  *    Add classes / css for id column
--------------------- */
window.idStyle = function(value, row, index) {
    let width = isIpad() ? '10%' : '20%';
    return {
        css: {
          width: width
        }
    }
}

/** ------------------
  *    Add classes / css for department name column
--------------------- */
window.departmentStyle = function(value, row, index) {
    let width = isIpad() ? '30%' : '40%';
    return {
        css: {
          width: width
        }
    }
}

/** ------------------
  *    Add classes / css for button column
--------------------- */
window.buttonStyle = function(value, row, index) {
    let width = isIpad() ? '40%' : '20%';
    return {
        css: {
          width: width
        }
    }
}

/** ------------------
  *    Add classes / css for button column
--------------------- */
window.isIpad = function() {
    let width = $(window).width();
    return width < 830;
}

/** ------------------
  *   Unbind dept pattern
  * @param patternId
  * @param deptId
  *
--------------------- */
window.unbindDeptPattern = function(patternId, deptId) {
    let url = 'departments/unbind_deptpattern';

    let method = "POST";

    let data = {
        id: deptId,
        pattern_id: patternId
    };

    let doneCallback = function (data, _textStatus, _jqXHR) {
        showToast($("#successUpdateDialog"), 2000, true);
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };
    runAjax(url, method, data, doneCallback, failCallback, null, false);
}

/** ------------------
  *   Bind dept pattern
  * @param patternId
  * @param deptId
  *
--------------------- */
window.bindDeptPattern = function(patternId, deptId, oldId) {
    let url = 'departments/bind_deptpattern';

    let method = "POST";

    let data = {
        id: deptId,
        pattern_id: patternId,
        company_id: $('#companyListID').find(':selected').val()
    };

    let doneCallback = function (data, _textStatus, _jqXHR) {
        showToast($("#successUpdateDialog"), 2000, true);
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
        // $("#checklist5sID" + deptId + " option[value=" + oldId + "]").attr('selected','selected');
        setTimeout(() => {
            location.reload();
        }, 200);
    };
    runAjax(url, method, data, doneCallback, failCallback, null, false);
}

/** ------------------
  *    Handle onchange pattern selection
--------------------- */
window.selectPattern = function(id) {
    let dataId = $("#checklist5sID" + id).find(":selected").val();
    let targetPatId =  $('#checklist5sID' + id).siblings().attr('data-patternId');
    let isPattern = $("#checklist5sID" + id).find(":selected").attr('data-isPattern');
    let mode = $('#companyListID').find(":selected").attr('data-mode');
    let deptId = $("#checklist5sID" + id).find(":selected").attr('data-deptId');
    let companyId = $("#checklist5sID" + id).find(":selected").attr('data-companyId');
    if (dataId == "") {
        $('#confirmDialog3').modal('show');
        $('.confirmMessage3').text($('#unBindDeptPatternMsg').val());
        $('#okBtn').attr('data-deptid', id);
        $('#okBtn').attr('data-patternid', dataId);
        isEmptyOption = true;
        return;
    }

    if (isPattern == "false") {
        $('#confirmDialog3').modal('show');
        $('.confirmMessage3').text($('#bindDeptPatternMsg').val());
        $('#okBtn').attr('data-deptid', id);
        $('#okBtn').attr('data-patternid', dataId);
        $('#okBtn').val(targetPatId);
        isExistedOption = true;
        return;
    }

    let patternFirstLoadValue = '';
    $('#checklist5sID' + id).siblings().attr('data-selectedPatternId', dataId);
    $('#checklist5sID' + id).siblings().attr('data-companyId', companyId);
    $('#checklist5sID' + id).siblings().attr('data-deptId', deptId);
    $('#checklist5sID' + id).siblings().attr('data-isPattern', isPattern);
    $("#checklist5sID" + id + " > option").each(function() {
        if (this.dataset.ispattern == 'false') {
            patternFirstLoadValue = this.value;
        }
    });
    if (checkDeptPattern == id) {
        checkPatternOnly = false;
        checkDeptPattern = '';
    }
    if (($('#userMode').val() == CONFIG.get('5S_MODE')['FREE'] && checkPatternOnly) || (mode == CONFIG.get('5S_MODE').FREE  && checkPatternOnly)) {
        $('#errorDialog').modal('show');
        $('#errorDialog .error-messages').text($('#errMessageUse1Pattern').val());
        $('#checklist5sID' + id).prop("selectedIndex", 0).change();
        $("#checklist5sID" + id).val(patternOldSelectedValue);
    } else {
        if (dataId && isPattern == "true") {
            isEmptyOption = false;
            isExistedOption = false;
            $('#confirmDialog3').modal('show');
            $('.confirmMessage3').text($('#confirmMessage').val());
            $('#okBtn').attr('data-compId', companyId);
            $('#okBtn').attr('data-deptid', id);
            $('#okBtn').attr('data-patternid', dataId);
            $('#okBtn').attr('data-isPattern', isPattern);
            $('#okBtn').val(targetPatId);
            $('#cancelBtn').attr('data-deptid-old', patternFirstLoadValue);
        }
        if (dataId && checkDeptPattern == '') {
            checkPatternOnly = true;
            checkDeptPattern = id;
        }
    }
}

/** ------------------
  *    Redirect to dept pattern edit
--------------------- */
window.openEditDeptPattern = function(id) {
    let deparmentId = $('#editPatternBtn' + id).attr("data-deptId");
    let patId = $('#editPatternBtn' + id).attr("data-patternId");
    let selectedPatId = $('#editPatternBtn' + id).attr("data-selectedPatternId");
    let compId = $('#editPatternBtn' + id).attr("data-companyId");
    let checklistId = $('#checklist5sID' + id).find(':selected').val();
    if (checklistId.length != 0) {
        window.location = '/pattern_dept_setting/' + patId + '?departmentId=' + deparmentId  + '&companyId=' + compId + '&patternId=' + selectedPatId + '&pageDept=1' + '&targetDept=' + id;
    } else {
        $('.error-messages').text($('#messageNoSelectedData').val());
        $('#errorDialog').modal('show');
    }
}

/** ------------------
  *    queryParams
--------------------- */
window.queryParams = function (params) {
    params.page = params.offset > 0 ? Math.ceil(params.offset / CONFIG.get("PAGING")) + 1 : 1;
    params.company_id = $('#companyListID').val();

    return params;
}

/*==================
 * Save team data
 ===================*/
 window.saveTeamData = function () {
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
    console.log("TCL: window.saveTeamData -> _data", _data)
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
    console.log("TCL: window.saveDataEmployee -> _data", _data)
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
            let html = '';
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
    loadCompanyList($('#companyListID'), true);
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

    $('#okBtn').on('click', function() {
        let compId = $('#okBtn').attr('data-compId');
        let deptId = $('#okBtn').attr('data-deptid');
        let patternId = $('#okBtn').attr('data-patternid');
        let isPattern = $('#okBtn').attr('data-isPattern');
        let id = $('#okBtn').val();
        if (isEmptyOption) {
            unbindDeptPattern(patternId, deptId);
        }
        else if (isExistedOption) {
            bindDeptPattern(patternId, deptId, id);
        } else {
            window.location = '/pattern_dept_setting/' + id + '?departmentId=' + deptId + '&patternId=' + patternId + '&isPattern=' + isPattern + '&compId=' + compId;
        }

    })

    $('#cancelBtn').on('click', function() {
        let deptId = $('#okBtn').attr('data-deptid');
        let oldPatternSelected = $(this).attr('data-deptid-old');
        // $('#checklist5sID' + deptId).prop("selectedIndex", 0).change();
        $("#checklist5sID" + deptId).val(oldPatternSelected);
        if (oldPatternSelected == '') {
            checkPatternOnly = false;
            checkDeptPattern = '';
        }
    })

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
        window.saveTeamData();
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

    /** ------------------
    *    Event click row on table department.
    --------------------- */
    $("#departmentTable").on("click", "tr", function (row, $el, _field) {
        patternOldSelectedValue = $(this).find('td:nth-child(3) option:selected').val();
    });
});
