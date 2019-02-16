$(function() {


    // Submit post on submit
    $('#post-form').on('submit', function(event){
        event.preventDefault();
        console.log("form submitted!")  // sanity check
        create_post();
    });

     // Delete post on click
    $("#talk").on('click', 'a[id^=delete-post-]', function(){
        var post_primary_key = $(this).attr('id').split('-')[2];
        console.log(post_primary_key) // sanity check
        delete_post(post_primary_key);
    });

     // Like on click
    $(".like").on('click',function(){
        var post_primary_key= $(this).attr('name')
        console.log(post_primary_key) // sanity check
        like(post_primary_key);
    });


        // AJAX for posting
    function create_post() {
        console.log("create post is working!") // sanity check
        $.ajax({
            url : "create_post/", // the endpoint
            type : "POST", // http method
            data : { the_post : $('#post-text').val()}, // data sent with the post request
            // handle a successful response
            success : function(json)  {
                $('#post-text').val(''); // remove the value from the input
                console.log(json); // log the returned json to the console
                $("#talk").prepend("<li><strong>"+json.text+"</strong>-<em> "+json.author+"</em> - <span> "+json.created+
                    "</span>  <a id='delete-post-"+json.postpk+"'>delete me</a></li>");
                console.log("success"); // another sanity check
            },
            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    };

    // AJAX for deleting
    function delete_post(post_primary_key){
            if (confirm('are you sure you want to remove this post?')==true){
                $.ajax({
                    url : "delete_post/", // the endpoint
                    type : "DELETE", // http method
                    data : { postpk : post_primary_key }, // data sent with the delete request
                    success : function(json) {
//                        $(li).hide(); // hide the post on success
//                     $(#talk > li:#delete-post-" + post_primary_key).hide()
//                      $("#talk").hide();
                        $("#delete-post-"+post_primary_key).parent('li').hide()
//                      $("#delete-post-" + post_primary_key).hide(); // hide the post on success
//                      console.log("post deletion successful");
                    },

                    error : function(xhr,errmsg,err) {
                        // Show an error
                        $('#results').html("<div class='alert-box alert radius' data-alert>"+
                        "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>"); // add error to the dom
                        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                    }
                });
            } else {
                return false;
         }
     };

    // AJAX for like
    function like(post_primary_key){
                console.log("like is working!") // sanity check
                $.ajax({
                    url: "like/", // 통신할 url을 지정한다.
                    type: "POST", // 데이터를 전송하는 방법을 지정한다.
                    data : { postpk : post_primary_key }, // data sent with the delete request
                    // 서버측에서 전송한 데이터 views.py like 메소드
                    // context = {'likes_count' : memo.total_likes, 'message' : message}
                    // json.dump(context)를 통해서 json 형식으로 전달된다.
                    success: function(response){ // 성공했을 때 호출할 콜백을 지정한다.
//                    id = $(this).attr('name');
                    $('#count'+ post_primary_key).html(": "+ response.likes_count);
//                    alert(response.message);
//                    alert("좋아요수 :" + response.likes_count);
                    },

                    error:function(request,status,error){
                        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                    }});
    }

    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});
