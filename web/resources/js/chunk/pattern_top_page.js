/**
 * Variable
 */
const MODE_NEW = 1;
const labels = [
    'S1',
    'S2',
    'S3',
    'S4',
    'S5',
];
const DEPT_CHART_COLOR = '#ffa500';
const TEAM_CHART_COLOR = 'rgb(54, 162, 235)';

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
    // todo:
    alert("go");
}

/**
 * Load radar chart
 */
function loadRadarChart(id, avgPointArr, isDept) {
    const data = {
        labels: labels,
        datasets: [{
          label: "The Radar Chart illustrates the average value of 5S methods",
          data: avgPointArr,
          fill: true,
          backgroundColor: isDept ? DEPT_CHART_COLOR: TEAM_CHART_COLOR,
          borderColor: isDept ? DEPT_CHART_COLOR: TEAM_CHART_COLOR,
          pointBackgroundColor: isDept ? DEPT_CHART_COLOR: TEAM_CHART_COLOR,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
      };
      const config = {
        type: 'radar',
        data: data,
        options: {
          responsive: true,
          elements: {
            line: {
              borderWidth: 3
            }
          }
        },
      };
      const ctx = document.getElementById(id);

      let myChart = new Chart(ctx, config);
      myChart.resize(200, 300);
}

/**
 * Init bar chart
 */
function loadBarChart(id, mapObj, count) {
    // todo:
    // alert("init chart");
    const labels = [];
    for (let index = 0; index < count; index++) {
      labels.push('Inspection' + index);
    }
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'S1',
          data: mapObj.get('s1'),
          backgroundColor: 'blue',
        },
        {
          label: 'S2',
          data: mapObj.get('s2'),
          backgroundColor: 'red',
        },
        {
          label: 'S3',
          data: mapObj.get('s3'),
          backgroundColor: 'green',
        },
        {
          label: 'S4',
          data: mapObj.get('s4'),
          backgroundColor: 'purple',
        },
        {
          label: 'S5',
          data: mapObj.get('s5'),
          backgroundColor: 'yellow',
        },
      ]
    };
    const config = {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: ''
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    };

    const ctx = document.getElementById(id);
    ctx.height = 2;
    new Chart(ctx, config);
}


/**
 * Render avg chart from teams in dept
 */
function renderAvgChart(dept_id, team_id) {
    // todo:

    // If have data: render chart with data avg

    // Else: render empty chart
    let count = $('#hidCountInspection').val();
    var mapObj = new Map();
    mapObj.set("s1", []);
    mapObj.set("s2", []);
    mapObj.set("s3", []);
    mapObj.set("s4", []);
    mapObj.set("s5", []);
    $('#dept_'+dept_id+'-team_'+team_id+'-info').find('input[id^=hidAvgPoint]').each(function(i,e){
        let avtPoints = $(e).val();

        if (avtPoints) {
            let avgPointArr = $(e).val().split('|');
            avgPointArr.forEach(function (value, i) {
                let key = "s" + (i+1).toString();
                mapObj.get(key).push(parseInt(value));
            });

            let id = 'radarchart_team_' + team_id + '-' + i;
            loadRadarChart(id, avgPointArr, 0);
        }
    });
    let barChartId = 'barchart_team_' + team_id;
    loadBarChart(barChartId, mapObj, count);
    // todo: Calculate avg point of Dept from teams and Render chart

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
    // Load overall dept chart
    let deptAvgPoints = $('#hidDeptId_' + dept_id).attr('data-avgPoint');
    let count = $('#hidCountInspection').val();
    if(deptAvgPoints) {
      deptAvgPoints = deptAvgPoints.split('|');
      // Load dept radar chart
      let radarchartId = 'radarchart_dept_' + dept_id + '-' + i;
      loadRadarChart(radarchartId, deptAvgPoints, 1);

      // Load dept bar chart
      var mapObj = new Map();
      mapObj.set("s1", [deptAvgPoints[0]]);
      mapObj.set("s2", [deptAvgPoints[1]]);
      mapObj.set("s3", [deptAvgPoints[2]]);
      mapObj.set("s4", [deptAvgPoints[3]]);
      mapObj.set("s5", [deptAvgPoints[4]]);
    }
    let barChartId = 'barchart_dept_' + dept_id;
    loadBarChart(barChartId, mapObj, count);
    // Loop all Teams in 1 Dept
    $("input[id^=hid_deptId_"+dept_id+"_teamId_]").each(function(i,t){
        let team_id = $(t).val();

        renderAvgChart(dept_id, team_id);

    });

    console.log('=========');

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