let numberArea = 0;
let numberNo = 1;
let listTitle = [];
let rowIsSelected = [];
let rowIsDeleted = [];

let countMinusArea = 0;
let indexArea = 0;
let tabIndexRow = 1;
let elementSkillMap;
let first = true;
let isDeleted = false;
let currentNoNumber = 0;
let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
let maxLengthCurrent = 0;
let updatedAtChanged = "";
let sParam = null;
let sCreateDate = null;
let sUpdateDate = null;

/**
 * Generate UI dropdown
 * @param  {} id
 * @param  {} placeholder
 * @param  {} optionItems
 * @param  {} isEventOnchange
 * @param  {} value
 */
function dropdownOptions(id, placeholder, optionItems, value, skillUp) {
    let html = '';
    if (isSafari) {
        html = "<select class='form-select' tabindex='" + tabIndexRow + "' data-skillup='" + skillUp + "' id='" + id + "' style='background-image: none;background: " + skillUp + ";padding-right: 0;text-align: center;text-align-last: center; font-size: 15px;'" +
        "aria-label='Select sample' " + onchange + ">" +
        "<option selected value='placeholder'>" + placeholder + "</option>";
    } else {
        html = "<select class='form-select' tabindex='" + tabIndexRow + "' data-skillup='" + skillUp + "' id='" + id + "' style='background-image: none;background: " + skillUp + ";padding-right: 0;padding-left: 0;text-align: center;text-align-last: center; font-size: 15px;'" +
        "aria-label='Select sample' " + onchange + ">" +
        "<option selected value='placeholder'>" + placeholder + "</option>";
    }

    html += "<ul class='dropdown-menu' style='align-items: center;' aria-labelledby='" + id + "'>";

    for (let item of optionItems) {
        if (value && value === item) {
            html += "<option selected value='" + item + "'>" + item + "</option>";
        } else {
            html += "<option value='" + item + "'>" + item + "</option>";
        }
    }

    html += "</select>";

    tabIndexRow++;

    return html;
}

/**
 * Generate UI input with multiple event
 * @param  {} id
 * @param  {} numberArea
 * @param  {} row
 * @param  {} col
 * @param  {} placeholder
 * @param  {} customAttr
 */
function inputs(id, numberArea, row, col, placeholder, customAttr) {
    customAttr = customAttr ? customAttr : "";
    let html = "<input type='text' tabindex= '" + tabIndexRow + "' " + customAttr + " class='form-control center-text-input' id='" + numberArea + "-" + id + "-" + row + "-" + col + "'" + " placeholder='" + placeholder + "'/>";
    tabIndexRow++;
    return html;
}

/**
 * Add new row
 * @param  {} row
 * @param  {} indexArea
 * @param  {} element
 */
function addRow(_row, indexAreaAddRow, _element) {
    let newRow = generateTable(1, '', null, indexAreaAddRow, true);
    $('#table-left tbody').find('.rowData-left-' + indexAreaAddRow + ':last').before(newRow[0]);

    // Table auto-size
    tableAutoSize();

    // Up rowspan
    $('#areaId-' + indexAreaAddRow).find('th').attr('rowspan', Number.parseInt($('#areaId-' + indexAreaAddRow).find('th').attr('rowspan')) + 1);
    defaultNoNumber();
}

/**
 * HightLight row when select, with removed = true is clear row
 * @param  {} row
 * @param  {} indexArea
 * @param  {} element
 * @param  {} removed
 * @param  {} color
 * @param  {} delay
 */
