/****************************************************
 * pdf.js
 *
 ****************************************************/
 "use strict";

const backgroundColorChart = {
    1: 'rgba(15, 144, 191, 0.5)',
    2: 'rgba(255, 240, 203, 0.5)',
    3: 'rgba(255, 228, 201, 0.5)',
    4: 'rgba(224, 224, 224, 0.5)',
    5: 'rgba(146, 208, 80, 0.5)',
    6: 'rgba(153, 153, 255, 0.5)'
};

const borderColorChart = {
    1: '#0F90BF',
    2: '#F8B200',
    3: '#EF7A00',
    4: '#595757',
    5: '#00B050',
    6: '#333399'
};

const sizePaper = {
    1: 'A3',
    2: 'A4',
};

const chart = {
    1: 1, // case less than 8 skills on 1 category
    2: 2, // case from 8 to 10 skills on 1 category
    3: 3, // case from 11 to 20 skills on 1 category
    4: 4, // case more than 20 skills on 1 category
};

let dataMaster = null;
let no = 0;
let maxLength = 6;
let cntChart = 0;
let size = sizePaper[1];
let cntColor = 1;
let width = 0;
let height = 0;
let isExportChart = false;

/* ==============================
     Global Functions
 ============================== */

/** ------------------
 *    Return page number.
 --------------------- */
window.getPageNumber = function (pageNumber) {
    return pageNumber;
}

/** ------------------
 *    Get size of paper pdf.
 --------------------- */
window.getSizePaper = function (isChart) {
    let sizePage = "";
    if (!isChart) {
        if ($("#flexRadioDefault1").prop("checked")) {
            sizePage = $("#flexRadioDefault1").val();
        }
        if ($("#flexRadioDefault2").prop("checked")) {
            sizePage = $("#flexRadioDefault2").val();
        }
    } else {
        if ($("#chartRadioDefault1").prop("checked")) {
            sizePage = $("#chartRadioDefault1").val();
        }
        if ($("#chartRadioDefault2").prop("checked")) {
            sizePage = $("#chartRadioDefault2").val();
        }
    }
    return sizePage;
}

/** ------------------
 *    Generate html header when new employee appear.
 --------------------- */
window.generateHeaderHtml = function (title, nameEmployee, startDate, endDate) {
    let tag = "";
    tag += "<table class='sub_title'>\n";
    tag += "<tr style='vertical-align: top;'>\n";
    tag += "<td>\n";

    // display title
    tag += "<p class='title'>" + title + "</p>\n";

    // display name employee
    tag += "<p class='name-employee'>" + nameEmployee + "</p>\n";
    tag += "</td>\n";

    // display date from/to
    tag += "<td class='date-from-to' style='font-size: 19px;'>&nbsp;&nbsp;&nbsp;" + "作成日:" + "&nbsp;" + startDate + "<br>" + "最終更新日:" + "&nbsp;" + endDate + "</td>";

    // display page number
    tag += "</tr>\n";
    tag += "</table>\n";
    tag += "<br/>\n";

    return tag;
}

/** ------------------
 *    Generate html page break/break line/next cell for chart.
 --------------------- */
window.generateBreakDivHtml = function (type) {
    let div = '';
    switch(type) {
    case 'page':
        div += "<p style='page-break-after: always;'></p>";
        break;
    case 'pageBefore':
        div += "<p style='page-break-before: always;'></p>";
        break;
    case 'line':
        div += "<br/>";
        break;
    case 'next':
        div += "<div style='display:inline-block;width:20px;'></div>";
        break;
    default:
        break;
    }
    return div;
}

/** ------------------
 *    Return a final list data for chart from init data.
 --------------------- */
