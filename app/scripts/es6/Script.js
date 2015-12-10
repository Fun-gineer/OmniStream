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