function selectedRow(row, indexArea, element, removed, color, delay) {
    let colorBackgroundHightLight = color ? color : '#5495f8';
    row = element ? parseInt($(element).text()) : row;

    // Start from area 2nd up
    if ($(".area-class").length > 1 && !removed) {
        // check row inside area
        let limitRowInSideArea = 0;
        let countArea = 0;
        let tmpRow = row;
        let categories = $(".area-class");
        for (let i = 0; i < categories.length; i++) {
            limitRowInSideArea += Number.parseInt($(categories[i]).attr('rowspan')) - 1;
            let nameArea = $(categories[i]).html();
            if (nameArea.length >= 30 && limitRowInSideArea <= 3) {
                $(categories[i]).attr('data-toggle', 'tooltip');
                $(categories[i]).attr('title', nameArea);
            }
            if (tmpRow < limitRowInSideArea) {
                indexArea = countArea;
                break;
            }
            countArea++;
            tmpRow++;
        }
        row = row + indexArea;
    }

    let pos = rowIsSelected.findIndex(e => e.row == row);

    if (removed) {
        $('#table-left tbody tr[class*="rowData-left"]').eq(row - 1).remove();

        // Minus rowspan value=1
        $('#areaId-' + indexArea).find('th').attr('rowspan', Number.parseInt($('#areaId-' + indexArea).find('th').attr('rowspan')) - 1);
        if (Number.parseInt($('#areaId-' + indexArea).find('th').attr('rowspan')) <= 2) { // 1 is add row number
            $('#areaId-' + indexArea).remove();

            $('#table-left tbody').find('.rowData-left-' + indexArea).remove();
            countMinusArea++;
        }

        let categories = $(".area-class");
        let lengthRow = $('.rowData-left-' + indexArea).length;
        let maxLength = 0;
        for (let i = 0; i < categories.length; i++) {
            let tmp = $('.rowData-left-' + i.toString()).length - 1;
            if (maxLength < tmp) {
                maxLength = tmp;
            }
            let nameArea = $(categories[i]).attr('data-full-name');
            if (nameArea.length >= 30 && lengthRow <= 3) {
                let subName = nameArea.substr(0, 2) + ' ...';
                $(categories[i]).html(subName);
            }
        }
        if (maxLength != 0) {
            maxLengthCurrent = maxLength;
        }
        defaultNoNumber();
    } else {
        if (pos == -1) {
            let objRowData = $('#table-left tbody tr[class*="rowData-left"]').eq(row - 1).attr('class');
            indexArea = objRowData ? objRowData.split('-')[2] : indexArea;
            $('#table-left tbody tr[class*="rowData-left"]').eq(row - 1).css({ 'background': colorBackgroundHightLight });

            if (delay) {
                setTimeout(() => {
                    $('#table-left tbody tr[class*="rowData-left"]').eq(row - 1).css({ 'background': '' });

                    // Remove row is selected
                    rowIsSelected.splice(pos, 1);
                }, delay);
            } else {
                // Save row is selected
                rowIsSelected.push({
                    'row': row,
                    'indexArea': indexArea
                });
            }
        } else {
            $('#table-left tbody tr[class*="rowData-left"]').eq(row - 1).css({ 'background': '' });

            // Remove row is selected
            rowIsSelected.splice(pos, 1);
        }
    }

    // Change count text selected
    if (rowIsSelected.length > 0 && !delay) {
        $('#delete').prop('disabled', false);
    } else {
        $('#delete').prop('disabled', true);
    }
}

/**
 * Event delete multiple row
 */
function deleteRow() {
    // Delete all
    if (rowLastTable <= 0 || rowIsSelected.length == rowLastTable) {
        $('#table-left tbody').empty();
    }

    rowIsSelected.sort((a, b) => parseInt(a.row) - parseInt(b.row));
    let countRowMinus = 0;
    for (let e of rowIsSelected) {

        rowIsDeleted.push({
            'indexArea': e.indexArea,
            'row': e.row
        });

        e.row = e.row - countRowMinus - countMinusArea;
        selectedRow(e.row, e.indexArea, null, true);// Delete row
        countRowMinus++;
    }

    countMinusArea = 0;
    rowIsSelected = [];
    $('#delete').html('選択行の削除');
    $('#delete').prop('disabled', true);
    $("#table-left").find("tbody tr").css({ 'background': '' });
}

/**
 * Validation number
 */
function validateNumber(e) {
    const pattern = /^[0-9]$/;
    return pattern.test(e.key)
}

/**
 * UI table group
 * @param  {} rowTable
 * @param  {} nameArea
 * @param  {} datas
 * @param  {} indexArea
 * @param  {} addRow
 */
