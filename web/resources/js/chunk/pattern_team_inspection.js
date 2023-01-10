

/**
 * Load data
 */
function loadInspectionData(is_new = '') {
    showLoading();

    let params = {
        dept_id: 4, // todo: get from selectbox or hidden id
        team_id: 1, // todo: get from selectbox or hidden id
    };

    if (is_new) {
        let count = $('#hidCountInspection').val();
        params['new_total_column'] = parseInt(count) + 1;
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
    loadInspectionData(true);
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
function saveData() {
    // todo: validate + save
    alert("save");
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
        // todo:
    });

    // Add column click
    $("#btnAdd").click(function () {
        addColumn();
    });


});