/****************************************************
 * departments.js
 *
 ****************************************************/
"use strict";

/* ==============================
    Global Functions
============================== */
var checkPatternOnly = false;
var checkDeptPattern = '';
var isEmptyOption = false;
var isExistedOption = false;
var isFreeWarning = false;
/** ------------------
 *    Actions
 --------------------- */
window.departmentTableActions = function (_value, row, _index) {
   return (
        '<button style="margin: 4px; width: 55px;" type="button" class="btn navy-color-button btn-sm" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target="#departmentEditDialog" >編集</button> ' +
        '<button style="margin: 4px; width: 55px;" type="button" class="btn btn-delete btn-sm" data-id="' +
        row.id + '" data-bs-toggle="modal" data-bs-target="#departmentDeleteDialog" >削除</button>'
    );
};

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
       setTimeout(function (){
        $('#departmentName').focus();
    }, 100);
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
       setTimeout(function (){
        $('#departmentName').focus();
    }, 100);
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

   $("#departmentDeleteDialog h5.modal-title").prepend($("#titleDepartmentDialog").val());
   $("#departmentEditDialog h5.modal-title.add").prepend($("#titleDepartmentDialog").val());
   $("#departmentEditDialog h5.modal-title.edit").prepend($("#titleDepartmentDialog").val());
});
