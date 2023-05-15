
// Common vars
var name_5s = {"s1":"整理", "s2":"整頓", "s3":"清掃", "s4":"清潔", "s5":"躾"};
var highlight = '#ced4da';
var select_location_to_delete = [];
var count_method_delete = '';
var selected_5s = [];
const maxCnt5s = 5;
const labels = [
    '整理',
    '整頓',
    '清掃',
    '清潔',
    '躾',
];
const DEPT_CHART_COLOR = 'rgb(255,165,0, 0.5)';
const TEAM_CHART_COLOR = 'rgb(54, 162, 235, 0.5)';

// Select 5S - 改善ポイントの選択
window.select5S = function (_ele) {
    selected_5s = [];
    $('.check_5s').find('input').each(function(){
        if ($(this).is(':checked')) {
            selected_5s.push($(this).val());
        }
    });
}

// Add Location 点検箇所
window.addLocation = function (area_id, location_id, area_index) {
    setTimeout(() => {
        // Get tr info
        let tr = $("#area_"+area_id+"_location_"+location_id+"_row_"+area_index);
        let count_current_location = tr.find("#hidCountLocation").val();
        let current_total_rows = $("[id*=area_"+area_id+"]").length;
        let new_location_index = 'new'+$.now();
        let new_count_current_location = parseInt(count_current_location) + 1;
        let new_total_rows = selected_5s.length + current_total_rows;

        // Set new row info from 5S 改善ポイントの選択
        let row = ``;
        for(let i=0; i < selected_5s.length; i++) {
            let new_index = 'new_' + parseInt(current_total_rows) + i;
            let td = `
                <td class="td_point" onclick="selectMethodToDelete(this, '`+area_id+`', '`+new_location_index+`', '`+new_index+`')">
                    `+ name_5s[selected_5s[i]] +`
                    <input type="hidden" id="hid5S" value="`+ selected_5s[i] +`"/>
                    <input type="hidden" id="hidCountLocation" value="`+new_count_current_location+`"/>
                    <input type="hidden" id="hidCountLocationDelete" value="count_location_delete"/>
                    <input type="hidden" id="hidAreaRowspan" value="`+new_total_rows+`"/>
                    <input type="hidden" id="hidLocationRowspan" value="`+selected_5s.length+`"/>
                    <input type="hidden" id="hidAreaName" value=""/>
                    <input type="hidden" id="hidLocationName" value=""/>
                </td>
                <td><textarea style="resize: none; overflow: hidden; max-height: 100px;" class='form-control' id='level_1' rows='1'></textarea></td>
                <td><textarea style="resize: none; overflow: hidden; max-height: 100px;" class='form-control' id='level_2' rows='1'></textarea></td>
                <td><textarea style="resize: none; overflow: hidden; max-height: 100px;" class='form-control' id='level_3' rows='1'></textarea></td>
                <td><textarea style="resize: none; overflow: hidden; max-height: 100px;" class='form-control' id='level_4' rows='1'></textarea></td>
                <td><textarea style="resize: none; overflow: hidden; max-height: 100px;" class='form-control' id='level_5' rows='1'></textarea></td>
                `;
            if (i == 0) {
                // row: main location
                row += `
                <tr id='area_`+area_id+`_location_`+new_location_index+`_row_`+new_index+`' class='main_location'>
                    <td rowspan='`+selected_5s.length+`' onclick="selectLocationToDelete(this, '`+area_id+`', '`+new_location_index+`')" class="location">
                        <input type='text' class='form-control' id='location' value=''/>
                        <input type="hidden" id="hidLocationId" value=''/>
                    </td>
                    `+ td +`
                </tr>
                `;
            } else {
                row += `
                <tr id='area_`+area_id+`_location_`+new_location_index+`_row_`+new_index+`'>
                    `+ td +`
                </tr>
                `;
            }
        }

        // Update rowspan area
        tr.find("td:first").attr('rowspan', new_total_rows);

        // Loop all tr with id => Update info and Insert location
        let count_location_delete = "";
        $("[id*=area_"+area_id+"]").each(function(i) {
            $(this).find("#hidCountLocation").val(new_count_current_location);
            $(this).find("#hidAreaRowspan").val(new_total_rows);

            // Get for delete
            if (!count_location_delete) {
                count_location_delete = $(this).find("#hidCountLocationDelete").val() ? $(this).find("#hidCountLocationDelete").val() : 0;
            }

            // Insert location at last row
            let isLastElement = i == $("[id*=area_"+area_id+"]").length -1;
            if (isLastElement) {
                row = row.replace(/count_location_delete/g, count_location_delete);
                $(this).after(row);
            }
        });
    }, 10);
}

