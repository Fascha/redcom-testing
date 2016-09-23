/**
 * Created by Fascha on 18.09.2016.
 */

$(document).ready(function(){

    var button_tree_load = $("#button_tree_load");
    var text_input_tree_thread_id = $("#text_input_tree_thread_id");

    button_tree_load.click(function(){
        // $.ajax({
        //     url: "/get_thread_by_id/" + text_input_tree_thread_id.val() + "/tree",
        //     type: "GET",
        //     dataType: "json",
        //     timeout: 0, //Set your timeout value in milliseconds or 0 for unlimited
        //     success: function(response) { alert(response); },
        //     error: function(jqXHR, textStatus, errorThrown) {
        //         if(textStatus==="timeout") {
        //             alert("Call has timed out"); //Handle the timeout
        //         } else {
        //             alert("Another error was returned"); //Handle other error type
        //         }
        //     }
        // });​

        $.ajax({
            url: "/get_thread_by_id/" + text_input_tree_thread_id.val() + "/tree",
            type: "GET",
            dataType: "json",
            timeout: 0,
            success: drawTree,
            error: function () {
                alert("Error")
            }

        });

        // drawTree("/get_thread_by_id/" + text_input_tree_thread_id.val() + "/tree");
        drawPie("/get_thread_by_id/" + text_input_tree_thread_id.val() + "/pie");
    });


});