/**
 * Created by Fascha on 18.09.2016.
 */

$(document).ready(function(){

    var button_tree_load = $("#button_tree_load");
    var text_input_tree_thread_id = $("#text_input_tree_thread_id");

    button_tree_load.click(function(){
        drawTree("http://127.0.0.1:5000/get_thread_by_id/" + text_input_tree_thread_id.val())
    });


});