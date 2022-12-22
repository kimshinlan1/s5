
// 改善ポイントの選択 - Select 5S methods
var selected_5s = ["s1","s2"];
var count_selected_5s = selected_5s.length;
var name_5s = {"s1":"整理", "s2":"整頓", "s3":"清掃", "s4":"清潔", "s5":"躾"};
var select_location_to_delete = [];
var highlight = 'aqua';

// Select 5S - 改善ポイントの選択
window.select5S = function (ele) {
    if (!$(ele).is(':checked')) {
        // todo:
        alert("Lost data, Are you sure?");
    }

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
window.addLocation = function (area_id, location_id, area_index, count_locations) {

    // setTimeout(() => {
        let tr = $("#area_"+area_id+"_location_"+location_id+"_row_"+area_index);
        let count_current_location = tr.find("#hidCountLocation").val();
        let current_total_rows = count_selected_5s * (parseInt(count_current_location));
        // let new_location_index = parseInt(current_total_rows) + 1;
        let new_location_index = $.now();
        let new_count_current_location = parseInt(count_current_location) + 1;

        let row = ``;
        for(let i=0; i < count_selected_5s; i++) {
            let new_index = parseInt(current_total_rows) + i;
            if (i == 0) {
                row += `
                <tr id='area_`+area_id+`_location_new`+new_location_index+`_row_new_`+new_index+`' class='main_location'>
                    <td rowspan='`+count_selected_5s+`' onclick="selectLocationToDelete(this, '`+area_id+`', 'new`+new_location_index+`')">
                        <input type='text' class='form-control' id='location' value=''/>
                        <input type="hidden" id="hidLocationId" value=''/>
                    </td>
                    <td>
                    `+ name_5s[selected_5s[i]] +`
                    <input type="hidden" id="hid5S" value="`+ name_5s[selected_5s[i]] +`"/>
                    <input type="hidden" id="hidCountLocation" value="`+new_count_current_location+`"/>
                    <input type="hidden" id="hidCountLocationDelete" value="count_location_delete"/>
                    </td>
                    <td><textarea class='form-control' id='' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='' rows='1'></textarea></td>
                </tr>
                `;

            } else {
                row += `
                <tr id='area_`+area_id+`_location_new`+new_location_index+`_row_new_`+new_index+`'>
                    <td>
                    `+ name_5s[selected_5s[i]] +`
                    <input type="hidden" id="hid5S" value="`+ name_5s[selected_5s[i]] +`"/>
                    <input type="hidden" id="hidCountLocation" value="`+new_count_current_location+`"/>
                    <input type="hidden" id="hidCountLocationDelete" value="count_location_delete"/>
                    </td>
                    <td><textarea class='form-control' id='' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='' rows='1'></textarea></td>
                    <td><textarea class='form-control' id='' rows='1'></textarea></td>

                </tr>
                `;
            }
        }

        // Update rowspan
        let new_total_rows = count_selected_5s * (parseInt(count_current_location)+1);
        tr.find("td:first").attr('rowspan', new_total_rows);

        // Update hidCountLocation and Insert location
        let count_location_delete = "";
        $("[id*=area_"+area_id+"]").each(function(i) {
            $(this).find("#hidCountLocation").val(new_count_current_location);

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

    // }, 10);
}

// Select location
window.selectLocationToDelete = function(ele, area_id, location_id) {

    console.log("before:");
    console.log(select_location_to_delete);
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

        // If: Remove selected before
        // Else: add new item
        if (checkExistId(select_location_to_delete, id)) {
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

        console.log("after_added:");
        console.log(select_location_to_delete);

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
    // console.log(select_location_to_delete);

    let params = [];
    $("#table-content tbody").find("tr").each(function() {
        // console.log($.inArray($(this).attr("id"), select_location_to_delete));

        if (select_location_to_delete.length == 0 || $.inArray($(this).attr("id"), select_location_to_delete) < 0) {
            let id = $(this).attr("id").split("_");
            let area_id = id[1];
            let location_id = id[3];

            let row = {};
            row["area_id"] = area_id ? area_id : "";
            row["area_name"] = $(this).find("#area").val() ? $(this).find("#area").val() : "";


            // todo:
            row["location_id"] = location_id ? location_id : "";


            row["location_name"] = $(this).find("#location").val() ? $(this).find("#location").val() : "";
            row["5s"] = $(this).find("#hid5S").val() ? $(this).find("#hid5S").val() : "";
            row["level_1"] = $(this).find("#level_1").val() ? $(this).find("#level_1").val() : "";
            row["level_2"] = $(this).find("#level_2").val() ? $(this).find("#level_2").val() : "";
            row["level_3"] = $(this).find("#level_3").val() ? $(this).find("#level_3").val() : "";
            row["level_4"] = $(this).find("#level_4").val() ? $(this).find("#level_4").val() : "";
            row["level_5"] = $(this).find("#level_5").val() ? $(this).find("#level_5").val() : "";

            let count = parseInt($(this).find("#hidCountLocation").val()) - parseInt($(this).find("#hidCountLocationDelete").val());
            row["count_locations"] = count;

            params.push(row);
        }

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
    $.ajax({
        url: "/pattern_detail_generate_area/",
        type: "GET",
        data: {selected_5s: JSON.stringify(selected_5s)}
    })
    .done(function (res) {
        $("#table-content tbody").append(res);
        // alert($("#table-content tbody").find("tr").length);
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors

    })
    .always(function () {

    });
}

// Save
window.saveData = function(params) {
    // todo:
    $.ajax({
        url: "/pattern_save",
        type: "POST",
        data: params
    })
    .done(function (res) {
        // notify
    })
    .fail(function (jqXHR, _textStatus, _errorThrown) {
        // show errors

    })
    .always(function () {

    });
}


$(function () {

    // Load data
    // loadData();

    // Add New Area
    $("#openModal").click(function () {
        // todo: Check 5S

        // Add Area
        let params = {
            new: 1, // case add new (remove in case edit)
            selected_5s: JSON.stringify(selected_5s),
            total_rows: $("#table-content tbody").find("tr").length
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
    });

    // Save click
    $("#save").click(function () {
        // todo: Validate required field (pattern_name, create_date, update_date)


        // todo: Validate data table (all rows) and generate submit params
        let params = [];
        $("#table-content tbody").find("tr").each(function() {
            // console.log($(this).find("#area").val());

            // todo: Check required => focus => notify => stop check

            // Generate submit params
            let row = {};
            row["area"] = $(this).find("#area").val();
            row["location"] = $(this).find("#location").val();
            row["5s"] = $(this).find("#hid5S").val();
            row["level_1"] = $(this).find("#level_1").val();
            row["level_2"] = $(this).find("#level_2").val();
            row["level_3"] = $(this).find("#level_3").val();
            row["level_4"] = $(this).find("#level_4").val();
            row["level_5"] = $(this).find("#level_5").val();

            params.push(row);
        });

        console.log(params);

        saveData(params);

    });

    // Remove click
    $("#removeLocation").click(function () {
        // if (confirm("Remove?")) {
            removeLocation();
        // }
    });



});