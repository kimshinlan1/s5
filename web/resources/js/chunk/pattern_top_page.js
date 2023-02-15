/**
 * Variable
 */
const MODE_NEW = 1;

//////////////////////////////////////////////////////////////////

/**
 * Show hide team inspection chart
 */
function showHideTeam(deptId) {
    // Toggle team inspection chart
    $("tr[id^=dept_"+deptId+"-team]").toggle();
    // Add red border to team inspection chart area
    $("#btnTeamInspection_" + deptId).children('.fa-minus, .fa-plus').toggleClass("fa-minus fa-plus");
    $("#btnTeamInspection_" + deptId).parents().parents().toggleClass("border-expand border-collapse");
}

/**
 * Go to Inspection Page
 */
function gotoInspectionPage(teamId) {
    window.location = '/pattern_team_inspection/' + teamId;
}
/**
 * Load radar chart
 */
function loadRadarChart(id, avgPointArr, isDept) {
    let config = configRadarChart(avgPointArr, isDept);
    const ctx = document.getElementById(id);
    var chart = new Chart(ctx, config);
}

/**
 * Init bar chart
 */
function loadBarChart(id, mapObj, count) {
    const labels = [];
    for (let index = 0; index < count; index++) {
      labels.push('');
    }

    let config = configBarChart(labels, null, mapObj);

    const ctx = document.getElementById(id);
    ctx.height = 2;
    // ctx.width = 1;
    var chart = new Chart(ctx, config);
}

/**
 * Render chart for each teams in a dept
 */
function renderTeamChart(deptId, teamId) {
    let count = $('#hidCountInspection').val();
    var mapObj = new Map();
    mapObj.set("s1", []);
    mapObj.set("s2", []);
    mapObj.set("s3", []);
    mapObj.set("s4", []);
    mapObj.set("s5", []);
    $('#dept_'+deptId+'-team_'+teamId+'-info').find('input[id^=hidAvgPoint]').each(function(i,e){
        let avtPoints = $(e).val();
        let avgPointArr = '';
        if (avtPoints) {
            avgPointArr = $(e).val().split('|');
            avgPointArr.forEach(function (value, i) {
                let key = "s" + (i+1).toString();
                mapObj.get(key).push(parseInt(value));
            });
        }
        let id = 'radarchart_team_' + teamId + '-' + i;
        loadRadarChart(id, avgPointArr, 0);
    });
    let barChartId = 'barchart_team_' + teamId;
    loadBarChart(barChartId, mapObj, count);
}

/**
 * Render overall dept chart representing average value of each inspection
 */
function renderAvgDeptChart(deptMapRadarData, countPerInspection, deptMapBarData, deptId, countMaxInspection) {
    /** Load Dept Radar Chart and calculate data structure for rendering dept bar chart **/
    for (let index = 0; index < countMaxInspection; index++) {
      let key = 'inspection' + index;
      let avgPointArr = null;

      // If inspection has data, create radar chart and add data to deptMapBarData for rendering dept bar chart
      if (deptMapRadarData.has(key)) {
        avgPointArr = deptMapRadarData.get(key);
        // Calculate average value
        avgPointArr = avgPointArr.map(function(val){
          return Math.round(val / parseInt(countPerInspection[key]) * 100) / 100;
        })
        // Create data structure for rendering bar chart from data structure of radar chart
        avgPointArr.forEach(function (value, i) {
          let key = "s" + (i+1).toString();
          deptMapBarData.get(key).push(parseInt(value));
        });
      }

      /** Loop Dept Radar Chart **/
      let radarchartId = 'radarchart_dept_' + deptId + '-' + index;
      loadRadarChart(radarchartId, avgPointArr, 1);
    }

    /** Loop Dept Bar Chart **/
    let barChartId = 'barchart_dept_' + deptId;
    loadBarChart(barChartId, deptMapBarData, countMaxInspection);
}

function loadCharts() {
  // Get hidCountInspection value
  var countMaxInspection = $('#hidCountInspection').val();
  // Loop all Depts
  $("input[id*=hidDeptId_]").each(function(i,d){
    // Get dept value
    let deptId = $(d).val();

    //Declare data structure for overall dept radar chart
    var deptMapRadarData = new Map();
    var countPerInspection = {};

    //Declare data structure for overall dept bar chart
    var deptMapBarData = new Map();
    deptMapBarData.set("s1", []);
    deptMapBarData.set("s2", []);
    deptMapBarData.set("s3", []);
    deptMapBarData.set("s4", []);
    deptMapBarData.set("s5", []);

    /** Loop all Teams in 1 Dept **/
    $("input[id^=hid_deptId_"+deptId+"_teamId_]").each(function(i,t){
        let teamId = $(t).val();
        // Load chart for each team
        renderTeamChart(deptId, teamId);

        // Calculate total data and count inspection for overall dept radar chart
        $('#dept_'+deptId+'-team_'+teamId+'-info').find('input[id^=hidAvgPoint]').each(function(i,e){
          let avtPoints = $(e).val();
          let avgPointArr = '';
          if (avtPoints) {
            avgPointArr = $(e).val().split('|');
            let key = 'inspection' + i;
            if (!deptMapRadarData.has(key)) {
              deptMapRadarData.set(key, [0,0,0,0,0]);
              countPerInspection[key] = 0;
            }
            let sum =  deptMapRadarData.get(key).map(function (val, index) {
              return parseInt(val) + parseInt(avgPointArr[index]);
            });
            deptMapRadarData.set((key), sum);
            countPerInspection[key]++;
          }
      });
    });

    /** Load Overal Dept Chart **/
    renderAvgDeptChart(deptMapRadarData, countPerInspection, deptMapBarData, deptId, countMaxInspection);
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

});
