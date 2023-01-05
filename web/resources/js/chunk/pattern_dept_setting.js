
// 改善ポイントの選択 - Select 5S methods
var selected_5s = [];
var params = {};
var name_5s = {"s1":"整理", "s2":"整頓", "s3":"清掃", "s4":"清潔", "s5":"躾"};
var select_location_to_delete = [];
var highlight = 'aqua';
var highlight = '#ced4da';
const maxCnt5s = 5;


// Select 5S - 改善ポイントの選択
window.select5S = function (ele) {
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
        let new_location_index = $.now();
        let new_count_current_location = parseInt(count_current_location) + 1;

        let new_total_rows = selected_5s.length + current_total_rows;

        // Set new row info from 5S 改善ポイントの選択
        let row = ``;
        for(let i=0; i < selected_5s.length; i++) {
            let new_index = parseInt(current_total_rows) + i;
            if (i == 0) {
                // row: main location
                row += `
                <tr id='area_`+area_id+`_location_new`+new_location_index+`_row_new_`+new_index+`' class='main_location'>
                    <td rowspan='`+selected_5s.length+`' onclick="selectLocationToDelete(this, '`+area_id+`', 'new`+new_location_index+`')">
                        <input type='text' class='form-control' id='location' value=''/>
                        <input type="hidden" id="hidLocationId" value=''/>
                    </td>
                    <td>
                    `+ name_5s[selected_5s[i]] +`
                    <input type="hidden" id="hid5S" value="`+ selected_5s[i] +`"/>
                    <input type="hidden" id="hidCountLocation" value="`+new_count_current_location+`"/>
                    <input type="hidden" id="hidCountLocationDelete" value="count_location_delete"/>
                    <input type="hidden" id="hidAreaRowspan" value="`+new_total_rows+`"/>
                    <input type="hidden" id="hidLocationRowspan" value="`+selected_5s.length+`"/>
                    </td>
                    <td><textarea class='form-control' id='level_1' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='level_2' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='level_3' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='level_4' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='level_5' rows='1'></textarea></td>
                </tr>
                `;

            } else {
                row += `
                <tr id='area_`+area_id+`_location_new`+new_location_index+`_row_new_`+new_index+`'>
                    <td>
                    `+ name_5s[selected_5s[i]] +`
                    <input type="hidden" id="hid5S" value="`+ selected_5s[i] +`"/>
                    <input type="hidden" id="hidCountLocation" value="`+new_count_current_location+`"/>
                    <input type="hidden" id="hidCountLocationDelete" value="count_location_delete"/>
                    <input type="hidden" id="hidAreaRowspan" value="`+new_total_rows+`"/>
                    <input type="hidden" id="hidLocationRowspan" value="`+selected_5s.length+`"/>
                    </td>
                    <td><textarea class='form-control' id='level_1' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='level_2' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='level_3' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='level_4' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='level_5' rows='1'></textarea></td>

                </tr>
                `;
            }
        }


        // Update rowspan area
        tr.find("td:first").attr('rowspan', new_total_rows);

        // todo: Loop all tr with id => Update info and Insert location
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

// Select location
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

            if ($(this).attr('id').includes(id)) {
                // Remove existed item
                select_location_to_delete = removeExistId(select_location_to_delete, $(this).attr('id'));

                // Reset high-light
                $(this).find('td').css('background-color', 'white');
            }
        });

    } else {
        // Loop all rows in area
        $("[id*=area_"+area_id+"]").each(function() {
            $(this).find("#hidCountLocationDelete").val(new_count);

            if ($(this).attr('id').includes(id)) {
                // Add item
                select_location_to_delete.push($(this).attr('id'));

                // high-light
                $(this).find('td').not('.area').css('background-color', highlight);
            }
        });
    }

    // console.log("updated:");
    // console.log(select_location_to_delete);

}

// Get data to re-render after delete
window.getValidRows = function() {

    let params = [];

    // Loop main area
    $("#table-content tbody").find("tr.main_area").each(function() {

        // Loop all locations and get rows will be deleted
        let trid = $(this).attr("id").split('_location_')[0];
        let area_name = $(this).find("#area").val();
        let delete_rows = 0;
        $('[id*='+trid+']').filter('.main_location').each(function(i, ele) {
            if ($.inArray($(ele).attr("id"), select_location_to_delete) >= 0) {
                delete_rows = delete_rows + parseInt($(ele).find("#hidLocationRowspan").val());
            }
        });

        // Loop all valid locations
        $('[id*='+trid+']').filter('.main_location').each(function(i, ele) {
            if ($.inArray($(ele).attr("id"), select_location_to_delete) < 0) {

                // Loop all rows in location
                let trid_location = $(ele).attr("id").split('_row_')[0];
                $('[id*='+trid_location+']').each(function(i, e) {
                    let id = $(e).attr("id").split("_");
                    let area_id = id[1];
                    let location_id = id[3];

                    let row = {};
                    row["area_id"] = area_id ? area_id : "";
                    row["area_name"] = area_name;
                    row["location_id"] = location_id ? location_id : "";
                    row["location_name"] = $(e).find("#location").val() ? $(e).find("#location").val() : "";
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

                });
            }
        });
    });
    return params;
}

