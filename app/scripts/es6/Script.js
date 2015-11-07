//SEARCH FOR GAMES (FROM A PREMADE LIST)
// https://api.twitch.tv/kraken/streams?game=Ultra%20Street%20Fighter%20IV
//SEARCH FOR CHANNELS FROM A PREMADE LIST
// https://api.twitch.tv/kraken/streams?channel=KatGunn

// https://api.twitch.tv/kraken/search/channels?q=Lineage%20II:%20The%20Chaotic%20Chronicle
// https://api.twitch.tv/kraken/search/games?q=Lineage&type=suggest&live

//THIS ONE WILL DO PARTIAL QUERIES FOR STREAMS
// https://api.twitch.tv/kraken/search/streams?q=Lineage&limit=100&offset=0&type=suggest&live
//THIS ONE WILL DO PARTIAL QUERIES FOR GAMES
//https://api.twitch.tv/kraken/search/games?q=counter&limit=100&offset=0&type=suggest&live
// THIS ONE WILL DO PARTIAL QUERIES AGAINST ALL
//https://api.twitch.tv/kraken/search/channels?q=Programming




"use strict";
// window.onload = function(){
$(function(){

	// document.domain=document.domain;	//iframe->document port matching. The Twitch API sets the domain correctly, so no problems there

	// window.classFun = require('./classy.js');
	(require('./streamUtils.js'))();
	window.cookies= new (require('./cookies.js'));
	window.mobile= new (require('./mobile.js'));
	window.list= new(require('./listManager.js'));
	window.parseURL= require('./parseURL.js');
	window.renderStreams= require('./renderStreams.js');
	window.cResizer= new(require('./columnResizer.js'));

	//init script
	(require('./init.js'))();
	// alert(window.isMobile);

	window.addToFavStreams= function(value, refreshing){
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







  //CONFIG VARIABLES
window.CFavStreamsSearchLimit = 400;   //maximum number of followed streams to fetch from the API to inspect for live-ness to populate the favorites list
window.CHideGame = false;
window.CHideDesc = true;
window.CSaveRecentStreams = true;


  //INITIALIZE
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
window.URL='';       //without appended streams or index.html#
window.UrlParams=[];
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
cookies.getStreamCookies();        //brings back the streams stored in the cookies session and updates the URL to reflect that (but only if a custom URL is not set)
// alert(window.history.length);

showStreamsLoadScreen();
cookies.getLayoutCookies();     //loads layout cookies and does resizing
cResizer.setResizableColumns('sample',true,cResizer.ResetStreamColumnDrag);
addToRecentStreams();   //sets recent streams to the streams you are initially watching

list.populateList(list.DefaultRequestURL,true);
list.controlListScroll();

(require('./keyListenersSetup.js'))();
(require('./streamListButtonListeners.js'))();
(require('./closeListener.js'))();  //creates cookies to store layout info for getLayoutCookies and getStreamCookies
cResizer.setResizableStreamList();


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

// player.pauseVideo();
// player.mute();


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

     //CSS
//$chat.css({"width": "30%", "height": "100%"});

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