// Update location name
window.updateLocationName = function(ele, area_id, location_id) {
    let id = "area_"+area_id+"_location_"+location_id;
    $("[id*="+id+"]").each(function() {
        if ($(this).attr('id').includes(id)) {
            $(this).find('#hidLocationName').val($(ele).val());
        }
    });
}

// Select location and high-light
window.selectLocationToDelete = function(ele, area_id, location_id) {
    if ($(ele).find('input').is(":focus")) {
        return;
    }

    /*
    * Main process:
    *    Get all id parent tr
    *    Add to list
    *    When call func remove : regenerate html
    */
    let id = "area_"+area_id+"_location_"+location_id;
    let new_count = parseInt($(id).first().find("#hidCountLocationDelete").val()) - 1;
    if (checkExistId(select_location_to_delete, id) === true) {
        // Loop all rows in area
        $("[id*=area_"+area_id+"]").each(function() {
            $(this).find("#hidCountLocationDelete").val(new_count);

            // Check rows in selected location
            if ($(this).attr('id').includes(id)) {
                // Remove existed item
                select_location_to_delete = removeExistId(select_location_to_delete, $(this).attr('id'));

                // Reset high-light
                $(this).find('td').css('background-color', 'white');

                // todo: Remove CLASS_DELETE
                $(this).find('.point').removeClass(CLASS_DELETE);
            }
        });
    } else {
        // Loop all rows in area
        $("[id*=area_"+area_id+"]").each(function() {
            $(this).find("#hidCountLocationDelete").val(new_count);

            // Check rows in selected location
            if ($(this).attr('id').includes(id)) {
                // Add item
                select_location_to_delete.push($(this).attr('id'));

                // high-light
                $(this).find('td').not('.area').css('background-color', highlight);

                // todo: Remove CLASS_DELETE
                $(this).find('.td_point').removeClass(CLASS_DELETE);
            }
        });
    }
}

// todo: Select method and high-light
const CLASS_DELETE = "delete";
window.selectMethodToDelete = function(_ele, area_id, location_id, index) {
    /**
     * Steps:
     *   Remove existed item from {select_location_to_delete}
     *   Reset high-light location
     *   High-light this method
     *   Add class "delete" to tr
     *
     */

    let id = "area_"+area_id+"_location_"+location_id;
    let row_id = "area_"+area_id+"_location_"+location_id+"_row_"+index;

    // Loop all rows in area
    $("[id*=area_"+area_id+"]").each(function() {

        // Check rows in selected location
        if ($(this).attr('id').includes(id)) {
            // Remove existed item
            if (checkExistId(select_location_to_delete, id) === true) {
                select_location_to_delete = removeExistId(select_location_to_delete, $(this).attr('id'));
            }

            // Reset high-light
            $(this).find('td').css('background-color', 'white');

            // if: Check selected items
            // else: Check unselected items
            if ($(this).attr('id') === row_id) {

                // if: Selected => Unselected
                // else: Unselected => Selected
                if ($(this).find('.td_point').hasClass(CLASS_DELETE)) {
                    $(this).find('td').css('background-color', 'white');
                    $(this).find('.td_point').removeClass(CLASS_DELETE);
                    count_method_delete--;
                } else {
                    $(this).find('td').not('.area').not('.location').css('background-color', highlight);
                    $(this).find('.td_point').addClass(CLASS_DELETE);
                    count_method_delete++;
                }
            } else {
                if ($(this).find('.td_point').hasClass(CLASS_DELETE)) {
                    // Keep selected
                    $(this).find('td').not('.area').not('.location').css('background-color', highlight);
                } else {
                    // Reset
                    $(this).find('td').css('background-color', 'white');
                }
            }
        }
    });

    // Update rowspan (current - selected)
    let delete_rows = $('[id*='+id+']').find("."+CLASS_DELETE).length;
    let current_rows = $('[id*='+id+']').find('.td_point').length;
    $("[id*="+id+"]").each(function(_i, r) {
        $(r).find('#hidLocationRowspan').val(current_rows - delete_rows);
    });

}

