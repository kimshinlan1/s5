/****************************************************
 * users.js
 *
****************************************************/
"use strict";

/* ==============================
	Common Variables
============================== */
let totalRowNumber = 0;

/* ==============================
	Global Functions
============================== */

/** ------------------
 *    getUserTableList
 --------------------- */
window.getUserTableList = function (params) {
    let url = '/users/list';
    params.data.page = params.data.offset > 0 ? Math.ceil(params.data.offset / CONFIG.get('PAGING')) + 1 : 1;
    $.get(url + '?' + $.param(params.data)).then(function (res) {
        params.success(res)
    }).catch(function(jqXHR, _textStatus, _errorThrown) {
        if (
            jqXHR.responseJSON &&
            jqXHR.status == 500 &&
            jqXHR.responseJSON.message
        ) {
            // Check and show other error on page error 500 (handled in server)
            handleSystemError();
        }
    });
}

/** ------------------
 *    Reload Company options
 --------------------- */
 window.reloadCompanyOptions = function (firstOption) {
    $.ajax({
        type: 'GET',
        url: '/users/available_company_list',
        success: function (res) {
            window.hideLoading();
            let html = firstOption;
            for (let e of res) {
                html += '<option value="' + e.id + '">' + e.name + '</option>';
            }
            $('#companyId').html(html);

            // Check all companies have been registered account
            if($('#companyId :selected').text() == ''){
                $('#userEditDialog').modal('hide');
                $('#confirmDialog').modal('show');
                $('.confirmMessage').text('すべて会社のアカウントを発行しましたので、ご確認ください。');
            } else {
                if (!firstOption) {
                    $('#userEditDialog').modal('show');
                }
            }
        }
    });

 }

/** ------------------
 *    userTableActions
 --------------------- */
 window.userTableActions = function (_value, row, _index) {
    if(row.role_id == CONFIG.get('ROLE_ADMIN_ID') || row.id == $('#hidAuthUserId').val()) {
        return '<button style="margin-right: 20px;" type="button" class="btn btn-primary btn-sm" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#userEditDialog">編集</button> '+
            '<button type="button" class="btn btn-danger btn-sm" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#userDeleteDialog" disabled>削除</button>';
    } else {
        return '<button style="margin-right: 20px;" type="button" class="btn btn-primary btn-sm" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#userEditDialog">編集</button> '+
            '<button type="button" class="btn btn-danger btn-sm" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#userDeleteDialog">削除</button>';
    }
}

/** ------------------
 *    customCell
 --------------------- */
window.customCell = function (_value, row, _index) {
    let deptList = row['company']['departments'];
    let menu = '<div id="subMenu' + _index + '" class="collapse">';
    let tagString = '';
    let mouseover = `onmouseover="this.style.backgroundColor='#C4E7CC'"`;
    let mouseout = `onmouseout="this.style.backgroundColor='unset'; this.style.color='black';"`;
    deptList.forEach(element => {
        tagString += '<a class="list-group-item list-group-item-action style-list" href="/employee?companyId='+element.company_id+'&deptId='+element.id+'"'+
        ' style="color: black; text-decoration: none;background-color: unset; border: unset;"' + mouseover + " " + mouseout + '>' + element.name + '</a>';

    });
    menu += tagString + '</div>';

    return '<a id="alinkId'+_index+'" onclick="showDeptList('+_index+');" href="#" data-toggle="collapse" style="color: black; text-decoration: none; display: inline-block; width: 100%;">'
    + row['company']['name'] + '<i class="fa fa-caret-right" aria-hidden="true" id="arrow' + _index + '" style="float: right;line-height: inherit;"></i></a><br>' + menu;

}

/** ------------------
 *    show department list when click on company name cell
 --------------------- */
window.showDeptList = function(index) {
    $('body').off().on('click', '#alinkId' + index, function() {
        $('#subMenu' + index).collapse('toggle');
        $('#arrow' + index).toggleClass("fa-caret-right fa-caret-down");
    })
}

