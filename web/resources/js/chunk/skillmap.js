let numberCategory = 0;
let isCalculatorPointRowNumber = [];
let numberNo = 1;
let listTitle = [];
let rowIsSelected = [];
let rowIsDeleted = [];
let objSkillLevel = {
    '●': 1,
    '◎': 2,
    '○': 3,
    '△': 4
};
let objMapSkillLevel = {
    1: '●',
    2: '◎',
    3: '○',
    4: '△'
};

let objMapSkillUp = {
    0: 'while',
    1: 'yellow',
    2: 'pink'
};
let countMinusCategory = 0;
let indexCategory = 0;
let tabIndexRow = 1;
let elementSkillMap;
let first = true;
let isDeleted = false;
let max_row_enable_A4 = 30;

let currentNoNumber = 0;

let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

let typeChart = 4;

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
 * @param  {} skillUp
 */
function dropdownOptions(id, placeholder, optionItems, isEventOnchange, value, skillUp) {
    let numberCategory = id.split('-')[0];
    let row = id.split('-')[2];
    let col = id.split('-')[3];
    let onchange = isEventOnchange ? " onchange='calculatorPoint(" + numberCategory + ", " + row + ", " + col + ", this)' " : "";
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
 * @param  {} numberCategory
 * @param  {} row
 * @param  {} col
 * @param  {} placeholder
 * @param  {} customAttr
 */
function inputs(id, numberCategory, row, col, placeholder, customAttr) {
    customAttr = customAttr ? customAttr : "";
    let html = "<input type='text' tabindex= '" + tabIndexRow + "' " + customAttr + " class='form-control center-text-input' id='" + numberCategory + "-" + id + "-" + row + "-" + col + "'" + " placeholder='" + placeholder + "'/>";
    tabIndexRow++;
    return html;
}

/**
 * Calculator point with require personel
 * @param  {} numberCategory
 * @param  {} row
 * @param  {} col
 * @param  {} event
 */
function calculatorPoint(numberCategory, row, col, event) {
    let mediumPoint = 1;
    let value = $('#' + numberCategory + '-tableRight-' + row + '-1').text();
    let item = $(event).find(":selected").text();
    let resultPoint = value;
    let pos = isCalculatorPointRowNumber.findIndex(x => x.row == row && x.col == col && x.numberCategory == numberCategory);

    if (item && item.trim() !== '' && pos == -1 && objSkillLevel[item] != 3 && objSkillLevel[item] != 4) {
        resultPoint = Number.parseInt(value) + mediumPoint;
        isCalculatorPointRowNumber.push({ row: row, col: col, numberCategory: numberCategory });
    } else if ((!item || item.trim() === '' || objSkillLevel[item] == 3 || objSkillLevel[item] == 4) && pos != -1) {
        resultPoint = Number.parseInt(value) - mediumPoint;
        isCalculatorPointRowNumber.splice(pos, 1);
        $(event).css({ 'background': '' });
        $(event).css({ 'background-image': 'none' });
    }
    $('#' + numberCategory + '-tableRight-' + row + '-1').html(Number.parseInt(resultPoint) + '');
    levelOfAchievement(numberCategory, row, $('#' + numberCategory + '-tableRight-' + row + '-0'));
}

/**
 * Selected condition employee
 * @param  {} numberCategory
 * @param  {} row
 * @param  {} event
 */
function levelOfAchievement(numberCategory, row, event) {
    setTimeout(() => {
        let value = $('#' + numberCategory + '-tableRight-' + row + '-1').text();
        let levelOfAchievement = $(event).val();
        let resultPoint = (Number.parseInt(value) / Number.parseInt(levelOfAchievement)) * 100;
        if (!isNaN(resultPoint) && Number.parseInt(levelOfAchievement) > 0) {
            $('#' + numberCategory + '-tableRight-' + row + '-2').find('.progress .progress-bar').html(Number.parseInt(resultPoint) > 100 ? '100%' : parseInt(resultPoint) + '%');
            if (Number.parseInt(resultPoint) >= 100) {
                $('#' + numberCategory + '-tableRight-' + row + '-2').find('.progress .progress-bar').css({ 'background': '#198754', 'color': 'rgb(206, 212, 218)', 'width': '100%' });
            } else if (Number.parseInt(resultPoint) >= 50 && Number.parseInt(resultPoint) < 99) {
                $('#' + numberCategory + '-tableRight-' + row + '-2').find('.progress .progress-bar').css({ 'background': 'orange', 'color': '', 'width': parseInt(resultPoint) + '%' });
            } else if (Number.parseInt(resultPoint) >= 0) {
                $('#' + numberCategory + '-tableRight-' + row + '-2').find('.progress .progress-bar').css({ 'background': 'red', 'color': '', 'overflow': 'visible', 'width': parseInt(resultPoint) + '%' });
            }
        } else {
            $('#' + numberCategory + '-tableRight-' + row + '-2').find('.progress .progress-bar').html('0%');
            $('#' + numberCategory + '-tableRight-' + row + '-2').find('.progress .progress-bar').css({ 'background': '', 'color': '', 'width': '0%' });
        }

        $('#' + numberCategory + '-tableRight-' + row + '-2').find('.progress').attr('data-levelOfAchievement', !isNaN(resultPoint) && Number.parseInt(levelOfAchievement) > 0 ? parseInt(resultPoint) : "0");
    }, 1);
}

/**
 * Add new row
 * @param  {} row
 * @param  {} indexCategory
 * @param  {} element
 */
function addRow(_row, indexCategoryAddRow, _element) {
    let newRow = generateTable(1, '', null, indexCategoryAddRow, true);
    $('#table-left tbody').find('.rowData-left-' + indexCategoryAddRow + ':last').before(newRow[0]);
    $('#table-center tbody').find('.rowData-center-' + indexCategoryAddRow + ':last').before(newRow[1]);
    $('#table-right tbody').find('.rowData-right-' + indexCategoryAddRow + ':last').before(newRow[2]);

    // Table auto-size
    tableAutoSize();

    // Up rowspan
    $('#categoryId-' + indexCategoryAddRow).find('th').attr('rowspan', Number.parseInt($('#categoryId-' + indexCategoryAddRow).find('th').attr('rowspan')) + 1);
    registerEventRightLick();
    defaultNoNumber();
}

/**
 * HightLight row when select, with removed = true is clear row
 * @param  {} row
 * @param  {} indexCategory
 * @param  {} element
 * @param  {} removed
 * @param  {} color
 * @param  {} delay
 */
function selectedRow(row, indexCategory, element, removed, color, delay) {
    let colorBackgroundHightLight = color ? color : '#5495f8';
    row = element ? parseInt($(element).text()) : row;

    // Start from category 2nd up
    if ($(".category-class").length > 1 && !removed) {
        // check row inside category
        let limitRowInSideCategory = 0;
        let countCategory = 0;
        let tmpRow = row;
        let categories = $(".category-class");
        for (let i = 0; i < categories.length; i++) {
            limitRowInSideCategory += Number.parseInt($(categories[i]).attr('rowspan')) - 1;
            let nameCategory = $(categories[i]).html();
            if (nameCategory.length >= 30 && limitRowInSideCategory <= 3) {
                $(categories[i]).attr('data-toggle', 'tooltip');
                $(categories[i]).attr('title', nameCategory);
            }
            if (tmpRow < limitRowInSideCategory) {
                indexCategory = countCategory;
                break;
            }
            countCategory++;
            tmpRow++;
        }
        row = row + indexCategory;
    }

    let pos = rowIsSelected.findIndex(e => e.row == row);

    if (removed) {
        $('#table-left tbody tr[class*="rowData-left"]').eq(row - 1).remove();
        $('#table-center tbody tr[class*="rowData-center"]').eq(row - 1).remove();
        $('#table-right tbody tr[class*="rowData-right"]').eq(row - 1).remove();

        // Minus rowspan value=1
        $('#categoryId-' + indexCategory).find('th').attr('rowspan', Number.parseInt($('#categoryId-' + indexCategory).find('th').attr('rowspan')) - 1);
        if (Number.parseInt($('#categoryId-' + indexCategory).find('th').attr('rowspan')) <= 2) { // 1 is add row number
            $('#categoryId-' + indexCategory).remove();

            $('#table-left tbody').find('.rowData-left-' + indexCategory).remove();
            $('#table-center tbody').find('.rowData-center-' + indexCategory).remove();
            $('#table-right tbody').find('.rowData-right-' + indexCategory).remove();
            countMinusCategory++;
        }

        let categories = $(".category-class");
        let lengthRow = $('.rowData-left-' + indexCategory).length;
        let maxLength = 0;
        for (let i = 0; i < categories.length; i++) {
            let tmp = $('.rowData-left-' + i.toString()).length - 1;
            if (maxLength < tmp) {
                maxLength = tmp;
            }
            let nameCategory = $(categories[i]).attr('data-full-name');
            if (nameCategory.length >= 30 && lengthRow <= 3) {
                let subName = nameCategory.substr(0, 2) + ' ...';
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
            indexCategory = objRowData ? objRowData.split('-')[2] : indexCategory;
            $('#table-left tbody tr[class*="rowData-left"]').eq(row - 1).css({ 'background': colorBackgroundHightLight });
            $('#table-center tbody tr[class*="rowData-center"]').eq(row - 1).css({ 'background': colorBackgroundHightLight });
            $('#table-right tbody tr[class*="rowData-right"]').eq(row - 1).css({ 'background': colorBackgroundHightLight });

            if (delay) {
                setTimeout(() => {
                    $('#table-left tbody tr[class*="rowData-left"]').eq(row - 1).css({ 'background': '' });
                    $('#table-center tbody tr[class*="rowData-center"]').eq(row - 1).css({ 'background': '' });
                    $('#table-right tbody tr[class*="rowData-right"]').eq(row - 1).css({ 'background': '' });

                    // Remove row is selected
                    rowIsSelected.splice(pos, 1);
                }, delay);
            } else {
                // Save row is selected
                rowIsSelected.push({
                    'row': row,
                    'indexCategory': indexCategory
                });
            }
        } else {
            $('#table-left tbody tr[class*="rowData-left"]').eq(row - 1).css({ 'background': '' });
            $('#table-center tbody tr[class*="rowData-center"]').eq(row - 1).css({ 'background': '' });
            $('#table-right tbody tr[class*="rowData-right"]').eq(row - 1).css({ 'background': '' });

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
    let rowLastTable = $('#table-center tbody').find('tr').length;
    if (rowLastTable <= 0 || rowIsSelected.length == rowLastTable) {
        $('#table-left tbody').empty();
        $('#table-center tbody').empty();
        $('#table-right tbody').empty();
    }

    rowIsSelected.sort((a, b) => parseInt(a.row) - parseInt(b.row));
    let countRowMinus = 0;
    for (let e of rowIsSelected) {

        rowIsDeleted.push({
            'indexCategory': e.indexCategory,
            'row': e.row
        });

        e.row = e.row - countRowMinus - countMinusCategory;
        selectedRow(e.row, e.indexCategory, null, true);// Delete row
        countRowMinus++;
    }

    countMinusCategory = 0;
    rowIsSelected = [];
    $('#delete').html('選択行の削除');
    $('#delete').prop('disabled', true);
    $("#table-left").find("tbody tr").css({ 'background': '' });
    $("#table-center").find("tbody tr").css({ 'background': '' });
    $("#table-right").find("tbody tr").css({ 'background': '' });
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
 * @param  {} nameCategory
 * @param  {} datas
 * @param  {} indexCategory
 * @param  {} addRow
 */
function generateTable(rowTable, nameCategory, datas, indexCategory, addRow) {
    let row = parseInt(rowTable);
    let heightTd = '63px';
    let titleContent = "社員名";
    let columnCountTableLeft = $('#table-left thead tr th').length - 1;
    let columnCountTableRight = $('#table-right thead tr th').length - 1;

    // add isCalculatorPointRowNumber
    if (datas) {
        let tmpRow = 0;
        for (let data of datas) {
            let emloyees = data['employees'];
            let tmpCol = 0;
            for (let e of emloyees) {
                if (e['skillLevel'] != 99 && e['skillLevel'] != 3 && e['skillLevel'] != 4) {
                    isCalculatorPointRowNumber.push({ row: tmpRow, col: tmpCol, numberCategory: indexCategory });
                }
                tmpCol++;
            }
            tmpRow++;
        }
    }

    $('#title-table-center').html(titleContent);

    // empty table
    if (numberCategory == 0) {
        $("#table-left tbody").empty();
        $("#table-center tbody").empty();
        $("#table-right tbody").empty();
    }

    let htmlTableLeft = "";
    let tHeadTableCenter = ""

    // adding name table center
    // table center
    tHeadTableCenter += "<tr id='header-table-center' style='height: " + heightTd + "'>";
    for (let item of listTitle) {
        tHeadTableCenter += "<th style='width: 80px;' scope='col'>" + item.name + "</th>";
    }
    tHeadTableCenter += "</tr>";
    $("#table-center thead").empty();
    $("#table-center thead").append(tHeadTableCenter);

    let htmlBodyTableCenter = "";
    let htmlBodyTableRight = "";

    // auto height header
    if ($('#header-table-center').height() + 3 > 60) {
        let heightHeaderTableCenter = ($('#header-table-center').height() + 3) + 'px';
        $('#header-table-center').css('height', heightHeaderTableCenter);
    }

    numberCategory = addRow ? indexCategory : numberCategory;
    let currentRow = addRow ? Number.parseInt($('#categoryId-' + indexCategory).find('th').attr('rowspan')) - 2 : 0;
    let limitRow = addRow ? Number.parseInt($('#categoryId-' + indexCategory).find('th').attr('rowspan')) - 1 : row;

    if (!addRow) {
        checkTypeChart(limitRow - 1); // re-set for type chart for button add new;
    } else {
        checkTypeChart(limitRow); // re-set for type chart for button (+);
    }

    chooseSizeExportChart(); // disable/enable radio A3, A4

    if (addRow) {
        let count = 0;
        for (let e of rowIsDeleted) {
            if (e.indexCategory == indexCategory) {
                count++;
            }
        }
        currentRow += count;
        limitRow += count;
    }

    for (let i = currentRow; i < limitRow; i++) {
        if (i == 0 && !addRow) {
            let tooltipShowCategoryName = " data-toggle='tooltip'  title='" + nameCategory + "' ";
            htmlTableLeft += "<tr id='categoryId-" + indexCategory + "'>" +
                "<th scope='row' rowspan='" + (Number.parseInt(row) + 1) + "' class='category-class' " + tooltipShowCategoryName + " data-full-name='" + nameCategory + "' data-idx-category='" + numberCategory + "'>" + inputs("nameCategory", numberCategory, i, 0, "分類名", "value='" + nameCategory + "'") + "</th>" +
                "</tr>";
        } else if (i == (row - 1)) {
            heightTd = '40.05px';
        }
        // table left
        htmlTableLeft += "<tr class='rowData-left-" + indexCategory + "' style='height: " + heightTd + "'>";
        for (let col = 1; col < columnCountTableLeft; col++) {
            if (i == row - 1 && col == 1 && !addRow) {
                // Here add row number
                htmlTableLeft += "<td style='cursor: pointer;background: rgb(206, 212, 218);' id='addRow-" + numberNo + "' onclick='addRow(" + numberNo + ", " + indexCategory + ", this)'>" + "+" + "</td>";
            } else if (col == 1) {
                htmlTableLeft += "<td style='cursor: pointer;' id='noNumber-" + numberNo + "' class='noNumber' onclick='selectedRow(" + numberNo + ", " + indexCategory + ", this, false)'>" + (numberNo) + "</td>";
            } else if (col == 2) {
                htmlTableLeft += "<td>" + inputs("workName", numberCategory, i, col, "[A-Z][0-9]（業務名）", "value='" + (datas && datas[i] ? datas[i].skill.workName : "") + "'") + "</td>";
            } else if (col == 3) {
                let difficultyLevel = datas && datas[i] ? datas[i].skill.difficultyLevel : null;
                htmlTableLeft += "<td>" + dropdownOptions(indexCategory + '-difficultyLevel-' + i, '  ', ['1', '2', '3', '4', '5'], false, difficultyLevel + '') + "</td>";
            } else {
                htmlTableLeft += "<td><div style='display: flex;'>" +
                    inputs("trainingPeriod", numberCategory, i, col, "1-999", "value='" + (datas && datas[i] ? datas[i].skill.trainingPeriod : "") + "'onkeypress= 'return validateNumber(event)' pattern='\d*' maxlength='3' style='width: 63px'") +
                    "<span>ヶ月</span></div></td>";
            }
        }
        htmlTableLeft += "</tr>";
        // table center
        htmlBodyTableCenter += "<tr class='rowData-center-" + indexCategory + "'>";
        let listPosIndexSkillLevel = [];
        for (let col = 0; col < listTitle.length; col++) {
            let valid = (datas && datas[i] && (datas[i].employees)[col]);
            let pos = listTitle.findIndex(x => valid && x.id == (datas[i].employees)[col].employee_id);
            if (pos != -1) {
                listPosIndexSkillLevel.push({
                    'idx': pos,
                    'emloyeesIdx': col
                });
            }
            let idxSkillLevel = listPosIndexSkillLevel.findIndex(x => x.idx == col);
            let objTmp = listPosIndexSkillLevel[idxSkillLevel];
            let skillLevel = idxSkillLevel != -1 ? objMapSkillLevel[(datas[i].employees)[objTmp.emloyeesIdx].skillLevel] : null;
            let skillUp = idxSkillLevel != -1 ? objMapSkillUp[(datas[i].employees)[objTmp.emloyeesIdx].skillUp] : null;
            htmlBodyTableCenter += "<td style='height: " + (row == 0 ? '41.05px' : heightTd) + "'>" + dropdownOptions(numberCategory + '-skillLevel-' + i + '-' + col, '  ', ['●', '◎', '○', '△'], true, skillLevel, skillUp) + "</td>";
        }
        htmlBodyTableCenter += "</tr>";

        // table right
        htmlBodyTableRight += "<tr class='rowData-right-" + indexCategory + "'>";
        let onkeydownInputTableRight = " onkeydown='levelOfAchievement(" + numberCategory + ", " + i + ", this)' ";
        for (let col = 0; col < columnCountTableRight; col++) {
            let requiredPersonnel = (datas && datas[i] && (datas[i].skill) ? (datas[i].skill).required_number : '');
            let currentPersionnel = 0;
            if (datas && datas[i] && datas[i].employees) {
                for (let e of datas[i].employees) {
                    if (e.skillLevel != 99 && e.skillLevel != 3 && e.skillLevel != 4) {
                        currentPersionnel++;
                    }
                }
            }
            if (col == 0) {
                htmlBodyTableRight += "<td style='height: " + heightTd + "'>" +
                    inputs("tableRight", numberCategory, i, col, "1-999", "onkeypress= 'return validateNumber(event)' pattern='\d*' style='width: 64px;' maxlength='3' value='" + requiredPersonnel + "'" + onkeydownInputTableRight) + "</td>";
            } else if (col < 2) {
                htmlBodyTableRight += "<td style='height: " + heightTd + "' id='" + numberCategory + "-tableRight-" + i + '-' + col + "'>" + currentPersionnel + "</td>";
            } else {
                htmlBodyTableRight += "<td style='height: " + heightTd + ";width: 53px;padding: 3px' id='" + numberCategory + "-tableRight-" + i + '-' + col + "'>" +
                    "<div class='progress'>" +
                    "<div class='progress-bar' role='progressbar' style='width: 0%;' aria-valuenow='0' aria-valuemin=0' aria-valuemax='100'>0%</div>" +
                    "</div>" +
                    "</td>";
            }
        }
        htmlBodyTableRight += "</tr>";
        numberNo++;
    }

    numberCategory++;
    $('#numberCategory').text(numberCategory);
    return [htmlTableLeft, htmlBodyTableCenter, htmlBodyTableRight];
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

    // Update indexCategory
    let elementRows = $('#table-left tbody').find('tr');
    for (let i = 0; i < elementRows.length; i++) {
        let strId = $(elementRows[i]).attr('id');
        if (strId && strId.indexOf('categoryId') != -1) {
            let id = strId.split('-')[1];
            indexCategory = parseInt(id) + 1;
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
    $(".category-class").each(function (_idx, e) {
        $(e).tooltip({ placement: 'top' });
    });
}

/**
 * Set responsive
 */
function setResponsive() {
    let heightScrollYBar = $('.container').height() - $('.row').eq(0).height() + 12 - 15;
    let widthScrollXBar = $('.container').width();
    let minWidthTable = widthScrollXBar - ($('#table-left').width() + $('#table-right').width()) - 15;

    $('#scroll-table').css({ 'max-height': heightScrollYBar + 'vh' });
    $('#table-center').css({ 'min-width': minWidthTable + 'px' });
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
        $('#header-table-center').find('th').css('top', (newScroll - 36) + 'px');
        $('#header-2-table-right').find('th').css('top', (newScroll - 1) + 'px');

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
        url: '/skillmaps_detail/skill_level_list',
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
                // Load department
                if (res && res.rows && res.rows.length > 0) {
                    let datas = res.rows;
                    let dCreatedAt = new Date(dateFormat(datas[0].created_at));
                    let dUpdatedAt = new Date(dateFormat(datas[0].updated_at));

                    sCreateDate = dateFormatterYmd(datas[0].created_at);
                    sUpdateDate = dateFormatterYmd(datas[0].updated_at);

                    $("#dateFrom").datepicker("setDate", dCreatedAt);
                    $("#dateTo").datepicker("setDate", dUpdatedAt);

                    $('#lineName').val(datas[0].name);
                    $('#department').val(datas[0].department_id);
                    $('#department').attr('disabled', true);
                    $('#department').css("pointer-events", 'none');
                    onChangeDataDepartment();
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
        $('#category').val('');
        $('#rowTable').val('');
        $('#category').focus();
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
 * Add a event right click
 */
function registerEventRightLick() {
    $('#table-center tbody tr[class*="rowData-center"] td').each(function (_i, element) {
        let hidden = $(element).find('select').attr('hidden');
        $(element).bind("contextmenu", function () {
            if (!hidden) {
                let position = $(element).offset(); // position = { left: 42, top: 567 }
                let widthElement = $(element).width();
                let heightElement = $(element).height();
                position.left = position.left + widthElement;
                position['z-index'] = 999;
                if ($(window).width() <= 1263) {
                    position.top = position.top + (heightElement / 2) - 230;
                } else if ($(window).width() <= 1051) {
                    position.top = position.top + (heightElement / 2) - 235;
                } else {
                    position.top = position.top + (heightElement / 2);
                }
                $('#right-click-menu').css(position);
                $('#right-click-menu').show();

                if (first) {
                    let heightRightClickMenu = $('#right-click-menu').find('button').eq(0).height() + $('#right-click-menu').find('button').eq(1).height() + $('#right-click-menu').find('button').eq(2).height();
                    $('#right-click-menu').css('height', (heightRightClickMenu + 50) + 'px');
                    first = false;
                }

                elementSkillMap = element;
            }
            return false;
        });
    });
}

/**
 * Hidden row
 */
function hiddenRow(indexCategory) {
    //Disabled button add new row
    $('#table-left tbody').find('.rowData-left-' + indexCategory + ':last input').attr('hidden', true);
    $('#table-left tbody').find('.rowData-left-' + indexCategory + ':last select').attr('hidden', true);
    $('#table-left tbody').find('.rowData-left-' + indexCategory + ':last span').attr('hidden', true);
    $('#table-center tbody').find('.rowData-center-' + indexCategory + ':last input').attr('hidden', true);
    $('#table-center tbody').find('.rowData-center-' + indexCategory + ':last select').attr('hidden', true);
    $('#table-right tbody').find('.rowData-right-' + indexCategory + ':last input').attr('hidden', true);
    $('#table-right tbody').find('.rowData-right-' + indexCategory + ':last select').attr('hidden', true);
    $('#table-right tbody').find('.rowData-right-' + indexCategory + ':last td').html('');
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
        arrTable = generateTable((parseInt(rowTable) + 1) + '', $('#category').val(), null, indexCategory);
    }
    $("#table-left tbody").append(arrTable[0]);
    $("#table-center tbody").append(arrTable[1]);
    $("#table-right tbody").append(arrTable[2]);

    // table auto-size
    tableAutoSize();

    // Disabled button add new row
    hiddenRow(indexCategory);

    registerEventRightLick();

    // recreate no number
    defaultNoNumber();
    $("#btnModalCategoryCancel").click();
}

/**
 * Event validate myForm
 */
function validateMyFormSkillMap() {
    // Check
    if (InvalidMsgMyFormSkillMap($('#category')[0]) && InvalidMsgMyFormSkillMap($('#rowTable')[0])) {
        $('#myForm button[type="submit"]').click();
    }

    // Show validate mess if err or close modal
    if (!($('#category')[0]).checkValidity() || !($('#rowTable')[0]).checkValidity()) {
        $('#myForm')[0].reportValidity();
    } else {
        // Close modal with valid dialog
        $("#exampleModalCenter").find('#btnModalCategoryAdd').attr('data-dismiss', 'modal');
    }
}

/**
 * Validate my form
 * @param  {} textbox
 */
function InvalidMsgMyFormSkillMap(textbox) {
    let result = true;
    if (textbox.value == '') {
        textbox.setCustomValidity(CONFIG.get("SKILL_MAP_REQUIRED"));
        result = false;
    } else if (textbox.validity.patternMismatch) {
        textbox.setCustomValidity(CONFIG.get("SKILL_MAP_FORMAT_NUMBER"));
        result = false;
    } else if (textbox.placeholder == (CONFIG.get("NUMBER_OF_LINES_IN_WORK_NAME"))) {
        if (isNaN(textbox.value)) {
            result = false;
        } else {
            // get number of record current on table list
            let currentNo = currentNoNumber;
            currentNo += parseInt(textbox.value);
            if (currentNo > parseInt(CONFIG.get("MAX_JOB"))) {
                textbox.setCustomValidity(CONFIG.get("MAXIMUM_OF_100_LINES"));
                result = false;
            } else {
                textbox.setCustomValidity('');
                result = true;
            }
        }
    } else if(textbox.placeholder == (CONFIG.get("PLACE_HOLDER_CATEGORY")) &&
        textbox.value.length > parseInt(CONFIG.get("MAX_LENGTH_CATEGORY"))) {
            textbox.setCustomValidity(CONFIG.get("SKILL_MAP_ERROR_MAX_LENGTH"));
            result = false;
    } else {
        textbox.setCustomValidity('');
        result = true;
    }
    return result;
}

/**
 * Auto size table when scroll
 */
function tableAutoSize() {
    let heightTableLeft = $('#header-2-table-left').height();
    let heightTableCenter = $('#header-table-center').height();
    let heightTableRight = $('#header-2-table-right').height();
    // check max value
    let maxHeight = Math.max(heightTableLeft, heightTableCenter, heightTableRight) + 3;
    $('#header-2-table-left').css('height', maxHeight + 'px');
    $('#header-table-center').css('height', maxHeight + 'px');
    $('#header-2-table-right').css('height', maxHeight + 'px');
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
 * Event selected change item department
 */
function onChangeDataDepartment() {
    let data = {
        department_id: $('#department').val(),
    }

    if (data.department_id != -1) {
        $('#header-table-center').attr('hidden', false);
        $('#div-table-center').css({ 'overflow-x': 'auto' });
    } else {
        $('#header-table-center').html("<th>データなし</th>");
        $('#div-table-center').css({ 'overflow-x': 'hidden' });
    }
    $.ajax({
        type: 'GET',
        url: '/departments/emp_list',
        data: data,
        success: function (res) {
            $('#header-table-center').empty();
            $("#table-left tbody").empty();
            $("#table-center tbody").empty();
            $("#table-right tbody").empty();
            if (res.rows.length > 0) {
                listTitle = res.rows;
                for (let department of res.rows) {
                    $('#header-table-center').append("<th style='width: 80px;' scope='col'>" + department.name + "</th>")
                }
                $('#div-table-center').css({ 'overflow-x': 'auto' });
                init();

                if (res.rows.length > max_row_enable_A4) {
                    // Only Enable A3
                    $('#flexRadioDefault1').attr('checked', true);
                    $('#flexRadioDefault2').attr('disabled', true);
                } else {
                    // Enable A3, A4
                    $('#flexRadioDefault2').attr('checked', true);
                    $('#flexRadioDefault2').attr('disabled', false);
                }
            } else {
                $('#div-table-center').css({ 'overflow-x': 'hidden' });
                $('#header-table-center').html("<th>データなし</th>");
                listTitle = [];
            }

            // table auto-size
            tableAutoSize();
            $('#openModal').attr('disabled', (res.rows.length <= 0));
            $('#save').attr('disabled', (res.rows.length <= 0));
            $('#pdf').attr('disabled', (res.rows.length <= 0));
            $('#pdfChart').attr('disabled', (res.rows.length <= 0));
        }
    });
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
function showErrorValidate(row, numberCategory) {
    let invalid = false;

    for (let i = 0; i < $('.rowData-left-' + numberCategory).length - 1; i++) {
        let listRowData = $('.rowData-left-' + numberCategory).eq(i).find('td');
        let element1 = $(listRowData[1]).find('input').val();
        let element3 = $(listRowData[3]).find('input').val();
        if ((element1 != undefined && !element1) || element1.trim() === ''
            || (element3 != undefined && element3 && parseInt(element3) <= 0)
            || (element1 != undefined && element1 && element1.length > 255)
            || (element3 != undefined && element3 && isNaN(element3))) {
            let noNumber = $('.rowData-left-' + numberCategory).eq(i).find('td:first').html();
            row = parseInt(noNumber);
            invalid = true;
            break;
        }
    }

    if (!invalid) {
        for (let i = 0; i < $('.rowData-right-' + numberCategory).length - 1; i++) {
            let listRowData = $('.rowData-right-' + numberCategory).eq(i).find('td');
            let element1 = $(listRowData[0]).find('input').val();
            if (element1 && (parseInt(element1) <= 0 || isNaN(element1))) {
                let noNumber = $('.rowData-left-' + numberCategory).eq(i).find('td:first').html();
                row = parseInt(noNumber);
                break;
            }
        }
    }

    selectedRow(row, numberCategory, null, false, "#dc3545", 1000);
}

/**
 * Get data from grid table
 * @Return object
 */
function getData(chart) {
    let result = [];
    let objResult = {};
    let categoryData = [];
    let employeeData = [];
    let isError = false;
    if(chart) {
        // add name employee from list header of center table to array
        for (let item of listTitle) {
            employeeData.push(item.name);
        }
    }
    $(this).attr('disabled', 'true');

    // Get arrays category
    let arrCategory = $(".category-class").map(function () {
        let obj = {
            'row': Number.parseInt($(this).attr('rowspan')) - 1,
            'name': $(this).find('input').val(),
            'idx-category': parseInt($(this).attr('data-idx-category')),
            'id': $(this).find('input').attr('id')
        }
        return obj;
    }).get();

    for (let e of arrCategory) {
        if (!e['name'] || e['name'] === '' || e['name'].trim() === '' || e['name'].length > parseInt(CONFIG.get("MAX_LENGTH_CATEGORY"))) {
            if (e['name'].length > parseInt(CONFIG.get("MAX_LENGTH_CATEGORY"))) {
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
        updatedAt = dateFormat((new Date()).toLocaleString());
    }

    objResult.skillMapId = id;
    objResult.lineName = $('#lineName').val();
    objResult.departmentId = $('#department').val();
    objResult.createdAt = dateFormat($('#dateFrom').datepicker("getDate"));
    sCreateDate = dateFormatterYmd($('#dateFrom').datepicker("getDate"));
    objResult.updatedAt = updatedAt;
    objResult.isRegisterNew = isRegisterNew;

    if (objResult.lineName.length > 255) {
        showToast($('#toast6'), 2000, true);
        $('#lineName').focus();
        hideLoading();
        isError = true;
    }

    for (let e of arrCategory) {
        let objDatatable = {};
        objDatatable.categoryName = e.name.replaceAll(' ', '');
        objDatatable.totalRow = e.row;
        objDatatable.datas = [];

        let numberCategory = e['idx-category'];

        e.row = e.row + rowIsDeleted.length;

        if(chart) {
            // add name category and total skill in category of left table to array
            let totalSkill = parseInt(e.row) - 1; // remove row add(+)
            let val = e.name + '_' + totalSkill.toString();
            categoryData.push(val);
        }
        for (let row = 0; row < (e.row - 1); row++) {
            // Skill insite Table-Left
            let objSkill = {
                'workName': $('#' + numberCategory + '-workName-' + row + '-2').val(),
                'difficultyLevel': $('#' + numberCategory + '-difficultyLevel-' + row).find(":selected").text(),
                'trainingPeriod': $('#' + numberCategory + '-trainingPeriod-' + row + '-4').val()
            };

            if ($('#' + numberCategory + '-workName-' + row + '-2').attr('hidden') === 'hidden' || ((!objSkill['workName'] || objSkill['workName'] === undefined) && isDeleted)) {
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
                showErrorValidate(row, numberCategory);
                hideLoading();
                isError = true;
            } else if ((!objSkill['workName'] && objSkill['workName'] != undefined && !isError) && !isDeleted
                || objSkill['workName']?.trim() === '') {
                showToast($('#toast5'), 2000, true);
                showErrorValidate(row, numberCategory);
                hideLoading();
                isError = true;
            }

            // Employee insite Table-Center
            let listEmployee = [];
            let validDataTableCenter = false;
            for (let col = 0; col < listTitle.length; col++) {
                let skillLevel = objSkillLevel[$('#' + numberCategory + '-skillLevel-' + row + '-' + col).find(":selected").text()];
                let skillUpName = $('#' + numberCategory + '-skillLevel-' + row + '-' + col).attr('data-skillup');
                let skillUp = 0;
                switch (skillUpName) {
                    case 'yellow':
                        skillUp = 1;
                        break;
                    case 'pink':
                        skillUp = 2
                        break;
                    default:
                        break;
                }

                let skillLevelChart = 0;
                if (skillLevel) {
                    switch (skillLevel) {
                        case 1:
                            skillLevelChart = 4; // skill level
                            break;
                        case 2:
                            skillLevelChart = 3;
                            break;
                        case 3:
                            skillLevelChart = 2;
                            break;
                        case 4:
                            skillLevelChart = 1;
                            break;
                        default:
                            break;
                    }
                }
                listEmployee.push({
                    'id': listTitle[col].id,
                    'skillLevel': skillLevel ? skillLevel : 99,
                    'skillUp': skillUp,
                    'name': listTitle[col].name,
                    'skillName': objSkill['workName'],
                    'skillLevelChart': skillLevelChart,
                });
                let tmp = skillLevel || skillLevel == undefined ? skillLevel : 99;
                if (tmp == 0 && !validDataTableCenter) {
                    validDataTableCenter = false;
                } else {
                    validDataTableCenter = true;
                }
            }
            if ((!validDataTableCenter)
                && ($('#' + numberCategory + '-tableRight-' + row + '-0').val()
                && isNaN($('#' + numberCategory + '-tableRight-' + row + '-0').val())
                && $('#' + numberCategory + '-tableRight-' + row + '-0').val() != undefined && !isDeleted)// Validate 合計点数
                || (parseInt($('#' + numberCategory + '-tableRight-' + row + '-0').val()) <= 0)
                || ($('#' + numberCategory + '-tableRight-' + row + '-0').val()
                && isNaN($('#' + numberCategory + '-tableRight-' + row + '-0').val())))
            {
                isValid = false;
            } else {
                let levelOfAchievement = $('#' + numberCategory + '-tableRight-' + row + '-2').find('div').attr("data-levelOfAchievement");
                if (objSkill.trainingPeriod != undefined) {
                    objDatatable.datas.push({
                        'skill': objSkill,
                        'employees': listEmployee,
                        'requiredPersonnel': $('#' + numberCategory + '-tableRight-' + row + '-0').val(),
                        'currentPersonnel': $('#' + numberCategory + '-tableRight-' + row + '-1').html(),
                        'LevelOfAchievement': levelOfAchievement && levelOfAchievement.trim() !== '' ? levelOfAchievement : 0
                    });
                }
            }
        }
        result.push(objDatatable);
    }

    objResult.result = result;

    if (chart) {
        // add list employee and category to result
        objResult.categoryList = categoryData;
        objResult.employeeList = employeeData;
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
function saveDataSkillMap(isDeletePdf, isBackPage, isSave, isExportSkill, isExportChart) {
    showLoading();
    let data = getData(null) ? getData(null)['data'] : getData(null);

    if (data == undefined) {
        sParam = null;
        return;
    }

    if ($('#table-center tbody tr').length == 0) {
        // showToast($('#toast3'), 2000, true);
        $("#confirmDialog2").modal("show");
        $(".confirmMessage").html(CONFIG.get('MESSAGE_ALARM_EMPTY_TABLE'));
        return;
    }

    let url = window.location.pathname.split('/');
    let id = url[url.length - 1];

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/skillmaps_detail/' + id,
        type: 'DELETE',
        success: function (res) {
            if (res.valid) {
                let deletePdf = false;
                // get skill-map no value
                let search = window.location.search;
                const urlParams = new URLSearchParams(search);
                let no = urlParams.get('no');
                let departmentId = $('#department').val();
                if (isDeletePdf) {
                    deletePdf = isDeletePdf;
                }
                let _condition = {
                    data: data,
                    deletePdf: deletePdf,
                    no,
                    departmentId
                };

                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type: 'POST',
                    url: '/skillmaps_detail',
                    data: _condition,
                    success: function (result) {
                        hideLoading();
                        $('#save').prop('disabled', false);
                        if (isBackPage) {
                            showToast($('#toast1'), 2000, true, isBackPage);
                        } else {
                            showToast($('#toast1'), 2000, true);
                            setTimeout(() => {
                                if (isSave || isExportSkill || isExportChart || isDeletePdf) {
                                    // set latest data for  save param
                                    sParam = getData(null) ? getData(null)['data'] : getData(null);
                                    if (result.no) {
                                        window.location = '/skillmaps_list/' + result.id + '?no=' + result.no;
                                    }
                                    if (isSave) {
                                        // data changed
                                        sCreateDate = dateFormatterYmd($('#dateFrom').datepicker("getDate"));
                                        sUpdateDate = dateFormatterYmd($('#dateTo').datepicker("getDate"));
                                    } else if (isExportSkill) {
                                        // click button pdf skill map list
                                        createSkillMapPdf(true, sParam);
                                    } else if (isExportChart) {
                                        // click button pdf skill map chart
                                        renderChart(true);
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
    let categories = $(".category-class");
    let size = categories.length;
    if ($('#table-center tbody').find('tr').length - rowIsSelected.length > size) {
        localStorage.setItem('isTransition', false);
        isDeleted = true;
        deleteRow();
        checkTypeChart(maxLengthCurrent, true); // re-set for type chart when delete;
        chooseSizeExportChart(); // disable/enable radio A3, A4
        let url = window.location.pathname.split('/');
        let id = url[url.length - 1];

        if (id.match(/^[0-9]+$/)) {
            saveDataSkillMap(true);
        }
    } else {
        $("#confirmDialog2").modal("show");
        $(".confirmMessage").html(CONFIG.get('MESSAGE_ALARM_EMPTY_TABLE'));
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
        url: '/skillmaps_detail/list/' + id,
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
                let arrTable = generateTable(rowTable, e.categoryName, e.datas, count);
                $('#table-left tbody').append(arrTable[0]);
                $('#table-center tbody').append(arrTable[1]);
                $('#table-right tbody').append(arrTable[2]);

                // Table auto-size
                tableAutoSize();

                hiddenRow(count);
                for (let row = 0; row < rowTable; row++) {
                    levelOfAchievement(count, row, $('#' + count + '-tableRight-' + row + '-0'));
                }
                registerEventRightLick();
                count++;
            }
            if (max <= 8) {
                typeChart = 1;
            } else if (max <= 12) {
                typeChart = 2;
            } else if (max <= 16) {
                typeChart = 3;
            } else {
                typeChart = 4;
            }
            defaultNoNumber();
            chooseSizeExportChart(); // disable/enable radio A3, A4

            // set latest data for  save param
            sParam = getData(null) ? getData(null)['data'] : getData(null);
        }
    }).always(function () {
        hideLoading();
    });
}

/**
 * Set type chart
 */
function checkTypeChart(value, delFlag) {
    let type = 4; //  default is A3(1 chart on 1 page)
    if (value <= 8) {
        type = 1; // A4/A3(6 chart on 1 page)
    } else if (value <= 12) {
        type = 2; // A3(6 chart on 1 page)
    } else if (value <= 16) {
        type = 3; // A3(4 chart on 1 page)
    }
    if ((!delFlag && typeChart < type) || delFlag) {
        typeChart = type;
    }
}

/**
 * Re-choose, enable/disbale radio A3, A4 for chart
 */
function chooseSizeExportChart() {
    if (typeChart >= 2) {
        // Only Enable A3
        $('#chartRadioDefault1').attr('checked', true);
        $('#chartRadioDefault2').attr('disabled', true);
    } else {
        // Enable A3, A4
        $('#chartRadioDefault2').attr('disabled', false);
        $('#chartRadioDefault2').attr('checked', true);
    }
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
        if (sObject[key] == pObject[key] || key == 'LevelOfAchievement') {
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
        validateMyFormSkillMap();
    }
}

$(function () {
    $.ajax({
        type: 'GET',
        url: '/departments/list',
        success: function (res) {
            let html = '';
            html += '<option value=-1>選択する</option>';
            for (let e of res.rows) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#department').html(html);
            startPage();
        }
    });

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

    // On change select department
    $('#department').change(function () {
        onChangeDataDepartment();
    });


    $('#exampleModalCenter').on("hide.bs.modal", function () {
        $("#exampleModalCenter").find('#btnModalCategoryAdd').attr('data-dismiss', '');
    });
});