// Get data to re-render after delete
window.getValidRows = function() {
    let params = [];

    // Loop main area
    $("#table-content tbody").find("tr.main_area").each(function() {

        // Loop all locations and get rows will be deleted
        let trid = $(this).attr("id").split('_location_')[0];
        let area_name = $(this).find("#area").val() ? $(this).find("#area").val() : $(this).find("#hidAreaName").val();
        let delete_rows = 0;
        $('[id*='+trid+']').filter('.main_location').each(function(_i, ele) {
            // if: selected to delete
            if ($.inArray($(ele).attr("id"), select_location_to_delete) >= 0) {
                delete_rows = delete_rows + parseInt($(ele).find("#hidLocationRowspan").val());
            }
        });

        // todo: count selected method to delete
        let len = $('[id*='+trid+']').find("."+CLASS_DELETE).length;
        if (len) {
            delete_rows = delete_rows + parseInt(len);
        }

        // Loop all valid locations
        $('[id*='+trid+']').filter('.main_location').each(function(_i, ele) {
            if ($.inArray($(ele).attr("id"), select_location_to_delete) < 0) {

                // Loop all rows in location
                let trid_location = $(ele).attr("id").split('_row_')[0];
                $('[id*='+trid_location+']').each(function(_index, e) {

                    // todo: Check if not selected method to delete (!= class "delete")
                    if (!$(e).find('.td_point').hasClass(CLASS_DELETE)) {

                        let id = $(e).attr("id").split("_");
                        let area_id = id[1];
                        let location_id = id[3];
                        let location_name = $(e).find("#location").val() ? $(e).find("#location").val() : $(e).find("#hidLocationName").val();

                        let row = {};
                        row["area_id"] = area_id ? area_id : "";
                        row["area_name"] = area_name;
                        row["location_id"] = location_id ? location_id : "";
                        row["location_name"] = location_name;
                        row["5s"] = $(e).find("#hid5S").val() ? $(e).find("#hid5S").val() : "";
                        row["level_1"] = $(e).find("#level_1").val() ? $(e).find("#level_1").val() : "";
                        row["level_2"] = $(e).find("#level_2").val() ? $(e).find("#level_2").val() : "";
                        row["level_3"] = $(e).find("#level_3").val() ? $(e).find("#level_3").val() : "";
                        row["level_4"] = $(e).find("#level_4").val() ? $(e).find("#level_4").val() : "";
                        row["level_5"] = $(e).find("#level_5").val() ? $(e).find("#level_5").val() : "";
                        row["count_locations"] = parseInt($(e).find("#hidCountLocation").val()) - parseInt($(e).find("#hidCountLocationDelete").val());
                        row["location_rowspan"] = $(e).find("#hidLocationRowspan").val() ? $(e).find("#hidLocationRowspan").val() : "";
                        row["area_rowspan"] = $(e).find("#hidAreaRowspan").val() - delete_rows;

                        params.push(row);
                    }
                });
            }
        });
    });
    return params;
}

// Remove Location and re generate html (not save)
window.removeLocation = function() {
    if (select_location_to_delete.length == 0 && count_method_delete == 0) {
        //Show warning no item to delete
        $("#confirmDialog2").modal("show");
        $(".confirmMessage").html(CONFIG.get('PATTERN_AT_LEAST_ONE_VERIFICATION_POINT_MUST_BE_CONFIGURED'));
        return;
    } else {
        let params = {
            remove: 1, // case remove
            selected_5s: JSON.stringify(selected_5s),
            rows: JSON.stringify(getValidRows())
        };

        let url = "/pattern_detail_remove";
        let method = "POST";

        let doneCallback = function (data, _textStatus, _jqXHR) {
            $("#table-content tbody").html("");
            $("#table-content tbody").append(data);
            select_location_to_delete = [];
            count_method_delete = 0;
        };

        runAjax(url, method, params, doneCallback);
    }
}