function generateTable(rowTable, nameArea, datas, indexArea, addRow) {
    let row = parseInt(rowTable);
    let heightTd = '63px';
    let columnCountTableLeft = $('#table-left thead tr th').length - 1;

    // empty table
    if (numberArea == 0) {
        $("#table-left tbody").empty();
    }
    let htmlTableLeft = "";
    numberArea = addRow ? indexArea : numberArea;
    let currentRow = addRow ? Number.parseInt($('#areaId-' + indexArea).find('th').attr('rowspan')) - 2 : 0;
    let limitRow = addRow ? Number.parseInt($('#areaId-' + indexArea).find('th').attr('rowspan')) - 1 : row;

    if (addRow) {
        let count = 0;
        for (let e of rowIsDeleted) {
            if (e.indexArea == indexArea) {
                count++;
            }
        }
        currentRow += count;
        limitRow += count;
    }

    for (let i = currentRow; i < limitRow; i++) {
        if (i == 0 && !addRow) {
            let tooltipShowAreaName = " data-toggle='tooltip'  title='" + nameArea + "' ";
            htmlTableLeft += "<tr id='areaId-" + indexArea + "'>" +
                "<th scope='row' rowspan='" + (Number.parseInt(row) + 1) + "' class='area-class' " + tooltipShowAreaName + " data-full-name='" + nameArea + "' data-idx-area='" + numberArea + "'>" + inputs("nameArea", numberArea, i, 0, "分類名", "value='" + nameArea + "'") + "</th>" +
                "</tr>";
        } else if (i == (row - 1)) {
            heightTd = '40.05px';
        }
        // table left
        htmlTableLeft += "<tr class='rowData-left-" + indexArea + "' style='height: " + heightTd + "'>";
        for (let col = 1; col < columnCountTableLeft; col++) {
            if (i == row - 1 && col == 1 && !addRow) {
                // Here add row number
                htmlTableLeft += "<td style='cursor: pointer;background: rgb(206, 212, 218);' id='addRow-" + numberNo + "' onclick='addRow(" + numberNo + ", " + indexArea + ", this)'>" + "+" + "</td>";
            } else if (col == 1) {
                htmlTableLeft += "<td style='cursor: pointer;' id='noNumber-" + numberNo + "' class='noNumber' onclick='selectedRow(" + numberNo + ", " + indexArea + ", this, false)'>" + (numberNo) + "</td>";
            } else if (col == 2) {
                htmlTableLeft += "<td>" + inputs("workName", numberArea, i, col, "[A-Z][0-9]（業務名）", "value='" + (datas && datas[i] ? datas[i].skill.workName : "") + "'") + "</td>";
            } else if (col == 3) {
                let difficultyLevel = datas && datas[i] ? datas[i].skill.difficultyLevel : null;
                htmlTableLeft += "<td>" + dropdownOptions(indexArea + '-difficultyLevel-' + i, '  ', ['1', '2', '3', '4', '5'], false, difficultyLevel + '') + "</td>";
            } else {
                htmlTableLeft += "<td><div style='display: flex;'>" +
                    inputs("trainingPeriod", numberArea, i, col, "1-999", "value='" + (datas && datas[i] ? datas[i].skill.trainingPeriod : "") + "'onkeypress= 'return validateNumber(event)' pattern='\d*' maxlength='3' style='width: 63px'") +
                    "<span>ヶ月</span></div></td>";
            }
        }
        htmlTableLeft += "</tr>";
    }

    numberArea++;
    $('#numberArea').text(numberArea);
    return [htmlTableLeft];
}

/**
 * Reset no number when change row
 */
