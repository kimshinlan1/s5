/**
 * Variable
 */
const MODE_NEW = 1;
var radarChart = [];
var barChart = [];

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
 * Scroll to team chart area after click button
 */
function scrollToDiv(deptId = null) {
  let targetDiv = null;
  if (deptId) {
    targetDiv = document.getElementById("dept_title_" + deptId);
  } else {
    targetDiv = document.getElementById("topPageTable");
  }
  if (targetDiv) {
    targetDiv.scrollIntoView({behavior:'smooth', block:'start'});
  } else {
    $('#errorDialog').modal('show');
    $('#errorDialog').find('.error-messages').html($('#noTeamInDeptWarning').val());
  }
}

/**
 * Go to Inspection Page
 */
function gotoInspectionPage(teamId, deptId) {
    $.ajax({
      type: 'GET',
      url: '/departments/getDeptPattern',
      data: { department_id: deptId },
      success: function (res) {
          let deptPatternId = res.dept_pattern_id;
          if (deptPatternId) {
              window.location = '/pattern_team_inspection/' + teamId;
          } else {
            $('#confirmDialog').modal('show');
            $(".confirmMessage").html(CONFIG.get('MESSAGE_CHOOSE_PATTERN_FOR_THIS_DEPARTMENT'));
          }
      }
  });
}

/**
 * Load radar chart
 */
function loadRadarChart(id, avgPointArr, isDept) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: CONFIG.get('FIRST_CHART_LABEL'),
        data: avgPointArr[0],
        fill: true,
        backgroundColor: isDept ? 'rgba(252, 185, 115, 0.3)' : 'rgba(170, 191, 180, 0.3)',
        borderColor: isDept ? 'rgb(252, 185, 115)' : 'rgb(170, 191, 180)',
        pointBackgroundColor: isDept ? 'rgb(252, 185, 115)' : 'rgb(170, 191, 180)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: isDept ? 'rgb(252, 185, 115)' : 'rgb(170, 191, 180)'
      },
      {
        label: CONFIG.get('SECOND_CHART_LABEL'),
        data: avgPointArr[1],
        fill: true,
        backgroundColor: isDept ? 'rgba(252, 217, 147, 0.3)' : 'rgba(188, 217, 192, 0.3)',
        borderColor: isDept ? 'rgba(252, 217, 147)' : 'rgb(188, 217, 192)',
        pointBackgroundColor: isDept ? 'rgba(252, 217, 147)' : 'rgb(188, 217, 192)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: isDept ? 'rgba(252, 217, 147)' : 'rgb(188, 217, 192)',
      },
      {
        label: CONFIG.get('THIRD_CHART_LABEL'),
        data: avgPointArr[2],
        fill: true,
        backgroundColor: isDept ? 'rgba(255, 236, 178, 0.3)' : 'rgba(212, 232, 198, 0.3)',
        borderColor: isDept ? 'rgb(255, 236, 178)' : 'rgb(212, 232, 198)',
        pointBackgroundColor: isDept ? 'rgb(255, 236, 178)' : 'rgb(212, 232, 198)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: isDept ? 'rgb(255, 236, 178)' : 'rgb(212, 232, 198)'
      },

  ]
};
const config = {
    type: 'radar',
    data: data,
    options: {
        maintainAspectRatio: false,
        responsive: false,
        elements: {
            point:{
                radius: 0
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                  boxWidth: 5,
                  boxHeight: 5,
                  color: 'black',
                },
            },
        },
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 5,
                beginAtZero: true,
                ticks: {
                    backdropPadding: {
                        y: 1
                    },
                    stepSize: 1
                },
            }
        },
    },
};
    const ctx = document.getElementById(id);
    radarChart = new Chart(ctx, config);
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
    barChart = new Chart(ctx, config);
}

/**
 * Render chart for each teams in a dept
 */
function renderTeamChart(deptId, teamId) {
    let myArray = [];
    let mapObj = new Map();
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
            avgPointArr.forEach(function (value, index) {
                let key = "s" + (index+1).toString();
                mapObj.get(key).push(parseFloat(value));
            });
        }
        myArray.push(avgPointArr);
    });
    let id = 'radarchart_team_' + teamId;
    loadRadarChart(id, myArray, 0);

    // let barChartId = 'barchart_team_' + teamId;
    // loadBarChart(barChartId, mapObj, count);
}

/**
 * Render overall dept chart representing average value of each inspection
 */
function renderAvgDeptChart(deptMapRadarData, countPerInspection, deptMapBarData, deptId, countMaxInspection) {
    /** Load Dept Radar Chart and calculate data structure for rendering dept bar chart **/
    let myArray = [];
    for (let index = 0; index < countMaxInspection; index++) {
      let key = 'inspection' + index;
      let avgPointArr = null;

      // If inspection has data, create radar chart and add data to deptMapBarData for rendering dept bar chart
      if (deptMapRadarData.has(key)) {
        avgPointArr = deptMapRadarData.get(key);
        // Calculate average value
        avgPointArr = avgPointArr.map(function(val){
          return Math.round(val / parseFloat(countPerInspection[key]) * 100) / 100;
        })
        // Create data structure for rendering bar chart from data structure of radar chart
        avgPointArr.forEach(function (value, i) {
          let keyString = "s" + (i+1).toString();
          deptMapBarData.get(keyString).push(parseFloat(value));
        });
      }

      /** Loop Dept Radar Chart **/
      myArray.push(avgPointArr);
    }
    let radarchartId = 'radarchart_dept_' + deptId;
    loadRadarChart(radarchartId, myArray, 1);

    /** Loop Dept Bar Chart **/
    // let barChartId = 'barchart_dept_' + deptId;
    // loadBarChart(barChartId, deptMapBarData, countMaxInspection);
}

function loadCharts() {
  // Get hidCountInspection value
  let countMaxInspection = $('#hidCountInspection').val();
  // Loop all Depts
  $("input[id*=hidDeptId_]").each(function(_i,d){
    // Get dept value
    let deptId = $(d).val();

    //Declare data structure for overall dept radar chart
    let deptMapRadarData = new Map();
    let countPerInspection = {};

    //Declare data structure for overall dept bar chart
    let deptMapBarData = new Map();
    deptMapBarData.set("s1", []);
    deptMapBarData.set("s2", []);
    deptMapBarData.set("s3", []);
    deptMapBarData.set("s4", []);
    deptMapBarData.set("s5", []);

    /** Loop all Teams in 1 Dept **/
    $("input[id^=hid_deptId_"+deptId+"_teamId_]").each(function(_i,t){
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
              return parseFloat(val) + parseFloat(avgPointArr[index]);
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

    let doneCallback = function (resData, _textStatus, _jqXHR) {
        $('#topPageChart').empty();
        $('#topPageChart').html(resData);
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
