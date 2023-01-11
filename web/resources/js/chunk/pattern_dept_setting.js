
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

window.saveAjax = function(data, patId=null, ispattern=null) {
    let url = patId ? "/pattern_dept_setting/freeUserSave" : "/pattern_dept_setting/save";
    let method = "POST";
    let name = $('#patternName').val();
    let compId = $('#userCompanyId').val();
    let freeData = {
        pattern_id: patId,
        name: name,
        ispattern: ispattern ? ispattern : -1,
        department_id: $('#departmentId').find(':selected').val(),
        company_id: compId,
    }
    let params = patId ? freeData : {data: data} ;

    let doneCallback = function (data, _textStatus, _jqXHR) {
        showToast($('#patternSaveSuccess'), 2000, true);
        setTimeout(() => {
            location.href = "/pattern_list_customer";
        }, 200);
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        showToast($('#toast8'), 2000, true);
    };
    runAjax(url, method, params, doneCallback, failCallback, null, true);
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
            $('#departmentId').change();
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
        $('#selectPatternIds').change();
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };
    runAjax(url, method, {}, doneCallback, failCallback, null, false);
}

/**
 * Load Company
 */
window.loadCompany = function(id) {
    let url = '/company/get_companies';

    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        let html = '';
        data.forEach(function callback(e, index) {
                if(e.id == id) {
                    html += '<option value="' + e.id + '" selected>' + e.name + '</option>';
                } else {
                    html += '<option value="' + e.id + '">' + e.name + '</option>';
                }

        });
        $('#companyOptionId').html(html);
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
    let url = !isPattern ? "/pattern_dept_setting_generate_area" : "/pattern_detail_generate_area";

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

    if (id == $('#kaizenbaseID').val()) {
        loadCompany(id);
    }
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
        $('#companyOptionId').prop( "disabled",true);
        let patId = $('#selectPatternIds').find(':selected').val();
        if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
            loadDataPreview();
        } else {
            addAreaToTable('edit', patId, isPattern);
        }
    }
    else {
        if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
            $('#departmentId').prop( "disabled",true);
            $('#companyOptionId').prop( "disabled",true);
        } else {
            $('#departmentId').prop( "disabled",false);
            $('#selectPatternIds').prop( "disabled",false);
            $('#companyOptionId').prop( "disabled",false);
        }
        loadDeptList(id);
        let department_id = $('#departmentId').find(':selected').val();
        loadPatternList(department_id);
        let patId = $('#selectPatternIds').find(':selected').val();
        let isPattern = $('#selectPatternIds').find(':selected').attr("data-isPattern");
        isPattern = isPattern == "true" ? true : false;
        if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
            loadDataPreview();
        } else {
            addAreaToTable('edit', patId, isPattern);
        }
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

        if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
            let patId = $('#selectPatternIds').val();
            let ispattern = $('#selectPatternIds').find(':selected').data('ispattern');
            saveAjax(null, patId, ispattern);
        } else {
            validateAndGetDataTable();
        }

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

    // Department options change event
    $('#departmentId').change(function() {
        let id = $('#departmentId').val();
        loadPatternList(id);
    });

    // Company options change event
    $('#companyOptionId').change(function() {
        let compID = $("#companyOptionId").find(":selected").val();
        loadDeptList(compID);
    });
});