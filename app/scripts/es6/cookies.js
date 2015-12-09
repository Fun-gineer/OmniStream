//COOKIE UTILITY FUNCTIONS
class cookies{

	 setCookie(cName, cValue, expiryDays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (expiryDays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cName + "=" + cValue + "; " + expires;
	}

	 getCookie(cName) {
	    var name = cName + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	    }
	    return "";
	}


	 areCookiesEnabled(){
		var cookieEnabled = (navigator.cookieEnabled) ? true : false;

		if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled){
			document.cookie="testcookie";
			cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
		}
		this.CookiesEnabled = cookieEnabled;
		return cookieEnabled;

	}



//SET LAYOUT
	getLayoutCookies() {

	      //SIZING WITH COOKIES AND SIZING RESET STUFF - USES PIXELS, SO NOT REALLY FUTURE-PROOF
	      //WILL FALL BACK TO DEFAULTS IF THE USER BREAKS COLUMN SIZES
	    try{
	    var chatw = cookies.getCookie("chatw");
	      if (chatw != "" && chatw>50 && chatw<650) {} else throw BreakException;
	    var listw = cookies.getCookie("listw");
	      if (listw != "" && listw>80 && listw<500) {} else throw BreakException;
	    var streamsw = cookies.getCookie("streamsw");
	      if (streamsw != "" && streamsw>350) {} else throw BreakException;

	    // alert('Chat Width: '+chatw); alert('List Width: '+listw); alert('Streams Width: '+streamsw);

	    //HAVE COOKIE RESTORE DISABLED ATM
	    window.$colList.width(listw);
	    window.$chat.width(chatw);
	    window.$streams.width(streamsw);

	    // alert('Chat Width: '+chatw); alert('List Width: '+listw); alert('Streams Width: '+streamsw);
	    }
	    catch (e) {console.log('Reverted column dimensions to default')}

	  }



//BRING BACK PREVIOUS STREAMS (BUT ONLY IF URL PARAMS ARE NOT SET)
	getStreamCookies(){

	    var push='index.html#';
	    for (var i=0;i<4;i++){
	      var cookie = window.cookies.getCookie('stream'+i);
	      if(cookie!=null && cookie!='') {
	        push+='/'+cookie;
	        window.WatchingStreams[i]=cookie;
	        console.log('stream '+i+'- '+cookie);
	      }
	      else {
					window.history.pushState(null, null, push);
					break;
				}
	    }
			var length = WatchingStreams.length || 0;
	    window.NumStreams=(length==0?1 :length==1?1 :length==2?2 :length==3?4: length==4?4 :4);
	    console.log('cookies used to populate streams. URL: ' + URL);

	}


};

module.exports=cookies;
