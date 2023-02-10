require('./bootstrap');

/* ==============================
    Global Constants
============================== */

/** ------------------
 * get constants configuration
 * digits of a number of  code
 --------------------- */
window.CONFIG = (function () {
    let private_const = {
        'PAGING': 10,
        'TIME_ZONE': 'Asia/Tokyo',
        'KAIZENBASE_MODE': 0,
        'KAIZENBASE_ID': 1,
        'ROLE_ADMIN_ID': 1,
        '5S_MODE': {
            'OWNER_COMPANY'  : 0,
            'IS_CHARGE'      : 1,
            'FREE'           : 2
        },
        'TECHMAP_MODE': {
            'OWNER_COMPANY'  : 0,
            'IS_CHARGE'      : 1,
            'FREE'           : 2
        },
        'ROLE_USER_ID': 2,
        'DELETE_MESSAGE': $('#messageDelete').val(),
        'DELETE_USER_MESSAGE': $('#messageUserDelete').val(),
        'MESSAGE_WAIT_SEACH': $('#messageWaitSearch').val(),
        'MESSAGE_NO_DATA': $('#messageNoData').val(),
        'MESSAGE_ALARM_EMPTY_TABLE': $('#messageAlarmEmptyTable').val(),
        'SYSTEM_ERROR': $('#messageSystemError').val(),
        'MAX_EMPLOYEES' : 35,
        'MAX_JOB' : 100,
        'MAX_LENGTH_CATEGORY' : 30,
        'NUMBER_OF_LINES_IN_WORK_NAME' : '作業名の行数',
        'MAXIMUM_OF_100_LINES' : '作業名は最大の100行になります。',
        'COPY_MESSAGE': $('#messageCopy').val(),
        'MESSAGE_ADD_EMP_ERROR': $('#messageAddEmployeeError').val(),
        'TITLE_PDF': $('#titlePDF').val(),
        'TIME_OUT': $('#timeOutPDF').val(),
        'SKILL_MAP_REQUIRED': $('#messageSkillMapRequired').val(),
        'SKILL_MAP_FORMAT_NUMBER': $('#messageSkillMapFormatNumber').val(),
        'SKILL_MAP_ERROR_MAX_LENGTH': $('#messageSkillMapMaxLength').val(),
        'PLACE_HOLDER_CATEGORY' : '分類名',
        'PATTERN_AT_LEAST_ONE_VERIFICATION_POINT_MUST_BE_CONFIGURED': $('#patternAtLeastOneVerificationPointMustBeConfigured').val(),
        'PLACE_HOLDER_POINT' : $('#placeHolderPoint').val(),
        'PATTERN_REQUIRED': $('#messagePatternRequired').val(),
        'PATTERN_FORMAT_NUMBER': $('#messagePatternFormatNumber').val(),
        'PAGE_PATTERN_LIST': 0,
        'PAGE_PATTERN_LIST_CUSTOMER': 1,
        'RADAR_CHART_LABEL': $('#radarLabel').val(),

    };
    return {
        get: function (name) { return private_const[name]; }
    };
})();

/* ==============================
    Global Functions
============================== */

/** ------------------
 * toCamelCase
 * snake case to camel case
 --------------------- */
