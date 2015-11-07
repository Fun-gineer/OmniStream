//COOKIES - GET LAYOUT ON CLOSE, GET WATCHING STREAMS
  function createCloseListener(){
      window.onbeforeunload = function(e) {

         cookies.setCookie("listw", $colList.width(), 90);
         cookies.setCookie("chatw", $chat.width(), 90);
         cookies.setCookie("streamsw", $streams.width(), 90);
         cookies.setCookie("ListRefreshTimeMinutes", list.CListRefreshTimeMinutes, 90);
         if (window.CSaveRecentStreams) localStorage.RecentStreams = window.RecentStreams.toString();
         else localStorage.RecentStreams = '';
        //  localStorage.removeItem('RecentStreams');

         for (var i=0;i<4;i++){
           if(window.WatchingStreams[i]!='' && window.WatchingStreams[i]!=null) cookies.setCookie("stream"+i, window.WatchingStreams[i], 90);
           else { while(i<4){
                cookies.setCookie("stream"+i,'', 90);
                ++i;
                // alert("set cookie " + window.WatchingStreams[i]);
              }
             break;}
          //  alert(window.WatchingStreams[i]);
         }
         
        return null;   //THIS IS THE EVENT HANDLER (FUNCTION) FOR CLOSING THE TAB (OR REFRESHING). WE DONT NEED ONE HERE
        }
    }

module.exports= createCloseListener;