/** ------------------
 *    Clear dialog
 --------------------- */
 window.clearDialog = function () {
    $('#userIdentifier').val('');
    $('#userIdentifier').prop('disabled', false);
    $('#userIdentifier').prop('readonly', false);
    $('#userName').val('');
    $('#userPassword').val('');
    $('#userPassword').get(0).type = 'text';
    $('#userPassword').prop('disabled', false);
    $('#userPassword').prop('readonly', false);
    $('#userRoleId').prop('checked', false);
    $('#isChargedId').prop('checked', false);
    $('#isAdminId').prop('checked', false);
    $('#companyId').empty();
    $('#alertMeg').empty();
    $("#alertMeg").attr("hidden",true);
    $('#companyId').val($("#companyId option:first").val());
}

/** ------------------
 *    Save data
 --------------------- */
 window.saveData = function () {
    // get data from dialog.
    let id = $('#userId').val();
    let userData = null;
    let dialog = '#successAddDialog';

    if(id){
        dialog = '#successUpdateDialog';
        userData = {
            id: id,
            name: $('#userName').val(),
            identifier: $('#userIdentifier').val(),
            password: $('#userPassword').val(),
            company_id: $('#companyId').val(),
            role_id: CONFIG.get('ROLE_USER_ID'),
        }
    } else {
        userData = {
            name: $('#userName').val(),
            identifier: $('#userIdentifier').val(),
            password: $('#userPassword').val(),
            company_id: $('#companyId').val(),
            role_id: CONFIG.get('ROLE_USER_ID'),
        }
    }
    // open loading
    showLoading();
    // save
    $.ajax({
        url: id ? '/users/' + id : '/users',
        type: id ? 'PUT' : 'POST',
        data: userData
    }).done(function(data, _textStatus, _jqXHR){
        if(data.valid === false){
            $('#userIdentifier').addClass('is-invalid').siblings('.invalid-feedback').html(data.errors);
        }else{
            $("#userEditDialog").modal('hide');
            showToast($(dialog), 2000, true);
            $('#userTable').bootstrapTable('refresh');
        }
    }).fail(function(jqXHR, _textStatus, _errorThrown){
        $('#userForm').removeClass('was-validated');
        $('#userIdentifier').removeClass('is-invalid');
        $('#userName').removeClass('is-invalid');
        $('#userForm .invalid-feedback').html('');
        // show errors
        showError(jqXHR, 'user', 'userEditDialog', 'errorDialog', 'userForm');
    }).always(function(){
        // hide loading
        hideLoading();
    });
}

