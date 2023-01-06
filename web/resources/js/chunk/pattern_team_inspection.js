

/**
 * Load data
 */
function loadData() {
    showLoading();

    let params = {
        dept_id: 19, // todo: get from hidden id
        team_id: 1, // todo: get from hidden id
    };

    let url = "/pattern_team_inspection/data";
    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
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
    // todo:
    alert("add");
}

/**
 * Remove column
 */
function removeColumn(inspection_id) {
    // todo: submit to backend and reload page (check column from DB and new column)
    alert("remove");
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
function openEvidenceDialog() {
    // todo:
    alert("open evidence");
}



/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {

    // Load data
    loadData();

    // Save click
    $("#btnSave").click(function () {
        // todo:
    });

    // Add column click
    $("#btnAddColumn").click(function () {
        // todo:
    });


});