function defaultNoNumber() {
    // recreate no number
    let count = 1;
    let listNoNumber = $('.noNumber');
    listNoNumber.each(function (_idx, e) {
        $(e).html(count);
        $(e).attr('id', 'noNumber-' + count);
        // and the rest of your code
        count++;
    });

    // Update indexArea
    let elementRows = $('#table-left tbody').find('tr');
    for (let i = 0; i < elementRows.length; i++) {
        let strId = $(elementRows[i]).attr('id');
        if (strId && strId.indexOf('areaId') != -1) {
            let id = strId.split('-')[1];
            indexArea = parseInt(id) + 1;
        }
    }

    currentNoNumber = listNoNumber.length;
    let style = 'auto';
    if (listNoNumber.length >= parseInt(CONFIG.get("MAX_JOB"))) {
        // if no number more than 100, button add on table will be disabled
        style = 'none';
    }
    for (let i = 0; i < numberNo; i++) {
        // set property for button add on table list
        $('#addRow-' + i.toString()).css("pointer-events", style);
    }

    // Create tooltip
    $(".area-class").each(function (_idx, e) {
        $(e).tooltip({ placement: 'top' });
    });
}

/**
 * Set responsive
 */
function setResponsive() {
    let heightScrollYBar = $('.container').height() - $('.row').eq(0).height() + 12 - 15;
    let widthScrollXBar = $('.container').width();
    let minWidthTable = widthScrollXBar - $('#table-left').width() - 15;

    $('#scroll-table').css({ 'max-height': heightScrollYBar + 'vh' });
    $('.max-width-table').css({ 'max-width': minWidthTable + 'px' });
    $('#dateFrom').tooltip({ placement: 'right' });
    $('#dateTo').tooltip({ placement: 'right' });

    //table auto-size
    tableAutoSize();
}

/**
 * Start page
 */
function startPage() {
    let running = false;
    $('#scroll-table').scroll(function (e) {
        let newScroll = e.currentTarget.scrollTop; // .scrollLeft ...
        $('#header-2-table-left').find('th').css('top', (newScroll - 1) + 'px');

        if (running) {
            return;
        }
        running = true;

        setTimeout(() => {
            running = false;
        }, 20);
    });

    $(window).resize(function () {
        //responsive when roll screen
        setResponsive();
    });
    setResponsive();

    let url = window.location.pathname.split('/');
    let id = url[url.length - 1];
    if (!isNaN(id)) {
        showLoading();
    }

    $.ajax({
        type: 'GET',
        url: '/pattern_detail/skill_level_list',
        success: function (res) {
            let obj = {};
            for (let e of res.rows) {
                obj[e.id] = e.icon_path;
            }
        }
    });

    $('#dateFrom').datepicker({
        autoclose: true,
        dateFormat: 'yy年mm月dd日',
        language: 'ja',
        changeYear: true
    });

    $('#dateTo').datepicker({
        autoclose: true,
        dateFormat: 'yy年mm月dd日',
        language: 'ja',
        changeYear: true,
        onSelect: function(_dateText) {
            updatedAtChanged = true;
        }
    });

    let currentDate = new Date();
    $('#dateFrom').datepicker("setDate", currentDate);
    $("#dateTo").datepicker("setDate", currentDate);
    sCreateDate = dateFormatterYmd(currentDate.toLocaleString());
    sUpdateDate = dateFormatterYmd(currentDate.toLocaleString());

    if (id.match(/^[0-9]+$/)) {
        $.ajax({
            type: 'GET',
            url: '/skillmaps_list/data/' + id,
            success: function (res) {
                if (res && res.rows && res.rows.length > 0) {
                    let datas = res.rows;
                    let dCreatedAt = new Date(dateFormat(datas[0].created_at));
                    let dUpdatedAt = new Date(dateFormat(datas[0].updated_at));

                    sCreateDate = dateFormatterYmd(datas[0].created_at);
                    sUpdateDate = dateFormatterYmd(datas[0].updated_at);

                    $("#dateFrom").datepicker("setDate", dCreatedAt);
                    $("#dateTo").datepicker("setDate", dUpdatedAt);

                    $('#patternName').val(datas[0].name);
                    $('#lineName').val(datas[0].name);
                } else {
                    // None data
                    window.location = "/skillmaps_list";
                }
            }
        });
    }
    // Event Form
    const form = document.getElementById('myForm');
    form.addEventListener('submit', createNewRow);

    // Event key up
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            closeRightMenu();
        }
    });
}

/**
 * Event open modal
 */
