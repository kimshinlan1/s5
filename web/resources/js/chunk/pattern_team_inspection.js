/**
 * Variable
 */
const MODE_NEW = 1;
const MODE_REMOVE_NEW = -1;
const TEST_TEAM_ID = 1; // todo: get from selectbox or hidden / just for test

//////////////////////////////////////////////////////////////////
/**
 * Load data
 * mode: new , remove
 */
function loadInspectionData(data, mode = '', getDataCanvas) {
    showLoading();
    let params = {
        dept_id: data.department_id, // todo: get from selectbox or hidden id
        team_id: data.team_id, // todo: get from selectbox or hidden id
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
        initRadarChart();
        initBarChart();

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
                language: 'ja',
                changeYear: true
            });

            // Check and get from DB
            let date_value = "";
            if ($(this).next().val()) {
                date_value = new Date(dateFormat($(this).next().val()));
            }

            $(this).datepicker("setDate", date_value);
        });
        console.log('2');
        if (getDataCanvas) {
            getDataCanvas();
        }
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
    // alert("init chart");
    const data = {
        labels: [
          'S1',
          'S2',
          'S3',
          'S4',
          'S5',
        ],
        datasets: [{
          label: 'My Second Dataset',
          data: [0, 4, 2, 3, 5],
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
      const ctx = document.getElementById('myChart');
      new Chart(ctx, config);
}

/**
 * Init bar chart
 */
function initBarChart(dept_id) {
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
          data: [2, 3, 4, 2, 4],
          backgroundColor: 'blue',
        },
        {
          label: 'S2',
          data: [2, 3, 4, 2, 4],
          backgroundColor: 'red',
        },
        {
          label: 'S3',
          data: [2, 3, 4, 2, 4],
          backgroundColor: 'green',
        },
        {
          label: 'S4',
          data: [2, 3, 4, 2, 4],
          backgroundColor: 'purple',
        },
        {
          label: 'S5',
          data: [2, 3, 4, 2, 4],
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
    const ctx = document.getElementById('myBarChart');
    ctx.height = 3;
    new Chart(ctx, config);
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
        let id = $(this).val();
        let inspection_date = $.datepicker.formatDate("yy-mm-dd", $('#txtInspectionDate_'+id).datepicker("getDate"));
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

    console.log(params);

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

/**
 * Event selected change item department
 */
function onChangeDataDepartment() {
    let data = {
        department_id: $('#selectDeptList').val(),
    }
    $.ajax({
        type: 'GET',
        url: '/teams/dept_id',
        data: data,
        success: function (res) {
            let html = '';
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#selectTeamList').html(html);
            $('#selectTeamList').change();
        }
    });
}

/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {
    $.ajax({
        type: 'GET',
        url: '/departments/list',
        success: function (res) {
            let html = '';
            for (let e of res.rows) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#selectDeptList').html(html);
            $('#selectDeptList').change();
        }
    });

    // On change select department
    $('#selectDeptList').change(function () {
        onChangeDataDepartment();
    });

    // On change select department
    $('#selectTeamList').change(function () {
        let data = {
            department_id: $('#selectDeptList').val(),
            team_id: $('#selectTeamList').val(),
        }

        let getDataCanvas = function () {
            getDataElement();

            $('.selPointValue').change(function() {
                getDataElement();
            });
        };

        // Load data
        loadInspectionData(data, '',getDataCanvas);
    });

    function getDataElement() {
        const formInput = document.getElementById('formFormsInput');
        let sumS1 = [];
        let sumS2 = [];
        let sumS3 = [];
        let sumS4 = [];
        let sumS5 = [];

        let countS1 = [];
        let countS2 = [];
        let countS3 = [];
        let countS4 = [];
        let countS5 = [];

        let avgS1 = [];
        let avgS2 = [];
        let avgS3 = [];
        let avgS4 = [];
        let avgS5 = [];

        Array.from(formInput.elements).forEach(element => {
            console.log(element);
            switch (element.dataset['5s']) {
                case 's1':
                    sumS1[element.dataset['inspection_id']] = (sumS1[element.dataset['inspection_id']] ?? 0) +  Number($('#' + element.id).val());
                    countS1[element.dataset['inspection_id']] = (countS1[element.dataset['inspection_id']] ?? 0) + ((Number($('#' + element.id).val()) != 0) ? 1 : 0);
                    break;
                case 's2':
                    sumS2[element.dataset['inspection_id']] = (sumS2[element.dataset['inspection_id']] ?? 0) +  Number($('#' + element.id).val());
                    countS2[element.dataset['inspection_id']] = (countS2[element.dataset['inspection_id']] ?? 0) + ((Number($('#' + element.id).val()) != 0) ? 1 : 0);
                    break;
                case 's3':
                    sumS3[element.dataset['inspection_id']] = (sumS3[element.dataset['inspection_id']] ?? 0) +  Number($('#' + element.id).val());
                    countS3[element.dataset['inspection_id']] = (countS3[element.dataset['inspection_id']] ?? 0) + ((Number($('#' + element.id).val()) != 0) ? 1 : 0);
                    break;
                case 's4':
                    sumS4[element.dataset['inspection_id']] = (sumS4[element.dataset['inspection_id']] ?? 0) +  Number($('#' + element.id).val());
                    countS4[element.dataset['inspection_id']] = (countS4[element.dataset['inspection_id']] ?? 0) + ((Number($('#' + element.id).val()) != 0) ? 1 : 0);
                    break;
                case 's5':
                    sumS5[element.dataset['inspection_id']] = (sumS5[element.dataset['inspection_id']] ?? 0) +  Number($('#' + element.id).val());
                    countS5[element.dataset['inspection_id']] = (countS5[element.dataset['inspection_id']] ?? 0) + ((Number($('#' + element.id).val()) != 0) ? 1 : 0);
                    break;

            }
        });

        let pointAvg = 0;
        for (let key in sumS1) {
            pointAvg = 0;
            if (Number(countS1[key]) != 0) {
                pointAvg = Number(sumS1[key]) / Number(countS1[key]);
            }
            avgS1[key] = pointAvg;
            $('#point_avg_1s_' + key).text(pointAvg);
        }

        for (let key in sumS2) {
            pointAvg = 0;
            if (Number(countS2[key]) != 0) {
                pointAvg = Number(sumS2[key]) / Number(countS2[key]);
            }
            avgS2[key] = pointAvg;
            $('#point_avg_2s_' + key).text(pointAvg);
        }

        for (let key in sumS3) {
            pointAvg = 0;
            if (Number(countS3[key]) != 0) {
                pointAvg = Number(sumS3[key]) / Number(countS3[key]);
            }
            avgS3[key] = pointAvg;
            $('#point_avg_3s_' + key).text(pointAvg);
        }

        for (let key in sumS4) {
            pointAvg = 0;
            if (Number(countS4[key]) != 0) {
                pointAvg = Number(sumS4[key]) / Number(countS4[key]);
            }
            avgS4[key] = pointAvg;
            $('#point_avg_4s_' + key).text(pointAvg);
        }

        for (let key in sumS5) {
            pointAvg = 0;
            if (Number(countS5[key]) != 0) {
                pointAvg = Number(sumS5[key]) / Number(countS5[key]);
            }
            avgS5[key] = pointAvg;
            $('#point_avg_5s_' + key).text(pointAvg);
        }
        getDataChart(avgS1, avgS2, avgS3, avgS4, avgS5);
    }

    function getDataChart(avgS1, avgS2, avgS3, avgS4, avgS5) {
        let array5s = [];
        for (let id_inspec of inspIds) {
            let arrayInspection = [];


            arrayInspection.push(avgS1[id_inspec]);
            arrayInspection.push(avgS2[id_inspec]);
            arrayInspection.push(avgS3[id_inspec]);
            arrayInspection.push(avgS4[id_inspec]);
            arrayInspection.push(avgS5[id_inspec]);

            array5s[id_inspec] = arrayInspection;
        }

        console.log(array5s);
    }


    // Save click
    $("#btnSave").click(function () {
        saveInspectionData();
    });

    // Add column click
    $("#btnAdd").click(function () {
        addColumn();
    });

});
