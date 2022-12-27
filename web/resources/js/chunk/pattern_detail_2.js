
// 改善ポイントの選択 - Select 5S methods
var selected_5s = [];
var name_5s = {"s1":"整理", "s2":"整頓", "s3":"清掃", "s4":"清潔", "s5":"躾"};
var select_location_to_delete = [];
var highlight = 'aqua';

// Select 5S - 改善ポイントの選択
window.select5S = function (ele) {
    // if (ele && !$(ele).is(':checked')) {
    //     // todo:
    //     alert("Lost data, Are you sure?");
    // }

    selected_5s = [];
    $('.check_5s').find('input').each(function(){
        if ($(this).is(':checked')) {
            selected_5s.push($(this).val());
        }
    });

    // todo: reload data onchange

    console.log(selected_5s);
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


        // todo:  update lại count theo flow
        // Update rowspan

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



        // // Update rowspan (location number * selected_5s)
        // let new_total_rows = selected_5s.length * (parseInt(count_current_location)+1);
        // tr.find("td:first").attr('rowspan', new_total_rows);

        // // todo: Loop all tr with id => Update hidCountLocation and Insert location
        // let count_location_delete = "";
        // $("[id*=area_"+area_id+"]").each(function(i) {
        //     $(this).find("#hidCountLocation").val(new_count_current_location);

        //     // Get for delete
        //     if (!count_location_delete) {
        //         count_location_delete = $(this).find("#hidCountLocationDelete").val() ? $(this).find("#hidCountLocationDelete").val() : 0;
        //     }

        //     // Insert location at last row
        //     let isLastElement = i == $("[id*=area_"+area_id+"]").length -1;
        //     if (isLastElement) {
        //         row = row.replace(/count_location_delete/g, count_location_delete);
        //         $(this).after(row);
        //     }
        // });

    }, 10);
}

// Select location
window.selectLocationToDelete = function(ele, area_id, location_id) {

    // console.log("before:");
    // console.log(select_location_to_delete);
    // Check focus input
    if ($(ele).find('input').is(":focus")) {
        return;
    }

    /*
    * Main process:
    *    Get all id parent tr
    *    Add to list
    *    When call func remove : regenerate html
    */

    // setTimeout(() => {
        let id = "area_"+area_id+"_location_"+location_id;
// console.log($.inArray(id, select_location_to_delete));
        // If existed: Remove selected before
        // Else: add new item
        if (checkExistId(select_location_to_delete, id)) {
        // if ($.inArray(id, select_location_to_delete) >= 0) {
            let new_count = "";
            $("[id*=area_"+area_id+"_location_"+location_id+"]").each(function() {
                // Remove item
                let id = "area_"+area_id+"_location_"+location_id;
                select_location_to_delete = removeExistId(select_location_to_delete, id);

                // Reset high-light
                $(this).find('td').css('background-color', 'white');

                if (!new_count) {
                    new_count = parseInt($(this).find("#hidCountLocationDelete").val()) - 1;
                }
                // $(this).find("#hidCountLocationDelete").val(new_count);
            });

            $("[id*=area_"+area_id+"]").each(function() {
                // $(this).find("#hidCountLocation").val(new_count);
                $(this).find("#hidCountLocationDelete").val(new_count);
            });

        } else {
            let new_count = "";
            $("[id*=area_"+area_id+"_location_"+location_id+"]").each(function() {
                select_location_to_delete.push($(this).attr('id'));

                // high-light
                $(this).find('td').not('.area').css('background-color', highlight);
                // $(this).find('td.location').css('background-color', highlight);

                if (!new_count) {
                    new_count = parseInt($(this).find("#hidCountLocationDelete").val()) + 1;
                }
                // $(this).find("#hidCountLocationDelete").val(new_count);
            });

            $("[id*=area_"+area_id+"]").each(function() {
                // $(this).find("#hidCountLocation").val(new_count);
                $(this).find("#hidCountLocationDelete").val(new_count);
            });
        }

        // console.log("after_added:");
        // console.log(select_location_to_delete);

    // }, 10);



}

window.checkExistId = function(arr, id) {
    let result = false;
    $.each( arr, function( key, value ) {
        if (value.indexOf(id) >= 0) {
            result = true;
            return false;
        }
    });
    return result;
}

window.removeExistId = function(arr, id) {
    arr.splice( $.inArray(id,arr) , 1 );
    return arr;
}

// Get data to re-render after delete
window.getValidRows = function() {

    let params = [];

    // $("#table-content tbody").find("tr").each(function() {

    //     // Get all not in select_location_to_delete
    //     if (select_location_to_delete.length == 0 || $.inArray($(this).attr("id"), select_location_to_delete) < 0) {
    //         let id = $(this).attr("id").split("_");
    //         let area_id = id[1];
    //         let location_id = id[3];

    //         let row = {};
    //         row["area_id"] = area_id ? area_id : "";
    //         row["area_name"] = $(this).find("#area").val() ? $(this).find("#area").val() : "";
    //         row["location_id"] = location_id ? location_id : "";
    //         row["location_name"] = $(this).find("#location").val() ? $(this).find("#location").val() : "";
    //         row["5s"] = $(this).find("#hid5S").val() ? $(this).find("#hid5S").val() : "";
    //         row["level_1"] = $(this).find("#level_1").val() ? $(this).find("#level_1").val() : "";
    //         row["level_2"] = $(this).find("#level_2").val() ? $(this).find("#level_2").val() : "";
    //         row["level_3"] = $(this).find("#level_3").val() ? $(this).find("#level_3").val() : "";
    //         row["level_4"] = $(this).find("#level_4").val() ? $(this).find("#level_4").val() : "";
    //         row["level_5"] = $(this).find("#level_5").val() ? $(this).find("#level_5").val() : "";
    //         row["count_locations"] = parseInt($(this).find("#hidCountLocation").val()) - parseInt($(this).find("#hidCountLocationDelete").val());

    //         row["area_rowspan"] = $(this).find("#hidAreaRowspan").val() ? $(this).find("#hidAreaRowspan").val() : "";
    //         row["location_rowspan"] = $(this).find("#hidLocationRowspan").val() ? $(this).find("#hidLocationRowspan").val() : "";

    //         params.push(row);
    //     }

    // });


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
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors

    })
    .always(function () {

    });
}

