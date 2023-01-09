
// 改善ポイントの選択 - Select 5S methods
var selected_5s = [];
var params = {};
var select_location_to_delete = [];
var department_id = null;

// Onchange 5S methods 改善ポイントの選択
window.loadData = function() {
    let params = {
        selected_5s: JSON.stringify(selected_5s),
        id: $('#hidPatternId').val()
    };

    $.ajax({
        url: "/pattern_detail_generate_area/",
        type: "GET",
        data: params
    })
    .done(function (res) {
        $("#table-content tbody").append(res);
        if ($('#hidTotalRows')) {
            $('#countRows').html($('#hidTotalRows').val());
        }
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors

    })
    .always(function () {

    });
}

// Save
window.saveAjax = function(data) {
    // todo:
    let params = {
        data: data
    };

    $.ajax({
        url: "/pattern_dept_setting/save",
        type: "POST",
        data: params
    })
    .done(function (res) {
        // todo: notify
        showToast($('#patternSaveSuccess'), 2000, true);
        setTimeout(() => {
            location.href = "/pattern_list_customer";
        }, 200);
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors
        showToast($('#toast8'), 2000, true);
    })
    .always(function () {
    });
}

/**
 * Button back page
 */
function backPage() {
    $("#modalBackPage").modal('hide');
    location.href = "/pattern_list_customer";
}

/**
 * Button cancel back page
 */
function cancelBackPage() {
    $("#modalBackPage").modal('hide');
}

/**
 * todo: Test => Remove when release
 */
function setValueTest() {
    // Loop main area
    $("#table-content tbody input[type=text]").each(function() {

        $(this).val("test");
    });

    $("#table-content tbody textarea").each(function() {
        $(this).val("level");
    });
}

/**
 * List department list
 */
window.loadDeptList = function(id, mode = null) {
    let url = mode == 'edit' ? '/departments/getDepartment/' + id :  '/departments/list/' + id;

    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        let html = '';
            for (let e of data) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#departmentId').html(html);
            department_id = $('#departmentId').val();
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    runAjax(url, method, {}, doneCallback, failCallback, null, false);
}

/**
 * List pattern list
 */
window.loadPatternList = function(id, isPattern = null, patternId = null ) {
    let url = '/pattern_list/getlist_by_department/' + id;

    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        let html = '';
        data.forEach(function callback(e, index) {
            if (isPattern) {
                if(index != 0 && e.id == patternId ) {
                    html += '<option value="' + e.id + '" data-isPattern="' + e.isPattern + '" selected>' + e.name + '</option>';
                }
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            } else {
                html += '<option value="' + e.id + '" data-isPattern="' + e.isPattern + '">' + e.name + '</option>';
            }
        });
        $('#selectPatternIds').html(html);
        // $('#patternId').change();
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };
    runAjax(url, method, {}, doneCallback, failCallback, null, false);
}

/**
 * Add new area to table
 */
function addAreaToTable(mode = null, id = null, isPattern = null) {
    // Add Area
    let locationNo = $('#locationNo').val();
    let areaName = $('#rowArea').val();
    let url = "/pattern_dept_setting_generate_area";

    let method = "GET";

    let params = {
        new: !mode ? 1 : -1, // case add new (remove in case edit)
        selected_5s: JSON.stringify(selected_5s),
        total_rows: $("#table-content tbody").find("tr").length,
        new_location_no: locationNo,
        new_area_name: areaName,
        id: id
    };

    let doneCallback = function (data, _textStatus, _jqXHR) {
        if (mode) {
            $("#table-content tbody").empty();
            $("#table-content tbody").append(data);
        } else {
            $("#table-content tbody").append(data);
        }
    };

    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    let alwaysCallback = function () {
        $("#modalAddInspectionPoint").modal('hide');
    };

    runAjax(url, method, params, doneCallback, failCallback, alwaysCallback, false);
}

/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {
    let id = $('#userCompanyId').val();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let deptId = urlParams.get('departmentId');
    let isPattern = urlParams.get('isPattern');
    let patternId = urlParams.get('patternId');
    if (deptId) {
        loadDeptList(deptId, 'edit');
        loadPatternList(deptId, isPattern, patternId);
        $('#departmentId').prop( "disabled",true);
        $('#selectPatternIds').prop( "disabled",true);
        let patId = $('#selectPatternIds').find(':selected').val();
        addAreaToTable('edit', patId, isPattern);
    }
    else {
        if($('#userMode').val() == CONFIG.get('FREE')) {
            $('#departmentId').prop( "disabled",true);
        } else {
            $('#departmentId').prop( "disabled",false);
        }
        loadDeptList(id);
        loadPatternList(department_id);
        let patId = $('#selectPatternIds').find(':selected').val();
        let isPattern = $('#selectPatternIds').find(':selected').attr("data-isPattern");
        isPattern = isPattern == "true" ? true : false;
        addAreaToTable('edit', patId, isPattern);
    }

    configCalendarPattern();

    select5S();

    // Load data for edit
    if ($('#hidPatternId').val()) {
        loadData();
    }

    // Add New Area
    $("#openModal").click(function () {
        // todo: Check 5S (empty, ...)
        $('#rowArea').val('');
        $('#locationNo').val('');
        $('#rowArea').focus();
        if (selected_5s.length == 0) {
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('PATTERN_AT_LEAST_ONE_VERIFICATION_POINT_MUST_BE_CONFIGURED'));
            return;
        }

        $("#modalAddInspectionPoint").modal('show');
    });

    $('#patternName').keyup(function () {
        if ($('#patternName').val()) {
            $('#patternName').removeClass('is-invalid');
        }
    });

    $('#area').keyup(function () {
        if ($('#area').val()) {
            $('#area').removeClass('is-invalid');
        }
    });

    $('#location').keyup(function () {
        if ($('#location').val()) {
            $('#location').removeClass('is-invalid');
        }
    });

    // Save click
    $("#save").click(function () {
        let patternName = $('#patternName').val();
        // todo: Validate required field (pattern_name, create_date, update_date)
        if (!patternName || patternName === '') {
            showToast($('#patternNameErr'), 2000, true);
            $('#patternName').focus();
            $('#patternName').addClass('is-invalid');
            return;
        }

        validateAndGetDataTable();

    });

    // Remove click
    $("#removeLocation").click(function () {
        if (select_location_to_delete.length == 0) {
            // todo: show warning no item to delete
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('PATTERN_AT_LEAST_ONE_VERIFICATION_POINT_MUST_BE_CONFIGURED'));
            return;
        }

        $("#modalDelectLocation").modal('show');
    });

    //Back page
    $("#backPage").click(function () {
        $("#modalBackPage").modal('show');
    })
    $('#selectPatternIds').change(function() {
        let patternid = $('#selectPatternIds').find(':selected').val();
        let isPattern = $('#selectPatternIds').find(':selected').attr("data-isPattern");
        isPattern = isPattern == "true" ? true : false;
        addAreaToTable('edit', patternid, isPattern);
    });

    $('#departmentId').change(function() {
        let id = $('#departmentId').val();
        loadPatternList(id);
    });
});