/**********
 * Variable
 **********/
const MODE_NEW = 1;
const MODE_REMOVE_NEW = -1;
var RenderRadarChart = [];
var RenderBarChart = [];
var inspectionIdBtnRemove = [];

//*********************************************************************************//
//**********************//---DOCUMENT---FUNCTION---START---//**********************//

/*************************************
 * Set param give teamId, departmentId
 *************************************/
function setParam() {
    let param = {};
    if ($("#hidTeamId").val()){
        param = {
            dept_id: $("#hidDeptId").val(),
            team_id: $("#hidTeamId").val(),
        };
    } else {
        param = {
            dept_id: $('#selectDeptList').val(),
            team_id: $('#selectTeamList').val(),
        };
    }
    return param;
}
/********************************************************************
 * Load data
 * Check mode: MODE_NEW = Add column, MODE_REMOVE_NEW = Remove column
 * data: departmentId, teamId
 ********************************************************************/
function loadInspectionData(data, mode = '', presentData = '') {
    showLoading();
    let params = {
        dept_id: data.dept_id,
        team_id: data.team_id,
        present_data: {presentData}
    };
    let count = $('#hidCountInspection').val();
    if (mode == MODE_NEW) {
        params['new_total_column'] = parseInt(count) + 1;
    } else if (mode == MODE_REMOVE_NEW) {
        params['new_total_column'] = parseInt(count) - 1;
    }

    let url = "/pattern_team_inspection/data";
    let method = "POST";

    let doneCallback = function (datas, _textStatus, _jqXHR) {
        $("#content").html("");
        $("#content").append(datas);

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
    $("#modalRemoveColumn").modal('show');
    $("#modalRemoveColumn").addClass("show");
    inspectionIdBtnRemove = inspection_id;
}

/**********************
 * Accept remove column
 **********************/
function acceptRemoveColumn() {
    $("#modalRemoveColumn").modal('hide');
    let param = setParam();
    let inspection_id = inspectionIdBtnRemove;

    showLoading();

    // Case: Remove new/empty column
    if (inspection_id == MODE_REMOVE_NEW) {
        loadInspectionData(param, MODE_REMOVE_NEW);
        return;
    }

    let params = {};
    let url = "/pattern_team_inspection/destroy/" + inspection_id;
    let method = "DELETE";

    let doneCallback = function (_data, _textStatus, _jqXHR) {
        showToast($('#toast2'), 2000, true);
        loadInspectionData(param);
    };

    let failCallback = function (_jqXHR, _textStatus, _errorThrown) {
        $('#errorDialog').modal('show');
        $('#errorDialog .error-messages').text($('#messageSystemError').val());
    };

    runAjax(url, method, params, doneCallback, failCallback);
}

/**********************
 * Cancel remove column
 **********************/
function cancelRemoveColumn() {
    $("#modalRemoveColumn").modal('hide');
}

/***********
 * Save data
 ***********/
function saveInspectionData() {
    $("#modalSaveInspectionData").modal('hide');
    // Validate + get data
    let params = validateAndGetData();
    // Check empty
    if (!params || params.length <= 0) {
        $('#errorDialog').modal('show');
        $('#errorDialog .error-messages').text($('#messageNoSelectedData').val());
        return;
    }
    // Save
    showLoading();

    let url = "/pattern_team_inspection/save";
    let method = "POST";
    let param = setParam();
    let doneCallback = function (data, _textStatus, _jqXHR) {
        showToast($('#toast1'), 2000, true);
        // Load data
        if ($("#hidTeamId").val()){
            window.location = "/pattern_top_page";
        } else {
            loadInspectionData(param);
        }
    };
    let failCallback = function (_jqXHR, _textStatus, _errorThrown) {
        $('#errorDialog').modal('show');
        $('#errorDialog .error-messages').text($('#messageSystemError').val());
    };
    runAjax(url, method, params, doneCallback, failCallback);
}

/*************************
 * Button cancel save data
 *************************/
function cancelSaveInspectionData() {
    $("#modalSaveInspectionData").modal('hide');
}

/*****************************
 * Check validate and get data
 *****************************/
function validateAndGetData() {
    // Get valid details
    let params = [];

    $('input[id^=hidInspectionId]').each(function() {
        let id = $(this).val();
        let inspection_date = "";
        let getdate = $('#txtInspectionDate_'+id).datepicker("getDate");
        if (getdate && getdate instanceof Date) {
            inspection_date = $.datepicker.formatDate("yy-mm-dd", getdate);
        }

        if (id) {
            let inspection = {
                'info': {},
                'data': {}
            };

            let teamId = '';
            if ($("#hidTeamId").val()) {
                teamId = $("#hidTeamId").val();
            } else {
                teamId = $('#selectTeamList').val();
            }
            // Info
            let info = {
                'inspection_id': id,
                'inspection_date': inspection_date,
                'team_id': teamId,
            };
            inspection['info'] = info;

            // Detail data
            let details = {};
            $('input[id^=hidLocationId_]').each(function(_i, l) {
                let location_id = $(l).val();
                let area_location_index = $('#hidAreaLocationIndex_'+location_id).val();
                let rows = {};
                $('select[id^=selPointValue-'+id+'-'+area_location_index+']').each(function(_k, e) {
                    let method = $(e).data('5s');
                    let point_value = $(e).find(":selected").val();
                    rows[method] = point_value;
                });
                details[location_id] = rows;
            });

            let pointAvg = [];
            let pointAvgS1 = document.getElementById('point_avg_1s_'+id).textContent;
            let pointAvgS2 = document.getElementById('point_avg_2s_'+id).textContent;
            let pointAvgS3 = document.getElementById('point_avg_3s_'+id).textContent;
            let pointAvgS4 = document.getElementById('point_avg_4s_'+id).textContent;
            let pointAvgS5 = document.getElementById('point_avg_5s_'+id).textContent;
            pointAvg = [pointAvgS1 + '|' + pointAvgS2 + '|' + pointAvgS3 + '|' + pointAvgS4 + '|' + pointAvgS5];
            inspection['data'] = {details, pointAvg};

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

/**************************
 * Check empty dept pattern
 **************************/
function checkEmptyDeptPattern() {
    let department_id = $('#selectDeptList').val();
    let team_id = $('#selectTeamList').val();
    $.ajax({
        type: 'GET',
        url: '/departments/getDeptPattern',
        data: { department_id: department_id },
        success: function (res) {
            let deptPatternId = res.dept_pattern_id;
            let data = setParam();
            if (deptPatternId && team_id) {
                $('#errorLabelNoDeptPattern').hide();
                $('#errorLabelNoTeam').hide();
                $('#tableDetailInspection').show();
                $('#btnSave').show();
                $('#btnAdd').show();
                // Load data
                loadInspectionData(data);
            } else if (!deptPatternId && team_id) {
                $('#errorLabelNoDeptPattern').show();
                $('#errorLabelNoTeam').hide();
                $('#tableDetailInspection').hide();
                $('#btnSave').hide();
                $('#btnAdd').hide();
            } else if (deptPatternId && !team_id) {
                $('#errorLabelNoDeptPattern').hide();
                $('#errorLabelNoTeam').show();
                $('#tableDetailInspection').hide();
                $('#btnSave').hide();
                $('#btnAdd').hide();
            } else {
                $('#errorLabelNoDeptPattern').show();
                $('#errorLabelNoTeam').show();
                $('#tableDetailInspection').hide();
                $('#btnSave').hide();
                $('#btnAdd').hide();
            }
        }
    });
}


/***************
 * Open Evidence
 ***************/
function openEvidenceDialog(_inspection_id) {
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
        avgS1[key] = pointAvg.toFixed(1);
        $('#point_avg_1s_' + key).text(avgS1[key]);
    }

    for (let key in sumS2) {
        pointAvg = 0;
        if (Number(countS2[key]) != 0) {
            pointAvg = Number(sumS2[key]) / Number(countS2[key]);
        }
        avgS2[key] = pointAvg.toFixed(1);
        $('#point_avg_2s_' + key).text(avgS2[key]);
    }

    for (let key in sumS3) {
        pointAvg = 0;
        if (Number(countS3[key]) != 0) {
            pointAvg = Number(sumS3[key]) / Number(countS3[key]);
        }
        avgS3[key] = pointAvg.toFixed(1);
        $('#point_avg_3s_' + key).text(avgS3[key]);
    }

    for (let key in sumS4) {
        pointAvg = 0;
        if (Number(countS4[key]) != 0) {
            pointAvg = Number(sumS4[key]) / Number(countS4[key]);
        }
        avgS4[key] = pointAvg.toFixed(1);
        $('#point_avg_4s_' + key).text(avgS4[key]);
    }

    for (let key in sumS5) {
        pointAvg = 0;
        if (Number(countS5[key]) != 0) {
            pointAvg = Number(sumS5[key]) / Number(countS5[key]);
        }
        avgS5[key] = pointAvg.toFixed(1);
        $('#point_avg_5s_' + key).text(avgS5[key]);
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
        let config = configRadarChart(array5s[e], 0);
        const ctx = document.getElementById('myChart_'+ e);
        RenderRadarChart[e] = new Chart(ctx, config);
    }
}

/******************
 * Create bar chart
 ******************/
function createBarChart(arrayPoint) {
    let datasets =[arrayPoint['S1'], arrayPoint['S2'], arrayPoint['S3'], arrayPoint['S4'], arrayPoint['S5']]
    const labels = [];
    for (let index = 0; index < inspIds.length; index++) {
      labels.push('');
    }
    let config = configBarChart(labels, datasets);
    const ctx = document.getElementById('myBarChart');
    RenderBarChart = new Chart(ctx, config);
}

/*****************************
 * Send data without saving db
 *****************************/
function sendDataWithoutSaveDB() {
    // Get valid details
    let requests = [];
    $('input[id^=hidInspectionId]').each(function() {
        let id = $(this).val();
        let inspection_date = "";
        let getdate = $('#txtInspectionDate_'+id).datepicker("getDate");
        if (getdate && getdate instanceof Date) {
          inspection_date = $.datepicker.formatDate("yy-mm-dd", getdate);
        }
        let area_id = $("#hidAreaId").val();
        $('input[id^=hidLocationId_]').each(function(_i, l) {
          let location_id = $(l).val();
          let area_location_index = $('#hidAreaLocationIndex_'+location_id).val();
          $('select[id^=selPointValue-'+id+'-'+area_location_index+']').each(function(_k, e) {
            let method = $(e).data('5s');
            let point_value = $(e).find(":selected").val();
            let inspection = {
              'inspection_id': id,
              'inspection_date': inspection_date,
              'area_id': area_id,
              'location_id': location_id,
              '5s': method,
              'point_value': point_value,
              'count_evidence': '',
            };
            // Add inspection to request
            requests.push(inspection);
          });
        });
    });
    return requests;
}

// Add column click
// $("#btnAdd").click(function () {
function addColumn() {
    let data = setParam();
    let presentData = sendDataWithoutSaveDB();
    // Load data
    loadInspectionData(data, MODE_NEW, presentData);
}

//********************//---DOCUMENT---CREATE---CHART---END---//********************//
//*********************************************************************************//


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////---DOCUMENT---READY---//////////////////////////////////
$(function () {
    // Call ajax get list data department
    let accountAdmin = $('#hidAuthUserId').val();
    if (accountAdmin == 1) {
        $.ajax({
            type: 'GET',
            url: '/departments/comp_list',
            success: function (res) {
                let html = '';
                for (let e of res.rows) {
                    html += '<option value="' + e.id + '">' + e.company['name'] + ' - ' + e.name +'</option>';
                }
                $('#selectDeptList').html(html);
                $('#selectDeptList').change();
            }
        });
    } else {
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
    }

    // On change select department
    $('#selectDeptList').change(function () {
        onChangeDataDepartment();
    });

    // On change select department
    $('#selectTeamList').change(function () {
        checkEmptyDeptPattern();
    });

    // Save click
    $("#btnSave").click(function () {
        $("#modalSaveInspectionData").modal("show");
        $("#modalSaveInspectionData").addClass("show");
    });

    $("#modalSaveInspectionData").on('hidden.bs.modal', function (e) {
        $("#modalSaveInspectionData").removeClass("show");
    })

    if ($("#hidTeamId").val()) {
        let data = setParam();
        loadInspectionData(data);
    }
});
