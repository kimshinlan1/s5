
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