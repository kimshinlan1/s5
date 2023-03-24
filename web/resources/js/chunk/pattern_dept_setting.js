
// 改善ポイントの選択 - Select 5S methods
var params = {};
var previousDeptId = -1;
var initDeptId = -1;
var changeDeptCase = 0;
var select_location_to_delete = [];
var initAreaArray = [];
var count_method_delete = 0;
var department_id = null;
var loginCompid = null;
var checkDataWhenAddingFirsTime = false;
var checkDataWhenRemovingFirsTime = false;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// Onchange 5S methods 改善ポイントの選択
window.loadData = function() {
    let data = {
        selected_5s: JSON.stringify(selected_5s),
        id: $('#hidPatternId').val()
    };

    $.ajax({
        url: "/pattern_detail_generate_area/",
        type: "GET",
        data: data,
        async: false
    })
    .done(function (res) {
        $("#table-content tbody").append(res);
        if ($('#hidTotalRows')) {
            $('#countRows').html($('#hidTotalRows').val());
        }
    })
    .fail(function (_jqXHR, _textStatus, _errorThrown) {
        // show errors

    })
    .always(function () {

    });
}

// Save

window.saveAjax = function(data, patId=null, ispattern=null, isFree = false) { //todo
    let url = isFree ? "/pattern_dept_setting/freeUserSave" : "/pattern_dept_setting/save";
    let method = "POST";
    let name = $('#patternName').val();
    let note = $('#patternNote').val();
    let compId = $('#userCompanyId').val() == $('#kaizenbaseID').val() ? $('#companyOptionId').find(':selected').val() : $('#userCompanyId').val();
    let currentDeptId = $("#departmentId").find(":selected").val();
    changeDeptCase = currentDeptId ? 2 : 1;
    let freeData = {
        pattern_id: patId,
        name: name,
        note: note,
        ispattern: ispattern ? ispattern : -1,
        department_id: $('#departmentId').find(':selected').val(),
        company_id: compId,
        pattern_5s_selected: JSON.stringify(selected_5s),
        pattern_created_at: dateFormat($('#dateCreate').datepicker("getDate")),
        pattern_updated_at: dateFormat($('#dateUpdate').datepicker("getDate")),
        changeDeptCase: changeDeptCase,
        initDeptId: initDeptId
    }
    if (data) {
        data['initAreaArray'] = initAreaArray;
        data['changeDeptCase'] = changeDeptCase;
        data['initDeptId'] = initDeptId;
        data['info']['pattern_note'] = $('#patternNote').val();
    }
    let paramDatas = isFree ? freeData : {data: data} ;
    let pageDept = urlParams.get('pageDept');
    let doneCallback = function (_data, _textStatus, _jqXHR) {
        showToast($('#patternSaveSuccess'), 2000, true);
        if (pageDept) {
            setTimeout(() => {
                location.href = '/departments';
            }, 200);
        } else {
            setTimeout(() => {
                location.href = '/pattern_list_customer';
            }, 200);
        }
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
        let msgJson = JSON.parse(jqXHR.responseText);
        if (jqXHR.status == 422) {
            $('#patternName').addClass("is-invalid");
            $('.invalid-feedback').text(msgJson.message);
        }
    };
    runAjax(url, method, paramDatas, doneCallback, failCallback, null, true);
}

/**
 * Button cancel back page
 */
function cancelBackPage() {
    $("#modalBackPage").modal('hide');
}

