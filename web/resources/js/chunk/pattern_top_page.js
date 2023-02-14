/**
 * Variable
 */
const MODE_NEW = 1;

//////////////////////////////////////////////////////////////////

/**
 * Show hide team inspection chart
 */
function showHideTeam(dept_id) {
    $("tr[id^=dept_"+dept_id+"-team]").toggle();
}

/**
 * Go to Inspection Page
 */
function gotoInspectionPage(team_id) {
    window.location = '/pattern_team_inspection/' + team_id;
}
/**
 * Load radar chart
 */
function loadRadarChart(id, avgPointArr, isDept) {
    let config = configRadarChart(avgPointArr, isDept);
    const ctx = document.getElementById(id);
    new Chart(ctx, config);
}

/**
 * Init bar chart
 */
function loadBarChart(id, mapObj, count) {
    const labels = [];
    for (let index = 0; index < count; index++) {
      labels.push('Inspection' + index);
    }

    let config = configBarChart(labels, null, mapObj);

    const ctx = document.getElementById(id);
    ctx.height = 2;
    new Chart(ctx, config);
}


/**
 * Render avg chart from teams in dept
 */
function renderAvgChart(dept_id, team_id) {
    let count = $('#hidCountInspection').val();
    var mapObj = new Map();
    mapObj.set("s1", []);
    mapObj.set("s2", []);
    mapObj.set("s3", []);
    mapObj.set("s4", []);
    mapObj.set("s5", []);
    $('#dept_'+dept_id+'-team_'+team_id+'-info').find('input[id^=hidAvgPoint]').each(function(i,e){
        let avtPoints = $(e).val();
        let avgPointArr = '';
        if (avtPoints) {
            avgPointArr = $(e).val().split('|');
            avgPointArr.forEach(function (value, i) {
                let key = "s" + (i+1).toString();
                mapObj.get(key).push(parseInt(value));
            });
        }
        let id = 'radarchart_team_' + team_id + '-' + i;
        loadRadarChart(id, avgPointArr, 0);
    });
    let barChartId = 'barchart_team_' + team_id;
    loadBarChart(barChartId, mapObj, count);
}

/**
 * Calculate avg point of Dept from teams and Render chart for dept
 */
var avgPointOfDept = {};
function getAvgPointOfDept(dept_id) {
    // todo: update avgPointOfDept

    // avgPointOfDept = {};
}

/**
 * Redirect to pattern_team_inspection
 */
function redirectToInspection(teamId) {
    window.location = '/pattern_team_inspection/' + teamId;
}

function loadCharts() {
  // Loop all Depts
  $("input[id*=hidDeptId_]").each(function(i,d){
    let dept_id = $(d).val();
    let barChartId = 'barchart_dept_' + dept_id;

    // Load overall dept chart
    let deptAvgPoints = $('#hidDeptId_' + dept_id).attr('data-avgPoint');
    let count = $('#hidCountInspection').val();
    var mapObj = new Map();
    if(deptAvgPoints) {
      deptAvgPoints = deptAvgPoints.split('|');
      mapObj.set("s1", [deptAvgPoints[0]]);
      mapObj.set("s2", [deptAvgPoints[1]]);
      mapObj.set("s3", [deptAvgPoints[2]]);
      mapObj.set("s4", [deptAvgPoints[3]]);
      mapObj.set("s5", [deptAvgPoints[4]]);
    }
    // Load dept radar chart
    let radarchartId = 'radarchart_dept_' + dept_id + '-0';
    loadRadarChart(radarchartId, deptAvgPoints, 1);
    for (let index = 1; index < count; index++) {
      let radarchartId = 'radarchart_dept_' + dept_id + '-' + index ;
      loadRadarChart(radarchartId, '', 1);
    }
    // Load dept bar chart
    loadBarChart(barChartId, mapObj, count);
    // Loop all Teams in 1 Dept
    $("input[id^=hid_deptId_"+dept_id+"_teamId_]").each(function(i,t){
        let team_id = $(t).val();
        renderAvgChart(dept_id, team_id);
    });
});
}

/**
 * Redirect to pattern_team_inspection
 */
function renderView(compId) {
    let url = '/pattern_top_page/load';

    let method = "GET";

    let data = {company_id : compId}

    let doneCallback = function (data, _textStatus, _jqXHR) {
        $('#topPageChart').empty();
        $('#topPageChart').html(data);
        loadCharts();
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };

    runAjax(url, method, data, doneCallback, failCallback, null, false);

}

/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {
    $('#submenu5sId').collapse('show');
    // Company Onchange Event
    $('#companyOptionId').change(function() {
      let compId = $('#companyOptionId').find(':selected').val();
      renderView(compId);
    })
    let compId = $('#companyOptionId').val();
    if (!compId) {
      compId = $('#userCompanyId').val();
      renderView(compId);
    } else {
      $('#companyOptionId').change();
    }

    // Change expand/collapse icon
    $(".btnTeamInspection").click(function(){
      $(this).children('.fa-minus, .fa-plus').toggleClass("fa-minus fa-plus");
      $(this).parents().parents().toggleClass("border-expand border-collapse");
    });
});