function btnOpenModal() {
    setTimeout(() => {
        $('#area').val('');
        $('#rowTable').val('');
        $('#area').focus();
    }, 500);
}

/**
 * Event open modal back page
 */
function btnOpenModalBackPage() {
    let param = getData(null) ? getData(null)['data'] : getData(null);
    if (!param || param['result'].length == 0) {
        window.location = '/skillmaps_list';
    }
    if (!paramCompare(sParam, param)) {
        $("#backPageModalConfirm").modal('show');
    } else {
        window.location = '/skillmaps_list';
    }
}

/**
 * Event hide skill up level
 */
function hideSkillUpLevel() {
    $('#right-click-menu').hide();
}

/**
 * Hidden row
 */
function hiddenRow(indexArea) {
    //Disabled button add new row
    $('#table-left tbody').find('.rowData-left-' + indexArea + ':last input').attr('hidden', true);
    $('#table-left tbody').find('.rowData-left-' + indexArea + ':last select').attr('hidden', true);
    $('#table-left tbody').find('.rowData-left-' + indexArea + ':last span').attr('hidden', true);
}

/**
 * Create new row
 */
function createNewRow(event) {
    event.preventDefault();

    let rowTable = $('#rowTable').val();
    let arrTable = [];
    if (rowTable == "0") {
        for(let i = 0; i < 2; i++) {
            arrTable.push("");
        }
    } else {
        arrTable = generateTable((parseInt(rowTable) + 1) + '', $('#area').val(), null, indexArea);
    }
    $("#table-left tbody").append(arrTable[0]);

    // table auto-size
    tableAutoSize();

    // Disabled button add new row
    hiddenRow(indexArea);

    // recreate no number
    defaultNoNumber();
    $("#btnModalAreaCancel").click();
}

/**
 * Event validate myForm
 */
function validateMyform() {
    $('#myForm button[type="submit"]').click();
    $("#exampleModalCenter").modal('hide');
}

/**
 * Validate my form
 * @param  {} textbox
 */
function InvalidMsgMyForm(textbox) {
    if (textbox.value == '') {
        textbox.setCustomValidity(CONFIG.get("SKILL_MAP_REQUIRED"));
    } else if (textbox.validity.patternMismatch) {
        textbox.setCustomValidity(CONFIG.get("SKILL_MAP_FORMAT_NUMBER"));
    } else if (textbox.placeholder == (CONFIG.get("NUMBER_OF_LINES_IN_WORK_NAME")) && !isNaN(parseInt(textbox.value))) {
        // get number of record current on table list
        let currentNo = currentNoNumber;
        currentNo += parseInt(textbox.value);
        if (currentNo > parseInt(CONFIG.get("MAX_JOB"))) {
            textbox.setCustomValidity(CONFIG.get("MAXIMUM_OF_100_LINES"));
        } else {
            textbox.setCustomValidity('');
        }
    } else if(textbox.placeholder == (CONFIG.get("PLACE_HOLDER_AREA")) &&
        textbox.value.length > parseInt(CONFIG.get("MAX_LENGTH_AREA"))) {
            textbox.setCustomValidity(CONFIG.get("SKILL_MAP_ERROR_MAX_LENGTH"));
    } else {
        textbox.setCustomValidity('');
    }
    return true;
}

/**
 * Auto size table when scroll
 */
function tableAutoSize() {
    let heightTableLeft = $('#header-2-table-left').height();
  
    // check max value
    let maxHeight = Math.max(heightTableLeft) + 3;
    $('#header-2-table-left').css('height', maxHeight + 'px');
}

/**
 * Close right menu
 */
function closeRightMenu() {
    $('#right-click-menu').css('z-index', -1);
    $('#right-click-menu').hide();
}

/**
 * Add background to skill map
 */
function paintBgSkillMap(_event, type) {
    switch (type) {
        case 'while':
            $(elementSkillMap).find('select').css({ 'background': '' });
            $(elementSkillMap).find('select').css({ 'background-image': 'none' });
            break;
        case 'yellow':
            $(elementSkillMap).find('select').css({ 'background': type });
            break;
        default:
            $(elementSkillMap).find('select').css({ 'background': type });
            break;
    }
    $(elementSkillMap).find('select').attr('data-skillup', type);
    closeRightMenu();
}

