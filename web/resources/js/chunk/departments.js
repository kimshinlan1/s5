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
var isFreeWarning = false;
/** ------------------
 *    Actions
 --------------------- */
window.departmentTableActions = function (_value, row, _index) {
   return (
        '<button style="margin: 4px; width: 55px;" type="button" class="btn btn-primary btn-sm" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target="#departmentEditDialog" >編集</button> ' +
        '<button style="margin: 4px; width: 55px;" type="button" class="btn btn-danger btn-sm" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target="#departmentDeleteDialog" >削除</button>'
    );
};

/** ------------------
 *    5S Checklist Actions
 --------------------- */
let pattern_list_data = null;
window.department5SChecklistActions = function (_value, row, _index) {
   let options = '<select class=" form-select px-2" id="checklist5sID' + row.id + '" onchange="selectPattern(' + row.id + ')" style="width: 65%; padding: 0; background-position: right 0.2rem center; display: inline-block;margin-inline-end: 30px;">';
   options += '<option> </option>';
   let selectedDeptPatternId = row.dept_pattern_id;
   if (row.dept_pattern_id) {
       checkPatternOnly = true;
       checkDeptPattern = row.id;
   }

   if (!pattern_list_data) {
       $.ajax({
           url: '/pattern_list/getlist_by_department/' + row.company_id,
           type: 'GET',
           async: false
       })
       .done(function (_data, _textStatus, _jqXHR) {
           pattern_list_data = _data;
       })
       .fail(function (_jqXHR, _textStatus, _errorThrown) {
           // SHOW ERRORS
           // failAjax(jqXHR, _textStatus, _errorThrown);
       });
   }

   let dataId = -1;
   let btn = '';
   pattern_list_data.forEach(ele => {
       if (!ele.isPattern && ele.id == selectedDeptPatternId) {
           options += "<option value=" + ele.id + " data-deptId=" + row.id + " data-isPattern=" + ele.isPattern + " data-companyId=" + row.company_id + " selected>" + ele.name + "</option>";
           dataId = 1;
           btn = '<button type="button" id="editPatternBtn' + row.id + '" class="btn btn-success btn-sm" style="width: 80px; font-size: 0.65rem;" data-id="'+dataId+'" data-isPattern="'+ ele.isPattern
           +'" data-companyId="'+ row.company_id +'" data-deptId="'+ row.id +'" data-patternId="'+ selectedDeptPatternId +'" data-selectedPatternId="'+ selectedDeptPatternId +'" onClick="openEditDeptPattern(' + row.id + ')">チェックリスト編集</button> ';
       } else {
           options += "<option value=" + ele.id + " data-deptId=" + row.id + " data-isPattern=" + ele.isPattern + " data-companyId=" + row.company_id + ">" + ele.name + "</option>";
       }
   });
   btn = btn ? btn : '<button type="button" id="editPatternBtn' + row.id + '" class="btn btn-success btn-sm" style="width: 80px; font-size: 0.65rem;" data-id="'+dataId+'" data-isPattern="" data-companyId="" data-deptId="" data-patternId="" data-selectedPatternId="'+ selectedDeptPatternId +'" onClick="openEditDeptPattern(' + row.id + ')">チェックリスト編集</button> ';
   options += " </select>";
   options += btn;

   return options;
};

