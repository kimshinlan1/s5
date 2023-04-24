/****************************************************
 * pattern list customer.js
 *
 ****************************************************/
"use strict";

/* ==============================
    Global Variables
============================== */
let oldSelectedDept = '';

/* ==============================
    Global Functions
============================== */

/** ------------------
 *    Actions
 --------------------- */
window.patternListTableActions = function (_value, row, _index) {
    let buttons = ( $('#mode5S').val() == CONFIG.get('5S_MODE').OWNER_COMPANY
    || $('#mode5S').val() == CONFIG.get('5S_MODE').IS_CHARGE ) ?
    (
        '<button type="button" style="margin-left: 6px;" class="btn btn-primary btn-sm" data-id="' +
        row.id +
        '" onclick="redirectToEdit(' +row.id+ ',' + row.deptId +',' + row.company_id +')" id="patternListEdit">編集</button> ' +
        '<button type="button" style="margin-left: 6px;" class="btn btn-danger btn-sm" data-id="' +
        row.id +
        '" data-bs-toggle="modal" data-bs-target="#patternListDeleteDialog" data-dept-id="' + row.deptId + '">削除</button>'
    ) : ''
    return buttons;
};

/** ------------------
 *    5S Checklist Actions
 --------------------- */
 window.departmentChecklistActions = function (_value, row, _index) {
    let rowDeptId =  row['deptId'];
    // Unify each by concatenating 'departmentCheckList' with id of the row (pattern id)
    let options = '<select class=" form-select px-4" id="departmentCheckList' + row.id + '"  onchange="selectPattern(' + row.deptId + ', ' + row.id +')"  style="width: 80%; padding: 0; background-position: right 0.2rem center; display: inline-block;">';
    options += '<option> </option>';
    let url = 'departments/list/' + row['company_id'];

    let method = "GET";

    let data = {

    };

    let doneCallback = function (data, _textStatus, _jqXHR) {
        data.forEach(ele => {
            if (ele.id == rowDeptId) {
                options += "<option value=" + ele.id +" selected>" + ele.name + "</option>";
            } else {
                options += "<option value=" + ele.id +">" + ele.name + "</option>";
            }
        });
        options += " </select>";
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };
    runAjax(url, method, data, doneCallback, failCallback, null, false);

    options += " </select>";

    return options;
 };

 /** ------------------
 *    Handle onchange pattern selection
 *    @param {int} deptId - dept id of row
 *    @param {int} patternId - pattern id of row
 *
--------------------- */
window.selectPattern = function(deptId, patternId) {
    let selectDeptId = $('#departmentCheckList' + patternId).find(':selected').val();
    let isSelectBindedDept = false;

    // Check if the current dept and pattern has inspection. If true => warning
    let isContainInspection = checkContainInspection(deptId, patternId);

    $("[id*='departmentCheckList']").each(function() {
        // Loop all checkboxes except of the current one, check if the selected dept is the binded dept of other row => warning
        if ( $(this).find(':selected').val() == selectDeptId && $(this).attr('id') != 'departmentCheckList' + patternId) {
            isSelectBindedDept = true;
        }
    });
    $('#confirmDialog3').modal('show');
    if (selectDeptId == "") {
        // Select null option => Unbind confirmation
        $('#confirmDialog3').find('.confirmMessage3').html($('#unBindDeptPatternMsg').val());
    } else {
        // Select not null option => Change confirmation
        let msg = '';
        if (isSelectBindedDept) {
            msg = $('#changeBindedDeptWarningMsgId').val();
        }
        else if (isContainInspection && !isSelectBindedDept) {
            msg = $('#changeDeptWarningMsgId').val();
        } else {
            msg = $('#savePatternMsgId').val();
        }
        $('#confirmDialog3').find('.confirmMessage3').html(msg);
    }
    // Assign values to confirmation dialog
    $('#confirmDialog3').find('#cancelBtn').attr('data-beforeChangdDeptId', oldSelectedDept);
    $('#confirmDialog3').find('#okBtn').attr('data-deptid', deptId);
    $('#confirmDialog3').find('#okBtn').attr('data-patternid', patternId);
}

/** ------------------
 *    Add styles/classes to button cells
 --------------------- */
window.cellStyle = function () {
    return {
        classes: 'justify-content-around',
    }
}

/** ------------------
 *    Add styles/classes to department checklist
 --------------------- */
window.deptCheckListStyle = function () {
    return {
        css: {
            'text-align': 'center',
            'width': '450px',
        }
      }
}

/** ------------------
 *   Open Edit tab
 --------------------- */
 window.redirectToEdit = function (id, deptId, compId) {
    let url = '/pattern_dept_setting/' + id + '?1=1';
    if (deptId) {
        url += '&departmentId=' + deptId;
    }
    if (compId) {
        url += '&companyId=' + compId;
    }
    window.location = url;
}

/** ------------------`
 *    queryParams
--------------------- */
window.queryParams = function (params) {
    params.page = params.offset > 0 ? Math.ceil(params.offset / 10) + 1 : 1;
    if($('#companyListID').length) {
        params.company_id = $("#companyListID").find(":selected").val();
    } else {
        params.company_id = $('#hidLoginCompanyId').val();
    }
    return params;
};


