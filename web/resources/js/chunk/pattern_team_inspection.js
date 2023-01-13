/**
 * Variable
 */
const MODE_NEW = 1;
const MODE_REMOVE_NEW = -1;
const TEST_TEAM_ID = 1;


//////////////////////////////////////////////////////////////////
/**
 * Load data
 * mode: new , remove
 */
function loadInspectionData(mode = '') {
    showLoading();

    let params = {
        dept_id: 4, // todo: get from selectbox or hidden id
        team_id: TEST_TEAM_ID, // todo: get from selectbox or hidden id
    };

    let count = $('#hidCountInspection').val();
    if (mode == MODE_NEW) {
        params['new_total_column'] = parseInt(count) + 1;
    } else if (mode == MODE_REMOVE_NEW) {
        params['new_total_column'] = parseInt(count) - 1;
    }

    let url = "/pattern_team_inspection/data";
    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        $("#content").html("");
        $("#content").append(data);

        // todo:
        // calculateAvgPoint();
        // initRadarChart();
        // initBarChart();

        // Tooltip level
        $('td[id=level_tooltip]').each(function () {
            let tip = $(this).find('#level').html();
            $(this).tooltip(
            {
                html: true,
                title: tip,

                // todo: update position and css
                position: {
                    at: 'left+15 center',
                    my: 'right center',
                }
            });
        });

        // Config init calendar
        $('input[id^=txtInspectionDate_]').each(function() {
            $(this).datepicker({
                autoclose: true,
                dateFormat: 'yy年mm月dd日',
                // timeFormat:  "hh:mm:ss",
                language: 'ja',
                changeYear: true
            });

            // todo: Check and get from DB

            // $(this).datepicker("setDate", date_value);
        });
    };

    runAjax(url, method, params, doneCallback);
}

/**
 * calculate avg point 5S
 */
function calculateAvgPoint() {
    // todo:
    alert("calculate avg");
}

/**
 * Init radar chart
 */
function initRadarChart(id) {
    // todo:
    alert("init chart");
}

/**
 * Init bar chart
 */
function initBarChart(dept_id) {
    // todo:
    alert("init chart");
}

/**
 * Add column (new inspection)
 */
function addColumn() {
    loadInspectionData(MODE_NEW);
}

/**
 * Remove column
 */
function removeColumn(inspection_id) {
    // todo: confirm ??
    if (!confirm("Do you want to delete?")) {
        return;
    }

    showLoading();

    // Case: Remove new/empty column
    if (inspection_id == MODE_REMOVE_NEW) {
        loadInspectionData(MODE_REMOVE_NEW);
        return;
    }

    let params = {};
    let url = "/pattern_team_inspection/destroy/" + inspection_id;
    let method = "DELETE";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        loadInspectionData();
    };

    let failcallback = function (jqXHR, _textStatus, _jqXHR) {
        // todo:
        alert(CONFIG.get('SYSTEM_ERROR'));
    };

    runAjax(url, method, params, doneCallback, failcallback);
}

/**
 * Save
 */
function validateAndGetData() {
    // todo: validate


    // Get valid details
    let params = [];

    $('input[id^=hidInspectionId]').each(function() {
        // console.log($(this).val());

        let id = $(this).val();
        let inspection_date = $.datepicker.formatDate("yy-mm-dd", $('#txtInspectionDate_'+id).datepicker("getDate"));
        inspection_date += " 0:0:0";
        if (id && inspection_date) {

            let inspection = {
                'info': {},
                'data': {}
            };

            // Info
            let info = {
                'inspection_id': id,
                'inspection_date': inspection_date,
                'team_id': TEST_TEAM_ID, // todo: get from selectbox or hidden
            };
            inspection['info'] = info;

            // Detail data
            let details = {};
            $('input[id^=hidLocationId_]').each(function(i, l) {
                let location_id = $(l).val();
                let area_location_index = $('#hidAreaLocationIndex_'+location_id).val();
                let rows = {};
                $('select[id^=selPointValue-'+id+'-'+area_location_index+']').each(function(k, e) {
                    let method = $(e).data('5s');
                    let point_value = $(e).find(":selected").val();
                    rows[method] = point_value;
                });
                details[location_id] = rows;
            });
            inspection['data'] = details;

            // Add params
            params.push(inspection);
        }

    });

    // console.log(params);

    return params;
}

/**
 * Save
 */
function saveInspectionData() {
    // todo: validate + get data
    let params = validateAndGetData();

    // todo: Check empty
    if (!params || params.length <= 0) {
        alert("no data");
        return;
    }

    // console.log(params);

    // todo: save
    showLoading();

    let url = "/pattern_team_inspection/save";
    let method = "POST";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        // todo:
        alert("save ok");
        location.reload();
    };

    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        // todo:
        console.log(jqXHR);
        alert("err");
    };

    runAjax(url, method, params, doneCallback, failCallback);
}

/**
 * Open Evidence
 */
function openEvidenceDialog(inspection_id) {
    // todo:
    alert("open evidence");
}



/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {

    // Load data
    loadInspectionData();

    // Save click
    $("#btnSave").click(function () {
        saveInspectionData();
    });

    // Add column click
    $("#btnAdd").click(function () {
        addColumn();
    });


});