/** ------------------
 *    Add classes / css for 5s pattern checklist column
--------------------- */
window.checkListStyle = function() {
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
window.idStyle = function() {
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
window.departmentStyle = function() {
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
window.buttonStyle = function() {
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

   let doneCallback = function (_data, _textStatus, _jqXHR) {
       showToast($("#successUpdateDialog"), 2000, true);
       setTimeout(() => {
           location.reload();
       }, 1000);
   };
   let failCallback = function (jqXHR, _textStatus, _errorThrown) {
       failAjax(jqXHR, _textStatus, _errorThrown);
       setTimeout(() => {
           location.reload();
       }, 1000);
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

   let doneCallback = function (_data, _textStatus, _jqXHR) {
       showToast($("#successUpdateDialog"), 1000, true);
       setTimeout(() => {
           location.reload();
       }, 500);
   };
   let failCallback = function (jqXHR, _textStatus, _errorThrown) {
       failAjax(jqXHR, _textStatus, _errorThrown);
       $("#checklist5sID" + deptId).val(oldId);
       setTimeout(() => {
           location.reload();
       }, 1000);
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
   mode = mode ? mode : $('#mode5S').val();
   let deptId = $("#checklist5sID" + id).find(":selected").attr('data-deptId');
   let companyId = $("#checklist5sID" + id).find(":selected").attr('data-companyId');

   $('#checklist5sID' + id).siblings().attr('data-selectedPatternId', dataId);
   $('#checklist5sID' + id).siblings().attr('data-companyId', companyId);
   $('#checklist5sID' + id).siblings().attr('data-deptId', deptId);
   $('#checklist5sID' + id).siblings().attr('data-isPattern', isPattern);

   // Unbind pattern case
   if (dataId == "") {
       $('#confirmDialog3').modal('show');
       $('.confirmMessage3').text($('#unBindDeptPatternMsg').val());
       $('#okBtn').attr('data-deptid', id);
       $('#okBtn').attr('data-patternid', dataId);
       $('#cancelBtn').attr('data-deptid-old', patternOldSelectedValue);
       isEmptyOption = true;
       return;
   }
   // Bind dept pattern case
   if ((isPattern == "false" && mode && mode != CONFIG.get('5S_MODE').FREE)
   || (isPattern == "false" && mode == CONFIG.get('5S_MODE')['FREE'] && patternOldSelectedValue != "" && checkPatternOnly)
   || (isPattern == "false" && mode == CONFIG.get('5S_MODE')['FREE'] && patternOldSelectedValue == "" && !checkPatternOnly)) {
       $('#confirmDialog3').modal('show');
       $('.confirmMessage3').text($('#bindDeptPatternMsg').val());
       $('#okBtn').attr('data-deptid', id);
       $('#okBtn').attr('data-patternid', dataId);
       $('#okBtn').val(targetPatId);
       $('#cancelBtn').attr('data-deptid-old', patternOldSelectedValue);
       isExistedOption = true;
       return;
   }

   // Free mode case
   if ((mode == CONFIG.get('5S_MODE').FREE  && checkPatternOnly && patternOldSelectedValue == "")) {
       $('#errorDialog').modal('show');
       $('#errorDialog .error-messages').text($('#errMessageUse1Pattern').val());
       $('#checklist5sID' + id).prop("selectedIndex", 0);
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
           $('#cancelBtn').attr('data-deptid-old', patternOldSelectedValue);
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
       $('.error-messages').text($('#messageNoSelectedPattern').val());
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
        if (!result['valid']) {
            $('#departmentName').addClass('is-invalid').siblings('.invalid-feedback').html(result['errors']);
        } else {
            reloadDataDepartment();
            $("#departmentEditDialog").modal("hide");
            showToast($(dialog), 2000, true);
            $("#departmentTable").bootstrapTable("refresh");
    }}).fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors
        if (jqXHR.responseJSON && jqXHR.responseJSON.errors) {
            if (jqXHR.status == 500 || jqXHR.status == 404) {
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
        checkDeptPattern = '';
        checkPatternOnly = false;
        $('#departmentTable').bootstrapTable('refresh', {url:'/departments/comp_list'});
        $('#departmentTable').on('load-success.bs.table.bs.table', function (_e, _result, _status, _jqXHR) {
            // hide loading modal
            $('.md-loading').modal('hide');
        });
        $('#departmentTable').on('load-error.bs.table.bs.table', function (_e, _status, _jqXHR) {});

        // Reset for next loop
        if (pattern_list_data) {
            pattern_list_data = null;
        }
    });

    reloadDataDepartment();

    $('body').on('click', '#okBtn', function() {
        let compId = $('#okBtn').attr('data-compId');
        let deptId = $('#okBtn').attr('data-deptid');
        let patternId = $('#okBtn').attr('data-patternid');
        let isPattern = $('#okBtn').attr('data-isPattern');
        // let id = $('#okBtn').val();
        let id = "";
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
        $('#checklist5sID' + deptId).siblings().attr('data-selectedPatternId', oldPatternSelected);
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
   
   /*----------------------------------------------
    * Save team data
    -----------------------------------------------*/
   $("#saveTeamBtn").on("click", function () {
       window.saveDataTeam();
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
               checkDeptPattern = '';
               checkPatternOnly = false;
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
   *    Event click row on table department.
   --------------------- */
   $("#departmentTable").on("click", "tr", function (row, $el, _field) {
       patternOldSelectedValue = $(this).find('td:nth-child(3) option:selected').val();
   });
});