window.getFinalListDataForChart = function (data) {
    let arrFinal = [];
    let category = data['data']['categoryList'];
    let employees = data['data']['employeeList'];
    let listEmp = [];
    let arrEmp = [];
    let arrCategory = [];
    let arrSkill = [];
    let totalSkill = 0;
    let cntSkill = 0;
    let listData =  data['data']['result'];

    for(let cate of category) {
        // get total number of skill
        let item = cate.split("_");
        totalSkill += parseInt(item[1]);
    }

    for(let employee of employees) {
        arrEmp = [];
        let result = [];

        // set name employee
        arrEmp.employee = employee;

        for(let cate of category) {
            // get name of category
            arrCategory = [];
            let it = cate.split("_");
            // set name category
            arrCategory.category = it[0];

            for(let item of listData) {
                // check master name name category
                if (it[0] == item.categoryName) {
                    // get array skill by category
                    let skills = item.datas;
                    arrSkill = [];
                    cntSkill = 0;
                    for(let skill of skills) {
                        // get list information employee contains skill
                        let emps = skill.employees;
                        let tmp = [];
                        for(let emp of emps) {
                            // check master name employee from information emp
                            if (employee == emp.name) {
                                tmp.skillLevel = emp.skillLevelChart;
                                tmp.skillName = window.checkLengthSkillName(emp.skillName.replace(/\s/g, ''));
                                // add skill to array
                                arrSkill.push(tmp);
                                cntSkill++;
                            }
                        }
                    }
                }
            }
            if (cntSkill <= 4) { // default chart has 5 vertices
                for(let i = 0; i < (5-cntSkill); i++) {
                    let tmp = [];
                    tmp.skillLevel = 0;
                    tmp.skillName = '　　　　　　';
                    // add skill to array
                    arrSkill.push(tmp);
                }
            }
            // add skill list to category
            arrCategory.list = arrSkill;
            // add number of skill
            arrCategory.numSkill = cntSkill;
            // add a category to list category
            result.push(arrCategory);
        }

        // add list category for employee
        arrEmp.category = result;
        listEmp.push(arrEmp);
    }

    arrFinal.totalSkill = totalSkill;
    arrFinal.dateFrom =  $('#dateFrom').val();
    arrFinal.dateTo = $('#dateTo').val();
    arrFinal.title = $('#department option:selected').text() + ' ' + $('#lineName').val() + ' ' + CONFIG.get("TITLE_PDF");
    arrFinal.dataChart = listEmp;

    return arrFinal;
}

/** ------------------
 *    Set align center for property labels.
 --------------------- */
window.setTextToAlignCenter = function (skillName) {
    let sizeText = skillName.length;
    let result = '';
    switch(sizeText) {
        case 1:
            result = '　　 ' + skillName + ' 　　';
            break;
        case 2:
            result = '　　' + skillName + '　　';
            break;
        case 3:
            result = '　 ' + skillName + ' 　';
            break;
        case 4:
            result = '　' + skillName + '　';
            break;
        default:
            result = skillName;
            break;
    }
    return result;
}

/** ------------------
 *    Check length and render to array of skill name.
 --------------------- */
window.checkLengthSkillName = function (skillName) {
    let splitSkillName = [];
    let lengthName = parseInt(skillName.length/maxLength);
    let start = 0;
    let end = maxLength;
    if (lengthName != 0) {
        if (lengthName == 1) { // if skill name less than 12 characters
            // get and add 6 characters first of name to array
            splitSkillName.push(skillName.substring(start, end));
            // get and add next characters of name to array
            if (end < skillName.length) {
                splitSkillName.push(window.setTextToAlignCenter(skillName.substring(maxLength, skillName.length)));
            }
        } else {
            if (lengthName > 3) {
                lengthName = 3;
            }
            for(let i = 0; i < lengthName; i++) {
                // get and add characters of name to array
                start = maxLength * i;
                end = (maxLength * (i + 1));
                if (skillName.length < 18) { // if skill name is 12 characters
                    splitSkillName.push(skillName.substring(start, end));
                } else {
                    if (i < 2) { // 12 first characters
                        splitSkillName.push(skillName.substring(start, end));
                    } else { // all next characters
                        splitSkillName.push(skillName.substring(start, start + 3) + '...');
                        end = skillName.length;
                        break;
                    }
                }
            }
            // if characters length is odd number
            if (end < skillName.length) {
                splitSkillName.push(window.setTextToAlignCenter(skillName.substring((end), skillName.length)));
            }
        }
    } else {
        // if characters length is 0
        splitSkillName.push(skillName);
    }

    return splitSkillName;
}

/** ------------------
 *    Generate html body when export chart.
 --------------------- */