// Remove Location
window.removeLocation = function() {
    // todo:

    if (select_location_to_delete.length == 0) {
        // todo: show warning no item to delete
        $("#confirmDialog2").modal("show");
        $(".confirmMessage").html(CONFIG.get('PATTERN_AT_LEAST_ONE_VERIFICATION_POINT_MUST_BE_CONFIGURED'));
        return;
    }

    let params = {
        remove: 1, // case remove
        selected_5s: JSON.stringify(selected_5s),
        rows: JSON.stringify(getValidRows())
    };
    // console.log(params);

    $.ajax({
        url: "/pattern_detail_generate_area/",
        type: "GET",
        data: params
    })
    .done(function (res) {
        $("#table-content tbody").html("");
        $("#table-content tbody").append(res);
        select_location_to_delete = [];
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors

    })
    .always(function () {

    });
}

// Onchange 5S methods 改善ポイントの選択
window.loadData = function() {
    let params = {
        selected_5s: JSON.stringify(selected_5s),
        id: $('#hidPatternId').val()
    };

    $.ajax({
        url: "/pattern_detail_generate_area/",
        type: "GET",
        data: params
    })
    .done(function (res) {
        $("#table-content tbody").append(res);
        if ($('#hidTotalRows')) {
            $('#countRows').html($('#hidTotalRows').val());
        }
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors

    })
    .always(function () {

    });
}

