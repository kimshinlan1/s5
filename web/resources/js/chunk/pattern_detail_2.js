
// 改善ポイントの選択 - Select 5S methods
var selected_5s = ["s1","s2"];
var count_selected_5s = selected_5s.length;
var name_5s = {"s1":"整理", "s2":"整頓", "s3":"清掃", "s4":"清潔", "s5":"躾"};
var count_rows = 0;
var select_location_to_delete = [];

// Select 5S - 改善ポイントの選択
window.select5S = function () {
    selected_5s = [];
}

// Add Location 点検箇所
window.addLocation = function (area_id, location_id, area_index, count_locations) {
    let tr = $("#area_"+area_id+"_location_"+location_id+"_row_"+area_index);
    let count_current_location = tr.find("#hidCountLocation").val();
    let current_total_rows = count_selected_5s * (parseInt(count_current_location));

    let row = ``;
    for(let i=0; i < count_selected_5s; i++) {
        let new_index = parseInt(current_total_rows) + i;
        if (i == 0) {
            row += `
            <tr id='area_`+area_id+`_location_new_row_new_`+new_index+`' class='main_location'>
                <td rowspan='`+count_selected_5s+`' onclick="selectLocationToDelete(this, '`+area_id+`', 'new')">
                    <input type='text' class='form-control' id='' value=''/>

                    <input type="hidden" id="hidLocationId" value=''/>

                </td>
                <td>`+name_5s[selected_5s[i]]+`</td>
                <td><textarea class='form-control' id='' rows='1'></textarea></td>
                <td><textarea class='form-control' id='' rows='1'></textarea></td>
                <td><textarea class='form-control' id='' rows='1'></textarea></td>
                <td><textarea class='form-control' id='' rows='1'></textarea></td>
                <td><textarea class='form-control' id='' rows='1'></textarea></td>
            </tr>
            `;

        } else {
            row += `
            <tr id='area_`+area_id+`_location_new_row_new_`+new_index+`'>
                <td>`+name_5s[selected_5s[i]]+`</td>
                <td><textarea class='form-control' id='' rows='1'></textarea></td>
                <td><textarea class='form-control' id='' rows='1'></textarea></td>
                <td><textarea class='form-control' id='' rows='1'></textarea></td>
                <td><textarea class='form-control' id='' rows='1'></textarea></td>
                <td><textarea class='form-control' id='' rows='1'></textarea></td>

                <input type="hidden" id="hidCountLocation" value=''/>
            </tr>
            `;
        }
    }

    // Insert location todo:
    tr.next("*:lt("+current_total_rows+")").after(row);

    // Update rowspan
    let new_total_rows = count_selected_5s * (parseInt(count_current_location)+1);
    tr.find("td:first").attr('rowspan', new_total_rows);

    // Update count current locations
    let new_count_current_location = parseInt(count_current_location) + 1;
    $("[id*=area_"+area_id+"]").each(function() {
        $(this).find("#hidCountLocation").val(new_count_current_location);
    });
}

// Select location
window.selectLocationToDelete_BK = function(ele, area_id, location_id) {

    // Get id parent tr
    // Check tr main area
       // if main: copy main to below tr + update info (rowspan, event, count locaiton,...) + remove tr
       // else: remove tr



    // Get id parent tr
    let parent_tr = $(ele).parent();


    // Check main
    let is_main_area = parent_tr.attr('class').indexOf('main_area') >= 0 ? true : false;
    let count_location = parent_tr.find("#hidCountLocation").val();
    console.log(parent_tr.attr('id'));
    console.log(count_location);
    if (count_location > 1) {
        if (is_main_area) {
            // Update info before remove
            // let next = parseInt(count_selected_5s) + 1;
            // console.log(parent_tr.next().attr('id'));
            console.log(parent_tr.nextAll('.main_location').first().attr('id'));
            // console.log(parent_tr.nextAll(":lt("+next+")").first().attr('id'));
            // console.log(parent_tr.next("*:lt("+next+")").attr('id'));

            // let new_main = parent_tr.nextAll('.main_location').first().html(parent_tr.html());
            // console.log(new_main.html());
            // new_main.find("#hidCountLocation").val(new_main.find("#hidCountLocation").val()-1);
            // new_main.find("tr").first().attr("rowspan", new_main.find("#hidCountLocation").val() * count_selected_5s);

            parent_tr.remove();
            parent_tr.next().remove();

            // Remove tr
        }

        parent_tr.remove();
            parent_tr.next().remove();

    } else {
        // Remove tr
    }


    // todo: high-light all rows in location
}

// Select location
window.selectLocationToDelete = function(ele, area_id, location_id) {

    // Check focus input
    if ($(ele).find('input').is(":focus")) {
        return;
    }

    // todo: high-light all rows in location


    /*
    * Main process:
    *    Get all id parent tr
    *    Add to list
    *    When call func remove : regenerate html
    */

    $("[id*=area_"+area_id+"_location_"+location_id+"]").each(function() {
        select_location_to_delete.push($(this).attr('id'));
    });

    $("[id*=area_"+area_id+"]").each(function() {
        $(this).find("#hidCountLocation").val($(this).find("#hidCountLocation").val() - 1);
    });

}

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
            row["location_id"] = location_id ? location_id : "";
            row["location_name"] = $(this).find("#location").val() ? $(this).find("#location").val() : "";
            row["count_locations"] = 1;
            row["5s"] = $(this).find("#hid5S").val();
            row["level_1"] = $(this).find("#level_1").val() ? $(this).find("#level_1").val() : "";
            row["level_2"] = $(this).find("#level_2").val() ? $(this).find("#level_2").val() : "";
            row["level_3"] = $(this).find("#level_3").val() ? $(this).find("#level_3").val() : "";
            row["level_4"] = $(this).find("#level_4").val() ? $(this).find("#level_4").val() : "";
            row["level_5"] = $(this).find("#level_5").val() ? $(this).find("#level_5").val() : "";

            params.push(row);
        }

    });
    return params;
}

// Remove ocation
window.removeLocation = function() {
    // todo:

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
window.saveData = function() {
    // todo:
}


$(function () {

    // Load data
    // loadData();

    // Add New Area
    $("#openModal").click(function () {
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

        // Submit
        // $.ajax({
        //     url: "/pattern_save/",
        //     type: "POST",
        //     data: params
        // })
        // .done(function (res) {
        //     // notify
        // })
        // .fail(function (jqXHR, _textStatus, _errorThrown) {
        //     // show errors

        // })
        // .always(function () {

        // });
    });


    $("#removeLocation").click(function () {
        // if (confirm("Remove?")) {
            removeLocation();
        // }


    });



});