/**
 * Event validate myForm
 */
function validateMyform() {
    let errFlag = InvalidMsgMyForm($('#rowArea')[0]);
    if (!errFlag) {
        errFlag = InvalidMsgMyForm($('#locationNo')[0]);
        if (!errFlag) {
            addAreaToTable();
        }
    }
    if (!($('#rowArea')[0]).checkValidity() || !($('#locationNo')[0]).checkValidity()) {
        $('#myForm')[0].reportValidity();
    }
}

/**
 * Validate my form
 * @param  {} textbox
 */
function RemoveMsgMyForm(textbox) {
    textbox.setCustomValidity('');
}

/**
 * Validate my form
 * @param  {} textbox
 */
function InvalidMsgMyForm(textbox) {
    let flag = false;
    if ((textbox.value.trim() == '') || (textbox.value == 0)) {
        textbox.setCustomValidity(CONFIG.get("PATTERN_REQUIRED"));
        flag = true;
    } else if (textbox.validity.patternMismatch) {
        textbox.setCustomValidity(CONFIG.get("PATTERN_FORMAT_NUMBER"));
        flag = true;
    } else if (textbox.placeholder == (CONFIG.get("PLACE_HOLDER_POINT"))) {
        if (isNaN(textbox.value) || (!/^[0-9]+$/.test(textbox.value))) {
            textbox.setCustomValidity(CONFIG.get("PATTERN_FORMAT_NUMBER"));
            flag = true;
        } else {
            textbox.setCustomValidity('');
        }
    } else {
        textbox.setCustomValidity('');
    }
    return flag;
}

/**
 * Get targeted company id
 */
window.getCompanyId = function() {
    return ( $('#userCompanyId').val() == $('#kaizenbaseID').val() ) ? $('#companyOptionId').find(':selected').val() : $('#userCompanyId').val();
}

/**
 * Get data from table
 */
function validateAndGetDataTable(isSelectedFree=null, selectedPatId=null) {
    //Validate all rows and Get param to submit
    let valid = true;
    if (selected_5s.length == 0) {
        select5S();
    }

    let info = {
        'pattern_id': selectedPatId ? selectedPatId : $('#hidPatternId').val(),
        'pattern_name': $('#patternName').val(),
        'pattern_note': $('#patternNote').val(),
        'pattern_5s_selected': JSON.stringify(selected_5s),
        'pattern_created_at': dateFormat($('#dateCreate').datepicker("getDate")),
        'pattern_updated_at': dateFormat($('#dateUpdate').datepicker("getDate"))
    }
    params['info'] = info;
    params['data'] = [];
    params['old_areas'] = [];
    params['old_locations'] = [];
    params['isSelectedFree'] = isSelectedFree ? 'free' : 'paid';
    params['department'] = $('#departmentId').find(':selected').val();
    // get department id
    params['company'] = getCompanyId();

    // Loop main area
    $("#table-content tbody").find("tr.main_area").each(function() {
        // New Area
        // get area name
        let areaName = $(this).find("#area").val();
        let areaId = $(this).find('#hidAreaId').val();
        // if area is empty
        if (areaName.trim().length === 0) {
            valid = false;
            $(this).find("#area").addClass('is-invalid');
        } else {
            $(this).find("#area").removeClass('is-invalid');
        }
        let area = {
            'area_id': areaId,
            'area_name': areaName,
            'locations': [],
            'old_locations': []
        };

        // Loop all locations
        let trid = $(this).attr("id").split('_location_')[0];
        $('[id*='+trid+']').filter('.main_location').each(function(_i, ele) {
            // New location
            // get location name on each row
            let locName = $(ele).find("#location").val();
            let locationId = $(ele).find('#hidLocationId').val();
            // if location is empty
            if (locName.trim().length === 0) {
                valid = false;
                $(ele).find("#location").addClass('is-invalid');
            } else {
                $(ele).find("#location").removeClass('is-invalid');
            }
            let location = {
                'location_id': locationId,
                'location_name': locName,
                'rows':{}
            };
            // Loop all rows in location
            let trid_location = $(ele).attr("id").split('_row_')[0];
            $('[id*='+trid_location+']').each(function(_index, e) {
                // Case Valid
                // Add levels in 1 methos 5S (1 row)
                let row = {};
                for (let cnt = 1; cnt <= maxCnt5s; cnt++) {
                    let levelName = $(e).find("#level_"  + cnt).val();

                    // if level is empty
                    if (levelName.trim().length === 0) {
                        row["level_" + cnt] = "";
                    } else {
                        row["level_" + cnt] = levelName;
                    }
                }
                location['rows'][$(e).find("#hid5S").val()] = row;
            });
            area['locations'].push(location);
        });
        params['data'].push(area);

        // Add old area (for delete)
        if ($(this).find("#hidAreaId").val()) {
            params['old_areas'].push($(this).find("#hidAreaId").val());
        }
    });

    // show modal when data input is valid
    if (valid) {
        $("#modalSaveData").modal('show');
    }
}

