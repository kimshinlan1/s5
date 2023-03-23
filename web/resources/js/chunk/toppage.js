/*****************
 * toppage.js
 *****************/
"use strict";

/*========================
 * GLOBAL FUNCTIONS
 =========================*/
function setSession(menu) {
    if (menu == 'mainMenu1') sessionStorage.setItem("mainMenu", "mainMenu1");
    if (menu == 'mainMenu2') sessionStorage.setItem("mainMenu", "mainMenu2");
    if (menu == 'mainMenu3') sessionStorage.setItem("mainMenu", "mainMenu3");
    if (menu == 'mainMenu4') sessionStorage.setItem("mainMenu", "mainMenu4");
}


/*==================
 * DOCUMENT READY
 ===================*/
$(function () {

});