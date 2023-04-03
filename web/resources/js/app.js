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
        'MESSAGE_CHOOSE_PATTERN_FOR_THIS_DEPARTMENT': $('#messageChoosePatternForThisDepartment').val(),

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
    let isFormData = data instanceof FormData;
    $.ajax({
        url: url,
        type: method,
        data: data,
        contentType: isFormData ? false : 'application/x-www-form-urlencoded; charset=UTF-8',
        processData: isFormData ? false : true,
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
    if ($('body').find('.md-loading').length) {
        $('body').find('.md-loading').modal('show');
        // disable multi submit
        $('body').find('.modal').find('button').each(function(){
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
    if ($('body').find('.md-loading').length) {
        $('body').find('.md-loading').modal('hide');
        $('body').find('.modal').find('button').each(function(){
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
        $(dialog).on('hide.bs.modal', function () {
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
window.showDialogDelete = function (table, deleteId, dialog, e, msg = null) {
    let $button = $(e.relatedTarget);
    let id = $button.data("id");
    if (id) {
        let data = $(table).bootstrapTable("getRowByUniqueId", id);
            $(deleteId).val(data.id);
            if (msg) {
                $(dialog + ' .modal-body .message').html(
                    escapeHtml(data.name) + " " + msg);
            } else {
                $(dialog + ' .modal-body .message').html(
                    escapeHtml(data.name) + " " + CONFIG.get("DELETE_MESSAGE"));
            }

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

window.auto_grow = function(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

/** ------------------
 *    Remove existed item in array
 --------------------- */
window.removeExistId = function(arr, id) {
    arr.splice( $.inArray(id,arr) , 1 );
    return arr;
}
/*======================
 * RELOAD DATA TEAM
 =======================*/
 window.reloadDataTeam = function (id) {
    let data = {department_id: id};
    $.ajax({
        type: 'GET',
        url: '/teams/dept_id',
        data: data,
        success: function (res) {
            let html = '';
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#employeeTeamId').html(html);
        }
    });
}

/*==================
 * SAVE DATA TEAM
 ===================*/
 window.saveDataTeam = function () {
    $('#teamForm').removeClass('was-validated');
    $('#teamForm .form-control').removeClass('is-invalid');
    $('#teamForm .invalid-feedback').html('');
    let id = $("#teamId").val();
    let name = $("#teamName").val();
    let department_id = $("#teamDepartment").val();
    let data = null;
    let dialog = '#successAddDialog';
    if (id) {
        dialog = '#successUpdateDialog';
        data = {
            id: id,
            name: name,
            department_id: department_id,
        };
    } else {
        data = {
            name: name,
            department_id: department_id,
        };
    }
    showLoading();

    // CALL DATABASE UPDATE DATA
    let url = id ? "/teams/" + id : "/teams";
    let method = id ? "PUT" : "POST";

    let doneCallback = function (_data, _textStatus, _jqXHR) {
        // SAVE SUCCESSFUL
        reloadDataTeam();
        $("#teamEditDialog").modal("hide");
        showToast($(dialog), 2000, true);
        $("#teamTable").bootstrapTable("refresh");
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        // SHOW ERRORS
        showError(jqXHR, 'team', 'teamEditDialog', 'errorDialog', 'teamForm');
    };
    runAjax(url, method, data, doneCallback, failCallback);
}

/*======================
 * SAVE DATA EMPLOYEE
 ========================*/
 window.saveDataEmployee = function () {
    $('#employeeForm').removeClass('was-validated');
    $('#employeeForm .form-control').removeClass('is-invalid');
    $('#employeeForm .invalid-feedback').html('');

    let data = {
        name: $("#employeeName").val(),
        email: $("#employeeEmail").val(),
        team_id: $("#employeeTeamId").val(),
        department_id: $("#deptd").val(),
    };

    showLoading();
    // CALL DATABASE UPDATE DATA
    let url = "/employee";
    let method = "POST";

    let doneCallback = function (_data, _textStatus, _jqXHR) {
        // SAVE SUCCESSFUL
        $("#employeeAddDialog").modal("hide");
        showToast($('#successAddDialog'), 2000, true);
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        // SHOW ERRORS
        showError(jqXHR, 'employee', 'employeeAddDialog', 'errorDialog', 'employeeForm');
    };
    runAjax(url, method, data, doneCallback, failCallback);
}

/** ------------------
 *    Handle click on main menu
 --------------------- */
window.toggleMenu = function(order) {
    // Check if sub menu is showing, add status to storage and change icon
    $('#subMenu' + order).off('show.bs.collapse').on("show.bs.collapse", function () {
        handleToggle('show', order);
    });

    // Check if sub menu is hiding, add status to storage and change icon
    $('#subMenu' + order).off('hide.bs.collapse').on("hide.bs.collapse", function (e) {
        handleToggle('hide', order);
        if (!$('#extraSubDeptMenuId').hasClass('show')) {
            e.stopPropagation();
        }
    });

    // Trigger toggle menu
    $('body').off().on('click','#mainMenu' + order, function() {
        $('#subMenu' + order).collapse('toggle');
    })
}

/** ------------------
 *    Handle click on 部門管理 menu
 --------------------- */
window.toggleDeptMenu = function() {
    // Check if sub menu is showing, add status to storage and change icon
    $('#extraSubDeptMenuId').off('show.bs.collapse').on("show.bs.collapse", function (ev) {
        ev.stopPropagation();
        sessionStorage.setItem("deptMenu", "show");
        $('body').find('#extraSubDeptMenuId').addClass('show').removeClass('in');
        $('body').find('#subIcon1').addClass("fa-caret-down");
        $('body').find('#subIcon1').removeClass("fa-caret-right");
    });

    // Check if sub menu is hiding, add status to storage and change icon
    $('#extraSubDeptMenuId').off('hide.bs.collapse').on("hide.bs.collapse", function (e) {
        e.stopPropagation();
        $('body').find('#extraSubDeptMenuId').removeClass('show').removeClass('in');
        $('body').find('#subIcon1').addClass("fa-caret-right");
        $('body').find('#subIcon1').removeClass("fa-caret-down");
    });
    sessionStorage.setItem("mainMenu1", "show");
    $('#extraSubDeptMenuId').collapse('toggle');
}

/** ------------------
 *    Handle toggle/collapse event
 --------------------- */
window.handleToggle = function(status, order) {
    if (status == 'show') {
        // Hide other menus
        $('.menu').each((i, ele) => {
            if ((i+1) != order) {
                $('#subMenu' + (i+1)).collapse('hide');
                if ((i+1) == 1) {
                    sessionStorage.setItem("deptMenu", "hide");
                    $('#extraSubDeptMenuId').collapse('hide');
                    $('body').find('#subIcon1').addClass("fa-caret-right");
                    $('body').find('#subIcon1').removeClass("fa-caret-down");
                }
            }
        });
        sessionStorage.setItem("mainMenu", "mainMenu" + order);
        $('body').find('#subMenu' + order).addClass('show').removeClass('in');
        $('#icon' + order).addClass("fa-caret-down");
        $('#icon' + order).removeClass("fa-caret-right");
    }
    else {
        sessionStorage.setItem("mainMenu", "");
        $('body').find('#subMenu' + order).removeClass('show').removeClass('in');
        $('#icon' + order).addClass("fa-caret-right");
        $('#icon' + order).removeClass("fa-caret-down");
    }
}

/* ==============================
jQuery
============================== */
$(function(){
    // Check and display show/hide status of each main menu when refresh page
    $('.menu').each((i, ele) => {
        // Check if sub menu is showing, add status to storage and change icon
        $('#subMenu' + (i+1)).off('show.bs.collapse').on("show.bs.collapse", function (e) {
            if ($('#extraSubDeptMenuId').hasClass('show')) {
                e.stopPropagation();
            }
            else {
                handleToggle('show', (i+1));
            }
        });

        // Check if sub menu is hiding, add status to storage and change icon
        $('#subMenu' + (i+1)).off('hide.bs.collapse').on("hide.bs.collapse", function (e) {
            if (!$('#extraSubDeptMenuId').hasClass('show')) {
                e.stopPropagation();
            }
            else {
                handleToggle('hide', (i+1));
            }
        });

        if (sessionStorage.getItem("mainMenu") == ele.id) {
            $('#subMenu' + (i+1)).collapse('show');
        }
    });
    $("body").find('.middle-click').on("mousedown", function(eve) {
        // Check if middle click is trigger or not. eve.which === 2 refers to an event that is triggered when the user presses the middle mouse button
        if (eve.which === 2) {
            let subDeptArr = ['/teams', '/employee', '/departments'];
            let url = $(this).attr("href");
            let newTag = window.open(url, "_blank");
            newTag.onload = function() {
                // Do an action in the new tab
                $('.menu').each((i, ele) => {
                    if (sessionStorage.getItem("mainMenu") == ele.id) {
                        $('#subMenu' + (i+1)).collapse('show');
                    }
                });
                if (subDeptArr.includes(url)) {
                    sessionStorage.setItem("deptMenu", "show");
                    $('#extraSubDeptMenuId').collapse('show');
                    $('body').find('#subIcon1').addClass("fa-caret-down");
                    $('body').find('#subIcon1').removeClass("fa-caret-right");
                }
            }
        }
    });

    if (sessionStorage.getItem("deptMenu") == "show") {
        $('#extraSubDeptMenuId').collapse('show');
        $('body').find('#subIcon1').addClass("fa-caret-down");
        $('body').find('#subIcon1').removeClass("fa-caret-right");
    } else {
        $('#extraSubDeptMenuId').collapse('hide');
        $('body').find('#subIcon1').addClass("fa-caret-right");
        $('body').find('#subIcon1').removeClass("fa-caret-down");
    }

    // Remove all sessionStorage data when logout
    $('#logoutBtn').click(function() {
        for (const key in sessionStorage) {
            sessionStorage.removeItem(key);
        }
    });
});