/**
 * Open celendar
 */
function openCalendar(name) {
    $('#' + name).focus();
}

/**
 * Accept save
 */
function saveDataPattern() {
    if($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
        $("#modalSaveData").modal('hide');
        let patId = $('#selectPatternIds').val();
        let ispattern = $('#selectPatternIds').find(':selected').data('ispattern');
        saveAjax(null, patId, ispattern, true);
    } else {
        $("#modalSaveData").modal('hide');
        showLoading();
        saveAjax(params);
    }
}

/**
 * Button cancel save data
 */
function cancelSaveData() {
    $("#modalSaveData").modal('hide');
}

/**
 * Button cancel save data change
 */
function cancelAddAreaToTable() {
    $("#modalAddInspectionPoint").modal('hide');
}

/**
 * Button remove location
 */
function runRemoveLocation() {
    $("#modalDelectLocation").modal('hide');
    removeLocation();
}

/**
 * Button cancel remove location
 */
function cancelRemoveLocation() {
    $("#modalDelectLocation").modal('hide');
}

/**
 * Config create/update date with calendar
 */
function configCalendarPattern() {
    let updatedAtChanged = '';
    $('#dateCreate').datepicker({
        autoclose: true,
        dateFormat: 'yy年mm月dd日',
        language: 'ja',
        changeYear: true
    });

    $('#dateUpdate').datepicker({
        autoclose: true,
        dateFormat: 'yy年mm月dd日',
        language: 'ja',
        changeYear: true,
        onSelect: function(_dateText) {
            updatedAtChanged = true;
        }
    });

    let date_create = new Date();
    let date_update = new Date();

    if ($('#hidPatternId').val()) {
        date_create = new Date(dateFormat($('#hidDateCreate').val()));
        date_update = new Date(dateFormat($('#hidDateUpdate').val()));
    }

    $('#dateCreate').datepicker("setDate", date_create);
    $("#dateUpdate").datepicker("setDate", date_update);
}

/**
 * Load preview DB
 */
window.loadDataPreview = function(pageDest, id=null) {
    showLoading();

    let params = {
        // selected_5s: JSON.stringify(selected_5s),
        id: (id) ? id : $('#hidPatternId').val(),
        pageDest: pageDest,
    };

    let url = "/pattern_preview_generate_area";
    let method = "GET";

    let doneCallback = function (data, _textStatus, _jqXHR) {
        $("#table-content tbody").empty();
        $("#table-content tbody").append(data);
        configCalendarPattern();
    };

    runAjax(url, method, params, doneCallback);
}

/**
 * Add ellipsis to the end of the visible text.
 *
 * @param {object} ele - button element
 * @returns {void}
 */
window.formatOverflowedButtonText = function(ele) {
    let borderSize = ele.outerWidth() - ele.innerWidth();
    if (ele.prop('scrollWidth') > ele.prop('offsetWidth') || ele.prop('scrollHeight') > ele.prop('offsetHeight')) {
      ele.addClass("has-overflow");
    }
    while ( (ele.prop('scrollWidth') > ele.prop('offsetWidth')) || (ele.prop('scrollHeight') > (ele.prop('offsetHeight') + borderSize)) ) {
      // Remove characters from paragraph until the text and the overflow indicator fit
      ele.find('a').html(ele.find('a').html().substring(0, ele.find('a').text().length-1));
    }
    if (ele.hasClass('has-overflow')) {
        if (ele.find('a').text().endsWith("!!")) {
            ele.find('a').html(ele.find('a').html().slice(0, -9) + "。。。");
        } else {
            ele.find('a').html(ele.find('a').html().slice(0, -4) + "。。。");
        }
    }
}