// Save
window.saveData = function(data) {
    // todo:
    let params = {
        data: data
    };

    $.ajax({
        url: "/pattern_save",
        type: "POST",
        data: params
    })
    .done(function (res) {
        // todo: notify
        alert("OK");

        if (!$('#hidPatternId').val()) {
            setTimeout(function (){
                showToast($('#toast1'), 2000, true);
            }, 3000);
            location.href = "/pattern_list";
        } else {
            showToast($('#toast1'), 2000, true);
            location.reload();
        }
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
 * Save data change
 */
function saveDataChange() {
    $("#saveData").modal('hide');
    showLoading();

    // Get param to submit
    let params = {};
    if (selected_5s.length == 0) {
        select5S();
    }

    let info = {
        'pattern_id': $('#hidPatternId').val(),
        'pattern_name': $('#patternName').val(),
        'pattern_note': $('#patternNote').val(),
        'pattern_5s_selected': JSON.stringify(selected_5s),
        'pattern_created_at': $('#dateCreate').val(),
        'pattern_updated_at': $('#dateUpdate').val(),
    }
    params['info'] = info;
    params['data'] = [];
    params['old_areas'] = [];
    params['old_locations'] = [];

    // Loop main area
    $("#table-content tbody").find("tr.main_area").each(function() {
        // New Area
        let area = {
            'area_name': $(this).find("#area").val(),
            'locations': [],
            'old_locations': []
        };

        // Loop all locations
        let trid = $(this).attr("id").split('_location_')[0];
        $('[id*='+trid+']').filter('.main_location').each(function(i, ele) {
            // New location
            let location = {
                'location_name': $(ele).find("#location").val(),
                'rows':{}
            };

            // Loop all rows in location
            let trid_location = $(ele).attr("id").split('_row_')[0];
            $('[id*='+trid_location+']').each(function(i, e) {
                // Add levels in 1 methos 5S (1 row)
                let row = {};
                row["level_1"] = $(e).find("#level_1").val() ? $(e).find("#level_1").val() : "";
                row["level_2"] = $(e).find("#level_2").val() ? $(e).find("#level_2").val() : "";
                row["level_3"] = $(e).find("#level_3").val() ? $(e).find("#level_3").val() : "";
                row["level_4"] = $(e).find("#level_4").val() ? $(e).find("#level_4").val() : "";
                row["level_5"] = $(e).find("#level_5").val() ? $(e).find("#level_5").val() : "";
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

    saveData(params);
}

/**
 * Button cancel save data change
 */
function cancelSaveDataChange() {
    $("#saveData").modal('hide');
}

/**
 * Add new area to table
 */
function addAreaToTable() {
    // Add Area
    let rowLocation = $('#rowLocation').val();
    let areaName = $('#area').val();
    let params = {
        new: 1, // case add new (remove in case edit)
        selected_5s: JSON.stringify(selected_5s),
        total_rows: $("#table-content tbody").find("tr").length,
        new_location_no: rowLocation,
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
    $("#exampleModalCenter").modal('hide');
}

/**
 * Button cancel save data change
 */
function cancelAddAreaToTable() {
    $("#exampleModalCenter").modal('hide');
}

/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {

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
        if (selected_5s.length == 0) {
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('MESSAGE_ALARM_EMPTY_TABLE'));
            return;
        }

        $("#exampleModalCenter").modal('show');
    });

    // Save click
    $("#save").click(function () {
        let patternName = $('#patternName').val();
        let areaName = $('#area').val();
        let locationName = $('#location').val();

        // todo: Validate required field (pattern_name, create_date, update_date)
        if (!patternName || patternName === '') {
            showToast($('#toast8'), 2000, true);
            $('#patternName').focus();
            return;
        }

        // todo: Validate data table (all rows) and generate submit params
        if (!areaName || areaName === '') {
            showToast($('#toast8'), 2000, true);
            $('#area').focus();
            return;
        }

        if (!locationName || locationName === '') {
            showToast($('#toast8'), 2000, true);
            $('#location').focus();
            return;
        }

        $("#saveData").modal('show');


    });

    // Remove click
    $("#removeLocation").click(function () {
        if (select_location_to_delete.length == 0) {
            // todo: show warning no item to delete
            alert("No selected to delete");
            return;
        }

        if (confirm("Remove?")) {
            // Remove row but not save DB (need to save to update DB)
            removeLocation();
        }
    });


});