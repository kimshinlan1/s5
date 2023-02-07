/**********
 * Variable
 **********/
const MODE_NEW = 1;
const MODE_REMOVE_NEW = -1;
var RenderRadarChart = [];
var RenderBarChart = [];

//*********************************************************************************//
//**********************//---DOCUMENT---FUNCTION---START---//**********************//

/********************************************************************
 * Load data
 * Check mode: MODE_NEW = Add column, MODE_REMOVE_NEW = Remove column
 * data: departmentId, teamId
 ********************************************************************/
function loadInspectionData(data, mode = '') {
    showLoading();
    let params = {
        dept_id: data.department_id,
        team_id: data.team_id,
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

        // Trigger
        $('.selPointValue').change(function() {
            for (let e of inspIds) {
                RenderRadarChart[e].destroy();
            }
            RenderBarChart.destroy();
            initChart();
        });

        // Init chart
        initChart();
    };

    runAjax(url, method, params, doneCallback);
}

/***************
 * Remove column
 ***************/
function removeColumn(inspection_id) {
    let param = {
        department_id: $('#selectDeptList').val(),
        team_id: $('#selectTeamList').val(),
    }

    // todo: confirm ??
    if (!confirm("Do you want to delete?")) {
        return;
    }

    showLoading();

    // Case: Remove new/empty column
    if (inspection_id == MODE_REMOVE_NEW) {
        loadInspectionData(param, MODE_REMOVE_NEW);
        return;
    }

    let params = {};
    let url = "/pattern_team_inspection/destroy/" + inspection_id;
    let method = "DELETE";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        loadInspectionData(param);
    };

    let failCallback = function (jqXHR, _textStatus, _jqXHR) {
        // todo:
        alert(CONFIG.get('SYSTEM_ERROR'));
    };

    runAjax(url, method, params, doneCallback, failCallback);
}

/***********
 * Save data
 ***********/
function saveInspectionData() {
    // todo: validate + get data
    let params = validateAndGetData();

    // todo: Check empty
    if (!params || params.length <= 0) {
        alert("no data");
        return;
    }

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

/*****************************
 * Check validate and get data
 *****************************/
function validateAndGetData() {
    // todo: validate


    // Get valid details
    let params = [];

    $('input[id^=hidInspectionId]').each(function() {
        let id = $(this).val();
        let inspection_date = "";
        let getdate = $('#txtInspectionDate_'+id).datepicker("getDate");
        if (getdate && getdate instanceof Date) {
            inspection_date = $.datepicker.formatDate("yy-mm-dd", getdate);
        }

        if (id && inspection_date) {
            let inspection = {
                'info': {},
                'data': {}
            };

            // Info
            let info = {
                'inspection_id': id,
                'inspection_date': inspection_date,
                'team_id': $('#selectTeamList').val(),
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
    return params;
}

/***************************************
 * Event selected change item department
 ***************************************/
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

/***************
 * Open Evidence
 ***************/
function openEvidenceDialog(inspection_id) {
    // todo:
    alert("open evidence");
}

/*********************************
 * evidenceDialog from each column
 *********************************/
function evidenceDialog(inspectionId) {
    $("#patternEvidenceDialog").find(".modal-footer #hidInspectionId").val( inspectionId );
}

//***********************//---DOCUMENT---FUNCTION---END---//***********************//
//*********************************************************************************//


//*********************************************************************************//
//*******************//---DOCUMENT---CREATE---CHART---START---//*******************//

/************************
 * Calculate avg point 5S
 ************************/
function calculateAvgPoint() {
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

    Array.from(formInput.elements).forEach(element => {
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

    let avgS1 = [];
    let avgS2 = [];
    let avgS3 = [];
    let avgS4 = [];
    let avgS5 = [];
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
    return array5s;
}

/**********************
 * Cover data bar chart
 **********************/
function coverDataBarChart(array5s) {
    let arrayPoint = [];
    for (let id of inspIds) {
        ['S1', 'S2', 'S3', 'S4', 'S5'].forEach(function (val, index) {
            if (!arrayPoint[val]) {
                arrayPoint[val] = [];
            }
            arrayPoint[val].push(array5s[id][index] ? array5s[id][index] : 0);
        });
    }
    return arrayPoint;
}

/************
 * Init chart
 ************/
function initChart() {
    //---Create radar chart---//
    let array5s = calculateAvgPoint();
    createRadarChart(array5s);

    //---Create bar chart---//
    let arrayPoint = coverDataBarChart(array5s);
    createBarChart(arrayPoint);
}

/********************
 * Create radar chart
 ********************/
function createRadarChart(array5s) {
    for (let e of inspIds) {
        const data = {
            labels: [
                'S1',
                'S2',
                'S3',
                'S4',
                'S5',
            ],
            datasets: [{
                label: '',
                data: array5s[e],
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
                responsive: false,
                plugins: {
                    legend: {
                        display: false,
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
        const ctx = document.getElementById('myChart_'+ e);
        RenderRadarChart[e] = new Chart(ctx, config);
    }
}

/******************
 * Create bar chart
 ******************/
function createBarChart(arrayPoint) {
    const labels = [];
    for (let index = 0; index < inspIds.length; index++) {
      labels.push('');
    }
    const data = {
        labels: labels,
        datasets: [
            {
            label: 'S1',
            data: arrayPoint['S1'],
            backgroundColor: 'blue',
            },
            {
            label: 'S2',
            data: arrayPoint['S2'],
            backgroundColor: 'red',
            },
            {
            label: 'S3',
            data: arrayPoint['S3'],
            backgroundColor: 'green',
            },
            {
            label: 'S4',
            data: arrayPoint['S4'],
            backgroundColor: 'purple',
            },
            {
            label: 'S5',
            data: arrayPoint['S5'],
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
                legend: {
                    position: "top",
                    align: "start",
                    labels: {
                      boxWidth: 20
                    }
                },
            },
            responsive: true,
            scales: {
                x: {
                        stacked: true,
                    },
                y: {
                    suggestedMin: 0,
                    suggestedMax: 25,
                    beginAtZero: true,
                    stacked: true,
                    ticks: {
                        stepSize: 5
                    },
                },
            },
            animation: false
        }
    };
    const ctx = document.getElementById('myBarChart');
    ctx.height = '128px';
    RenderBarChart = new Chart(ctx, config);
}

//********************//---DOCUMENT---CREATE---CHART---END---//********************//
//*********************************************************************************//


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////---DOCUMENT---READY---//////////////////////////////////
$(function () {
    // Call ajax get list data department
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
        // Load data
        loadInspectionData(data);
    });

    // Save click
    $("#btnSave").click(function () {
        saveInspectionData();
    });

    // Add column click
    $("#btnAdd").click(function () {
        let data = {
            department_id: $('#selectDeptList').val(),
            team_id: $('#selectTeamList').val(),
        }
        // Load data
        loadInspectionData(data, MODE_NEW);
    });
});