// Save
window.saveAjax = function(data) {
    // todo:
    let params = {
        data: data
    };

    $.ajax({
        url: "/pattern_dept_setting/save",
        type: "POST",
        data: params
    })
    .done(function (res) {
        // todo: notify
        showToast($('#patternSaveSuccess'), 2000, true);
        setTimeout(() => {
            if (!$('#hidPatternId').val()) {
                location.href = "/pattern_list_customer";
            } else {
                location.reload();
            }
        }, 2000);
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors
        showToast($('#toast8'), 2000, true);

    })
    .always(function () {

    });
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
function saveData() {
    $("#modalSaveData").modal('hide');
    showLoading();
    saveAjax(params);
}

/**
 * Button cancel save data
 */
function cancelSaveData() {
    $("#modalSaveData").modal('hide');
}

/**
 * Add new area to table
 */
function addAreaToTable() {
    // Add Area
    let locationNo = $('#locationNo').val();
    let areaName = $('#area').val();
    let params = {
        new: 1, // case add new (remove in case edit)
        selected_5s: JSON.stringify(selected_5s),
        total_rows: $("#table-content tbody").find("tr").length,
        new_location_no: locationNo,
        new_area_name: areaName
    };

    $.ajax({
        url: "/pattern_detail_generate_area/",
        type: "GET",
        data: params
    })
    .done(function (res) {
        $("#table-content tbody").append(res);
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors

    })
    .always(function () {

    });
    $("#modalAddInspectionPoint").modal('hide');
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
 * Button back page
 */
function backPage() {
    $("#modalBackPage").modal('hide');
    location.href = "/pattern_list";
}

/**
 * Button cancel back page
 */
function cancelBackPage() {
    $("#modalBackPage").modal('hide');
}

/**
 * todo: Test => Remove when release
 */
function setValueTest() {
    // Loop main area
    $("#table-content tbody input[type=text]").each(function() {

        $(this).val("test");
    });

    $("#table-content tbody textarea").each(function() {
        $(this).val("level");
    });
}

/**
 * List department list
 */
window.loadDeptList = function(id, mode = null) {
    let url = mode == 'edit' ? '/departments/getDepartment/' + id :  '/departments/list/' + id;
    $.ajax({
        type: 'GET',
        url: url,
        success: function (res) {
            let html = '';
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#departmentId').html(html);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus + ': ' + errorThrown);
        },
    });
}

/**
 * List department list
 */
window.loadPatternList = function(id, isPattern = null, patternId = null ) {
    $.ajax({
        url: '/pattern_list/getlist_by_department/' + id,
        type: 'GET',
        async: false
    })
    .done(function (data, _textStatus, _jqXHR) {
        let html = '';
        data.forEach(function callback(e, index) {
            if (isPattern) {
                if(index != 0 && e.id == patternId ) {
                    html += '<option value="' + e.id + '" selected>' + e.name + '</option>';
                }
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            } else {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
        });
        $('#patternId').html(html);
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // SHOW ERRORS
        failAjax(jqXHR, _textStatus, _errorThrown);
    });
}

/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {
    let id = $('#userCompanyId').val();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let deptId = urlParams.get('departmentId');
    let isPattern = urlParams.get('isPattern');
    let patternId = urlParams.get('patternId');
    if (deptId) {
        loadPatternList(deptId, isPattern, patternId);
        loadDeptList(deptId, 'edit');
        $('#departmentId').prop( "disabled",true);
    }
    else {
        if($('#userMode').val() == CONFIG.get('FREE')) {
            $('#departmentId').prop( "disabled",true);
        } else {
            $('#departmentId').prop( "disabled",false);
        }
        loadDeptList(id);
    }

    // Trigger init page

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

    let currentDate = new Date();
    $('#dateCreate').datepicker("setDate", currentDate);
    $("#dateUpdate").datepicker("setDate", currentDate);

    select5S();

    // Load data for edit
    if ($('#hidPatternId').val()) {
        loadData();
    }

    // Add New Area
    $("#openModal").click(function () {
        // todo: Check 5S (empty, ...)
        $('#area').val('');
        $('#locationNo').val('');
        if (selected_5s.length == 0) {
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('PATTERN_AT_LEAST_ONE_VERIFICATION_POINT_MUST_BE_CONFIGURED'));
            return;
        }

        $("#modalAddInspectionPoint").modal('show');
    });

    $('#patternName').keyup(function () {
        if ($('#patternName').val()) {
            $('#patternName').removeClass('is-invalid');
        }
    });

    $('#area').keyup(function () {
        if ($('#area').val()) {
            $('#area').removeClass('is-invalid');
        }
    });

    $('#location').keyup(function () {
        if ($('#location').val()) {
            $('#location').removeClass('is-invalid');
        }
    });

    // Save click
    $("#save").click(function () {
        let patternName = $('#patternName').val();
        let areaName = $('#area').val();
        let locationName = $('#location').val();
        // todo: Validate required field (pattern_name, create_date, update_date)
        if (!patternName || patternName === '') {
            showToast($('#patternNameErr'), 2000, true);
            $('#patternName').focus();
            $('#patternName').addClass('is-invalid');
            return;
        }

        // todo: Validate data table (all rows) and generate submit params
        // if (!areaName || areaName === '') {
        //     showToast($('#areaNameErr'), 2000, true);
        //     $('#area').focus();
        //     $('#area').addClass('is-invalid');
        //     return;
        // }

        // if (!locationName || locationName === '') {
        //     showToast($('#locationNameErr'), 2000, true);
        //     $('#location').focus();
        //     $('#location').addClass('is-invalid');
        //     return;
        // }

        validateAndGetDataTable();

    });

    function validateAndGetDataTable() {
        //Validate all rows and Get param to submit
        let valid = true;
    
        if (selected_5s.length == 0) {
            select5S();
        }
    
        let info = {
            'pattern_id': $('#hidPatternId').val(),
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
    
        // Loop main area
        $("#table-content tbody").find("tr.main_area").each(function() {
            // New Area
            // get area name
            let areaName = $(this).find("#area").val();
    
            // if area is empty
            if (areaName.trim().length === 0) {
                valid = false;
                $(this).find("#area").addClass('is-invalid');
            } else {
                $(this).find("#area").removeClass('is-invalid');
            }
            let area = {
                'area_name': areaName,
                'locations': [],
                'old_locations': []
            };
    
            // Loop all locations
            let trid = $(this).attr("id").split('_location_')[0];
            $('[id*='+trid+']').filter('.main_location').each(function(i, ele) {
                // New location
                // get location name on each row
                let locName = $(ele).find("#location").val();
                // if location is empty
                if (locName.trim().length === 0) {
                    valid = false;
                    $(ele).find("#location").addClass('is-invalid');
                } else {
                    $(ele).find("#location").removeClass('is-invalid');
                }
                let location = {
                    'location_name': locName,
                    'rows':{}
                };
    
                // Loop all rows in location
                let trid_location = $(ele).attr("id").split('_row_')[0];
                $('[id*='+trid_location+']').each(function(i, e) {
                    // Case Valid
                    // Add levels in 1 methos 5S (1 row)
                    let row = {};
                    for (let cnt = 1; cnt <= maxCnt5s; cnt++) {
                        let levelName = $(e).find("#level_"  + cnt).val();
                        // if level is empty
                        if (levelName.trim().length === 0) {
                            valid = false;
                            row["level_" + cnt] = "";
                            $(e).find("#level_"  + cnt).addClass('is-invalid');
                        } else {
                            row["level_" + cnt] = levelName;
                            $(e).find("#level_"  + cnt).removeClass('is-invalid');
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

    // Remove click
    $("#removeLocation").click(function () {
        if (select_location_to_delete.length == 0) {
            // todo: show warning no item to delete
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('PATTERN_AT_LEAST_ONE_VERIFICATION_POINT_MUST_BE_CONFIGURED'));
            return;
        }

        $("#modalDelectLocation").modal('show');
    });

    //Back page
    $("#backPage").click(function () {
        $("#modalBackPage").modal('show');
    })
});