window.generateBodyHtml = function (item, canvas, img, divC, divF, labelTitle) {
    let cates = item.category;
    let labels = [];
    let datasets = [];
    let html = '';
    // the list categories of employee
    for (let cate of cates) {
        labels = [];
        datasets = [];
        // the list skill of a category
        for (let skill of cate.list) {
            labels.push(skill.skillName);
            datasets.push(skill.skillLevel);
        }
        // create a new chart for a category
        // clear previous tmp label
        labelTitle.remove();
        labelTitle.text(cate.category);
        let fontTitleChart = '18px';
        if ((typeChart == chart[2] || typeChart == chart[1]) && size == sizePaper[1]) {
            fontTitleChart = '24px';
        } else if (typeChart == chart[3]) {
            fontTitleChart = '26px';
        } else if (typeChart == chart[4]) {
            fontTitleChart = '32px';
        }
        labelTitle.css("font-size", fontTitleChart);
        html += window.createNewChart(labels, datasets, canvas, img, divC, divF, labelTitle);
        // set background and border color for chart
        if (cntColor ==  6) {
            cntColor = 1;
        } else {
            cntColor++;
        }
    }
    return html;
}

/** ------------------
 *    Create a new chart.
 --------------------- */
window.createNewChart = function (label, dataset, canvas, img, divC, divF, labelTitle) {
    // set sum number of chart export
    cntChart++;
    let html = '';
    let arrData = {
        labels: label,
        datasets: [
            {
                data: dataset,
                fill: true,
                backgroundColor: backgroundColorChart[cntColor],
                borderColor: borderColorChart[cntColor],
                bezierCurve : false,
                borderWidth: 10,
            },
        ]
    };

    // clear previous tmp div
    divC.remove();
    divF.remove();
    let ctx = canvas.getContext('2d');
    let fontPoint = 60;
    let fontLabel = 65;
    if(size == sizePaper[2]) {
        fontPoint = 68;
    } else if (dataset.length >= 9 &&  dataset.length <= 12) {
        fontPoint = 50;
    } else if (dataset.length > 12 && dataset.length <= 16) {
        fontPoint = 40;
        fontLabel = 50;
    } else if (dataset.length > 16  && dataset.length <= 19) {
        fontPoint = 33;
        fontLabel = 45;
    } else if (dataset.length > 19  && dataset.length <= 25) {
        fontPoint = 26;
        fontLabel = 45;
    } else if (dataset.length > 25) {
        fontPoint = 20;
        fontLabel = 50;
    }

    Chart.register({
        id: 'custom_canvas_background_color',
        beforeDraw: function(chart) {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.canvas.width, chart.canvas.height);
            ctx.restore();
        }
    });

    let myChart = new Chart(ctx, {
        type: 'radar',
        data: arrData,
        options: {
            elements: {
                point:{
                    radius: 0
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    angleLines:{
                        display: false
                    },
                    suggestedMin: 0,
                    suggestedMax: 4,
                    beginAtZero: true,
                    ticks: {
                        backdropColor: 'rgba(255, 0, 0, 0)',
                        backdropPadding: {
                            y: 15
                        },
                        font:{
                            size: fontLabel
                        },
                        stepSize: 1
                    },
                    pointLabels:{
                        font: {
                            size: fontPoint
                        },
                    },
                    grid:{
                        color: 'blue',
                        borderWidth: 10
                    },
                }
            },
            animation: false
        },
    });

    // add page break
    if ((cntChart == 7 && (typeChart == chart[1] || typeChart == chart[2]))
        || (cntChart == 5 && typeChart == chart[3])
        || (cntChart == 2 && typeChart == chart[4]))
    {
        html += window.generateBreakDivHtml('page');
        html += "<br/><br/><br/>"
        cntChart = 1;
    }
    img.src = myChart.toBase64Image('image/jpeg', 0.5);
    img.backgroundColor = 'transparent';
    myChart.destroy();
    divC.append(labelTitle);
    divC.append(img);
    divF.append(divC);

    // add html for chart
    html += divF.html();
    img.style.marginTop = "0px";
    divC.remove();

    return html;
}

/** ------------------
 *    Create a canvas.
 --------------------- */
