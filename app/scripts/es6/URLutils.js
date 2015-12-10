function URLUtils(){

//PARSES THE URL PARAMETERS AND RETURNS EACH OF THEM AS ELEMENTS IN A RETURN ARRAY (query_string)
    window.parseURL= function() {

      var query_string = [];
      var query = window.location.href;
      var pre = query.split(/index\.html#?\/?/);
      if (!(pre)) pre = query;
      window.URL=pre[0]+'index.html#/';
        if(pre[1]) var vars = pre[1].split("/");
        else var vars='';
      for (var i=0;i<vars.length;i++) {
          var temp = decodeURIComponent(vars[i]);
          if (temp) query_string[i] = temp;   //doesn't terminate at empty entries, ie: / /
        }
        return query_string;
    }



//CALL THIS AFTER RUNNING parseURL AND PASSING THE RESULTS INTO THIS FUNCTION
    window.fillStreamsWithURLParams = function (UrlParams, WatchingStreams){
  	  try{
  	    if (UrlParams){
  	      var p=0;
  	      UrlParams.forEach(function(param){
  	        console.log(param+ ', ');
  	        WatchingStreams[p]=param;
  	        addToRecentStreams();
  	        if(p>3) throw BreakException;
  	        ++p;
  	      })
  	    }
  	  }catch(e) {
  	      alert('Maximum of 4 streams!');
          return '';
  	  }finally{
  	    var length = WatchingStreams.length || 0;
  	    window.NumStreams=(length==0?1 :length==1?1 :length==2?2 :length==3?4: length==4?4 :4);
  	   }
       return WatchingStreams;
  	  // alert('URL params used to populate streams. URL: ' + URL);
  	}

//UPDATE THE URL
    window.updateURL= function(URL,WatchingStreams){
      var newURL = URL;
      WatchingStreams.forEach(function(stream){
      if (stream != 'undefined')
       newURL += stream + '/';
      });
      window.history.replaceState(null, null, newURL);
    }

}


module.exports= URLUtils;
