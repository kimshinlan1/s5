
// 改善ポイントの選択 - Select 5S methods
var selected_5s = [];
var params = {};
var select_location_to_delete = [];
var count_method_delete = 0;
var department_id = null;
var loginCompid = null;
// Onchange 5S methods 改善ポイントの選択
window.loadData = function() {
    let params = {
        selected_5s: JSON.stringify(selected_5s),
        id: $('#hidPatternId').val()
    };

    $.ajax({
        url: "/pattern_detail_generate_area/",
        type: "GET",
        data: params,
        async: false
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

window.saveAjax = function(data, patId=null, ispattern=null, isFree = false) {
    let url = isFree ? "/pattern_dept_setting/freeUserSave" : "/pattern_dept_setting/save";
    let method = "POST";
    let name = $('#patternName').val();
    let compId = $('#userCompanyId').val() == $('#kaizenbaseID').val() ? $('#companyOptionId').find(':selected').val() : $('#userCompanyId').val();
    let freeData = {
        pattern_id: patId,
        name: name,
        ispattern: ispattern ? ispattern : -1,
        department_id: $('#departmentId').find(':selected').val(),
        company_id: compId,
    }
    let params = isFree ? freeData : {data: data} ;

    let doneCallback = function (data, _textStatus, _jqXHR) {
        showToast($('#patternSaveSuccess'), 2000, true);
        setTimeout(() => {
            if (isFree) {
                location.replace(document.referrer);

            } else {
                location.replace(document.referrer);
            }
        }, 200);
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        showToast($('#toast8'), 2000, true);
        let msgJson = JSON.parse(jqXHR.responseText);
        if (jqXHR.status == 422) {
            $('#patternName').addClass("is-invalid");
            $('.invalid-feedback').text(msgJson.message);
        }
    };
    runAjax(url, method, params, doneCallback, failCallback, null, true);
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
window.loadDeptList = function(id) {
    let url = '/departments/list/' + id;

    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        let html = '';
            for (let e of data) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#departmentId').html(html);
            let selectedCompId = getCompanyId();
            loadPatternList(selectedCompId);
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    runAjax(url, method, {}, doneCallback, failCallback, null, false);
}

/**
 * List pattern list
 * @param id company id
 * @param patternId dept pattern id
 */
var pattern_list_data = null;
window.loadPatternList = function(id, patternId = null, isPattern = null ) {

    // Check existed data
    if (pattern_list_data) {
        return;
    }

    let url = '/pattern_list/getlist_by_department/' + id;
    let method = "GET";
    isPattern = isPattern ? true : false;

    let doneCallback = function (data, _textStatus, _jqXHR) {
        pattern_list_data = data;

        let html = '';
        data.forEach(function callback(e, index) {
            if (patternId == null && index == 0) {
                $('#patternNote').val(e.note);
            }

            if(e.id == patternId && e.isPattern == isPattern) {
                html += '<option value="' + e.id + '" data-isPattern="' + e.isPattern + '" data-note="' + e.note + '" selected>' + e.name + '</option>';
                $('#patternNote').val(e.note);
            }
            else {
                html += '<option value="' + e.id + '" data-isPattern="' + e.isPattern + '" data-note="' + e.note + '">' + e.name + '</option>';
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
                    html += '<option value="' + e.id + '" data-mode5s="'+ e.mode_5s+ '" selected>' + e.name + '</option>';
                } else {
                    html += '<option value="' + e.id + '" data-mode5s="'+ e.mode_5s+ '">' + e.name + '</option>';
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
 * check if free account has a dept pattern or not
 */
window.checkDeptPatternExist = function(id) {
    let url = '/pattern_list/check_pattern_exist/' + id;

    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        console.log("TCL: doneCallback -> data", data)
        if (data.isExisted) {
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html($('#errMessageUse1Pattern').val());
        }
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

window.initLoadPage = function() {
    if (loginCompid == $('#kaizenbaseID').val()) {
        loadCompany(loginCompid);
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let hidPatternId = $('#hidPatternId').val()
    let deptId = urlParams.get('departmentId');
    let pageDept = urlParams.get('pageDept');
    let targetDept = urlParams.get('targetDept');
    let compId = urlParams.get('compId');
    let selectedPatId = urlParams.get('patternId');
    let isPatternSelection = urlParams.get('isPattern');
    isPatternSelection = !isPatternSelection ? false : true;
    let companyId = urlParams.get('companyId');
    if (companyId) {
        $('#companyOptionId option[value='+companyId+']').prop("selected", true);
    }
    // let patternId = urlParams.get('patternId');
    let selectedCompId = loginCompid == $('#kaizenbaseID').val() ? $('#companyOptionId').find(':selected').val() : $('#userCompanyId').val();
    // Edit mode
    if (hidPatternId) {
        let ispattern = $('#selectPatternIds').find(':selected').attr("data-isPattern");
        ispattern = ispattern == "true" ? true : false;
        // set seleted value for company
        selectedCompId = compId ? compId : selectedCompId;
        loadDeptList(selectedCompId);
        loadPatternList(selectedCompId, hidPatternId);
        $('#departmentId  option[value=' + deptId + ']').attr('selected','selected');
        if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
            $('#selectPatternIds  option[value=' + selectedPatId + ']').filter("[data-ispattern=" + isPatternSelection + "]").attr('selected','selected');
            let ispattern = $('#selectPatternIds').find(':selected').attr("data-isPattern");
            ispattern = ispattern == "true" ? true : false;
            let isDept = ispattern ? null : 1;
            if (selectedPatId) {
                loadDataPreview(isDept, selectedPatId);
                $('#companyOptionId  option[value=' + compId + ']').attr('selected','selected');
                $('#departmentId  option[value=' + deptId + ']').attr('selected','selected');
            } else {
                loadDataPreview(isDept, hidPatternId);
            }
        } else {
            if (selectedPatId) {
                addAreaToTable('edit', selectedPatId, isPatternSelection);
                $('#companyOptionId  option[value=' + compId + ']').attr('selected','selected');
                $('#departmentId  option[value=' + deptId + ']').attr('selected','selected');
                $('#selectPatternIds  option[value=' + selectedPatId + ']').filter("[data-ispattern=" + isPatternSelection + "]").attr('selected','selected');
            } else {
                addAreaToTable('edit', hidPatternId, ispattern);
            }
        }
        if (pageDept) {
            $('#departmentId  option[value=' + targetDept + ']').attr('selected','selected');
        }
        $('#companyOptionId').prop( "disabled",true);
        $('#departmentId').prop( "disabled",true);
        $('#selectPatternIds').prop( "disabled",true);

    }
    // Add new mode
    else {
        if (compId) {
            loadDeptList(compId);
            loadPatternList(compId, selectedPatId, true);
            $('#companyOptionId  option[value=' + compId + ']').attr('selected','selected');
            $('#departmentId  option[value=' + deptId + ']').attr('selected','selected');
        } else {
            loadDeptList(loginCompid);
            loadPatternList(selectedCompId);
        }
        let patId = $('#selectPatternIds').find(':selected').val();
        let ispattern = $('#selectPatternIds').find(':selected').attr("data-isPattern");
        ispattern = ispattern == "true" ? true : false;
        let pageDest = ispattern ? null : 1;
        if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
            loadDataPreview(pageDest, patId);
        } else {
            addAreaToTable('edit', patId, ispattern);
        }
    }
}
/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {
    loginCompid = $('#userCompanyId').val();

    if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
        checkDeptPatternExist(loginCompid);
    }

    initLoadPage();

    configCalendarPattern();

    select5S();

    // Load data for edit
    if ($('#hidPatternId').val()) {
        // loadData();
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
        if (!patternName || patternName === '') {
            showToast($('#patternNameErr'), 2000, true);
            $('#patternName').focus();
            $('#patternName').addClass('is-invalid');
            return;
        }
        // Check if selected company option is the 5s-free one
        let isSelectedFree = $('#companyOptionId').find(':selected').data('mode5s') == CONFIG.get('5S_MODE').FREE ? true : false;
        if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
            let patId = $('#selectPatternIds').val();
            let ispattern = $('#selectPatternIds').find(':selected').data('ispattern');
            saveAjax(null, patId, ispattern, true);
        } else {
            validateAndGetDataTable(isSelectedFree);
        }

    });

    // Remove click
    $("#removeLocation").click(function () {
        checkNoSelected();
    });

    // Back page
    // $("#backPage").click(function () {
    //     $("#modalBackPage").modal('show');
    // })
    $('#selectPatternIds').change(function() {
        let patternid = $('#selectPatternIds').find(':selected').val();
        let isPattern = $('#selectPatternIds').find(':selected').attr("data-isPattern");
        let note = $('#selectPatternIds').find(':selected').attr("data-note");
        $('#patternNote').val(note);
        isPattern = isPattern == "true" ? true : false;
        let pageDest = isPattern ? null : 1;
        if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
            loadDataPreview(pageDest, patternid);
        } else {
            addAreaToTable('edit', patternid, isPattern);
        }
    });

    // Company options change event
    $('#companyOptionId').change(function() {
        let compID = $("#companyOptionId").find(":selected").val();
        loadDeptList(compID);
    });
});