/* ==============================
	jQuery
============================== */
$(function(){
    $('#userTable').bootstrapTable({
        ajax: "getUserTableList",
        pagination: "true",
        paginationParts:"['pageList']",
        sidePagination: "server",
        uniqueId:"id",
        escape:"true",
        onLoadSuccess: function (data) {
            reloadBoostrapTable(data, $('#userTable'))
            totalRowNumber = document.getElementById("userTable").rows.length;
            for (let index = 0; index < totalRowNumber; index++) {
                $('#alinkId' + index).bind('click');
            }
        },
    });

    if ($('#errorDialog .modal-body .error-messages').length) {
        $('#errorDialog .modal-body .error-messages').html("");
    }

    /** ------------------
     *    User edit dialog show
     --------------------- */
    $('#userEditDialog').on('show.bs.modal', function(e) {
        for (let index = 0; index < totalRowNumber; index++) {
            $('#alinkId' + index).popover('hide');
        }
        let $button = $(e.relatedTarget);
        let userId = $button.data('id');
        if (userId) {
            // Set data submit
            let data = $('#userTable').bootstrapTable('getRowByUniqueId', userId);

            // Disable loginID and password field
            $('#userIdentifier').prop('readonly', true);
            $('#userIdentifier').prop('disable', true);

            //Render data to edit form
            $('#userId').val(data.id);
            $('#userIdentifier').val(data.identifier);
            $('#userName').val(data.name);

            let html = '<option value="' + data.company.id + '">' + data.company.name + '</option>';
            reloadCompanyOptions(html);
            $('#companyId').val($("#companyId option:first").val());

            // Update GUI: Password field
            $('#userPassword').prop('required', false);
            $('#userPassword').prop('readonly', true);
            $('#userPassword').prop('disable', true);
            $('#userPassword').val(data.password);
            $('#userPassword').get(0).type = 'password';

            $('#userEditDialog .modal-title.add').hide();
            $('#userEditDialog .modal-title.edit').show();
        }
    });

    /** ------------------
     *    User edit dialog hide
     --------------------- */
    $('#userEditDialog').on('hide.bs.modal', function(_e) {
        // reset form
        clearDialog();
        $('#userForm').removeClass('was-validated');
        $('#userForm .form-control').val('').removeClass('is-invalid');
        $('#userForm .invalid-feedback').html('');
    });

    /** ------------------
      *    Click Button Add
      --------------------- */
      $('#btnAdd').on('click', function() {
        // Update GUI
        window.showLoading();
        $('#userPassword').prop('required', true);
        $('#userRoleId').prop('disabled', false);
        $('#userPassword').val(createRandomPassword());
        reloadCompanyOptions();
        $('#userPassword').val();

        $('#userEditDialog .modal-title.add').show();
        $('#userEditDialog .modal-title.edit').hide();

        $('#departmentId').val($("#departmentId option:first").val());
    });

    /** ------------------
     *    Save user
     --------------------- */
     $('#saveUserBtn').on('click', function() {
       window.saveData();
    });

    /** ------------------
     *    User delete dialog show
     --------------------- */
     $('#userDeleteDialog').on('show.bs.modal', function(e) {
        for (let index = 0; index < totalRowNumber; index++) {
            $('#alinkId' + index).popover('hide');
        }
        let $button = $(e.relatedTarget);
        let userId = $button.data('id');
        if (userId) {
            let data = $('#userTable').bootstrapTable('getRowByUniqueId', userId);
            $('#deleteUserId').val(data.id);
            $('#userDeleteDialog .modal-body .message').html(escapeHtml(data.name) + CONFIG.get('DELETE_MESSAGE'));
        }
    });

    /** ------------------
     *    Delete user
     --------------------- */
     $('#deleteUserBtn').on('click', function() {
        showLoading();
        let id = $('#deleteUserId').val();
        $.ajax({
            url: '/users/' + id,
            type: 'DELETE'
        }).done(function(data, _textStatus, _jqXHR){
            if(data.valid === false){
                $("#userDeleteDialog").modal('hide');
                $('#errorDialog .modal-body .error-messages').html(data.errors);
                $("#errorDialog").modal('show');
                $('#userTable').bootstrapTable('remove', {
                    field: 'id',
                    values: id
                }).bootstrapTable('refresh');
            }else{
                $("#userDeleteDialog").modal('hide');
                $('#userTable').bootstrapTable('remove', {
                    field: 'id',
                    values: id
                }).bootstrapTable('refresh');
            }
        }).fail(function(jqXHR, _textStatus, _errorThrown){
            // show errors
            if (jqXHR.responseJSON && jqXHR.responseJSON.errors) {
                $("#userDeleteDialog").modal('hide');
                for (let error in jqXHR.responseJSON.errors) {
                    let tag = '<p style="margin:0px">'+jqXHR.responseJSON.errors[error] + '</p>';
                    $('#errorDialog .modal-body .error-messages').append(tag);
                }
                $("#errorDialog").modal('show');
            }
            else if (jqXHR.responseJSON && jqXHR.status == 500 && jqXHR.responseJSON.message) {
                // Check and show other error on page error 500 (handled in server)
                handleSystemError($("#userDeleteDialog"));
            }
        }).always(function(){
            hideLoading();
        });
    });

    $('#createPwdId').on('click', function() {
        $('#userPassword').get(0).type = 'text';
        $('#userPassword').prop('readonly', false);
        $('#userPassword').prop('disable', false);
        $('#userPassword').val(createRandomPassword());
    });

    $("#userEditDialog input").keypress(function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.saveData();
        }
    });
});