window.createCanvas = function () {
    let canvas = '';
    if (size == sizePaper[2] && typeChart == chart[1]) {
        width = 300;
        height = 300;
    } else if (size == sizePaper[1] && (typeChart == chart[2] || typeChart == chart[1])) {
        width = 480;
        height = 480;
    } else if (size == sizePaper[1] && typeChart == chart[3]) {
        width = 520;
        height = 520;
    } else {
        width = 1200;
        height = 1200;
    }
    canvas = $('<canvas/>',{
        'class':'canvas',
        'id': 'canvas'
    }).prop({
            width: width,
            height: height
    })[0];
    $('body').append(canvas);
    return canvas;
}

/** ------------------
 *    Create a image for chart.
 --------------------- */
window.createImage = function () {
    let img = '';
    img = new Image(width, height);
    img.style.margin = "0px auto 10px auto";
    img.style.display = "block";
    return img;
}

/** ------------------
 *    Create a child div.
 --------------------- */
window.createDiv = function () {
    let div = '';
    let styleHeight = '';
    let styleWidth = '';
    let styleMargin = '';
    if (size == sizePaper[2] && typeChart == chart[1]) {
        styleHeight = 'height:auto;';
        styleWidth = 'width:410px;';
        styleMargin = 'margin: 7px;';
    } else if (size == sizePaper[1] && (typeChart == chart[2] || typeChart == chart[1])) {
        styleHeight = 'height:auto;';
        styleWidth = 'width:600px;';
        styleMargin = 'margin: 10px;';
    } else if (size == sizePaper[1] && typeChart == chart[3]) {
        styleHeight = 'height:auto;';
        styleWidth = 'width:910px;';
        styleMargin = 'margin: 10px;';
    } else {
        styleHeight = 'height:auto;';
        styleWidth = 'width:2000px;';
    }
    div = $('<div>',{
        'class':'',
        'style' : 'background-color:transparent;' + styleHeight + '' + styleWidth
                + 'border-width:1px;border-style:solid;border-color:#CED4DA;display:inline-block;'
                + styleMargin
    });
    return div;
}

/** ------------------
 *    Create a title chart.
 --------------------- */
window.createLabel = function () {
    return $('<label>',{
        'class':'title-chart',
        'text' : '',
    });
}

/** ------------------
 *    Create a parent div.
 --------------------- */
window.createDivF = function () {
    return $('<div>');
}

/** ------------------
 *    Export chart to pdf.
 --------------------- */
window.exportCharToPdf = function (htmlChart, isRender) {
    if (isRender) {
        createCharToPdf(isRender, dataMaster['data'], htmlChart);
    } else {
        createCharToPdf(false, dataMaster['data'], htmlChart);
    }
}

/** ------------------
 *    Create chart to pdf.
 --------------------- */
function createCharToPdf(render, datas, htmlChart) {
    // get arrays category
    let _condition = {
        result: datas.result,
        department: $('#department option:selected').text(),
        department_id: $('#department').val(),
        dateFrom: $('#dateFrom').val(),
        dateTo: $('#dateTo').val(),
        lineName: $('#lineName').val(),
        size: size,
        no: no,
        chart: true,
        render: render,
        html: htmlChart
    };
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: 'POST',
        url: '/skillmap_pdf/html',
        data: _condition,
        success: function (_res) {
            window.hideLoadingPdf();
            window.open(
                '/skillmap_pdf',
                '_blank' // <- this is what makes it open in a new window.
            );
        },
        error: function (_res) {
            window.hideLoadingPdf();
            // Check and show other error on page error 500 (handled in server)
            handleSystemError(null, CONFIG.get('TIME_OUT'));
        }
    });
}

/** ------------------
 *    Export skill map to pdf.
 --------------------- */
function createSkillMapPdf(render, datas) {
    window.showLoadingPdf();
    // get arrays category
    let _condition = {
        result: datas.result,
        department: $('#department option:selected').text(),
        department_id: $('#department').val(),
        dateFrom: $('#dateFrom').val(),
        dateTo: $('#dateTo').val(),
        lineName: $('#lineName').val(),
        size: size,
        no: no,
        render: render
    };

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: 'POST',
        url: '/skillmap_pdf/html',
        data: _condition,
        success: function (_res) {
            window.hideLoadingPdf();
            window.open(
                '/skillmap_pdf',
                '_blank' // <- this is what makes it open in a new window.
            );
        },
        error: function (_res) {
            window.hideLoadingPdf();
            // Check and show other error on page error 500 (handled in server)
            handleSystemError(null, CONFIG.get('TIME_OUT'));
        }
    });
}

