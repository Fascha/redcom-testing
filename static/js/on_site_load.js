/**
 * Created by Fascha on 18.09.2016.
 */

$(document).ready(function(){


    var opts = {
        lines: 13 // The number of lines to draw
        , length: 28 // The length of each line
        , width: 14 // The line thickness
        , radius: 42 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    }

    var button_tree_load = $("#button_tree_load");
    var text_input_tree_thread_id = $("#text_input_tree_thread_id");
    var spinner = new Spinner(opts);
    var target = document.getElementById('spinner-box')


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
            beforeSend: function() {
                spinner.spin(target)
            },
            complete: function() {
                spinner.stop()
            },
            url: "/get_thread_by_id/" + text_input_tree_thread_id.val() + "/tree",
            type: "GET",
            dataType: "json",
            timeout: 0,
            success: drawTree,
            error: function () {
                spinner.stop()
                alert("Error")
            }

        });

        // drawTree("/get_thread_by_id/" + text_input_tree_thread_id.val() + "/tree");
        drawPie("/get_thread_by_id/" + text_input_tree_thread_id.val() + "/pie");
        drawTimeSeries("/get_thread_by_id/" + text_input_tree_thread_id.val() + "/timeseries")
    });


});