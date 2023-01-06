
// Common
var name_5s = {"s1":"整理", "s2":"整頓", "s3":"清掃", "s4":"清潔", "s5":"躾"};
var highlight = '#ced4da';


function commonMethod() {
    return;
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
        if (isNaN(parseInt(textbox.value))) {
            textbox.setCustomValidity(CONFIG.get("PATTERN_FORMAT_NUMBER"));
            flag = true;
        } else if (!/^[0-9]+$/.test(textbox.value)) {
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
 * Get data from table
 */
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
    params['department'] = [];

    // get department id
    params['department'] = $('#departmentId').find(':selected').val();

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