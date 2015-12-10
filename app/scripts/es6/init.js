function init(){

// //REDIRECT FOR THE HELP BUTTON
//       $('#Help').click(function(){
//         window.open('http://www.streamstreamstream.com/help.txt');
//       });


//CHECK FLASH INSTALLED
// var Flash_Installed = ((typeof navigator.plugins !== "undefined" && typeof navigator.plugins["Shockwave Flash"] === "object") || (window.ActiveXObject && (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) !== false));
      window.Flash_Installed = (swfobject.hasFlashPlayerVersion("1")) ? true : false;

//ENLARGE MENU ICONS FOR TOUCHSCREENS
  		window.MobileOrTablet= mobile.mobileOrTablet();


//CHECK FOR COOKIES
      window.CookiesEnabled = cookies.areCookiesEnabled();

//CHECK FOR LOCALSTORAGE
      window.storageEnabled = (function(){
        var test = 'test';
        try {
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch(e) {
          return false;
        }
      })();


//GET USERNAME
      window.Username = cookies.getCookie('username') || '';


//SET RECENT STREAMS VARIABLE
      window.RecentStreams = [];
      	if(storageEnabled){
      			if (!(localStorage.RecentStreams)) localStorage.RecentStreams = '';
      			RecentStreams = localStorage.RecentStreams.split(",");   //contains recent streams that were watched
      			if (RecentStreams[0] === '') RecentStreams = [];
      	}
      	else RecentStreams = [];


//ADJUSTMENTS FOR MOBILE
//MEDIA QUERY (CSS SCREEN SIZE) BASED MOBILE DETECTING
    if (mobile.isMobile()){
			$('.fa').addClass('fa-2x');
		}




//CHOOSE BETWEEN LOADING FROM COOKIES OR USING URL PARAMS (TRIES URL PARAMS FIRST)
    			window.URL='';       //without appended streams or index.html#
    			window.UrlParams= parseURL();	//GET COOKIES OR URL PARAMS TO SET THE INITIAL STREAMS BEING WATCHED. GET USERNAME
    if(typeof UrlParams[0] == "undefined" && CookiesEnabled){
      console.log('No URL params. loading cookies');
      cookies.setStreamsFromCookies();    //brings back the streams stored in the cookies session and updates the URL to reflect that (but only if a custom URL is not set)
    }
    else{
    	console.log('Using URL to populate streams');
    	WatchingStreams = fillStreamsWithURLParams(UrlParams,WatchingStreams);
    };
    // alert(window.history.length);

}

module.exports= init;