/**
 * Open celendar 
 */
function openCalendar(name) {
    $('#' + name).focus();
}

/**
 * Validation and show message error
 */
function showErrorValidate(row, numberArea) {
    let invalid = false;

    for (let i = 0; i < $('.rowData-left-' + numberArea).length - 1; i++) {
        let listRowData = $('.rowData-left-' + numberArea).eq(i).find('td');
        let element1 = $(listRowData[1]).find('input').val();
        let element3 = $(listRowData[3]).find('input').val();
        if ((element1 != undefined && !element1) || element1.trim() === ''
            || (element3 != undefined && element3 && parseInt(element3) <= 0)
            || (element1 != undefined && element1 && element1.length > 255)
            || (element3 != undefined && element3 && isNaN(element3))) {
            let noNumber = $('.rowData-left-' + numberArea).eq(i).find('td:first').html();
            row = parseInt(noNumber);
            invalid = true;
            break;
        }
    }
    selectedRow(row, numberArea, null, false, "#dc3545", 1000);
}

/**
 * Get data from grid table
 * @Return object
 */
function getData(chart) {
    let result = [];
    let objResult = {};
    let areaData = [];
    let isError = false;

    // Get arrays area
    let arrArea = $(".area-class").map(function () {
        let obj = {
            'row': Number.parseInt($(this).attr('rowspan')) - 1,
            'name': $(this).find('input').val(),
            'idx-area': parseInt($(this).attr('data-idx-area')),
            'id': $(this).find('input').attr('id')
        }
        return obj;
    }).get();

    for (let e of arrArea) {
        if (!e['name'] || e['name'] === '' || e['name'].trim() === '' || e['name'].length > parseInt(CONFIG.get("MAX_LENGTH_AREA"))) {
            if (e['name'].length > parseInt(CONFIG.get("MAX_LENGTH_AREA"))) {
                showToast($('#toast9'), 2000, true);
            } else {
                showToast($('#toast8'), 2000, true);
            }
            setTimeout(() => {
                $('#' + e['id']).focus();
            }, 0);
            isError = true;
            return {
                valid: isError,
            };
        }
    }

    let url = window.location.pathname.split('/');
    let id = url[url.length - 1];

    let isRegisterNew = false;

    if (!id.match(/^[0-9]+$/)) {
        id = -1;
        isRegisterNew = true;
    }

    let updatedAt = "";
    if (updatedAtChanged) {
        updatedAt = dateFormat($('#dateTo').datepicker("getDate"));
    } else {
        // Get current
        updatedAt = (new Date()).toLocaleString();
    }

    objResult.skillMapId = id;
    objResult.patternName = $('#patternName').val();
    objResult.lineName = $('#lineName').val();

    objResult.createdAt = dateFormat($('#dateFrom').datepicker("getDate"));
    sCreateDate = dateFormatterYmd($('#dateFrom').datepicker("getDate"));
    objResult.updatedAt = updatedAt;
    objResult.isRegisterNew = isRegisterNew;

    if (objResult.patternName.length > 255) {
        showToast($('#toast6'), 2000, true);
        $('#patternName').focus();
        hideLoading();
        isError = true;
    }

    if (objResult.lineName.length > 255) {
        showToast($('#toast6'), 2000, true);
        $('#lineName').focus();
        hideLoading();
        isError = true;
    }

    for (let e of arrArea) {
        let objDatatable = {};
        objDatatable.areaName = e.name.replaceAll(' ', '');
        objDatatable.totalRow = e.row;
        objDatatable.datas = [];

        let numberArea = e['idx-area'];

        e.row = e.row + rowIsDeleted.length;

        if(chart) {
            // add name area and total skill in area of left table to array
            let totalSkill = parseInt(e.row) - 1; // remove row add(+)
            let val = e.name + '_' + totalSkill.toString();
            areaData.push(val);
        }
        for (let row = 0; row < (e.row - 1); row++) {
            // Skill insite Table-Left
            let objSkill = {
                'workName': $('#' + numberArea + '-workName-' + row + '-2').val(),
            };

            if ($('#' + numberArea + '-workName-' + row + '-2').attr('hidden') === 'hidden' || ((!objSkill['workName'] || objSkill['workName'] === undefined) && isDeleted)) {
                continue;
            }

            let isValid = true;
            // Validate スキルマップ項目
            if (objSkill['trainingPeriod'] && isNaN(objSkill['trainingPeriod'])) {
                isValid = false;
            } else if(objSkill['workName'] === undefined) {
                isValid = false;
            } else if (objSkill['workName'].length > 255 && !isError) {
                showToast($('#toast7'), 2000, true);
                showErrorValidate(row, numberArea);
                hideLoading();
                isError = true;
            } else if ((!objSkill['workName'] && objSkill['workName'] != undefined && !isError) && !isDeleted
                || objSkill['workName']?.trim() === '') {
                showToast($('#toast5'), 2000, true);
                showErrorValidate(row, numberArea);
                hideLoading();
                isError = true;
            }
        }
        result.push(objDatatable);
    }

    objResult.result = result;

    if (chart) {
        // add list employee and area to result
        objResult.areaList = areaData;
    }

    return {
        id: id,
        data: objResult,
        valid: isError,
    };
}

