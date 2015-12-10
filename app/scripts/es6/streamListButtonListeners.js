function setStreamListButtonListeners(){

  //TOP STREAMS
    $('#topStreams').click(function(){

      if (!($(this).hasClass('activeButton'))){
        $('.activeButton').removeClass('activeButton');
        $(this).addClass('activeButton');
        list.addToTopStreams(true);
      }
    });


  //RECENT STREAMS
  $('#recStreams').click(function(){

    if(list.NoListLockout){
      if (!($(this).hasClass('activeButton'))){
        $('.activeButton').removeClass('activeButton');
        $(this).addClass('activeButton');
            list.NoListLockout=false;

          list.addToRecStreams(true);

      }
    }
  });




  //FAVORITE STREAMS
  //we only hit the Twitch API for a refresh of favorited streams every couple hours when the app is running, and only request ~25 images per request...
  //cookies are set to control the API hits for the full list of favorites (which could be hundreds of entries) to every couple of hours when running, and every
  //few days when not running. It then sorts the full list by viewers and saves into Favorites[]. We then only use subsets of this array to populate the list...
  //the reson that the entire Favorites array isnt used to populate the list is to reduce API requests for images...
  //imagine making requests for hundreds of medium sized images every few minutes per client...
  $('#favStreams').click(function(){

    if (!($(this).hasClass('activeButton'))){
        //CHECK IF USERNAME IS SET
      if(window.Username!='' && window.Username!=null){
            console.log('Using as '+window.Username);
        } else {
            var user = prompt("Enter your Twitch username to use the favorites tab:", "");
            if (user != "" && user != null) {
                cookies.setCookie("username", user, 365);
                window.Username = user;
            } else {
                    return
              }
          }


      if(list.NoListLockout){
        list.NoListLockout=false;
            $('.activeButton').removeClass('activeButton');
            $(this).addClass('activeButton');

            //HAVE TO DO TWO AJAX REQUESTS, BECAUSE THE "FOLLOWS" RESPONSE FROM THE TWITCH API DOESENT GIVE YOU THE PROPER
            //DATA NEEDED TO POPULATE THE STREAMS LIST

            //IF THE SESSION COOKIE FOR THE FavoritesString IS EXPIRED, HIT THE API WITH THE FavoritesString TO REFRESH VIEWERCOUNT,
            //THEN SORT BY VIEWER COUNT AND RESET FavoritesString AND THE LOCAL STORAGE COPY TO REFLECT THAT SORTING. THEN HIT THE
            //API FOR THE STREAM DATA ON THE TOP 25 (if you havent changed the number) STREAMS FROM THAT FavoritesString.
            if(storageEnabled && cookies.CookiesEnabled) {

              if(typeof (localStorage.FavoritesString) == 'undefined' || localStorage.FavoritesString == null || localStorage.FavoritesString=='' ||
                  localStorage.SortedFavoritesString == null || typeof (localStorage.SortedFavoritesString) == 'undefined'|| localStorage.SortedFavoritesString=='' ||
                  cookies.getCookie('FRefreshSession') == null || cookies.getCookie('FRefreshSession')==''){

                    console.log('refreshed Favorites');
                    cookies.setCookie("FRefreshSession", true, 0.1);

                    window.deferred1 = $.Deferred();
                    window.deferred2 = $.Deferred();
                      //SETS FavoritesString. DOESN'T UPDATE THE LOCAL STORAGE IF THE FAVORITES LIST IS NOT EXPIRED
                    window.refreshFavoritesString(false);      //refresh the list if it's gone expired (3 days default) during the session

                      //USES FavoritesString TO SORT BY VIEWERS, THEN SETS SortedFavoritesString BASED OFF THAT ORDERING.
                      //DOES NOTHING IF THE CURRENT SORTED LIST ISNT EXPIRED
                    window.deferred1.done(function(value){window.getFavStreamsAndSort(value)});     //hit the API for all favorited streams, then sort them and set the string to reflect that
                    window.deferred2.done(function(value){list.addToFavStreams(value,true)});
              } else {
                console.log(cookies.getCookie('FRefreshSession'));
                console.log('didnt refresh anything');
                window.FavoritesString = localStorage.FavoritesString;
                window.SortedFavoritesString = localStorage.SortedFavoritesString;
                list.addToFavStreams('',true);     //use a sub-array of FavoritesString  (25 entries if you havent modified the global for list refresh increment) to populate the list.
              }

          }
      }
    }
  });



//FILTER STREAMS
//GIVES THE FILTER FIELD CHECKED AN activeFilter CLASS SO THAT LISTLOADER CAN USE THIS CLASS TO CHOOSE WHAT FILTERING FUNCTIONS TO RUN
  $filterList.find('.toggleableFilter i, .toggleableFilter span, .toggleableFilter span input').click(function(event){

        if ($(this).prop("tagName") === 'INPUT') {
          event.stopPropagation();
          return;
        }

          //CLICKED RED CHECKMARK
        if ($(this).hasClass('activeFilter')) {
          $(this).removeClass('activeFilter');
          $(this).next('span').find('input').off('input');
          list.flushNumListedStreams();
          list.listLoader(list.List, true, false, list.NumListedStreamsEnd);
        }
          //DIDNT CLICK RED CHECKMARK
        else {
              //CLICKED A WHITE CHECKMARK
            if ($(this).hasClass('i')) {
              $(this).addClass('activeFilter');
              list.flushNumListedStreams();
              list.listLoader(list.List, true, false, list.NumListedStreamsEnd);
            }
              //DIDNT CLICK A CHECKMARK
            else {
                  //DIDNT CLICK CHECKMARK, CHECKMARK IS RED
              if ($(this).parent().find('i').hasClass('activeFilter'))
                  { $(this).parent().find('i').removeClass('activeFilter');
                    $(this).next('span').find('input').off('input');
                    list.flushNumListedStreams();
                    list.listLoader(list.List, true, false, list.NumListedStreamsEnd);
                  }
                    //DIDNT CLICK A CHECKMARK, CHECKMARK IS WHITE
              else {
                $(this).parent().find('i').addClass('activeFilter');
                list.flushNumListedStreams();
                list.listLoader(list.List, true, false, list.NumListedStreamsEnd);
              }
            }


        }

  });

  $('input').on('input', function() {
    if($(this).val()==='') $(this).closest('li').find('i').removeClass('activeFilter');

    else if (!($(this).closest('li').find('i').hasClass('activeFilter')) && $(this).val()!=='') {
      // $('.toggleableFilter .activeFilter').removeClass('activeFilter');
      $(this).closest('li').find('i').addClass('activeFilter');
    }
    list.flushNumListedStreams();
    list.listLoader(list.List, true, false, list.NumListedStreamsEnd);

  });


//LIST SIZE AND CHAT SIZE SETTING LISTENERS
    $('#listSize').change(function(){
      $colList.css("width", $(this).val()+'%');
    });

    $('#chatSize').change(function(){
      $chat.css("width", $(this).val()+'%');
      $streams.css("width", 100-$(this).val()+'%');
      cResizer.ResetOuterColumnDrag();
      cResizer.ResetStreamColumnDrag();
    });

//REFRESH PERIOD SETTING LISTENER
    $('#refreshPeriod').change(function(){
      if ($(this).val() === 'NEVER') CListRefreshTimeMinutes = 9999999999;  //USED IN IN  listManager.js TO UPDATE STREAMS LIST EVERY SO OFTEN
      else CListRefreshTimeMinutes = $(this).val();
    });



//STREAM SPLIT SETTING LISTENER FOR THE SELECT IN THE MENU BAR
  $('#streamSplit').change(function(){
    if($(this).val() === 'Single') {
      var e = jQuery.Event("keypress");
      e.which = 122;
      $("html").trigger(e);
    }
    if($(this).val() === 'DoubleH') {
      window.DivideStreams='vertical';
      var e = jQuery.Event("keypress");
      e.which = 120;
      $("html").trigger(e);
    }
    if($(this).val() === 'DoubleV') {
      window.DivideStreams='horizontal';
      var e = jQuery.Event("keypress");
      e.which = 120;
      $("html").trigger(e);
    }
    if($(this).val() === 'Quad') {
      var e = jQuery.Event("keypress");
      e.which = 99;
      $("html").trigger(e);
    }
  });




//CLICK LISTENERS FOR THE STREAM LIST
    function moveDownStreamListener(i){
      return function(){
        var temp = WatchingStreams[i];
        WatchingStreams[i]=WatchingStreams[i+1];
        WatchingStreams[i+1]=temp;
        window.changeChat(i,WatchingStreams[i]);
        window.changeChat(i+1,WatchingStreams[i+1]);
        window.renderStreamsSortList();
      }
    }

      function moveUpStreamListener(i){
        return function(){
            var temp = WatchingStreams[i];
            WatchingStreams[i]=WatchingStreams[i-1];
            WatchingStreams[i-1]=temp;
            window.changeChat(i,WatchingStreams[i]);
            window.changeChat(i-1,WatchingStreams[i-1]);
            window.renderStreamsSortList();
        }
      }

      function deleteStreamListener(i){
        return function(){
          WatchingStreams[i]='';
          $('#Stream'+i).text('');
          window.changeChat(i,'');
          window.renderStreamsSortList();
        }
      }

    for(var i=0;i<4;i++){

      if(i<3){
        $('#moveDownStream'+i).click(moveDownStreamListener(i));
      }
      if(i>0){
        $('#moveUpStream'+i).click(moveUpStreamListener(i));
      }
      $('.delStream'+i).click(deleteStreamListener(i));

    }

}

module.exports= setStreamListButtonListeners;
