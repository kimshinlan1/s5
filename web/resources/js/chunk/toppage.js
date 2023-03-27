/*****************
 * toppage.js
 *****************/
"use strict";

/*========================
 * GLOBAL FUNCTIONS
 =========================*/
function setSession(menu) {
    $('.menu').each((i, _ele) => {
        if (menu == 'mainMenu' + (i+1)) sessionStorage.setItem("mainMenu", "mainMenu" + (i+1));
    });
}


/*==================
 * DOCUMENT READY
 ===================*/
$(function () {

});