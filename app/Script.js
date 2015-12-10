(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//FUNCTIONS FOR THE STREAM REARRANGER
function Dropdown(){

  //POPULATES THE DROPDOWN MENU STREAM LIST WITH THE STREAMS BEING WATCHED
    window.renderStreamsSortList=function(){
      for(var i=0;i<4;i++){
        $('#Stream'+i).text(WatchingStreams[i]);
      }
    }

    window.renderTopGamesDisplay=function(refreshing){
      if(refreshing) {
        var i=0;
        window.topGamesIndex=50;
      } else{
        i=window.topGamesIndex;
        window.topGamesIndex += 50;
      }

      $.getJSON(window.TOP_GAMES_REQUEST_URL+'&offset='+i+'&callback=?', function(topGames){_renderTopGamesDisplay(topGames)});
      function _renderTopGamesDisplay(topGames){
        for (i;i<topGames.top.length;i++){
          $('#topGames').append('<img src="'+topGames.top[i].game.box.medium+'" id="'+i+'">');
          $('#topGames #'+i).click(_topGamesListener(topGames,i));
        }
      }
    }

    window._topGamesListener= function(topGames,i){
      return function(){
        window.list.URLRequestGames(topGames.top[i].game.name,true);
      }
    }

    window.controlDropdownScroll= function(){
      $('#topGames').scroll(function(){
        if ($(this).get(0).scrollWidth){
          if ($(this).scrollLeft() > (($(this).get(0).scrollWidth-1000)*((topGamesIndex-50)/50))){
            renderTopGamesDisplay(false);
          }
        }
        console.log($(this).get(0).scrollWidth);
        //TODO finish
      });
    }

}
module.exports = Dropdown;

},{}],2:[function(require,module,exports){
//SEARCH FOR GAMES (FROM A PREMADE LIST)
// https://api.twitch.tv/kraken/streams?game=
//SEARCH FOR CHANNELS FROM A PREMADE LIST
// https://api.twitch.tv/kraken/streams?channel=

// https://api.twitch.tv/kraken/search/channels?q=Lineage%20II:%20The%20Chaotic%20Chronicle
// https://api.twitch.tv/kraken/search/games?q=Lineage&type=suggest&live

//THIS ONE WILL DO PARTIAL QUERIES FOR STREAMS
// https://api.twitch.tv/kraken/search/streams?q=Lineage&limit=100&offset=0&type=suggest&live
//THIS ONE WILL DO PARTIAL QUERIES FOR GAMES
//https://api.twitch.tv/kraken/search/games?q=counter&limit=100&offset=0&type=suggest&live
//https://api.twitch.tv/kraken/games/top?limit=&offset=0
// THIS ONE WILL DO PARTIAL QUERIES AGAINST ALL
//https://api.twitch.tv/kraken/search/channels?q=




"use strict";
// window.onload = function(){
$(function(){

	// document.domain=document.domain;	//iframe->document port matching. The Twitch API sets the domain correctly, so no problems there

//INCLUDES
	(require('./streamUtils.js'))();
	window.cookies= new (require('./cookies.js'));
	window.mobile= new (require('./mobile.js'));
	window.list= new(require('./listManager.js'));
	(require('./URLUtils.js'))();
	(require('./Dropdown.js'))();
	window.renderStreams= require('./renderStreams.js');
	window.cResizer= new(require('./columnResizer.js'));



//CONFIG VARIABLES
window.CFavStreamsSearchLimit = 400;   //maximum number of followed streams to fetch from the API to inspect for live-ness to populate the favorites list
window.CHideGame = false;
window.CHideDesc = true;
window.CSaveRecentStreams = true;

//URLs
window.BASE_TWITCH_REQUEST_URL= 'https://api.twitch.tv/kraken/streams?';
window.TOP_GAMES_REQUEST_URL = 'https://api.twitch.tv/kraken/games/top?limit=50';

//INITIALIZE
window.topGamesIndex=0;
window.lw=500;
window.NumStreams=1;  //number of streams being displayed, NOT the number of streams in the watching-list
window.SelectedStream=0;   //the stream that is "active" to be changed on a list click
window.WatchingStreams=[]; //the streams being watched
window.DivideStreams='horizontal';
window.ActiveChat=0;
window.addListTimer = null;
window.FirstTimeRenderingStreams = true;
window.ListIsHidden = false;
window.ChatIsHidden = false;
window.SingleStreamSelectorOffset=0;
window.ChangingSingleStreams=false;    //used in the renderStreams function's .Init listener on the flash players to correctly show the channel number on SelectedStream change
window.Favorites=[];
window.FavoritesFirstClick=true;
window.FavoritesString = '';
window.SortedFavoritesString = '';
window.deferred1 = $.Deferred();
window.deferred2 = $.Deferred();


//CACHE DOM
window.$list = $('#list');
window.$colList = $('.colList');
window.$streams = $('.colStreams');
window.$chat = $('.colChat');
window.$selectedStreamPopup = window.$streams;    //meaningless; purely for initialization;
window.$filterList = $('#filterList');



//RUN

//init script
(require('./init.js'))();
showStreamsLoadScreen();
cookies.setLayoutFromCookies();     //loads layout cookies and does resizing
cResizer.setResizableColumns('sample',true,cResizer.ResetStreamColumnDrag);
addToRecentStreams();   //sets recent streams to the streams you are initially watching
renderTopGamesDisplay(true);	//THE DROPDOWN MENU

list.URLRequestTopStreams(window.BASE_TWITCH_REQUEST_URL,true);
list.controlListScroll();
controlDropdownScroll();

window.renderStreamsSortList();

(require('./streamListButtonListeners.js'))();
(require('./closeListener.js'))();  //creates cookies to store layout info for setLayoutFromCookies and setStreamsFromCookies
cResizer.setResizableStreamList();
(require('./keyListenersSetup.js'))();
(require('./initFinished.js'))();


});


//THIS IS THE MASTER THAT REFRESHES ALL THE RESIZERS AT ONCE
	// function ResetAllDragColumns(){
	//   ResetOuterColumnDrag();
	//   ResetStreamColumnDrag();
	// }


//WINDOW.RESIZEBY() (ONLY WORKS ON WINDOWS YOU MADE) NEED THIS TO UNBREAK THE CHAT. THE CHAT DOESNT FIT ITSELF WHEN YOU FIRST EMBED IT.
	// function DoBrowserResizeCycle(){
	//   var height = $(window).height();
	//   var width = $(window).width();
	//   alert($(window).width());
	//   window.resizeBy(-500, 0);
	//   alert($(window).width());
	//   // window.resizeTo(width, height);
	// }


// this.$OuterDiv = $(document.createElement('div'))     //$('<div></div>') also works instead of document.create....
//     .hide()
//     .append($('<table></table>')
//         .attr({ cellSpacing : 0 })
//         .addClass("text")
//     );
//
//


// $(document).ready(function() {
//     $("a").click(function(event) {
//         alert(event.target.id);
//     });
// });
//
// $(document).ready(function() {
//     $("a").click(function(event) {
//         // this.append wouldn't work
//         $(this).append(" Clicked");
//     });
// });

//WRAP FUNCTION
	// $( ".inner" ).wrap(function() {
	//   return "<div class='" + $( this ).text() + "'></div>";
	// });

//GETTING % WIDTHS OF ELEMENTS (here its class of box)
	// var width = $('.box').clone().appendTo('body').wrap('<div style="display: none"></div>').css('width');
	// alert(width);

//WINDOW.LOCATION
	// window.location.href returns the href (URL) of the current page
	// window.location.hostname returns the domain name of the web host
	// window.location.pathname returns the path and filename of the current page
	// window.location.protocol returns the web protocol used (http:// or https://)
	// window.location.assign loads a new document


//MONITOR EVENTS
//type in console:
	// monitorEvents($0)		//$0 is just the last element in the DOM, can replace with whatever you want
	// unmonitorEvents($0)

},{"./Dropdown.js":1,"./URLUtils.js":3,"./closeListener.js":4,"./columnResizer.js":5,"./cookies.js":6,"./init.js":7,"./initFinished.js":8,"./keyListenersSetup.js":9,"./listManager.js":10,"./mobile.js":11,"./renderStreams.js":12,"./streamListButtonListeners.js":13,"./streamUtils.js":14}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
//FOR RESIZABLE COLUMN SUPPORT
  //CAN MAKE A SEPARATE RESIZE HANDLERR FOR EACH EMBEDDED RESIZABLE COLUMN SET, MAKING THEM CALL DOWN THE CHAIN RECURSIVELY.
  //THIS WILL REFRESH THE ENTIRE CHAIN DOWNWARDS WHEN A HIGHER LEVEL COLUMN ANCHOR IS MOVED, KEEPING ALL LOWER LEVEL ANCHORS ACCURATE

class columnResizer {

  setResizableColumns(id,isOuter,resizeChildHandler){
    if(isOuter){
      $("#"+id).colResizable(
        {liveDrag:true,
         gripInnerHtml:"<div class='grip'></div>",
        draggingClass:"dragging",
        partialRefresh:"true",
        onResize: function(){
                  // chatWidth=$chat.width();
                  // listWidth=$colList.width();
                    //THIS IS A HACK TO FIX THE TWITCH DRAGGING-CHAT-OF-DEATH
                  // if(NumStreams>1) renderStreams();

                resizeChildHandler()
                }
       }
      );
   }
   else {
     $("#"+id).colResizable(
       {liveDrag:true,
        gripInnerHtml:"<div class='grip'></div>",
       draggingClass:"dragging",
       partialRefresh:"true"      //might not even be neccessary
      }
     );
   }
  }

  ResetOuterColumnDrag(){
      $("#sample").colResizable({
        disable:true
      });

    this.setResizableColumns('sample',true,this.ResetStreamColumnDrag);
     }

     //NEED TO USE THIS TO MOVE THE STREAM COLUMN RESIZER HANDLES WHEN YOU SHOW OR HIDE THE SIDE COLUMNS
   ResetStreamColumnDrag(){
     if(window.NumStreams>1){
         $("#streamTable").colResizable({
           disable:true
       });
   }
      this.setResizableColumns('streamTable',false,null);
     }

    //FOR THE STREAM LIST
  setResizableStreamList(){
    $("#listTable").colResizable(
      {liveDrag:true,
       gripInnerHtml:"<div class='grip'></div>",
      draggingClass:"dragging",
      // partialRefresh:"true"      //might not even be neccessary
     }
    );
  }

}

module.exports= columnResizer;

},{}],6:[function(require,module,exports){
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
	setLayoutFromCookies() {

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
	setStreamsFromCookies(){

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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
function initFinished(){

//WINDOW RESIZE LISTENERS
	//KEEPS THE COLLAPSE CARETS PROPERLY ALIGNED ON BROWSER RESIZE
		$(window).resize(function() {
			var $collapseList = $(".collapseList");
			var $collapseChat = $('.collapseChat');
			if(!ListIsHidden) $collapseList.css({top: 0, left: $colList.width(), position:'absolute', 'z-index': 2});
			$collapseChat.css({top: 0, right: 0, position:'absolute', 'z-index': 2});
		});

	//KEEPS THE CARET AND MENU BAR ICONS THE PROPER SIZE ON BROWSER RESIZE
		$(window).resize(function(){
			//MAKE TOGGLE ICONS BIGGER FOR SMALLER DEVICES
			    if (mobile.isMobile()) {
						$('.fa').addClass('fa-2x');
			      $('.fa-caret-right').addClass('fa-4x');
			      $('.fa-caret-left').addClass('fa-4x');
			    } else {
						$('.fa').removeClass('fa-2x');
						$('.fa-caret-left').addClass('fa-2x');
						$('.fa-caret-right').addClass('fa-2x');
						$('.fa-caret-right').removeClass('fa-4x');
			      $('.fa-caret-left').removeClass('fa-4x');

					}

					if(mobile.isPhone()){

					}
		});


//CLICK PROPAGATION
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


//TOOLTIP INIT FOR BOOTSTRAP
      $('[data-toggle="tooltip"]').tooltip();

}

module.exports= initFinished;

},{}],9:[function(require,module,exports){
//SETUP KEYBOARD KEYPRESS LISTENERS
function setupKeyListeners(){

  $("html").keypress(function( event ) {
    var player = $("#twitch_embed_player_"+SelectedStream)[0];

  //HIDING LIST
//hiding list is done in renderStreams, as per the requirement to be dynamic


      //WHEN IN SINGLE STREAM MODE THIS WILL SWITCH TO THE STREAM NUMBER PRESSED
    switch(event.which){

        //SELECTS STREAM (1,2,3,4)
      case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56:
          for (var i=0;i<4;i++){
            if ( event.which == i+49 ) {
               event.preventDefault();
               window.ChangingSingleStreams=true;
                if(window.NumStreams==1 && i!==window.SelectedStream){
                  window.SingleStreamSelectorOffset=i;
                  window.renderStreams();
                    for (var c=0;c<4;c++){
                    $('#chat'+c).hide();
                    }
                    window.ActiveChat=i;
                    $('#chat'+window.ActiveChat).show();
                  window.SingleStreamSelectorOffset=0;
                  window.SelectedStream=i;
                }
            else window.changeSelectedStream(i);
            break;
          }
            //SELECTS THE CHAT (5,6,7,8)
          if ( event.which == i+53 ) {
             event.preventDefault();
             window.ActiveChat=i;
             for (c=0;c<4;c++){
             $('#chat'+c).hide();
             }
             $('#chat'+window.ActiveChat).show();
             break;
           }
          }
        break;

      //PAUSING, MUTING, UNMUTING (space,t,u)
      case 32:
        event.preventDefault();
        if (player.isPaused()) player.playVideo();
        else player.pauseVideo();
        break;
      case 116:
        player.mute();
        break;
      case 117:
        player.unmute();
        break;


        //SET STREAM QUALITY
      case 108:
        player.setQuality('Low');
        break;
      case 109:
        player.setQuality('Medium');
        break;
      case 104:
        player.setQuality('High');
        break;
      case 115:
        player.setQuality('Source');
        break;


        //CHANGE NUMBER OF DISPLAYED STREAMS
      case 122:   //z
          if (window.NumStreams!==1){
            if (window.SelectedStream!==0){
              window.SingleStreamSelectorOffset = window.SelectedStream;
            }
            window.changeSelectedStream(SelectedStream);
          window.ActiveChat = window.SelectedStream;
            for (c=0;c<window.NumStreams;c++){
            $('#chat'+c).hide();
            }
            $('#chat'+window.ActiveChat).show();

          window.NumStreams=1;
          window.renderStreams();
          window.SingleStreamSelectorOffset=0;
            }
          break;

      case 120:   //x
          if(window.NumStreams==2){
            if (window.DivideStreams=='horizontal') window.DivideStreams='vertical';
            else window.DivideStreams='horizontal';
          } else NumStreams=2;
          window.renderStreams();
          break;

      case 99:   //c
          // if (NumStreams!==4){
          window.NumStreams=4;
          window.renderStreams();
          //  }
          break;

      };
 });
}

module.exports= setupKeyListeners;

},{}],10:[function(require,module,exports){
class listManager{

  //ADD MORE STUFF TO THE LIST WHEN THE SCROLLBAR REACHES THE BOTTOM
  constructor(){

    this.CListRefreshTimeMinutes
    this.CNumListedStreamsStart = 0;
    this.CNumListedStreamsEnd = 25;
    this.CListRefreshTimeMinutes = cookies.getCookie("ListRefreshTimeMinutes") || 60;

    this.NumListedStreamsStart = 0;
    this.NumListedStreamsEnd = 25;

    this.FilteringListStaticCounter = 0;
    this.ListStaticCounter=0;            //used when accessing the list renderer multiple times for when multiple concurrent ajax requests resolve

    this.FavIndexL=this.CNumListedStreamsStart;		//THESE ARE STATIC VARIABLES TO HOLD THE LIST NUMBER DURING ADDING OF FAVORITE STREAMS (SINCE SOME MIGHT BE OFFLINE WE NEED A SEPARATE LIST TRACKER)
    this.FavIndexH=this.CNumListedStreamsEnd;
    this.RecIndexL=this.CNumListedStreamsStart;
    this.RecIndexH=this.CNumListedStreamsEnd;

    this.ListAddCooldown=false;

    this.NoListLockout = true;

    this.List={};

    this.Game = '';
  }


  URLRequestGames(game,refreshingList){
    this.NoListLockout=false;

    this.Game = game;

    if(refreshingList) this.flushNumListedStreams();

      var that= this;
    $.getJSON('https://api.twitch.tv/kraken/streams?game='+game+'&limit='+this.NumListedStreamsEnd+'&offset='+this.NumListedStreamsStart+'&callback=?', function(result){   //the ? for the callback name signals jQuery that it is a JSONP request and not a JSON request. jQuery registers and calls the callback function automatically.
        //response data are now in the result variable
    //  var jsonString = JSON.stringify(result);
    //  var result = JSON.parse(result);
    console.log(result);
     that.listLoader(result, refreshingList, refreshingList, that.NumListedStreamsEnd);
  });
}


// SETUP OF THE STREAM LIST VIEW WITH CLICK LISTENERS
  URLRequestTopStreams (reqURL, refreshingList){
      //PREVENTS OTHER LIST EVENTS FROM BEING FIRED SO THAT MULTIPLE SETS OF AJAX REQUESTS DON'T COINCIDE
      this.NoListLockout=false;

      if(refreshingList) this.flushNumListedStreams();

        var that= this;
      $.getJSON(window.BASE_TWITCH_REQUEST_URL+'offset='+this.NumListedStreamsStart+'&limit='+this.NumListedStreamsEnd+'&callback=?', function(result){

       that.listLoader(result, refreshingList, refreshingList, that.NumListedStreamsEnd);
      });
    }


//LOAD THE STREAMS LIST ON THE LEFT. YOURE EITHER ADDING TO THE LIST, REFRESHING THE LIST (REWRITING ANEW), OR FILTERING
  //YOU PASS IN A DIFFERENT LIST EVERY TIME, SO YOU ONLY NEED TO KEEP A STATIC COUNTER TO KEEP THE INDEX POSITION WHILE FILTERING
//WHEN USING LISTLOADER ON ITS OWN, YOU NEED TO USE flushNumListedStreams() TO CLEAR THE VALUE OF this.NumListedStreamsStart...
  //NOTE listLoader HAS NO TOLERANCE FOR EMPTY LIST ENTRIES (ABORTS FUNCTION ON SIGHT), AND REQUIRES YOU TO KEEP THE
//START AND FINISH LIST PUSH POSITIONS YOURSELF IF YOU ARE MAKING MULTIPLE CALLS TO IT...
  //changingCat IS FOR WHEN YOU CLICK A NEW CATEGORY BUTTON, IT WILL RUN ONCE WITHOUT FILTERING TO POPULATE List, AND THEN ONCE WITH
//TO RENDER THE LIST PROPERLY FILTERED (SO YOU ONLY NEED TO CALL ONCE EXTERNALY)
  //streamIteratorEnd DOESNT AUTO-REFERENCE TO THE LIST'S STARTING POINT WHEN YOU RUN. YOU NEED TO MANAGE THIS EXTERNALLY
  listLoader(list, refreshingList, changingCat, streamIteratorEnd) {

        var filtering=false;
        var tempList = list;

          //CHECK THE FILTER DOM ELEMENTS TO SEE IF FILTERING IS ON; IF IT IS THEN DO THE FILTERING AND SET filtering TO TRUE
          //SO THE BEHAVIOR OF THE LISTLOADING CAN BE MODIFIED


              var temp = $filterList.find('.activeFilter');
              var _this = this;
          temp.each(function(){
            var id = $(this).next('span').find('input').attr('id');
            if (id==='streamer') {
              tempList = _this.filterByStreamer(tempList);
              filtering=true;
            }
            if (id==='game') {
              tempList = _this.filterByGame(tempList);
              filtering=true;
            }
          });


  //MODIFY LISTLOADER BEHAVIOR IF REFRESHING OR FILTERING. THESE VARIABLES AFFECT HOW THE PASSED IN list IS ADDED TO
  //THE $list DOM ELEMENT
      if (refreshingList){
        $list.html('');
        this.FilteringListStaticCounter=0;
        if(filtering==false || changingCat){
          this.List = list;
          this.ListStaticCounter=0;
        }
      } else this.List.streams = this.List.streams.concat(list.streams);

      if (filtering) list = tempList;  //else just use list



        var c=0;
     for (var i=this.NumListedStreamsStart;i<streamIteratorEnd;i++){

       if (list.streams[i-this.NumListedStreamsStart]==null || list.streams[i-this.NumListedStreamsStart]=='' ||
           list.streams[i-this.NumListedStreamsStart]=={}) break;

       if(filtering==false) {c=this.ListStaticCounter;}
       else {c=this.FilteringListStaticCounter}

       if (CHideGame) var hg = 'display:none;';
       else var hg = '';
       if (CHideDesc) var hd = 'display:none;';
       else var hd = '';
          $list.append('<li style="position: relative; top:0; width: 100% !important;" class="Pic'+c+' listHoverClass">'+
                               '<img style="width:100%;" class="streamPic" src="'+list.streams[i-this.NumListedStreamsStart].preview.medium+'">'+
                                '<div class="listStreamName" style="width: 100%; height:100%;">'+
                                  '<div style="height: auto;" class="strokeme wordwrap"><b>'+list.streams[i-this.NumListedStreamsStart].channel.name+'</b> - <span style="font-size: 75%; float: right:">'+list.streams[i-this.NumListedStreamsStart].viewers+'</span></div>'+
                                  '<div style="height: auto; font-size: 85%; '+hg+'" id="gameName" class="listHidden strokeme wordwrap"><i>'+list.streams[i-this.NumListedStreamsStart].game+'</i></div>'+
                                  '<div style="height: auto; position:absolute; bottom:0; '+hd+'" id="gameStatus" class="listHidden strokeme wordwrap"><span style="font-size: 85%;">'+list.streams[i-this.NumListedStreamsStart].channel.status+'</span></div>'+
                               '</div>'+
                        '</li>'
                      );

        //SHOW THE HIDDEN STREAM PICTURE OVERLAY STUFF (.listHidden) ON HOVER. ON EXIT HIDE THEM.
           $('.listHoverClass').hover(
             function(){$(this).find('.listHidden').show();},
             function(){if(CHideGame) $(this).find('#gameName').hide();
                        if(CHideDesc) $(this).find('#gameStatus').hide();
             }
           );

          $('.listStreamName').css({bottom: 0, position:'absolute', width: '100%'})

       //ONCE THE LIST IS LOADED FOR THE FIRST TIME, LOAD THE FLASH PLAYERS
          if(window.FirstTimeRenderingStreams){
            window.renderStreams();
          }

       //THE LISTENERS TO RENDER THE STREAMS ON CLICK
          $('.Pic'+c).click(loadNewStream(list.streams[i-this.NumListedStreamsStart].channel.name, window.SelectedStream));

      //DONT INCREMENT THE LIST RENDERING POSITION IF THIS WAS A FILTERING PASS, ONLY INCREMENT ON STREAM ADDITION / LIST REFRESH
          if(filtering==false) this.ListStaticCounter++;
          else this.FilteringListStaticCounter++;
      //RELINQUISH LOCK
          this.NoListLockout=true;
      };
    };


//RESETS THE STREAM COUNTER FOR THE LIST TO BEGIN ANEW
	flushNumListedStreams(){
	  this.NumListedStreamsEnd= this.CNumListedStreamsEnd;
		this.NumListedStreamsStart= this.CNumListedStreamsStart;
	}


//ADDS MORE TO THE LIST IF YOU'VE SCROLLED PAST A CERTAIN POINT IN THE LIST
  controlListScroll(){

      var _this= this;
      $(".colList ul").scroll(function() {
        //CHECK FOR LIST SCROLLBAR HEIGHT (A LITTLE BIT TOO TRIGGER-HAPPY ON MOBILE WHERE THE LIST ICONS ARE ENLARGED)
          var ScrollBottom=false;
        	if ($(this).scrollTop() - 200 > $(document).height()*_this.NumListedStreamsEnd/25) {
            ScrollBottom=true;
          }
        if(ScrollBottom && _this.NumListedStreamsEnd<251 && _this.ListAddCooldown==false) {
          if ($('#topStreams').hasClass('activeButton')) {
            _this.NumListedStreamsEnd+=25;
            _this.NumListedStreamsStart+=25;
            _this.addToTopStreams(false);
          }
          else if ($('#favStreams').hasClass('activeButton')){
            _this.addToFavStreams('',false);
          }
          else if ($('#recStreams').hasClass('activeButton')) {
            _this.NumListedStreamsEnd+=25;
            _this.NumListedStreamsStart+=25;
            _this.addToRecStreams(false);
          }
          //MUST BE SORTING BY TOP GAMES IF NOTHING ELSE
          else{
            _this.NumListedStreamsEnd+=25;
            _this.NumListedStreamsStart+=25;
            addToTopGameStreams(false);
          }


          _this.ListAddCooldown=true;
          _this.addListTimer=setInterval(addListReset, 1500);
        };
      });

          //REFRESH THE LIST EVERY MINUTE
          //TODO BROKEN, NEEDS TO BE CUSTOMIZED TO THE SELECTED LISTBAR ITEM
    _this.refreshListInterval=setInterval(_this.URLRequestTopStreams(window.BASE_TWITCH_REQUEST_URL,true), _this.CListRefreshTimeMinutes*60000);

    function addListReset(){
      _this.ListAddCooldown=false;
      clearInterval(_this.addListTimer);
    }
  }




//FILTERING
	filterByStreamer(streams){
	  var newList = {streams:[]};
	  var streamer = $('#streamer').val();

	  for (var i=0;i<streams.streams.length;i++){
			var regexp = new RegExp(streamer, "i");
	    if((streams.streams[i].channel.name).search(regexp) > -1){
	      newList.streams.push(streams.streams[i]);
	    }
	  }
		console.log('newList');
		console.log(newList);
	  return newList;
	}


	filterByGame(streams){
		console.log("streams");
		console.log(streams);
	  var newList = {'streams':[]};
	  var game = $('#game').val();
		var regexp = new RegExp(game, "i");

	  for (var i=0;i<streams.streams.length;i++){
	    if((streams.streams[i].game).search(regexp) > -1){
	      newList.streams.push(streams.streams[i]);
	    }
	  }
	  return newList;
	}




  addToRecStreams(refreshing){

    this.NoListLockout=false;
        if(refreshing) {
          this.flushNumListedStreams();
          this.NumListedStreamsEnd=0;
          this.RecIndexL=this.CNumListedStreamsStart;
          this.RecIndexH=this.CNumListedStreamsEnd;
        }


        //THIS BLOCK TRIES TO FIND AT LEAST ONE LIVE STREAM FROM YOUR LIST, UP TO A MAX OF 4 API HITS
      var length = 0;
      var lc = 0;
      var _this=this;
      loop(_this);

      function loop(_this){


        var qString = RecentStreams.slice(_this.RecIndexL,_this.RecIndexH).toString();
        console.log('qString');
        console.log(qString);

              if (lc == 4 || qString=='' || qString==null) {_this.NoListLockout=true; return;}
              lc++;

        $.getJSON('https://api.twitch.tv/kraken/streams?channel='+qString+'&callback=?')
        .done(function(recent){
          // Favorites.push(favorites);		//SET THE GLOBAL FAVORITES TO THE RESULT
          console.log('addToRecStreams recent:');
          console.log(recent);
            _this.NumListedStreamsEnd+=recent.streams.length;
            _this.listLoader(recent,refreshing,false,_this.NumListedStreamsEnd);
            _this.NumListedStreamsStart+=recent.streams.length;
            _this.RecIndexL+=_this.CNumListedStreamsEnd;
            _this.RecIndexH+=_this.CNumListedStreamsEnd;
            refreshing = false;
            length += recent.streams.length;
            if (length < 1)  loop(_this);
            else {lc=4; _this.NoListLockout=true;}
        })
      }

  }

  addToTopStreams(refreshing){
    if(this.NoListLockout){
      this.NoListLockout=false;
        this.URLRequestTopStreams(window.BASE_TWITCH_REQUEST_URL, refreshing);
      this.NoListLockout=true;
    }
  }

  addToTopGameStreams(refreshing){
    if(this.NoListLockout){
      this.NoListLockout=false;
        this.URLRequestGames(this.Game, false);
      this.NoListLockout=true;
    }
  }


  addToFavStreams(value, refreshing){
		if(value!=''  && value!=null && typeof(value)!='undefined') SortedFavoritesString = value;

console.log('Sorted favorites string:');
console.log(SortedFavoritesString);

		list.NoListLockout=false;
				if(refreshing) {
					list.flushNumListedStreams();
					list.NumListedStreamsEnd=list.CNumListedStreamsEnd;
					list.FavIndexL=list.CNumListedStreamsStart;
					list.FavIndexH=list.CNumListedStreamsEnd;
				}

					//ONLY USE A SUBSET OF Favorites TO QUERY
					//HAVE TO CHOP SOME ELEMENTS OFF OF FavoritesString. SO TURN INTO AN ARRAY, SLICE IT, THEN STRINGIFY IT AGAIN
			var res = SortedFavoritesString.split(',');
console.log('making requests in loop to add to favorites');


        //TRIES TO FIND AT LEAST ONE LIVE FAVORITED STREAM, UP TO A MAX OF 4 API HITS
			var length = 0;
			var lc = 0;
			loop();

			function loop(){

				var qString = res.slice(list.FavIndexL,list.FavIndexH).toString();
console.log('qString');
console.log(qString);

							if (lc == 4 || qString=='' || qString==null) {list.NoListLockout=true; return;}
							lc++;

				$.getJSON('https://api.twitch.tv/kraken/streams?channel='+qString+'&callback=?')
				.done(function(favorites){
					// Favorites.push(favorites);		//SET THE GLOBAL FAVORITES TO THE RESULT
					console.log('addToFavStreams favorites:');
					console.log(favorites);
					  list.NumListedStreamsEnd+=favorites.streams.length;
						list.listLoader(favorites,refreshing,false,list.NumListedStreamsEnd);
						list.NumListedStreamsStart+=favorites.streams.length;
						list.FavIndexL+=list.CNumListedStreamsEnd;
						list.FavIndexH+=list.CNumListedStreamsEnd;
						refreshing = false;
						length += favorites.streams.length;
						if (length < 1)  loop();
						else {lc=4; list.NoListLockout=true;}
				})
			}

	}

}


module.exports= listManager;

},{}],11:[function(require,module,exports){
class detectMobile{

//CHECK FOR MOBILE USING CSS WIDTH
	isMobile(){
		return window.matchMedia("(max-width: 1300px)").matches;
	}

	isPhone(){
		return window.matchMedia("(max-width: 800px)").matches;
	}

//check for mobile based on CSS PIXEL SIZE
	detectMobBySize() {
	   if(window.innerWidth <= 800 && window.innerHeight <= 600) {
	     return true;
	   } else {
	     return false;
	   }
	}

//check for on mobile USING A REALLY BIG RegExp
	mobile() {
	  var check = false;
	  (function(a){
			if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
				check = true
		 })(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	}
//check for mobile or tablet USING A REALLY BIG RegExp
	mobileOrTablet() {
	  var check = false;
	  (function(a){
				if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
					check = true
			})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	}


	//add |android|ipad|playbook|silk to include these as well (not in there by default)
	//another way to detect mobile (not super reliable)
	detectmobByNavigator() {
	 if( navigator.userAgent.match(/Android/i)
	 || navigator.userAgent.match(/webOS/i)
	 || navigator.userAgent.match(/iPhone/i)
	 || navigator.userAgent.match(/iPad/i)
	 || navigator.userAgent.match(/iPod/i)
	 || navigator.userAgent.match(/BlackBerry/i)
	 || navigator.userAgent.match(/Windows Phone/i)
	 ){
	    return true;
	  }
	 else {
	    return false;
	  }
	}

}

module.exports= detectMobile;

},{}],12:[function(require,module,exports){
   //RENDERS THE STREAM COLUMN
function renderStreams(){
    // $collapseList.parent().css({position: 'relative'});   //NEED THIS FOR ABSOLUTE LINK POSITIONING. IFRAME HAS THE SAME PARENT
    // $streams.css({position: 'relative'});

    showStreamsLoadScreen();  //erases streams html and shows a loading screen
    var html = '';


  switch (NumStreams){
    case 1:
				if (true) html = html+'<div id="twitch_embed_player_0"></div>';
				else html = html+'<div class="stream0" style="width: 100%;"><iframe src="http://www.twitch.tv/'+WatchingStreams[0]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe><param name="menu" value="false" /></div>';
        break;
    case 2:
       if (DivideStreams=='horizontal'){
				if (window.Flash_Installed  && !mobile.isMobile()){
					html = html+'<div style="height: 100%; width: 100%;"><table style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td><div id="twitch_embed_player_0"></div></td>';
	        html = html+'<td><div id="twitch_embed_player_1"></div></td></tr><tbody></table></div>';
				}
        else{
					html = html+'<div style="height: 100%; width: 100%;"><table style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="stream0"><iframe src="http://www.twitch.tv/'+WatchingStreams[0]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td>';
					html = html+'<td class="stream1"><iframe src="http://www.twitch.tv/'+WatchingStreams[1]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td></tr><tbody></table></div>';
				}
       }
       else if (DivideStreams=='vertical'){
				 if (window.Flash_Installed  && !mobile.isMobile()){
         html = html+'<div style="height: 100%; width: 100%;"><table style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td><div id="twitch_embed_player_0"></div></td></tr>';
         html = html+'<tr><td><div id="twitch_embed_player_1"></div></td></tr></tbody></table></div>';
       }
			 else{
				 html = html+'<div style="height: 100%; width: 100%;"><table style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="stream0"><iframe src="http://www.twitch.tv/'+WatchingStreams[0]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td></tr>';
         html = html+'<tr><td class="stream1"><iframe src="http://www.twitch.tv/'+WatchingStreams[1]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td></tr></tbody></table></div>';
			 }
		 }
        break;
    case 4:
			if(window.Flash_Installed  && !mobile.isMobile()){
        html = html+'<table  style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td><div id="twitch_embed_player_0"></div></td>';
        html = html+'<td><div id="twitch_embed_player_1"></div></td></tr>';
        html = html+'<tr><td><div id="twitch_embed_player_2"></div></td>';
        html = html+'<td><div id="twitch_embed_player_3"></div></td></tr></tbody></table>';
			}
			else{
				html = html+'<table  style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="stream0"><iframe src="http://www.twitch.tv/'+WatchingStreams[0]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td>';
        html = html+'<td class="stream1"><iframe src="http://www.twitch.tv/'+WatchingStreams[1]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td></tr>';
        html = html+'<tr><td class="stream2"><iframe src="http://www.twitch.tv/'+WatchingStreams[2]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td>';
        html = html+'<td class="stream3"><iframe src="http://www.twitch.tv/'+WatchingStreams[3]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td></tr></tbody></table>';
			}
        break;
  }


//ICONS TO TOGGLE SIDE PANEL
    html = html + '<a href="#" class="collapse collapseList" style="display: none;" data-toggle="tooltip" data-placement="bottom" title="Collapse Streams List"><i class="fa fa-2x fa-caret-left"></i></a>'+
                      '<a href="#" class="collapse collapseChat" style="display: none;" data-toggle="tooltip" data-placement="bottom" title="Collapse Chat"><i class="fa fa-2x fa-caret-right"></i></a>';


//HIDE STREAMS UNTIL THEY ARE ALL LOADED (NEED THEM IN THE DOM TO CREATE THE LISTENERS FOR WHEN THEY LOAD)
    var temp = '<div style="height:100%;" id="loadingDivShow" class="divShowHandle" style="visibility: hidden;">'
                 +html+
                      '<div id="selectedStreamPopup" style="position: absolute; top: 0; right: 50%; width: 8%; display: none; color: white; z-index:2;">'+
                        '<i class="fa fa-2x fa-television" style="color: white;"></i><span></span>'+
                      '</div>'
               '</div>';
    $streams.html(temp);



    $selectedStreamPopup = $('#selectedStreamPopup');

//TWITCH PLAYER API
  for (var i=0; i<NumStreams; i++){

    var c=i+SingleStreamSelectorOffset;   //THIS IS TO RENDER STREAMS IN SINGLE-STREAM-MODE BASED ON NUMBER PRESSED

 //USE SHOCKWAVE FLASH PLUGIN FOR NON MOBILE
		if(window.Flash_Installed && !window.isMobile){
		    window['onPlayerEvent'+i] = function (data) {
		      data.forEach(function(event) {
		        if (event.event == "playerInit") {    //could also use videoPlaying or playerInit

		            $('#loadingDivShow').removeAttr('id');
		            $('.divShowHandle').attr("id","loadingDivShowFinal");
		            $('.loadingDivHide').hide();

		            if (ChangingSingleStreams) {
		              changeSelectedStream(c);
		              ChangingSingleStreams=false;
		            }
		            else changeSelectedStream(0);
		        }
		      });
		    }

		    swfobject.embedSWF("http://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf", "twitch_embed_player_"+i, "100%", "100%", "11", null,
		      { "eventsCallback":"onPlayerEvent"+i,
		        "embed":1,
		        "channel": WatchingStreams[c],
		        "auto_play":"true"},
		      { "allowScriptAccess":"always",
		        "allowFullScreen":"true"});

		  }

 //MOBILE VIDEO CLIENT (NO FLASH)
		// else{
		// 		$('#loadingDivShow').removeAttr('id');
		// 		$('.divShowHandle').attr("id","loadingDivShowFinal");
		// 		$('.loadingDivHide').hide();
    //
		// 		if (ChangingSingleStreams) {
		// 			changeSelectedStream(c);
		// 			ChangingSingleStreams=false;
		// 		}
		// 		else changeSelectedStream(0);
    //
		// 		$('.stream'+i).html('<iframe src="http://www.twitch.tv/'+WatchingStreams[c]+'" frameborder="0" scrolling="no"'+
    //                         +'height="100%" width="100%"></iframe><param name="menu" value="false" />');
		// }

  }


//APPENDING FUNCTIONS AFTER RENDERING THE STREAMS
  //ALLOWS STREAM COLUMN RESIZE
    cResizer.ResetStreamColumnDrag();
  //SET UP LISTENERS FOR CHAT AND LIST TOGGLERS
    _setupColumnCollapseListeners();

    _preventRedirect();


//DO ALL OF THIS ONLY IF THE PAGE IS LOADING (NOT IF ALREADY LOADED)
  if(FirstTimeRenderingStreams){
    FirstTimeRenderingStreams=false;
  //FILL UP CHAT AND DISPLAY THE ACTIVE ONE
    _renderChatHtml();

  //SETUP THE KEYPRESS LISTENER FOR HIDING LIST AND CHAT. THIS NEEDS TO BE HERE AND NOT ANYWHERE ELSE.
      $("html").keypress(function( event ) {
        switch(event.which){
          case 97:
            _toggleList();
            break;
          case 100:
            _toggleChat();
            break;
        }
      });

    }



//INNER FUNCTIONS

        function _renderChatHtml(){
          var html = '';
             for(var c=0; c<4; c++){
               html += '<div id="chat'+c+'" style="display: none; height: 100vh; width: 100%;"><iframe class="asdf" style="z-index: 5;"'+
                        'src="http://www.twitch.tv/'+WatchingStreams[c]+'/chat" frameborder="0" scrolling="no" id="chat_embed"'+
                        'height="100%" width="100%"></iframe></div>';
             }
            $chat.html('');
            $chat.html(html);
            $('#chat'+ActiveChat).show();
        }

    //STILL FIDDLING WITH THIS. RIP.
        function _preventRedirect(){
          for(var i=0;i<NumStreams;i++){
            $('#twitch_embed_player_'+i).find("param[name='allowScriptAccess']").attr('value','sameDomain');
          }
        }

        function _setupColumnCollapseListeners(){
             //CACHE THE DOM FOR TOGGLERS
          var $collapseList = $(".collapseList");
          var $collapseChat = $('.collapseChat');


          if(window.isMobile){
              _toggleChat();
              $collapseList.show();
              $collapseChat.show();
              window.$list.click(_toggleList);
          }
          else{
              $streams.hover(function(){
                $collapseList.show();
                $collapseChat.show();
              });
              $chat.hover(function(){
                $collapseList.fadeOut( 200 );
                $collapseChat.fadeOut( 200 );
              });
              $colList.hover(function(){
                $collapseList.fadeOut( 200 );
                $collapseChat.fadeOut( 200 );
              });
          }


            if($colList.width() > 100 && $colList.width() < 1000) window.lw = $colList.width();
            else window.lw = 500;    //fallback value if list size gets crunched
            $collapseList.parent().css({position: 'relative'});    //need this to do absolute link positioning
            if (ListIsHidden){
              $collapseList.css({top: 0, left: 0, position:'absolute', 'z-index': 2});
            }
            else {
              $collapseList.css({top: 0, left: lw, position:'absolute', 'z-index': 2});
            }
          $collapseList.click(_toggleList);


          $collapseChat.css({top: 0, right: 0, position:'absolute', 'z-index': 2});
          $collapseChat.click(_toggleChat);

        }

//TOGGLE LIST AND TOGGLE CHAT
          function _toggleList(){
            var $collapseList = $(".collapseList");
            var $collapseChat = $('.collapseChat');

            $colList.toggle();
              //NEED THIS CAUSE LIST IS FLOATING
            if (ListIsHidden){
              ListIsHidden=false;
              $collapseList.css({top: 0, left: $colList.width(), position:'absolute', 'z-index': 2});
            }
            else {
              ListIsHidden=true;
              $collapseList.css({top: 0, left: 0, position:'absolute', 'z-index': 2});
            }
          }

          function _toggleChat(){
            var $collapseList = $(".collapseList");
            var $collapseChat = $('.collapseChat');

            $chat.toggle();
            $collapseChat.css({top: 0, right: 0, position:'absolute', 'z-index': 2});
            cResizer.ResetStreamColumnDrag();
          }


          // function _putStreamsInTabList(){
          //   for (i=0;i<NumStreams;i++){
          //     $('#Stream'+i).val(WatchingStreams[i]);
          //     $('#delStream'+i).off('click');
          //     $('#delStream'+i).click(function(){
          //       $('#Stream'+i).val('');
          //       WatchingStreams[i]='';
          //     });
          //   }
          // }


};

module.exports= renderStreams;

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
function streamUtils (){


//WRITES OVER WATCHINGSTREAMS[] ELEMENT WITH THE INPUT STREAM NAME, CHANGES THE #CHAT TO THE NEWLY SELECTED STREAM, UPDATES THE URL TO REFLECT THE CHANGE
	window.loadNewStream= function (name,SelectedStream){
	    return function(){
                WatchingStreams[SelectedStream]=name;
                addToRecentStreams();
        				var ss = SelectedStream;
        				if (NumStreams==1) ss = 0;

              //CHANGE THE CHAT TO THE NEW STREAM
        				window.changeChat(SelectedStream,name);

              //TWITCH API TO LOAD A NEW STREAM
                if (Flash_Installed) $("#twitch_embed_player_"+ss)[0].loadStream(name);
      					else $('.stream'+ss).html('<iframe src="http://www.twitch.tv/'+WatchingStreams[c]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe>')

              //UPDATE URL
                updateURL(window.URL,WatchingStreams);
              };
	}

//CHANGE THE SELECTED STREAM'S CHAT (STREAM NUMBER) TO THE CHAT OF THE GIVEN STREAM NAME
  window.changeChat=function(SelectedStream, name){
    $('#chat'+SelectedStream).html('<iframe style="z-index: 5; float: left;" src="http://www.twitch.tv/'+name+'/chat" frameborder="0" scrolling="no" id="chat_embed" height="100%" width="100%"></iframe>');
  }



//ADDS THE CURRENTLY WATCHING STREAMS TO THE RECENT STREAMS LIST, IF THEY HAVEN'T BEEN ALREADY
	window.addToRecentStreams= function(){
	  WatchingStreams.forEach(function(stream){
	    if(stream!=null && stream!=''){
	      if ($.inArray(stream, RecentStreams)!==-1){}    //-1 IF stream IS NOT IN THE ARRAY RecentStreams
	      else {RecentStreams.push(stream);}
	      }
	    });
	}




//CHANGES THE SELECTED STREAM AND MAKES THE STREAM NUMBER POPUP COME UP
	window.changeSelectedStream= function(i){
	  SelectedStream=i;
	  var temp = i+1;
	  var delay = true;
	  $selectedStreamPopup.find('span').html('<span style="font-size: 200%;"> '+temp+'</span>');
	  $selectedStreamPopup.show();
	  var fadeout=setInterval(function(){$selectedStreamPopup.fadeOut(300); clearInterval(fadeout);}, 1000);
	}

//LOADING SCREEN
	window.showStreamsLoadScreen= function(){
	  $streams.html('<div class="fa loadingDivHide"><i class="loadingDivHide fa fa-3x fa-cog fa-spin"></i><div class="fa-cog-text" style="color:white;">Working on it...</div></div>');
	}



  window.getFavStreamsAndSort= function(value){
		if(value!='' && value!=null && typeof(value)!='undefined') FavoritesString = value;

			console.log('refreshed SessionFavoritesString');
		$.getJSON('https://api.twitch.tv/kraken/streams?limit=100&channel='+FavoritesString+'&callback=?')
		.done(function(arr2){
				console.log('arr2');
				console.log(arr2);

				//GET RID OF ALL INVALID RESPONSES - Favorites is the new "cleaned" array (no empty objects in it)
					var j=0;

				arr2.streams.forEach(function(stream){
					if(stream!=null && stream!='' && stream!={}){
						Favorites[j]=stream;
						j++;
					}
				});

				//BUBBLE SORT WITHOUT MOVING ENTIRE OBJECTS (arr3[] HOLDS A LIST OF REFERENCES TO THE OBJECT'S POSITIONS IN Favorites)
				var length=Favorites.length;
				console.log('favorites.length');
				console.log(Favorites.length);

				var arr3=[];
				for(var k=0;k<length;k++) arr3[k]=k;

				for (var l=0;l<length-1;l++){
					for (var m=0;m<length-1;m++){
						var temp01=arr3[m];
						var temp02=arr3[m+1];
						if (Favorites[temp01].viewers<Favorites[temp02].viewers){
							var temp2 = arr3[m];
							arr3[m] = arr3[m+1];
							arr3[m+1] = temp2;
						}
					}
				}

				console.log('sorted favorites:');
				console.log(Favorites);


					//DO LISTLOADER ON VIEWERS-SORTED LIST OF FAVORITES
				// 	refreshingList=true;
				// for(var n=0;n<length;n++){
				// 		if(refreshingList) flushNumListedStreams();
				// 		listLoader({streams:[Favorites[n]]},refreshingList,true,1);
				// 		refreshingList=false;
				// }
				// NoListLockout=true;


				//TURN THE Favorites ARRAY INTO A FavoritesString FORMAT
				for (var a=0;a<Favorites.length;a++)
					Favorites[a] = Favorites[a].channel.name;

				localStorage.SortedFavoritesString = Favorites.toString();	//NOTE SETS THE GLOBAL SortedFavoritesString
				deferred2.resolve(localStorage.SortedFavoritesString);
				cookies.setCookie("FRefreshSession", true, 0.025);

		})
		.fail(function(){
			list.NoListLockout=true;
			refreshingList=false;
			console.log('AJAX REQUEST FOR RECENT STREAMS FAILED!')

		});

	}


//WE ONLY WANT TO HIT THE TWITCH API EVERY FEW DAYS OR SO TO REFRESH FAVORITES, ELSE THERE WOULD BE TOO MANY HITS
//HIT THE API TO REFRESH THE FAVORITES STRING IN LOCAL STORAGE EVERY THREE DAYS. SET THE GLOBAL FavoritesString TO localStorage.FavoritesString
    //THIS IS ONLY MADE TO BE RUN AT STARTUP TO LOAD THE OLD FavoritesString TO SEE IF IT'S EXPIRED... USE FRefreshSession INSTEAD OF
    //FRefresh COOKIE TO TRACK VIEWERCOUNT STALENESS
    //NOTE FRefresh IS FOR CHECKING FOR FAVORITES LIST STALENESS, WHILE FRefreshSession IS TO CHECK FOR VIEWERCOUNT STALENESS ON FRefresh LIST'S MEMBERS (they have different expiry dates)
  window.refreshFavoritesString= function(force){

    //CHECK THE BROWSER FOR LOCAL STORAGE SUPPORT AND SEE IF COOKIES ARE ENABLED...
      if(storageEnabled && cookies.CookiesEnabled) {
        if(force || typeof (localStorage.FavoritesString) == 'undefined' || localStorage.FavoritesString == null || cookies.getCookie('FRefresh') == null || cookies.getCookie('FRefresh') == ''){
          console.log('refreshed FavoritesString');
          $.getJSON('https://api.twitch.tv/kraken/users/'+Username+'/follows/channels?limit='+CFavStreamsSearchLimit+'&offset=0&callback=?')
          .done(function(arr){           //ON SUCCESS

                  var stringArray = [];
                arr.follows.forEach(function(stream){
                  stringArray.push(stream.channel.name);
                    });
                    //SAVE THE FAVORITES STRING INTO LOCAL STORAGE, MAKE A TRACKING COOKIE THAT GIVES IT AN EXPIRY DATE
                    localStorage.setItem("FavoritesString", stringArray.toString());
                    cookies.setCookie("FRefresh", true, 3);
                    deferred1.resolve(localStorage.FavoritesString);
                            // localStorage.removeItem("lastname");
                })
                //ON ERROR
          .fail(function(){
                console.log('ATTEMPT TO GET USER\'S FOLLOWED STREAMS FAILED!' );
                deferred1.resolve('');
          });

        }
        else deferred1.resolve(localStorage.FavoritesString);
      }
      else {
          console.log('Favorites wont work - you need to enable cookies and local storage. You may not have native local storage support in your browser');
          $('#favStreams').off('click');
          deferred1.resolve('');
      }

  }


  window.swapStreams= function(i,j){
    //SWAP STREAMS
    var temp = WatchingStreams[i];
    WatchingStreams[i] = WatchingStreams[j];
    WatchingStreams[j] = WatchingStreams[i];

    //SWAP CHAT
    changeChat(i,WatchingStreams[j]);
    changeChat(j,WatchingStreams[i]);

    //SWAP VIEWER COUNT
    temp = ViewerCount[i];
    ViewerCount[i] = ViewerCount[j];
    ViewerCount[j] = ViewerCount[i];

  }



}

module.exports= streamUtils;

},{}]},{},[2]);
