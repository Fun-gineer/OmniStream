function init(){

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

      // var Flash_Installed = ((typeof navigator.plugins !== "undefined" && typeof navigator.plugins["Shockwave Flash"] === "object") || (window.ActiveXObject && (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) !== false));
      window.Flash_Installed = (swfobject.hasFlashPlayerVersion("1")) ? true : false;



  //matchMedia is relatively new. Theres a modernizr equivalent and a polyfill on github
      window.isMobile = window.matchMedia("(max-width: 1300px)").matches;
      //mq.matches as a test (not a function)


        //ENLARGE MENU ICONS FOR TOUCHSCREENS
  		window.MobileOrTablet= mobile.mobileOrTablet();
  		if (MobileOrTablet){
  			$('.fa').addClass('fa-2x');
  		}


        //SET RECENT STREAMS
      window.RecentStreams = [];
      	if(storageEnabled){
      			if (!(localStorage.RecentStreams)) localStorage.RecentStreams = '';
      			RecentStreams = localStorage.RecentStreams.split(",");   //contains recent streams that were watched
      			if (RecentStreams[0] === '') RecentStreams = [];
      	}
      	else RecentStreams = [];



          //GET COOKIES OR URL PARAMS TO SET THE INITIAL STREAMS BEING WATCHED. GET USERNAME
      window.UrlParams = window.parseURL();
      cookies.CookiesEnabled = cookies.areCookiesEnabled();
      window.Username = cookies.getCookie('username') || '';


    //CROSS BROWSER SCROLL PANE CUSTOMISATION
    	$('.scroll-pane').jScrollPane({
    		showArrows: true,
    		arrowScrollOnHover: true,
    		// horizontalGutter: 30,
    		// verticalGutter: 30
    	});
      // // Add some content to #pane2
      // var pane2api = $('#pane2').data('jsp');
      // var originalContent = pane2api.getContentPane().html();
      // pane2api.getContentPane().html(originalContent + originalContent + originalContent);
      //
      // // Reinitialise the #pane2 scrollpane
      // pane2api.reinitialise();



    	//filter and settings windows won't close when you click the buttons
    $(".toggleableFilter").click(function(e) {
    		 e.stopPropagation();
    });
    $(".toggleableSetting").click(function(e) {
    		e.stopPropagation();
    });
      //filter and settings windows won't close when you type input into the inputs
    $('#game').keypress(function(e){
    	e.stopPropagation();
    })
    $('#streamer').keypress(function(e){
    	e.stopPropagation();
    })
    $('#Username').keypress(function(e){
    	e.stopPropagation();
    })


}

module.exports= init;
