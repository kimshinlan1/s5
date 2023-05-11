/**********
 * Variable
 **********/


//*********************************************************************************//
//**********************//---DOCUMENT---FUNCTION---START---//**********************//

window.exportPDF = function() {
    let url = '/pattern_team_inspection/loadPDFView';

    let method = "POST";
    let deptId = $('#selectDeptList').find(':selected').val();
    let teamId = $('#selectTeamList').find(':selected').val();
    if (!teamId) {
        let urlString = window.location.href;
        let parts = urlString.split("/");
        teamId = parts[parts.length - 1];
    }

    let data = {
        deptId: deptId,
        teamId: teamId,
    };

    let doneCallback = function (_data, _textStatus, _jqXHR) {
        window.open(
            '/pattern_team_inspection_exportPdf',
            '_blank' // <- this is what makes it open in a new window.
        );
    };
    let failCallback = function (jqXHR, _textStatus, _errorThrown) {
        failAjax(jqXHR, _textStatus, _errorThrown);
    };
    runAjax(url, method, data, doneCallback, failCallback, null, false);

 }
//***********************//---DOCUMENT---FUNCTION---END---//***********************//
//*********************************************************************************//


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////---DOCUMENT---READY---//////////////////////////////////
$(function () {
    $( "#btnInspectionPDF" ).on( "click", function() {
        exportPDF();
    });
});