window.toCamelCase = function (str) {
    return str.split('_').map(function (word, index) {
        if (index === 0) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
}


/** zeroPad add leading zero before number
 * -----------------
 ** num is number to add leading zero
 ** digits is number after add leading zero
 -------------------*/
window.zeroPad = function (num, digits = 0) {
    num = parseInt(num);
    if (!isNaN(num) && num !== "" && num !== null && num !== "undefined") {
        const numZeroes = digits - num.toString().length + 1;
        if (numZeroes > 0) {
            return Array(+numZeroes).join("0") + num;
        }
    } else {
        return 0;
    }
    return num;
}

/** ------------------
 *    AJAX
 --------------------- */
 $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
// run ajax
window.runAjax = function (url, method, data, donecallback, failcallback, alwayscallback, async = true) {
    // Check and convert array to json object
    if ($.isArray(data)) {
        data = {data};
    }

    $.ajax({
        url: url,
        type: method,
        data: data,
        async: async
    })
        .done(donecallback ? donecallback : function (res) {
            console.log(res);
        })
        .fail(failcallback ? failcallback : function (res) {
            console.log(res);
        })
        .always(alwayscallback ? alwayscallback : function () {
            hideLoading();
        });
}

/**
 * remove leading zero number
 *
 * **/
window.removeZeroPad = function (num) {

    if (num == 0 && !isNaN(num) && num.length > 0) { return "0"; }
    else if (num !== "" && num !== null && num !== "undefined") {
        return num.replace(/^0+/, '');
    }
    return num;
}

/** ------------------
 * Show loading
 --------------------- */
window.showLoading = function () {
    if ($('.md-loading').length) {
        $('.md-loading').modal('show');
        // disable multi submit
        $('.modal').find('button').each(function(){
            this.disabled = true;
        });
        // reset form
        $('form').removeClass('was-validated');
    }
}

/** ------------------
 * Hide loading
 --------------------- */
window.hideLoading = function () {
    if ($('.md-loading').length) {
        $('.md-loading').modal('hide');
        $('.modal').find('button').each(function(){
            this.disabled = false;
        });
    }
}

/** ------------------
 * Show loading pdf
 --------------------- */
window.showLoadingPdf = function () {
    if ($('.md-loading-pdf').length) {
        $('.md-loading-pdf').modal('show');
        // disable multi submit
        $('.modal').find('button').each(function(){
            this.disabled = true;
        });
        // reset form
        $('form').removeClass('was-validated');
    }
}

/** ------------------
 * Hide loading pdf
 --------------------- */
window.hideLoadingPdf = function () {
    if ($('.md-loading-pdf').length) {
        $('.md-loading-pdf').modal('hide');
        $('.modal').find('button').each(function(){
            this.disabled = false;
        });
    }
}

/** ------------------
 *    dateFormat
 --------------------- */
window.dateFormat = function (value, _row, _index) {
    return new Date(value).toLocaleString('ja-JP', { timeZone: CONFIG.get('TIME_ZONE') });
}

/** ------------------
 *    setting Formater for JP Date  (年⽉⽇ H:i:s)
 --------------------- */
window.dateFormatter = function (value, _row) {

    let datestring = "";
    if (value) {
        let date = new Date(value).toLocaleString('ja-JP', { timeZone: CONFIG.get('TIME_ZONE') });
        date = new Date(Date.parse(date));
        datestring = date.getFullYear() + "年" + (date.getMonth() + 1) + "⽉" + date.getDate() + "⽇ " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
    }

    return datestring;
}

/** ------------------
 *    setting Formater for JP Date  (年⽉⽇)
 --------------------- */
window.dateFormatterYmd = function (value, _row) {

    let datestring = "";
    if (value) {
        let date = new Date(value).toLocaleString('ja-JP', { timeZone: CONFIG.get('TIME_ZONE') });
        date = new Date(Date.parse(date));
        datestring = date.getFullYear() + "年" + (date.getMonth() + 1) + "⽉" + date.getDate() + "⽇";
    }

    return datestring;
}
/** ------------------
 *    Function onload table.
 --------------------- */
window.reloadBoostrapTable = function (data, selectorId) {
    // If deleting all elements in last page.
    if (data.total && !data.rows.length) {
        selectorId.bootstrapTable('prevPage').bootstrapTable('refresh');
    }
}

/** ------------------
 *    Check and show other error on page error 500 (handled in server)
 --------------------- */
window.handleSystemError = function (dialog, message) {
    // Check and show other error on page error 500 (handled in server)
    if (dialog) {
        $(dialog).modal('hide');
    }
    if (message) {
        $('#errorDialog .modal-body .error-messages').html(message);
    } else {
        $('#errorDialog .modal-body .error-messages').html(CONFIG.get('SYSTEM_ERROR'));
    }
    $("#errorDialog").modal('show');
}

/** ------------------
 *    Escape text display html.
 --------------------- */
window.escapeHtml = function (unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/** ---------------
 * Show toast model
------------------ */
window.showToast = function (event, delay, autoHide, isBackPage) {
    let option = {
        animation: true,
        delay: delay
    };
    event.show(option);
    if (autoHide) {
        setTimeout(() => {
            event.hide(option);
            if (isBackPage) {
                window.location = "/skillmaps_list";
            }
        }, delay);
    }
    hideLoading();
    $('#loading-inside-btn').css('display', 'none');
}

/** ------------------
*    Set default option for bootstrapTable
--------------------- */
if (typeof $.fn.bootstrapTable != "undefined") {
    $.extend($.fn.bootstrapTable.defaults, {
        escape: "true",
        formatLoadingMessage: function () {
            return CONFIG.get('MESSAGE_WAIT_SEACH');
        },
        formatNoMatches: function () {
            return CONFIG.get('MESSAGE_NO_DATA');
        },
    });
}

function reponseSive(className) {
    let heightScrollYBar = $('.' + className).height() - $('.row').eq(0).height() + 12 - 15;
    let widthScrollXBar = $('.' + className).width();
    let minWidthTable = widthScrollXBar - ($('#table-left').width() + $('#table-right').width()) - 15;

    $('#scroll-table').css({ 'max-height': heightScrollYBar + 'vh' });
    $('#table-center').css({ 'min-width': minWidthTable + 'px' });
    $('.max-width-table').css({ 'max-width': minWidthTable + 'px' });
    $('.sticky-table-when-scroll .center').css('width', minWidthTable + 'px');

    $('#dateFrom').tooltip({ placement: 'right' });
    $('#dateTo').tooltip({ placement: 'right' });
}

$(function () {
    hideMenuInit();
    $("#side-bar-menu").click(function () {
        hideMenu();
    });
});

function hideMenu() {
    let className = ''
    if (!localStorage.getItem('menu') || localStorage.getItem('menu') === 'show') {
        $('.sidebar').hide(700);
        setTimeout(() => {
            $('.sidebar').css('display', 'none');
            $('.container').removeClass('container').addClass('container-fluid');
        }, 800);

        localStorage.setItem('menu', 'hide');
        className = 'container-fluid';
    } else {
        $('.container-fluid').removeClass('container-fluid').addClass('container');

        $('.sidebar').show(700);
        setTimeout(() => {
            $('.sidebar').css('display', 'block');
        }, 800);

        localStorage.setItem('menu', 'show');
        className = 'container';
    }
    setTimeout(() => {
        reponseSive(className);
    }, 1000);
}

function hideMenuInit() {
    let className = '';
    if (!localStorage.getItem('menu') || localStorage.getItem('menu') === 'show') {
        $('.sidebar').show();
        $('.sidebar').css('display', 'block');
        $('.container-fluid').removeClass('container-fluid').addClass('container');
        className = 'container';
    } else {
        $('.sidebar').hide();
        $('.sidebar').css('display', 'none');
        $('.container').removeClass('container').addClass('container-fluid');
        className = 'container-fluid';
    }
    setTimeout(() => {
        reponseSive(className);
    });
}

/** ------------------
*    Hide dialog modal
--------------------- */
window.dialogModalHide = function (dialog, form) {
    if ($(form).length) {
        $(dialog).on('hide.bs.modal', function (e) {
            // reset form
            $(form).removeClass('was-validated');
            $(form + ' .form-control').val('').removeClass('is-invalid');
            $(form + ' .invalid-feedback').html('');
        });
    }

}

/** ------------------
*   Delete dialog show
--------------------- */
window.showDialogDelete = function (table, deleteId, dialog, e) {
    let $button = $(e.relatedTarget);
    let id = $button.data("id");
    if (id) {
        let data = $(table).bootstrapTable("getRowByUniqueId", id);
            $(deleteId).val(data.id);
            $(dialog + ' .modal-body .message').html(
            escapeHtml(data.name) + " " + CONFIG.get("DELETE_MESSAGE"));
    }
}

/** ------------------
*   Fail ajax dialog show
--------------------- */
window.failAjax = function (jqXHR, _textStatus, _errorThrown) {
    $("#errorDialog .modal-body .error-messages").empty();
    if (jqXHR.responseJSON && jqXHR.responseJSON.errors) {
        $("#errorDialog .modal-body .error-messages").append(
            '<p style="margin:0px">' + jqXHR.responseJSON.errors + "</p>"
        );
        $("#errorDialog").modal("show");
    }
}
/** ------------------
 *    Generate random password
 --------------------- */
let lastRand, randNum;
window.rand = function() {
    while(randNum == lastRand) {
        randNum = (new Date().getTime()*Math.PI)%1;
    }
    lastRand = randNum;
    return randNum;
}
window.createRandomPassword = function () {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let passwordLength = 8;
    let password = "";
    for (let i = 0; i <= passwordLength; i++) {
        let randomNumber = Math.floor(rand() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
}

//
window.showError = function(jqXHR, object_name, edit_dialog_id, err_dialog_id, object_form) {
    if (jqXHR.responseJSON && jqXHR.responseJSON.errors) {
        if(jqXHR.status == 500 || jqXHR.status == 404) {

            // Hide current dialog
            $("#"+edit_dialog_id).modal('hide');

            // Show err
            $('#'+err_dialog_id+' .modal-body .error-messages').html(jqXHR.responseJSON.errors);
            $("#"+err_dialog_id).modal('show');
        } else {

            dialogModalHide("#"+edit_dialog_id, "#"+object_form);

            for (let error in jqXHR.responseJSON.errors) {
                $('#' + window.toCamelCase(object_name+'_' + error)).addClass('is-invalid').siblings('.invalid-feedback').html(jqXHR.responseJSON.errors[error]);
            }
        }
    } else if (jqXHR.responseJSON && jqXHR.status == 500 && jqXHR.responseJSON.message) {
        // Check and show other error on page error 500 (handled in server)
        handleSystemError($("#"+edit_dialog_id));
    }
}

window.showPassword = function (toggle,inputId){
    $('#'+toggle).on('click', function() {
        let changeType = $("#"+inputId).attr('type') === "password" ? "text" : "password";
        $("#"+inputId).attr('type', changeType);
        this.classList.toggle("bi-eye");
    });
}

window.addTestValue = function (parent_class){
    $("."+parent_class).each(function(){
        $(this).find('input').val("1");
        $(this).find('select').each(function(){
            $(this).val(1);
        });
    })
}

/** ------------------
 *    Load Company List
 --------------------- */
 window.loadCompanyList = function (elem, isTriggerChange = false){
    $.ajax({
        type: 'GET',
        url: '/company/list',
        success: function (res) {
            let html = '';
            if(res.currentCompany.mode == CONFIG.get("KAIZENBASE_MODE")) {
                for (let e of res.rows) {
                    html += '<option value="' + e.id + '" data-mode="' + e.mode + '">' + e.name + '</option>';
                }
            }
            else {
                html += '<option value="' + res.currentCompany.id + '" hidden>' + res.currentCompany.name + '</option>';
            }
            elem.html(html);
            if (isTriggerChange) {
                elem.change();
            }
        }
    });
}

/** ------------------
 *    Check item in array
 --------------------- */
window.checkExistId = function(arr, id) {
    let existed = false;
    arr.every(val => {
        if (val.includes(id)) {
            existed = true;
            return false;
        }
        return true;
    });
    return existed;
}

/** ------------------
 *    Remove existed item in array
 --------------------- */
window.removeExistId = function(arr, id) {
    arr.splice( $.inArray(id,arr) , 1 );
    return arr;
}

/* ==============================
jQuery
============================== */
$(function(){
    /** ------------------
     *    Handle toggle/collapse on sidebar
     --------------------- */
    $('#managementMenuId').click(function() {
        $('#subManagementMenuId').collapse('toggle');
        $('#icon1').toggleClass("fa-caret-right fa-caret-down");
    })
    $('#studyPlanMenuId').click(function() {
        $('#subStudyPlanMenuId').collapse('toggle');
        $('#icon2').toggleClass("fa-caret-right fa-caret-down");
    })
    $('#skillMapMenuId').click(function() {
        $('#subSkillMapMenuId').collapse('toggle');
        $('#icon3').toggleClass("fa-caret-right fa-caret-down");
    })
    $('#menu5sId').click(function() {
        $('#submenu5sId').collapse('toggle');
        $('#icon4').toggleClass("fa-cyaret-right fa-caret-down");
    })

    /** ------------------ Menu 1 ------------------ */
    $('#subManagementMenuId').on("shown.bs.collapse", function () {
        sessionStorage.setItem("mainMenu1", "show");
        $('#icon1').addClass("fa-caret-down");
        $('#icon1').removeClass("fa-caret-right");
    });

    $('#subManagementMenuId').on("hide.bs.collapse", function () {
        sessionStorage.setItem("mainMenu1", "hide");
        $('#icon1').addClass("fa-caret-right");
        $('#icon1').removeClass("fa-caret-down");
    });

    const mainMenu1 = sessionStorage.getItem("mainMenu1");

    if (mainMenu1 == "show") {
        $('#subManagementMenuId').collapse('show');
    } else {
        $('#subManagementMenuId').collapse('hide');
    }

    /** ------------------ Menu 2 ------------------ */
    $('#subStudyPlanMenuId').on("shown.bs.collapse", function () {
        sessionStorage.setItem("mainMenu2", "show");
        $('#icon2').addClass("fa-caret-down");
        $('#icon2').removeClass("fa-caret-right");
    });

    $('#subStudyPlanMenuId').on("hide.bs.collapse", function () {
        sessionStorage.setItem("mainMenu2", "hide");
        $('#icon2').addClass("fa-caret-right");
        $('#icon2').removeClass("fa-caret-down");
    });

    const mainMenu2 = sessionStorage.getItem("mainMenu2");

    if (mainMenu2 == "show") {
        $('#subStudyPlanMenuId').collapse('show');
    } else {
        $('#subStudyPlanMenuId').collapse('hide');
    }

    /** ------------------ Menu 3 ------------------ */
    $('#subSkillMapMenuId').on("shown.bs.collapse", function () {
        sessionStorage.setItem("mainMenu3", "show");
        $('#icon3').addClass("fa-caret-down");
        $('#icon3').removeClass("fa-caret-right");
    });

    $('#subSkillMapMenuId').on("hide.bs.collapse", function () {
        sessionStorage.setItem("mainMenu3", "hide");
        $('#icon3').addClass("fa-caret-right");
        $('#icon3').removeClass("fa-caret-down");
    });

    const mainMenu3 = sessionStorage.getItem("mainMenu3");

    if (mainMenu3 == "show") {
        $('#subSkillMapMenuId').collapse('show');
    } else {
        $('#subSkillMapMenuId').collapse('hide');
    }

    /** ------------------ Menu 4 ------------------ */
    $('#submenu5sId').on("shown.bs.collapse", function () {
        sessionStorage.setItem("mainMenu4", "show");
        $('#icon4').addClass("fa-caret-down");
        $('#icon4').removeClass("fa-caret-right");
    });

    $('#submenu5sId').on("hide.bs.collapse", function () {
        sessionStorage.setItem("mainMenu4", "hide");
        $('#icon4').addClass("fa-caret-down");
        $('#icon4').removeClass("fa-caret-right");
    });

    const mainMenu4 = sessionStorage.getItem("mainMenu4");

    if (mainMenu4 == "show") {
        $('#submenu5sId').collapse('show');
    } else {
        $('#submenu5sId').collapse('hide');
    }
});