// Check if dept or pattern has a connection
window.checkBindDeptPattern = function(deptId, patternId) {
    let res = null;
    let url = '/pattern_dept_setting/check_binding';

    let method = "POST";

    let data = {
            deptId: deptId,
            patternId: patternId ? patternId : -1
    };

    let doneCallback = function (data, _textStatus, _jqXHR) {
            res = data['success'];
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);

    };
    runAjax(url, method, data, doneCallback, failCallback, null, false);
    return res;
}

/**
 * Document Ready
 */
$(function () {
    $("#btnEditPreview").click(function () {
        let id = $('#hidPatternId').val();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let deptId = urlParams.get('departmentId');
        let compId = urlParams.get('companyId');

        window.location = '/pattern_dept_setting/' + id + '?departmentId='+ deptId + '&companyId='+ compId;
    });

    $("#btnBackPagePreview").click(function () {
        let typeBackPage = $('#hidTypeBackPage').val();
        setTimeout(() => {
            if ($('#userMode').val() == CONFIG.get('5S_MODE')['FREE']) {
                history.back(1);
            }
        }, 100);
        if (typeBackPage == CONFIG.get("PAGE_PATTERN_LIST_CUSTOMER")) {
            location.href = "/pattern_list_customer";
        } else {
            location.href = "/pattern_list";
        }
    });
});

/********************
 * Config radar chart
 ********************/
function configRadarChart(datasets, colorChart) {
    const data = {
        labels: labels,
        datasets: [{
            label: '',
            data: datasets,
            fill: true,
            backgroundColor: colorChart ? DEPT_CHART_COLOR: TEAM_CHART_COLOR,
            borderColor: colorChart ? DEPT_CHART_COLOR: TEAM_CHART_COLOR,
            pointBackgroundColor: colorChart ? DEPT_CHART_COLOR: TEAM_CHART_COLOR,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
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
    return config;
}

/******************
 * Config bar chart
 ******************/
function configBarChart(labels, datasets = null, mapObj = null) {
    const data = {
        labels: labels,
        datasets: [
            {
            label: 'S1',
            data: datasets ? datasets[0] : mapObj.get('s1'),
            backgroundColor: 'blue',
            },
            {
            label: 'S2',
            data: datasets ? datasets[1] : mapObj.get('s2'),
            backgroundColor: 'red',
            },
            {
            label: 'S3',
            data: datasets ? datasets[2] : mapObj.get('s3'),
            backgroundColor: 'green',
            },
            {
            label: 'S4',
            data: datasets ? datasets[3] : mapObj.get('s4'),
            backgroundColor: 'purple',
            },
            {
            label: 'S5',
            data: datasets ? datasets[4] : mapObj.get('s5'),
            backgroundColor: 'yellow',
            },
        ]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            maintainAspectRatio: false,
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
    return config
}

// Check if pattern has any inspection
window.checkContainInspection = function(deptId, patternId) {
    let res = null;
    let url = '/pattern_list/check_inspection_binding';

    let method = "POST";

    let data = {
            deptId: deptId,
            patternId: patternId,
    };

    let doneCallback = function (data, _textStatus, _jqXHR) {
            res = data['success'];
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);

    };
    runAjax(url, method, data, doneCallback, failCallback, null, false);
    return res;
}

// Delete patternId or delete pattern_customerId
window.deleteAjax = function(urlConfig) {
    $.ajax({
        url: urlConfig,
        type: "DELETE",
    })
    .done(function (_department, _textStatus, _jqXHR) {
        $("#patternListTable").bootstrapTable("refresh");
        showToast($("#toast2"), 3000, true);
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors
        failAjax(jqXHR, _textStatus, _errorThrown);
    })
    .always(function () {
        hideLoading();
        $("#patternListDeleteDialog").modal("hide");
    });
}
