/****************************************************
 * users.js
 *
****************************************************/
"use strict";

/* ==============================
	Global Functions
============================== */

/** ------------------
*    getCompanyTableList
--------------------- */

  window.getCompanyTableList = function (slt_opt_company,slt_val) {
    let url = '/company/list';
    $.get(url + '?offset=0&limit=100').then(function (res) {
        if(res && res.rows.length > 0) {
            slt_opt_company.empty();
            $.each(res.rows, function(key, value) {
                let _text = $('<div/>').text(value.name).html();
                slt_opt_company.append(`<option value="${value.id}">${_text}</option>`);
            });
            if (slt_val) {
                slt_opt_company.val(slt_val).trigger('change');
            }
        }
    });
}

/* ==============================
	jQuery
============================== */
$(function() {
    /** ------------------
     *    User edit dialog show
     --------------------- */
    $('#userEditDialog').on('show.bs.modal', function(e) {
        // fill data to inputs
        $('#userName').val($('#trUserName').data('value'));
        $('#userIdentifier').val($('#trUserIdentifier').data('value'));
    });

    showPassword("toggleOldPassword", "userOldPassword"); 
    showPassword("toggleNewPassword", "userNewPassword"); 
    showPassword("toggleNewConfirmPassword", "userNewConfirmPassword"); 

    /** ------------------
     *    User edit dialog hide
     --------------------- */
    dialogModalHide("#userEditDialog", "#userForm");

    /** ------------------
     *   User change password dialog hide
    --------------------- */
    dialogModalHide("#userChangePasswordDialog", "#userChangePasswordForm");

    /** ------------------
     *    Save user
     --------------------- */
     $('#saveUserEditBtn').on('click', function() {
        // reset messages
        dialogModalHide("#userEditDialog", "#userForm");

        // validate
        var userForm = $('#userForm')[0];
        if (!userForm || !userForm.checkValidity()) {
            $('#userForm').addClass('was-validated');
            return;
        }

        // get data from dialog.
        var id =  $('#hidAuthUserId').val();
        var userData = {
            id: $('#hidAuthUserId').val(),
            name: $('#userName').val(),
            identifier: $('#userIdentifier').val(),
        }

        $('.md-loading').modal('show');

        // save
        $.ajax({
            url:'/user/' + id,
            type: 'PUT',
            data: userData
        }).done(function(data, textStatus, jqXHR){
            $("#userEditDialog").modal('hide');
            location.reload();
        }).fail(function(jqXHR, _textStatus, _errorThrown){
            // show errors
            showError(jqXHR, 'user', 'userEditDialog', 'userErrorDialog', 'userForm');
        }).always(function(){
            $('.md-loading').modal('hide'); // hide loading modal
        });


    });

    /** ------------------
    *    Change user password
    --------------------- */
     $('#changeUserPasswordBtn').on('click', function() {
        $('#userChangePasswordForm').removeClass('was-validated');
        $('#userChangePasswordForm .form-control').removeClass('is-invalid');
        $('#userChangePasswordForm .invalid-feedback').html('');
        // validate
        var userChangePwdForm = $('#userChangePasswordForm')[0];
        if (!userChangePwdForm || !userChangePwdForm.checkValidity()) {
            $('#userChangePasswordForm').addClass('was-validated');
            return;
        }

        // get data from dialog.
        var id =  $('#hidAuthUserId').val();
        var userData = {
            id: $('#hidAuthUserId').val(),
            old_password: $('#userOldPassword').val(),
            new_password: $('#userNewPassword').val(),
            new_confirm_password: $('#userNewConfirmPassword').val()
        }

        // show loading modal
        $('.md-loading').modal('show');

        // save
        $.ajax({
            url:'/change_user_password/' + id,
            type: 'PUT',
            data: userData
        }).done(function(_data, _textStatus, _jqXHR){
            $("#userChangePasswordDialog").modal('hide');
            location.reload();
        }).fail(function(jqXHR, _textStatus, _errorThrown){
            // show errors
            showError(jqXHR, 'user', 'userChangePasswordDialog', 'userErrorDialog', 'userForm');
        }).always(function(){
            // hide loading modal
            $('.md-loading').modal('hide');
        });

    });
});