/**
 * Remove when release
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
window.loadDeptList = function(id, patternId = null, isPattern = null) {
    let url = '/departments/list/' + id;
    let method = "GET";
    let doneCallback = function (data, _textStatus, _jqXHR) {
        let html = '';
        let deptId = urlParams.get('departmentId');
        let companyId = urlParams.get('companyId');
        if (patternId && companyId) {
            if (!deptId) {
                html += '<option value="' + '" selected>' + '</option>';
            } else {
                html += '<option value="' + '">' + '</option>';
            }
        }
        for (let e of data) {
            let dept_pattern_id = e.dept_pattern_id == null ? '-1' : e.dept_pattern_id
            if (e.id == patternId && deptId) {
                html += '<option value="' + e.id + '" data-deptPatternId="' + dept_pattern_id + '" selected>' + e.name + '</option>';
            } else {
                html += '<option value="' + e.id + '" data-deptPatternId="' + dept_pattern_id + '" >' + e.name + '</option>';
            }
        }

        $('#departmentId').html(html);
        let selectedCompId = getCompanyId();
        loadPatternList(selectedCompId, patternId, isPattern);
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
window.loadPatternList = function(id, patternId = null, isPattern = null) {
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
            let checkNoteNull = e.note?? '';
            if(e.id == patternId && e.isPattern == isPattern) {
                html += '<option value="' + e.id + '" data-isPattern="' + e.isPattern + '" data-note="' + checkNoteNull + '" selected>' + e.name + '</option>';
                $('#patternNote').val(e.note);
            }
            else {
                html += '<option value="' + e.id + '" data-isPattern="' + e.isPattern + '" data-note="' + checkNoteNull + '">' + e.name + '</option>';
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
        data.forEach(function callback(e, _index) {
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
function addAreaToTable(mode = null, id = null, isPattern = null, isInitEdit = null) {
    // Add Area
    let locationNo = $('#locationNo').val();
    let areaName = $('#rowArea').val();
    let url = !isPattern ? "/pattern_dept_setting_generate_area" : "/pattern_detail_generate_area";

    let method = "GET";

    let paramDatas = {
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
        if (isInitEdit) {
            getInitialAreaData();
        }
    };

    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    let alwaysCallback = function () {
        $("#modalAddInspectionPoint").modal('hide');
    };

    runAjax(url, method, paramDatas, doneCallback, failCallback, alwaysCallback, false);
}

window.getInitialAreaData = function() {
    // Loop main area
    $("#table-content tbody").find("tr.main_area").each(function() {
        // New Area
        // get area name
        let areaName = $(this).find("#area").val();
        let areaId = $(this).find('#hidAreaId').val();
        // if area is empty
        if (areaName.trim().length === 0) {
            valid = false;
            $(this).find("#area").addClass('is-invalid');
        } else {
            $(this).find("#area").removeClass('is-invalid');
        }
        let area = {
            'area_id': areaId,
            'area_name': areaName,
            'locations': [],
            'old_locations': []
        };

        // Loop all locations
        let trid = $(this).attr("id").split('_location_')[0];
        $('[id*='+trid+']').filter('.main_location').each(function(_i, ele) {
            // New location
            // get location name on each row
            let locName = $(ele).find("#location").val();
            let locationId = $(ele).find('#hidLocationId').val();
            // if location is empty
            if (locName.trim().length === 0) {
                valid = false;
                $(ele).find("#location").addClass('is-invalid');
            } else {
                $(ele).find("#location").removeClass('is-invalid');
            }
            let location = {
                'location_id': locationId,
                'location_name': locName,
                'rows':{}
            };
            // Loop all rows in location
            let trid_location = $(ele).attr("id").split('_row_')[0];
            $('[id*='+trid_location+']').each(function(_index, e) {
                // Case Valid
                // Add levels in 1 methos 5S (1 row)
                let row = {};
                for (let cnt = 1; cnt <= maxCnt5s; cnt++) {
                    let levelName = $(e).find("#level_"  + cnt).val();

                    // if level is empty
                    if (levelName.trim().length === 0) {
                        row["level_" + cnt] = "";
                    } else {
                        row["level_" + cnt] = levelName;
                    }
                }
                location['rows'][$(e).find("#hid5S").val()] = row;
            });
            area['locations'].push(location);
        });
        initAreaArray.push(area);
        initDeptId = $('#departmentId').find(":selected").val();
    });
}

window.initLoadPage = function() {
    if (loginCompid == $('#kaizenbaseID').val()) {
        loadCompany(loginCompid);
    }
    let hidPatternId = $('#hidPatternId').val()
    let deptId = urlParams.get('departmentId');
    let pageDept = urlParams.get('pageDept');
    let targetDept = urlParams.get('targetDept');
    let compId = urlParams.get('compId');
    let selectedPatId = urlParams.get('patternId');
    let isPatternSelection = urlParams.get('isPattern');
    isPatternSelection = !isPatternSelection ? false : true;
    let companyId = urlParams.get('companyId');
    if (isPatternSelection) {
        $('#patternName').val('');
        $('#patternNote').val('');
    }
    if (companyId) {
        $('#companyOptionId option[value='+companyId+']').prop("selected", true);
    }
    let selectedCompId = loginCompid == $('#kaizenbaseID').val() ? $('#companyOptionId').find(':selected').val() : $('#userCompanyId').val();

    // Edit mode
    if (hidPatternId) {
        let ispattern = $('#selectPatternIds').find(':selected').attr("data-isPattern");
        ispattern = ispattern == "true" ? true : false;
        // set seleted value for company
        selectedCompId = compId ? compId : selectedCompId;
        loadDeptList(selectedCompId, hidPatternId);

        $('#departmentId  option[value=' + deptId + ']').attr('selected','selected');

        if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
            $('#selectPatternIds  option[value=' + selectedPatId + ']').filter("[data-ispattern=" + isPatternSelection + "]").attr('selected','selected');
            let isPattern = $('#selectPatternIds').find(':selected').attr("data-isPattern");
            isPattern = isPattern == "true" ? true : false;
            let isDept = isPattern ? null : 1;
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
                addAreaToTable('edit', hidPatternId, ispattern, true);
            }
        }
        if (pageDept) {
            $('#departmentId  option[value=' + targetDept + ']').attr('selected','selected');
        }
        $('#companyOptionId').prop( "disabled",true);
        $('#departmentId').prop( "disabled",false);
        $('#selectPatternIds').prop( "disabled",true);

    }
    // Add new mode
    else {
        if (compId) {
            loadDeptList(compId, selectedPatId, true);
            $('#companyOptionId  option[value=' + compId + ']').attr('selected','selected');
            $('#departmentId  option[value=' + deptId + ']').attr('selected','selected');
        } else {
            loadDeptList(selectedCompId);
        }
        let patId = $('#selectPatternIds').find(':selected').val();
        if (!patId) {
            $("#modalErrInitPage").modal("show");
        }
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

// Error message when init page has no original pattern
window.btnErrInitPage = function() {
    $('#modalErrInitPage').modal("hide");
    if (loginCompid == $('#kaizenbaseID').val()) {
        location.href = "/pattern_detail";
    } else {
        location.href = "/pattern_top_page";
    }
}

// Check if the data has been used for inspection
window.checkDataUsed = function() {
    let deptId = urlParams.get('departmentId');
    if (!deptId) {
        return;
    } else {
        let url = '/pattern_dept_setting_check_data_used/' + deptId;
        let method = "GET";
        let doneCallback = function (data, _textStatus, _jqXHR) {
            if (data.isCheckData.length > 0) {
                checkDataWhenAddingFirsTime = true;
                checkDataWhenRemovingFirsTime = true;
            }
        };
        let failCallback = function (jqXHR, _textStatus, _errorThrown) {
            failAjax(jqXHR, _textStatus, _errorThrown);
        };
        runAjax(url, method, {}, doneCallback, failCallback, null, false);
    }
}

// Confirm the cancellation of data changes when adding a new area
window.confirmNotAddNewData = function() {
    $("#modalCheckDataUsed1").modal('hide');
}

// Confirm data change when adding new area
window.confirmAddNewData = function() {
    checkDataWhenAddingFirsTime = false;
    $("#modalCheckDataUsed1").modal('hide');
    $("#modalAddInspectionPoint").modal('show');
}

// Confirm the cancellation of data changes when removing data
window.confirmNotRemoveData = function() {
    $("#modalCheckDataUsed2").modal('hide');
}

// Confirm data change when removing data
window.confirmRemoveData = function() {
    checkDataWhenRemovingFirsTime = false;
    $("#modalCheckDataUsed2").modal('hide');
    removeLocation();
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

    checkDataUsed();

    // Add New Area
    $("#openModal").click(function () {
        // Check 5S (empty, ...)
        $('#rowArea').val('');
        $('#locationNo').val('');
        $('#rowArea').focus();
        if (selected_5s.length == 0) {
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('PATTERN_AT_LEAST_ONE_VERIFICATION_POINT_MUST_BE_CONFIGURED'));
            return;
        }

        if (checkDataWhenAddingFirsTime) {
            $("#modalCheckDataUsed1").modal('show');
        } else {
            $("#modalAddInspectionPoint").modal('show');
        }
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
        if (checkDataWhenRemovingFirsTime) {
            $("#modalCheckDataUsed2").modal('show');
        } else {
            $("#modalDelectLocation").modal('show');
        }
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

    // Department options change event //todo
    $('#departmentId').on('focus', function () {
        // Store the current value on focus and on change
        previousDeptId = this.value;
    }).change(function() {
        let deptPatternId = $("#departmentId").find(":selected").attr('data-deptpatternid');
        if (deptPatternId && deptPatternId != '-1') {
            $("#confirmDialog3").modal("show");
            $(".confirmMessage3").html($('#changeDeptWarningMsgId').val());
        }
    });

    // Company options change event
    $('#companyOptionId').change(function() {
        let compID = $("#companyOptionId").find(":selected").val();
        loadDeptList(compID);
    });

    $("#confirmDialog3").find('#okBtn').click(function() {
        // Replace department
        changeDeptCase = 2;
    });

    $("#confirmDialog3").find('#cancelBtn').click(function() {
        // Replace department
        $("#departmentId").val(previousDeptId);
    });
});