/**
 * Save data skill map
 * @Return result list object
 */
function saveDataSkillMap(isBackPage, isSave, isExportSkill, isExportChart) {
    showLoading();
    let data = getData(null) ? getData(null)['data'] : getData(null);

    if (data == undefined) {
        sParam = null;
        return;
    }

    let url = window.location.pathname.split('/');
    let id = url[url.length - 1];

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/pattern_detail/' + id,
        type: 'DELETE',
        success: function (res) {
            if (res.valid) {
                // get skill-map no value
                let search = window.location.search;
                const urlParams = new URLSearchParams(search);
                let no = urlParams.get('no');
                let _condition = {
                    data: data,
                    no,
                };

                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type: 'POST',
                    url: '/pattern_detail',
                    data: _condition,
                    success: function (result) {
                        hideLoading();
                        $('#save').prop('disabled', false);
                        if (isBackPage) {
                            showToast($('#toast1'), 2000, true, isBackPage);
                        } else {
                            showToast($('#toast1'), 2000, true);
                            setTimeout(() => {
                                if (isSave || isExportSkill || isExportChart) {
                                    // set latest data for  save param
                                    sParam = getData(null) ? getData(null)['data'] : getData(null);
                                    if (result.no) {
                                        window.location = '/skillmaps_list/' + result.id + '?no=' + result.no;
                                    }
                                    if (isSave) {
                                        // data changed
                                        sCreateDate = dateFormatterYmd($('#dateFrom').datepicker("getDate"));
                                        sUpdateDate = dateFormatterYmd($('#dateTo').datepicker("getDate"));
                                    }
                                }
                            }, 2000);
                        }
                    },
                    error: function (_request, _status, _error) {
                        $('#save').prop('disabled', false);
                        hideLoading();
                    }
                });
            }
        }
    });
    return data;
}

/**
 * Event Delete Skill Map
 */
function deleteDataSkillMap() {
    $("#btnCancelConfirm").click();
    let categories = $(".area-class");
    let size = categories.length;
    localStorage.setItem('isTransition', false);
    isDeleted = true;
    deleteRow();
    let url = window.location.pathname.split('/');
    let id = url[url.length - 1];

    if (id.match(/^[0-9]+$/)) {
        saveDataSkillMap(true);
    }
}

/**
 * Button back page
 */
function backPageSaveData(isSave) {
    if (isSave) {
        $("#backPageModalConfirm").modal('hide');
        saveDataSkillMap(true, true);
    } else {
        window.location = "/skillmaps_list";
    }
}

/**
 * Button save data change
 */
function saveDataChange() {
    $("#saveData").modal('hide');
    showLoading();
    $('#loading-inside-btn').css('display', 'block');
    $('#save').prop('disabled', true);

    saveDataSkillMap(true, false, true);

    $('#save').prop('disabled', false);
}