/* ==============================
    Document Ready
==============================*/
$(function () {
    // Setting company list
    if($('#companyListID').length) {
        $.ajax({
            type: "GET",
            url: "/company/list",
            success: function (res) {
                let html = "";
                if (res.currentCompany.mode == 0) {
                    for (let e of res.rows) {
                        html +=
                            '<option value="' + e.id + '">' + e.name + "</option>";
                    }
                } else {
                    html +=
                        '<option value="' +
                        res.currentCompany.id +
                        '" hidden>' +
                        res.currentCompany.name +
                        "</option>";
                }
                $("#companyListID").html(html);
                $("#companyListID").change();
            },
        });
    }

    // Setting datatable
    $("#patternListTable").bootstrapTable({
        pagination: "true",
        paginationParts: "['pageList']",
        sidePagination: "server",
        uniqueId: "id",
        escape: "true",
        queryParams: "queryParams",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $("#patternListTable"));
        },
    });

    // Load data after config datatable (get queryParams)
    setTimeout(() => {
        if ($('#hidLoginCompanyId').val() || $("#companyListID").length) {
            $("#patternListTable").bootstrapTable("refresh", {
                url: "/pattern_list/patern_list_by_company",
            });
        }
    }, 100);

    if ($("#errorDialog .modal-body .error-messages").length) {
        $("#errorDialog .modal-body .error-messages").html("");
    }

    // Handle change company option
    $("#companyListID").on("change", function () {
        $("#patternListTable").bootstrapTable("refresh", {
            url: "/pattern_list/patern_list_by_company",
        });
        $("#patternListTable").on(
            "load-success.bs.table.bs.table",
            function (_e, _result, _status, _jqXHR) {
                // hide loading modal
                $(".md-loading").modal("hide");
            }
        );
        $("#patternListTable").on(
            "load-error.bs.table.bs.table",
            function (_e, _status, _jqXHR) {}
        );
    });
    $('#confirmDialog3').on("show.bs.modal", function (e) {
       let $button = $(e.relatedTarget);
       let id = $button.data("id");
       let rowData = $("#departmentTable").bootstrapTable("getRowByUniqueId", id);
       $("#employeeDepartmentId").val(rowData.id);
       $("#employeeName").val('');
       $("#employeeEmail").val('');
   });

   // Click cancel button on confirmation dialog
    $('#confirmDialog3').find('#cancelBtn').on('click', function() {
        let beforeChangdDeptId = $('#confirmDialog3').find('#cancelBtn').attr('data-beforeChangdDeptId');
        let rowPatternId = $('#confirmDialog3').find('#okBtn').attr('data-patternid');
        $('#departmentCheckList' + rowPatternId).val(beforeChangdDeptId);
    })

   // Click ok button on confirmation dialog
    $('#confirmDialog3').find('#okBtn').on('click', function() {
        let beforeChangdDeptId = $('#confirmDialog3').find('#cancelBtn').attr('data-beforeChangdDeptId');
        let patternId = $('#confirmDialog3').find('#okBtn').attr('data-patternid');
        let selectedDept = $('#departmentCheckList' + patternId).find(':selected').val();
        if (!selectedDept) {
            unbindDeptPattern(patternId, beforeChangdDeptId);
        } else {
            bindDeptPattern(patternId, selectedDept, beforeChangdDeptId);
        }
    })
    /** ------------------
   *   Delete dialog show
   --------------------- */
    $("#patternListDeleteDialog").on("show.bs.modal", function (e) {
        let $button = $(e.relatedTarget);
        let deptId = $button.data("dept-id");
        let patternId = $button.data("id");
        let isContainInspection = checkContainInspection(deptId, patternId);
        if (isContainInspection && deptId) {
            showDialogDelete('#patternListTable', '#deletePatternListId', '#patternListDeleteDialog', e, $('#deletePatternWarningMsg').val());
            return;
        }
        showDialogDelete('#patternListTable', '#deletePatternListId', '#patternListDeleteDialog', e);
    });

    /** ------------------
    *    Delete
    --------------------- */
    $("#deletePatternListBtn").on("click", function () {
        showLoading();
        let id = $("#deletePatternListId").val();
        let urlConfig = "/pattern_list/delete_pattern/" + id + "?pageDest=" + CONFIG.get("PAGE_PATTERN_LIST_CUSTOMER");
        deleteAjax(urlConfig);
    });

    // Handle click on row event
    $('#patternListTable').on('click-cell.bs.table', function (_field, value, row, $el) {
        // Redirect to 5S pattern preview page
        if (row && value != 'deptName') {
            window.location = '/pattern_preview/' + $el.id + '?departmentId=' + $el.deptId + '&companyId=' + $el.company_id + "&pageDest=" + CONFIG.get("PAGE_PATTERN_LIST_CUSTOMER");
        }
    })
    $('#patternListAdd').on('click', function() {
        window.location = '/pattern_dept_setting';
    });

    /** ------------------
     *    Event click row on table department.
     --------------------- */
    $("#patternListTable").on("click", "tr", function (row, $el, _field) {
        oldSelectedDept = $(this).find('td:nth-child(4) option:selected').val();
    });
    // Add free user label
    addFreeModeText();
});