/** ------------------
 *    Button OK, save data and export pdf.
 --------------------- */
function saveAndExport() {
    $("#saveExportPdf").modal('hide');
    // save data to db and export pdf
    if (isExportChart) {
        saveDataSkillMap(false, false, false, false, true);
    } else {
        saveDataSkillMap(false, false, false, true);
    }
}

/** ------------------
 *    Button cancel save and export pdf
 --------------------- */
function cancelExport() {
    $("#saveExportPdf").modal('hide');
}

/** ------------------
 *    Render chart
 --------------------- */
function renderChart(isRender) {
    window.showLoadingPdf();
    setTimeout(function(){
        // get data to output
        let data = getData(true);
        dataMaster = data;
        // reset init data when export pdf chart
        let htmlChart = '';

        // get no skill-map value
        let search = window.location.search;
        const urlParams = new URLSearchParams(search);
        no = urlParams.get('no');
        size = window.getSizePaper(true);

        // get final list data for chart
        let dataFinal = window.getFinalListDataForChart(data);
        // create common canvas
        let canvas = window.createCanvas();
        let img = window.createImage();
        let divC = window.createDiv();
        let divF = window.createDivF();
        let breakPage = window.generateBreakDivHtml('pageBefore');
        let labelTitle = window.createLabel();

        // process display chart
        // loop employee in list employees
        for(let item of dataFinal['dataChart']) {
            cntChart = 0;
            // break page when new employee
            htmlChart += breakPage;
            // add header
            htmlChart += window.generateHeaderHtml(dataFinal['title'], item.employee, dataFinal['dateFrom'], dataFinal['dateTo']);
            // add chart for employee
            htmlChart += window.generateBodyHtml(item, canvas, img, divC, divF, labelTitle);
        }
        // clear previous tmp canvas
        canvas.remove();

        // clear previous tmp div
        divC.remove();
        divF.remove();

        // clear previous tmp label
        labelTitle.remove();
        // clear previous tmp img
        img.remove();

        // export chart to pdf
        window.exportCharToPdf(JSON.stringify(htmlChart), isRender);
        dataMaster = null;
        width = 0;
        height = 0;
    }, 0);
}

$(function () {
    /** ------------------
     *    Event click button pdf skill map.
     --------------------- */
    $('#domPdfDialogId').find('#domPdfBtnId').on('click', function() {
        $("#pdf-export1").attr("hidden", false)
        $("#pdf-export2").attr("hidden", true)
        isExportChart = false;
        // get data to output
        let data = getData();
        // get skill-map no value
        let search = window.location.search;
        const urlParams = new URLSearchParams(search);
        no = urlParams.get('no');
        size = window.getSizePaper();

        // validate data is invalid
        if (data['valid']) {
            return;
        } else if (!data || data.length == 0 || data['data']['result'].length == 0) {
            // showToast($('#toast3'), 2000, true);
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('MESSAGE_ALARM_EMPTY_TABLE'));
            return;
        } else {
            if (paramCompare(sParam, data['data'])) {
                // data is not change
                createSkillMapPdf(false, data['data']);
            } else {
                // display dialog confirm save and export
                $("#saveExportPdf").modal('show');
            }
        }
        $("#domPdfDialogId").modal('hide');
    })
    /** ------------------
     *    Event click button pdf chart.
     --------------------- */
    $('#chartPdfDialogId').find('#chartPdfBtnId').on('click', function() {
        $("#pdf-export2").attr("hidden", false);
        $("#pdf-export1").attr("hidden", true)
        isExportChart = true;
        cntColor = 1;
        // get tmp data to compare
        let tmp = getData();
        // validate data is invalid
        if (tmp['valid']) {
            return;
        } else if (!tmp || tmp.length == 0 || tmp['data']['result'].length == 0) {
            // showToast($('#toast3'), 2000, true);
            $("#confirmDialog2").modal("show");
            $(".confirmMessage").html(CONFIG.get('MESSAGE_ALARM_EMPTY_TABLE'));
            return;
        } else {
            if (!paramCompare(sParam, tmp['data'])) {
                $("#saveExportPdf").modal('show');
            } else {
                renderChart();
            }
        }
        $("#chartPdfDialogId").modal('hide');
    })
});