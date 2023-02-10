/*****************
 * toppage.js
 *****************/
"use strict";

/*========================
 * GLOBAL FUNCTIONS
 =========================*/
function setSession(menu) {
    if (menu == 'menu1') sessionStorage.setItem("mainMenu1", "show");
    if (menu == 'menu2') sessionStorage.setItem("mainMenu2", "show");
    if (menu == 'menu3') sessionStorage.setItem("mainMenu3", "show");
    if (menu == 'menu4') sessionStorage.setItem("mainMenu4", "show");

}


/*==================
 * DOCUMENT READY
 ===================*/
$(function () {

});