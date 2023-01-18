
// 改善ポイントの選択 - Select 5S methods
var selected_5s = [];
var select_location_to_delete = [];
var params = {};

// Load DB
window.loadData = function() {
    showLoading();

    let params = {
        selected_5s: JSON.stringify(selected_5s),
        id: $('#hidPatternId').val()
    };

    let url = "/pattern_detail_generate_area";
    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        $("#table-content tbody").append(data);
        if ($('#hidTotalRows')) {
            $('#countRows').html($('#hidTotalRows').val());
        }
    };

    runAjax(url, method, params, doneCallback);
}

// Save pattern
window.saveAjax = function(data) {
    let params = {
        data: data
    };
    let url = "/pattern_save";
    let method = "POST";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        // Notify
        showToast($('#patternSaveSuccess'), 2000, true);
        setTimeout(() => {
            location.href = "/pattern_list";
        },500);
    };

    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        // show errors
        let err = jqXHR.errors ? jqXHR.errors : JSON.parse(jqXHR.responseText).errors;
        if (err) {
            handleSystemError(null, err);
        }
    };

    runAjax(url, method, params, doneCallback, failCallback);
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

/**
 * Button back page
 */
function backPage() {
    $("#modalBackPage").modal('hide');
    location.href = "/pattern_list";
}

/**
 * Button cancel back page
 */
function cancelBackPage() {
    $("#modalBackPage").modal('hide');
}

/**
 * Add new area to table
 */
function addAreaToTable() {
    let locationNo = $('#locationNo').val();
    let areaName = $('#rowArea').val();
    let params = {
        new: 1, // case add new (remove in case edit)
        selected_5s: JSON.stringify(selected_5s),
        total_rows: $("#table-content tbody").find("tr").length,
        new_location_no: locationNo,
        new_area_name: areaName
    };

    let url = "/pattern_detail_generate_area";
    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        $("#table-content tbody").append(data);
    };

    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    let alwaysCallback = function () {
        $("#modalAddInspectionPoint").modal('hide');
    };

    runAjax(url, method, params, doneCallback, failCallback, alwaysCallback);
}

/**
 * Test => Remove when release
 */
function setValueTest() {
    // Loop main area
    $("#table-content tbody input[type=text]").each(function() {

        $(this).val("通路周辺");
    });

    $("#table-content tbody textarea").each(function() {
        $(this).val("ｳｴｯｸｽ、手袋等が放置されている");
    });
}

/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {
    // Trigger init page

    configCalendarPattern();

    select5S();

    // Load data for edit
    if ($('#hidPatternId').val()) {
        loadData();
    }

    // Add New Area
    $("#openModal").click(function () {
      	$('#rowArea').val('');
        $('#locationNo').val('');
        $('#rowArea').focus();
        // Check 5S (empty, ...)
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
        if ($("#table-content tbody").find("tr.main_area").length === 0) {
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('PATTERN_AT_LEAST_ONE_VERIFICATION_POINT_MUST_BE_CONFIGURED'));
            return;
        }

        let patternName = $('#patternName').val().trim();
        // Validate required field pattern_name
        if (!patternName || patternName === '') {
            $('#patternName').focus();
            $('#patternName').addClass('is-invalid');
            return;
        }
        validateAndGetDataTable();
    });

    // Remove click
    $("#removeLocation").click(function () {
        if (select_location_to_delete.length == 0) {
            //Show warning no item to delete
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('PATTERN_AT_LEAST_ONE_VERIFICATION_POINT_MUST_BE_CONFIGURED'));
            return;
        }
        $("#modalDelectLocation").modal('show');
    });

});