/**
 * Button cancel save data change
 */
function cancelSaveDataChange() {
    $("#saveData").modal('hide');
}

/**
 * First load data
 */
function init() {
    let url = window.location.pathname.split('/');
    let id = url[url.length - 1];

    $.ajax({
        type: 'GET',
        url: '/pattern_detail/list/' + id,
        success: function (res) {
            // Here get data from database
            let dataTables = res.rows;
            let count = 0;
            let max = 0;
            for (let e of dataTables) {
                if (e.datas.length > max) {
                    max = e.datas.length;
                }
                let rowTable = e.datas.length + 1;
                let arrTable = generateTable(rowTable, e.areaName, e.datas, count);
                $('#table-left tbody').append(arrTable[0]);
                // Table auto-size
                tableAutoSize();

                hiddenRow(count);
                count++;
            }

            // set latest data for  save param
            sParam = getData(null) ? getData(null)['data'] : getData(null);
        }
    }).always(function () {
        hideLoading();
    });
}

/**
 * Compare save and retrieve parameters
 * @sparam saved parameters
 * @param  retrieve parameters
 */
function paramCompare(sparam, param) {
    // same if all pass
    let result = true;
    try {
        // save parameter is null after screen display
        if (sparam == null) {
            result = false;
        } else { // since the save parameter has a callback, the loop key uses the get parameter
            for (let pname in param) {
                if (!param.hasOwnProperty(pname)) {
                    continue;
                }
                // if it is an array, compare values in a loop
                if (typeof (param[pname]) == 'object') {
                    // array length check
                    if (param[pname] == null) {
                        continue;
                    }
                    if (param[pname].length == sparam[pname].length) {
                        for (let key in param[pname]) {
                            if (!param[pname].hasOwnProperty(key)) {
                                continue;
                            }
                            if (param[pname][key] == sparam[pname][key]) {
                                continue;
                            } else if (typeof (param[pname][key]) == 'object') {
                                result = compareObject(param[pname][key], sparam[pname][key]);
                                if (!result) {
                                    break;
                                }
                            } else {
                                result = false;
                                break;
                            }
                        }
                        continue;
                    } else {
                        result = false;
                        break;
                    }
                } else if (pname != 'updatedAt') {
                    // simple comparison here for dates and strings
                    if (param[pname] == sparam[pname]) {
                        continue;
                    } else {
                        result = false;
                        break;
                    }
                }
            }
        }
        // compare insert date and update date on screen with database
        if (sCreateDate != dateFormatterYmd($('#dateFrom').datepicker("getDate"))
            || sUpdateDate != dateFormatterYmd($('#dateTo').datepicker("getDate"))) {
            return false;
        }
    } catch (e) {
        result = false;
    }
    return result;
}

/**
 * Compare source and retrieve object
 * @sparam source object
 * @param  retrieve object
 */
function compareObject(sObject, pObject) {
    let result = true;
    for (let key in sObject) {
        if (!sObject.hasOwnProperty(key)) {
            continue;
        }
        if (sObject[key] == pObject[key]) {
            continue;
        } else if (typeof (sObject[key]) == 'object') {
            result = compareObject(sObject[key], pObject[key]);
            if (!result) {
                return result;
            }
        } else {
            result = false;
            break;
        }
    }
    return result;
}

/** ------------------
 *    Event input enter of field input
 --------------------- */
 function onKeyUp(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        validateMyform();
    }
}

$(function () {
    // Event add records -> table
    $("#createNewRow").click(function () {
        createNewRow();
    });

    // Event insert database
    $("#save").click(function () {
        isDeleted = false;
        let param = getData(null);
        if (param['valid']) {
            return;
        } else if (!param || param.length == 0 || param['data']['result'].length == 0) {
            // showToast($('#toast3'), 2000, true);
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('MESSAGE_ALARM_EMPTY_TABLE'));
            return;
        } else {
            if (!paramCompare(sParam, param['data'])) {
                $("#saveData").modal('show');
            } else {
               return;
            }
        }
    });
});