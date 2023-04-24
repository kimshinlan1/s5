/****************************************************
 * pattern_department.js
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
window.isIpad = function() {
   let width = $(window).width();
   return width < 830;
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
   let tableOptions =  $("#patternDepartmentTable").bootstrapTable('getOptions');
   return ((tableOptions.pageNumber - 1) * tableOptions.pageSize) + (1 + index);
}

/** ------------------
*    Reload Data Department
--------------------- */
window.reloadDataDepartment = function () {
   $.ajax({
       type: 'GET',
       url: '/pattern_departments/list',
       success: function (res) {
           let html = '';

           for (let e of res.rows) {
               html += '<option value="' + e.id + '">' + e.name + '</option>';
           }
           $('#employeeDepartmentId').html(html);
       }
   });
}

/* ==============================
    jQuery
==============================*/
$(function () {
    loadCompanyList($('#companyListID'), true);
    $("#patternDepartmentTable").bootstrapTable({
        pagination: "true",
        paginationParts: "['pageList']",
        sidePagination: "server",
        uniqueId: "id",
        escape: "true",
        queryParams:"queryParams",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $("#patternDepartmentTable"));
        },
    });

    if ($("#errorDialog .modal-body .error-messages").length) {
        $("#errorDialog .modal-body .error-messages").html("");
    }

    $('#companyListID').on('change',function () {
        checkDeptPattern = '';
        checkPatternOnly = false;
        $('#patternDepartmentTable').bootstrapTable('refresh', {url:'/pattern_departments/comp_list'});
        $('#patternDepartmentTable').on('load-success.bs.table.bs.table', function (_e, _result, _status, _jqXHR) {
            // hide loading modal
            $('.md-loading').modal('hide');
        });
        $('#patternDepartmentTable').on('load-error.bs.table.bs.table', function (_e, _status, _jqXHR) {});

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
   *    Event click row on table department.
   --------------------- */
   $("#patternDepartmentTable").on("click", "tr", function (row, $el, _field) {
       patternOldSelectedValue = $(this).find('td:nth-child(2) option:selected').val();
   });
});
