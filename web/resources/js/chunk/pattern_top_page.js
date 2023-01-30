/**
 * Variable
 */
const MODE_NEW = 1;

//////////////////////////////////////////////////////////////////

/**
 * Show hide team inspection chart
 */
function showHideTeam(dept_id) {
    $("tr[id^=dept_"+dept_id+"-team]").toggle();
}

/**
 * Go to Inspection Page
 */
function gotoInspectionPage(team_id) {
    // todo:
    alert("go");
}

/**
 * Render avg chart from teams in dept
 */
function renderAvgChart(dept_id, team_id) {
    // todo:

    // If have data: render chart with data avg

    // Else: render empty chart




    $('#dept_'+dept_id+'-team_'+team_id+'-info').find('input[id^=hidAvgPoint]').each(function(i,e){
        console.log(e);
    });



    // todo: Calculate avg point of Dept from teams and Render chart


}

/**
 * Calculate avg point of Dept from teams and Render chart for dept
 */
var avgPointOfDept = {};
function getAvgPointOfDept(dept_id) {
    // todo: update avgPointOfDept

    // avgPointOfDept = {};

}

/////////////////////////////////////////////////////////////////////////////

/**
 * Document Ready
 */
$(function () {

    /**
     * Flow:
     *   Get data and init layout
     *   Loop all Depts and Teams
     *     Render chart with teams inspection data (by columns)
     *       use $('#hidAvgPoint_')
     *     Calculate avg point of Dept from teams
     *     Render chart for Dept
     *
     *
     */



    // Loop all Depts
    $("input[id*=hidDeptId_]").each(function(i,d){
        let dept_id = $(d).val();
        // Loop all Teams in 1 Dept
        $("input[id^=hid_deptId_"+dept_id+"_teamId_]").each(function(i,t){
            let team_id = $(t).val();

            renderAvgChart(dept_id, team_id);


        });

        console.log('=========');

    });

});