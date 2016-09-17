/**
 * Created by Fascha on 17.09.2016.
 */
(function(){
    "use strict";

    var btn_load = $("#btn_load_data");
    var thread_url = $("#thread_url");

    btn_load.click(function(){
        alert("http://127.0.0.1:5000/get_thread_by_id/" + thread_url.val())
        drawTree("http://127.0.0.1:5000/get_thread_by_id/" + thread_url.val())
    });



}());


