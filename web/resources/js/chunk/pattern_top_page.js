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
function loadRadarChart(id, avgPointArr) {
    const data = {
        labels: labels,
        datasets: [{
          label: "The Radar Chart illustrates the average value of 5S methods",
          data: avgPointArr,
          fill: true,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
      };
      const config = {
        type: 'radar',
        data: data,
        options: {
          elements: {
            line: {
              borderWidth: 3
            }
          }
        },
      };
      const ctx = document.getElementById(id);

      new Chart(ctx, config);
}

/**
 * Init bar chart
 */
function loadBarChart(id, mapObj) {
    // todo:
    // alert("init chart");
    const labels = [
        '',
        '',
        '',
        '',
        '',
    ];
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
    const actions = [
      {
        name: 'Randomize',
        handler(chart) {
          chart.data.datasets.forEach(dataset => {
            dataset.data = Utils.numbers({count: chart.data.labels.length, min: -100, max: 100});
          });
          chart.update();
        }
      },
    ];
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
                let dd = mapObj.get(key)
                mapObj.get(key).push(parseInt(value));
            });

            let id = 'radarchart_team_' + team_id + '-' + i;
            loadRadarChart(id, avgPointArr);
        }
    });
    let barChartId = 'barchart_team_' + team_id;
    loadBarChart(barChartId, mapObj);
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

/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {

    /**
     * Flow:
     *   Get data and init layout
     *   Loop all Depts and Teams
     *     Render chart with teams inspection data (by columns)
     *       use $('#hidAvgPoint_')
     *     Calculate avg point of Dept from teams
     *     Render chart for Dept
     *
     *
     */



    // Loop all Depts
    $("input[id*=hidDeptId_]").each(function(i,d){
        let dept_id = $(d).val();
        // Loop all Teams in 1 Dept
        $("input[id^=hid_deptId_"+dept_id+"_teamId_]").each(function(i,t){
            let team_id = $(t).val();

            renderAvgChart(dept_id, team_id);


        });

        console.log('=========');

    });

});