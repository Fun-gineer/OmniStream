"use strict";function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){$(function(){a("./streamUtils.js")(),window.cookies=new(a("./cookies.js")),window.mobile=new(a("./mobile.js")),window.list=new(a("./listManager.js")),window.parseURL=a("./parseURL.js"),window.renderStreams=a("./renderStreams.js"),window.cResizer=new(a("./columnResizer.js")),a("./init.js")(),window.addToFavStreams=function(a,b){function c(){var a=d.slice(list.FavIndexL,list.FavIndexH).toString();return console.log("qString"),console.log(a),4==f||""==a||null==a?void(list.NoListLockout=!0):(f++,void $.getJSON("https://api.twitch.tv/kraken/streams?channel="+a+"&callback=?").done(function(a){console.log("addToFavStreams favorites:"),console.log(a),list.NumListedStreamsEnd+=a.streams.length,list.listLoader(a,b,!1,list.NumListedStreamsEnd),list.NumListedStreamsStart+=a.streams.length,list.FavIndexL+=list.CNumListedStreamsEnd,list.FavIndexH+=list.CNumListedStreamsEnd,b=!1,e+=a.streams.length,1>e?c():(f=4,list.NoListLockout=!0)}))}""!=a&&null!=a&&"undefined"!=typeof a&&(SortedFavoritesString=a),console.log("Sorted favorites string:"),console.log(SortedFavoritesString),list.NoListLockout=!1,b&&(list.flushNumListedStreams(),list.NumListedStreamsEnd=list.CNumListedStreamsEnd,list.FavIndexL=list.CNumListedStreamsStart,list.FavIndexH=list.CNumListedStreamsEnd);var d=SortedFavoritesString.split(",");console.log("making requests in loop to add to favorites");var e=0,f=0;c()},window.refreshFavoritesString=function(a){storageEnabled&&cookies.CookiesEnabled?a||"undefined"==typeof localStorage.FavoritesString||null==localStorage.FavoritesString||null==cookies.getCookie("FRefresh")||""==cookies.getCookie("FRefresh")?(console.log("refreshed FavoritesString"),$.getJSON("https://api.twitch.tv/kraken/users/"+Username+"/follows/channels?limit="+CFavStreamsSearchLimit+"&offset=0&callback=?").done(function(a){var b=[];a.follows.forEach(function(a){b.push(a.channel.name)}),localStorage.setItem("FavoritesString",b.toString()),cookies.setCookie("FRefresh",!0,3),deferred1.resolve(localStorage.FavoritesString)}).fail(function(){console.log("ATTEMPT TO GET USER'S FOLLOWED STREAMS FAILED!"),deferred1.resolve("")})):deferred1.resolve(localStorage.FavoritesString):(console.log("Favorites wont work - you need to enable cookies and local storage. You may not have native local storage support in your browser"),$("#favStreams").off("click"),deferred1.resolve(""))},window.CFavStreamsSearchLimit=400,window.CHideGame=!1,window.CHideDesc=!0,window.CSaveRecentStreams=!0,window.NumStreams=1,window.SelectedStream=0,window.WatchingStreams=[],window.DivideStreams="horizontal",window.ActiveChat=0,window.addListTimer=null,window.FirstTimeRenderingStreams=!0,window.ListIsHidden=!1,window.ChatIsHidden=!1,window.SingleStreamSelectorOffset=0,window.URL="",window.UrlParams=[],window.ChangingSingleStreams=!1,window.Favorites=[],window.FavoritesFirstClick=!0,window.FavoritesString="",window.SortedFavoritesString="",window.deferred1=$.Deferred(),window.deferred2=$.Deferred(),window.$list=$("#list"),window.$colList=$(".colList"),window.$streams=$(".colStreams"),window.$chat=$(".colChat"),window.$selectedStreamPopup=window.$streams,window.$filterList=$("#filterList"),cookies.getStreamCookies(),showStreamsLoadScreen(),cookies.getLayoutCookies(),cResizer.setResizableColumns("sample",!0,cResizer.ResetStreamColumnDrag),addToRecentStreams(),list.populateList(list.DefaultRequestURL,!0),list.controlListScroll(),a("./keyListenersSetup.js")(),a("./streamListButtonListeners.js")(),a("./closeListener.js")(),cResizer.setResizableStreamList()})},{"./closeListener.js":2,"./columnResizer.js":3,"./cookies.js":4,"./init.js":5,"./keyListenersSetup.js":6,"./listManager.js":7,"./mobile.js":8,"./parseURL.js":9,"./renderStreams.js":10,"./streamListButtonListeners.js":11,"./streamUtils.js":12}],2:[function(a,b,c){function d(){window.onbeforeunload=function(a){cookies.setCookie("listw",$colList.width(),90),cookies.setCookie("chatw",$chat.width(),90),cookies.setCookie("streamsw",$streams.width(),90),cookies.setCookie("ListRefreshTimeMinutes",list.CListRefreshTimeMinutes,90),window.CSaveRecentStreams?localStorage.RecentStreams=window.RecentStreams.toString():localStorage.RecentStreams="";for(var b=0;4>b;b++){if(""==window.WatchingStreams[b]||null==window.WatchingStreams[b]){for(;4>b;)cookies.setCookie("stream"+b,"",90),++b;break}cookies.setCookie("stream"+b,window.WatchingStreams[b],90)}return null}}b.exports=d},{}],3:[function(a,b,c){var d=function(){function a(){_classCallCheck(this,a)}return _createClass(a,[{key:"setResizableColumns",value:function(a,b,c){b?$("#"+a).colResizable({liveDrag:!0,gripInnerHtml:"<div class='grip'></div>",draggingClass:"dragging",partialRefresh:"true",onResize:function(){c()}}):$("#"+a).colResizable({liveDrag:!0,gripInnerHtml:"<div class='grip'></div>",draggingClass:"dragging",partialRefresh:"true"})}},{key:"ResetOuterColumnDrag",value:function(){$("#sample").colResizable({disable:!0}),this.setResizableColumns("sample",!0,this.ResetStreamColumnDrag)}},{key:"ResetStreamColumnDrag",value:function(){window.NumStreams>1&&$("#streamTable").colResizable({disable:!0}),this.setResizableColumns("streamTable",!1,null)}},{key:"setResizableStreamList",value:function(){$("#listTable").colResizable({liveDrag:!0,gripInnerHtml:"<div class='grip'></div>",draggingClass:"dragging"})}}]),a}();b.exports=d},{}],4:[function(a,b,c){var d=function(){function a(){_classCallCheck(this,a)}return _createClass(a,[{key:"setCookie",value:function(a,b,c){var d=new Date;d.setTime(d.getTime()+24*c*60*60*1e3);var e="expires="+d.toUTCString();document.cookie=a+"="+b+"; "+e}},{key:"getCookie",value:function(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){for(var e=c[d];" "==e.charAt(0);)e=e.substring(1);if(0==e.indexOf(b))return e.substring(b.length,e.length)}return""}},{key:"areCookiesEnabled",value:function(){var a=navigator.cookieEnabled?!0:!1;return"undefined"!=typeof navigator.cookieEnabled||a||(document.cookie="testcookie",a=-1!=document.cookie.indexOf("testcookie")?!0:!1),this.CookiesEnabled=a,a}},{key:"getLayoutCookies",value:function(){try{var b=a.getCookie("chatw");if(!(""!=b&&b>50&&650>b))throw BreakException;var c=a.getCookie("listw");if(!(""!=c&&c>80&&500>c))throw BreakException;var d=a.getCookie("streamsw");if(!(""!=d&&d>350))throw BreakException;window.$colList.width(c),window.$chat.width(b),window.$streams.width(d)}catch(e){console.log("Reverted column dimensions to default")}}},{key:"getStreamCookies",value:function(){if("undefined"==typeof window.UrlParams[0]&&this.CookiesEnabled){console.log("No URL params. loading cookies");for(var a="index.html#",b=0;4>b;b++){var c=window.cookies.getCookie("stream"+b);if(null==c||""==c){window.history.pushState(null,null,a);break}a+="/"+c,window.WatchingStreams[b]=c,console.log("stream "+b+"- "+c)}console.log("cookies used to populate streams. URL: "+URL)}else console.log("Using URL to populate streams"),window.fillStreamsFromURL()}}]),a}();b.exports=d},{}],5:[function(a,b,c){function d(){window.storageEnabled=function(){var a="test";try{return localStorage.setItem(a,a),localStorage.removeItem(a),!0}catch(b){return!1}}(),window.Flash_Installed=swfobject.hasFlashPlayerVersion("1")?!0:!1,window.isMobile=window.matchMedia("(max-width: 1300px)").matches,window.MobileOrTablet=mobile.mobileOrTablet(),MobileOrTablet&&$(".fa").addClass("fa-2x"),window.RecentStreams=[],storageEnabled?(localStorage.RecentStreams||(localStorage.RecentStreams=""),RecentStreams=localStorage.RecentStreams.split(","),""===RecentStreams[0]&&(RecentStreams=[])):RecentStreams=[],window.UrlParams=window.parseURL(),cookies.CookiesEnabled=cookies.areCookiesEnabled(),window.Username=cookies.getCookie("username")||"",$(".scroll-pane").jScrollPane({showArrows:!0,arrowScrollOnHover:!0}),$(".toggleableFilter").click(function(a){a.stopPropagation()}),$(".toggleableSetting").click(function(a){a.stopPropagation()}),$("#game").keypress(function(a){a.stopPropagation()}),$("#streamer").keypress(function(a){a.stopPropagation()}),$("#Username").keypress(function(a){a.stopPropagation()})}b.exports=d},{}],6:[function(a,b,c){function d(){$("html").keypress(function(a){var b=$("#twitch_embed_player_"+SelectedStream)[0];switch(a.which){case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:for(var c=0;4>c;c++){if(a.which==c+49){if(a.preventDefault(),window.ChangingSingleStreams=!0,1==window.NumStreams&&c!==window.SelectedStream){window.SingleStreamSelectorOffset=c,window.renderStreams();for(var d=0;4>d;d++)$("#chat"+d).hide();window.ActiveChat=c,$("#chat"+window.ActiveChat).show(),window.SingleStreamSelectorOffset=0,window.SelectedStream=c}else window.changeSelectedStream(c);break}if(a.which==c+53){for(a.preventDefault(),window.ActiveChat=c,d=0;4>d;d++)$("#chat"+d).hide();$("#chat"+window.ActiveChat).show();break}}break;case 32:a.preventDefault(),b.isPaused()?b.playVideo():b.pauseVideo();break;case 116:b.mute();break;case 117:b.unmute();break;case 97:window.$colList.toggle();var e=$(".collapseList"),f=$colList.width();window.ListIsHidden?(window.ListIsHidden=!1,e.css({top:0,left:f,position:"absolute","z-index":2})):(window.ListIsHidden=!0,e.css({top:0,left:0,position:"absolute","z-index":2}));break;case 100:window.$chat.toggle(),cResizer.ResetStreamColumnDrag();break;case 108:b.setQuality("Low");break;case 109:b.setQuality("Medium");break;case 104:b.setQuality("High");break;case 115:b.setQuality("Source");break;case 122:if(1!==window.NumStreams){for(0!==window.SelectedStream&&(window.SingleStreamSelectorOffset=window.SelectedStream),window.changeSelectedStream(SelectedStream),window.ActiveChat=window.SelectedStream,d=0;d<window.NumStreams;d++)$("#chat"+d).hide();$("#chat"+window.ActiveChat).show(),window.NumStreams=1,window.renderStreams(),window.SingleStreamSelectorOffset=0}break;case 120:2==window.NumStreams?"horizontal"==window.DivideStreams?window.DivideStreams="vertical":window.DivideStreams="horizontal":NumStreams=2,window.renderStreams();break;case 99:window.NumStreams=4,window.renderStreams()}})}b.exports=d},{}],7:[function(a,b,c){var d=function(){function a(){_classCallCheck(this,a),this.CListRefreshTimeMinutes,this.CNumListedStreamsStart=0,this.CNumListedStreamsEnd=25,this.CListRefreshTimeMinutes=cookies.getCookie("ListRefreshTimeMinutes")||60,this.NumListedStreamsStart=0,this.NumListedStreamsEnd=25,this.DefaultRequestURL="https://api.twitch.tv/kraken/streams?",this.RequestURL="https://api.twitch.tv/kraken/streams?",this.FilteringListStaticCounter=0,this.ListStaticCounter=0,this.FavIndexL=this.CNumListedStreamsStart,this.FavIndexH=this.CNumListedStreamsEnd,this.RecIndexL=this.CNumListedStreamsStart,this.RecIndexH=this.CNumListedStreamsEnd,this.ListAddCooldown=!1,this.NoListLockout=!0,this.List={}}return _createClass(a,[{key:"populateList",value:function(a,b){this.NoListLockout=!1,b&&this.flushNumListedStreams();var c=this;$.getJSON(a+"offset="+this.NumListedStreamsStart+"&limit="+this.NumListedStreamsEnd+"&callback=?",function(a){c.listLoader(a,b,b,c.NumListedStreamsEnd)})}},{key:"listLoader",value:function(a,b,c,d){var e=!1,f=a,g=$filterList.find(".activeFilter"),h=this;g.each(function(){var a=$(this).next("span").find("input").attr("id");"streamer"===a&&(f=h.filterByStreamer(f),e=!0),"game"===a&&(f=h.filterByGame(f),e=!0)}),b?($list.html(""),this.FilteringListStaticCounter=0,(0==e||c)&&(this.List=a,this.ListStaticCounter=0)):this.List.streams=this.List.streams.concat(a.streams),e&&(a=f);for(var i=0,j=this.NumListedStreamsStart;d>j&&(null!=a.streams[j-this.NumListedStreamsStart]&&""!=a.streams[j-this.NumListedStreamsStart]&&a.streams[j-this.NumListedStreamsStart]!={});j++){if(i=0==e?this.ListStaticCounter:this.FilteringListStaticCounter,CHideGame)var k="display:none;";else var k="";if(CHideDesc)var l="display:none;";else var l="";$list.append('<li style="position: relative; top:0; width: 100% !important;" class="Pic'+i+' listHoverClass"><img style="width:100%;" class="streamPic" src="'+a.streams[j-this.NumListedStreamsStart].preview.medium+'"><div class="listStreamName" style="width: 100%; height:100%;"><div style="height: auto;" class="strokeme wordwrap"><b>'+a.streams[j-this.NumListedStreamsStart].channel.name+'</b> - <span style="font-size: 75%; float: right:">'+a.streams[j-this.NumListedStreamsStart].viewers+'</span></div><div style="height: auto; font-size: 85%; '+k+'" id="gameName" class="listHidden strokeme wordwrap"><i>'+a.streams[j-this.NumListedStreamsStart].game+'</i></div><div style="height: auto; position:absolute; bottom:0; '+l+'" id="gameStatus" class="listHidden strokeme wordwrap"><span style="font-size: 85%;">'+a.streams[j-this.NumListedStreamsStart].channel.status+"</span></div></div></li>"),$(".listHoverClass").hover(function(){$(this).find(".listHidden").show()},function(){CHideGame&&$(this).find("#gameName").hide(),CHideDesc&&$(this).find("#gameStatus").hide()}),$(".listStreamName").css({bottom:0,position:"absolute",width:"100%"}),window.FirstTimeRenderingStreams&&window.renderStreams(),$(".Pic"+i).click(loadNewStream(a.streams[j-this.NumListedStreamsStart].channel.name)),0==e?this.ListStaticCounter++:this.FilteringListStaticCounter++,this.NoListLockout=!0}}},{key:"flushNumListedStreams",value:function(){this.NumListedStreamsEnd=this.CNumListedStreamsEnd,this.NumListedStreamsStart=this.CNumListedStreamsStart}},{key:"filterByStreamer",value:function(a){for(var b={streams:[]},c=$("#streamer").val(),d=0;d<a.streams.length;d++){var e=new RegExp(c,"i");a.streams[d].channel.name.search(e)>-1&&b.streams.push(a.streams[d])}return console.log("newList"),console.log(b),b}},{key:"filterByGame",value:function(a){console.log("streams"),console.log(a);for(var b={streams:[]},c=$("#game").val(),d=new RegExp(c,"i"),e=0;e<a.streams.length;e++)a.streams[e].game.search(d)>-1&&b.streams.push(a.streams[e]);return b}},{key:"controlListScroll",value:function(){function a(){b.ListAddCooldown=!1,clearInterval(b.addListTimer)}var b=this;$(".colList ul").scroll(function(){0==$(document).scrollTop()&&b.NumListedStreamsEnd<251&&0==b.ListAddCooldown&&($("#topStreams").hasClass("activeButton")&&(b.NumListedStreamsEnd+=25,b.NumListedStreamsStart+=25,b.addToTopStreams(!1)),$("#favStreams").hasClass("activeButton")&&window.addToFavStreams("",!1),$("#recStreams").hasClass("activeButton")&&(b.NumListedStreamsEnd+=25,b.NumListedStreamsStart+=25,b.addToRecStreams(!1)),b.ListAddCooldown=!0,b.addListTimer=setInterval(a,1500))}),b.refreshListInterval=setInterval(b.populateList(b.RequestURL,!0),6e4*b.CListRefreshTimeMinutes)}},{key:"addToRecStreams",value:function(a){function b(e){var f=RecentStreams.slice(e.RecIndexL,e.RecIndexH).toString();return console.log("qString"),console.log(f),4==d||""==f||null==f?void(e.NoListLockout=!0):(d++,void $.getJSON("https://api.twitch.tv/kraken/streams?channel="+f+"&callback=?").done(function(f){console.log("addToRecStreams recent:"),console.log(f),e.NumListedStreamsEnd+=f.streams.length,e.listLoader(f,a,!1,e.NumListedStreamsEnd),e.NumListedStreamsStart+=f.streams.length,e.RecIndexL+=e.CNumListedStreamsEnd,e.RecIndexH+=e.CNumListedStreamsEnd,a=!1,c+=f.streams.length,1>c?b(e):(d=4,e.NoListLockout=!0)}))}this.NoListLockout=!1,a&&(this.flushNumListedStreams(),this.NumListedStreamsEnd=0,this.RecIndexL=this.CNumListedStreamsStart,this.RecIndexH=this.CNumListedStreamsEnd);var c=0,d=0,e=this;b(e)}},{key:"addToTopStreams",value:function(a){this.NoListLockout&&(this.NoListLockout=!1,this.populateList(list.DefaultRequestURL,a),this.NoListLockout=!0)}}]),a}();b.exports=d},{}],8:[function(a,b,c){var d=function(){function a(){_classCallCheck(this,a)}return _createClass(a,[{key:"mobile",value:function(){var a=!1;return function(b){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(b)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0,4)))&&(a=!0)}(navigator.userAgent||navigator.vendor||window.opera),a}},{key:"mobileOrTablet",value:function(){var a=!1;return function(b){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(b)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0,4)))&&(a=!0)}(navigator.userAgent||navigator.vendor||window.opera),a}},{key:"detectmobBySize",value:function(){return window.innerWidth<=800&&window.innerHeight<=600?!0:!1}},{key:"detectmobByNavigator",value:function(){return navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i)?!0:!1}}]),a}();b.exports=d},{}],9:[function(a,b,c){function d(){var a=[],b=window.location.href,c=b.split(/index\.html#?\/?/);if(URL=c[0]+"/index.html#",c[1])var d=c[1].split("/");else var d="";for(var e=0;e<d.length;e++){var f=decodeURIComponent(d[e]);f&&(a[e]=f)}return a}b.exports=d},{}],10:[function(a,b,c){function d(){function a(){for(var a=0;a<NumStreams;a++)$("#twitch_embed_player_"+a).find("param[name='allowScriptAccess']").attr("value","sameDomain")}function b(){var a=$(".collapseList"),b=$(".collapseChat");if(window.isMobile?(d(),a.show(),b.show(),window.$list.click(c)):($streams.hover(function(){a.show(),b.show()}),$chat.hover(function(){a.fadeOut(200),b.fadeOut(200)}),$colList.hover(function(){a.fadeOut(200),b.fadeOut(200)})),$colList.width()>100)var e=$colList.width();else var e=500;a.parent().css({position:"relative"}),ListIsHidden?a.css({top:0,left:0,position:"absolute","z-index":2}):a.css({top:0,left:e,position:"absolute","z-index":2}),a.click(c),b.css({top:0,right:0,position:"absolute","z-index":2}),b.click(d)}function c(){$colList.toggle(),ListIsHidden?(ListIsHidden=!1,$collapseList.css({top:0,left:lw,position:"absolute","z-index":2})):(ListIsHidden=!0,$collapseList.css({top:0,left:0,position:"absolute","z-index":2}))}function d(){$chat.toggle(),cResizer.ResetStreamColumnDrag()}showStreamsLoadScreen();var e="";switch(NumStreams){case 1:window.Flash_Installed&&!window.isMobile?e+='<div id="twitch_embed_player_0"></div>':e=e+'<span class="stream0" style="width: 100%; height:100%;"><iframe src="http://www.twitch.tv/'+WatchingStreams[0]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe><param name="menu" value="false" /></span>';break;case 2:"horizontal"==DivideStreams?window.Flash_Installed&&!window.isMobile?(e+='<div style="height: 100%; width: 100%;"><table style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td><div id="twitch_embed_player_0"></div></td>',e+='<td><div id="twitch_embed_player_1"></div></td></tr><tbody></table></div>'):(e=e+'<div style="height: 100%; width: 100%;"><table style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="stream0"><iframe src="http://www.twitch.tv/'+WatchingStreams[0]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td>',e=e+'<td class="stream1"><iframe src="http://www.twitch.tv/'+WatchingStreams[1]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td></tr><tbody></table></div>'):"vertical"==DivideStreams&&(window.Flash_Installed&&!window.isMobile?(e+='<div style="height: 100%; width: 100%;"><table style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td><div id="twitch_embed_player_0"></div></td></tr>',e+='<tr><td><div id="twitch_embed_player_1"></div></td></tr></tbody></table></div>'):(e=e+'<div style="height: 100%; width: 100%;"><table style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="stream0"><iframe src="http://www.twitch.tv/'+WatchingStreams[0]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td></tr>',e=e+'<tr><td class="stream1"><iframe src="http://www.twitch.tv/'+WatchingStreams[1]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td></tr></tbody></table></div>'));break;case 4:window.Flash_Installed&&!window.isMobile?(e+='<table  style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td><div id="twitch_embed_player_0"></div></td>',e+='<td><div id="twitch_embed_player_1"></div></td></tr>',e+='<tr><td><div id="twitch_embed_player_2"></div></td>',e+='<td><div id="twitch_embed_player_3"></div></td></tr></tbody></table>'):(e=e+'<table  style="height: 100%; width: 100%;" id="streamTable" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="stream0"><iframe src="http://www.twitch.tv/'+WatchingStreams[0]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td>',e=e+'<td class="stream1"><iframe src="http://www.twitch.tv/'+WatchingStreams[1]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td></tr>',e=e+'<tr><td class="stream2"><iframe src="http://www.twitch.tv/'+WatchingStreams[2]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td>',e=e+'<td class="stream3"><iframe src="http://www.twitch.tv/'+WatchingStreams[3]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></td></tr></tbody></table>')}e+='<a href="#" class="collapse collapseList" style="display: none;"><i class="fa fa-2x fa-caret-left"></i></a><a href="#" class="collapse collapseChat" style="display: none;"><i class="fa fa-2x fa-caret-right"></i></a>';var f='<div style="height:100%;" id="loadingDivShow" class="divShowHandle" style="visibility: hidden;">'+e+'<div id="selectedStreamPopup" style="position: absolute; top: 0; right: 50%; width: 8%; display: none; color: white; z-index:2;"><i class="fa fa-2x fa-television" style="color: white;"></i><span></span></div>';$streams.html(f),window.isMobile&&($(".fa-caret-right").addClass("fa-4x"),$(".fa-caret-left").addClass("fa-4x")),$selectedStreamPopup=$("#selectedStreamPopup");for(var g=0;g<NumStreams;g++){var h=g+SingleStreamSelectorOffset;window.Flash_Installed&&!window.isMobile?(window["onPlayerEvent"+g]=function(a){a.forEach(function(a){"playerInit"==a.event&&($("#loadingDivShow").removeAttr("id"),$(".divShowHandle").attr("id","loadingDivShowFinal"),$(".loadingDivHide").hide(),ChangingSingleStreams?(changeSelectedStream(h),ChangingSingleStreams=!1):changeSelectedStream(0))})},swfobject.embedSWF("http://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf","twitch_embed_player_"+g,"100%","100%","11",null,{eventsCallback:"onPlayerEvent"+g,embed:1,channel:WatchingStreams[h],auto_play:"true"},{allowScriptAccess:"always",allowFullScreen:"true"})):($("#loadingDivShow").removeAttr("id"),$(".divShowHandle").attr("id","loadingDivShowFinal"),$(".loadingDivHide").hide(),ChangingSingleStreams?(changeSelectedStream(h),ChangingSingleStreams=!1):changeSelectedStream(0),$(".stream"+g).html('<iframe src="http://www.twitch.tv/'+WatchingStreams[h]+'/embed" frameborder="0" scrolling="no"NaN'))}if(cResizer.ResetStreamColumnDrag(),b(),a(),FirstTimeRenderingStreams){FirstTimeRenderingStreams=!1;for(var e="",h=0;4>h;h++)e+='<div id="chat'+h+'" style="display: none; height: 100vh; width: 100%;"><iframe class="asdf" style="z-index: 5;"src="http://www.twitch.tv/'+WatchingStreams[h]+'/chat" frameborder="0" scrolling="no" id="chat_embed"height="100%" width="100%"></iframe></div>';$chat.html(""),$chat.html(e),$("#chat"+ActiveChat).show()}}b.exports=d},{}],11:[function(a,b,c){function d(){$("#topStreams").click(function(){$(this).hasClass("activeButton")||($(".activeButton").removeClass("activeButton"),$(this).addClass("activeButton"),list.addToTopStreams(!0))}),$("#recStreams").click(function(){list.NoListLockout&&($(this).hasClass("activeButton")||($(".activeButton").removeClass("activeButton"),$(this).addClass("activeButton"),list.NoListLockout=!1,list.addToRecStreams(!0)))}),$("#favStreams").click(function(){if(!$(this).hasClass("activeButton")){if(""!=window.Username&&null!=window.Username)console.log("Using as "+window.Username);else{var a=prompt("Enter your Twitch username to use the favorites tab:","");if(""==a||null==a)return;cookies.setCookie("username",a,365),window.Username=a}list.NoListLockout&&(list.NoListLockout=!1,$(".activeButton").removeClass("activeButton"),$(this).addClass("activeButton"),storageEnabled&&cookies.CookiesEnabled&&("undefined"==typeof localStorage.FavoritesString||null==localStorage.FavoritesString||""==localStorage.FavoritesString||null==localStorage.SortedFavoritesString||"undefined"==typeof localStorage.SortedFavoritesString||""==localStorage.SortedFavoritesString||null==cookies.getCookie("FRefreshSession")||""==cookies.getCookie("FRefreshSession")?(console.log("refreshed Favorites"),cookies.setCookie("FRefreshSession",!0,.1),window.deferred1=$.Deferred(),window.deferred2=$.Deferred(),window.refreshFavoritesString(!1),window.deferred1.done(function(a){window.getFavStreamsAndSort(a)}),window.deferred2.done(function(a){window.addToFavStreams(a,!0)})):(console.log(cookies.getCookie("FRefreshSession")),console.log("didnt refresh anything"),window.FavoritesString=localStorage.FavoritesString,window.SortedFavoritesString=localStorage.SortedFavoritesString,window.addToFavStreams("",!0))))}}),$filterList.find(".toggleableFilter i, .toggleableFilter span, .toggleableFilter span input").click(function(a){return"INPUT"===$(this).prop("tagName")?void a.stopPropagation():void($(this).hasClass("activeFilter")?($(this).removeClass("activeFilter"),$(this).next("span").find("input").off("input"),list.flushNumListedStreams(),list.listLoader(List,!0,!1,list.NumListedStreamsEnd)):$(this).hasClass("i")?($(this).addClass("activeFilter"),list.flushNumListedStreams(),list.listLoader(list.List,!0,!1,list.NumListedStreamsEnd),alert("white check!")):$(this).parent().find("i").hasClass("activeFilter")?($(this).parent().find("i").removeClass("activeFilter"),$(this).next("span").find("input").off("input"),list.flushNumListedStreams(),list.listLoader(list.List,!0,!1,list.NumListedStreamsEnd)):($(this).parent().find("i").addClass("activeFilter"),list.flushNumListedStreams(),list.listLoader(list.List,!0,!1,list.NumListedStreamsEnd)))}),$("input").on("input",function(){""===$(this).val()?$(this).closest("li").find("i").removeClass("activeFilter"):$(this).closest("li").find("i").hasClass("activeFilter")||""===$(this).val()||$(this).closest("li").find("i").addClass("activeFilter"),list.flushNumListedStreams(),list.listLoader(list.List,!0,!1,list.NumListedStreamsEnd)}),$("#listSize").change(function(){$colList.css("width",$(this).val()+"%")}),$("#chatSize").change(function(){$chat.css("width",$(this).val()+"%"),$streams.css("width",100-$(this).val()+"%"),cResizer.ResetOuterColumnDrag(),cResizer.ResetStreamColumnDrag()}),$("#refreshPeriod").change(function(){"NEVER"===$(this).val()?CListRefreshTimeMinutes=9999999999:CListRefreshTimeMinutes=$(this).val()})}b.exports=d},{}],12:[function(a,b,d){function e(){window.fillStreamsFromURL=function(){try{if(UrlParams){var a=0;UrlParams.forEach(function(b){if(console.log(b+", "),WatchingStreams[a]=b,addToRecentStreams(),a>3)throw BreakException;++a})}}catch(b){alert("Maximum of 4 streams!")}finally{var c=WatchingStreams.length||0;NumStreams=0==c?1:1==c?1:2==c?2:4}window.parseURL()},window.loadNewStream=function(a){return function(){WatchingStreams[SelectedStream]=a,addToRecentStreams();var b=SelectedStream;1==NumStreams&&(b=0),$("#chat"+SelectedStream).html('<iframe style="z-index: 5; float: left;" src="http://www.twitch.tv/'+a+'/chat" frameborder="0" scrolling="no" id="chat_embed" height="100%" width="100%"></iframe>'),
Flash_Installed?$("#twitch_embed_player_"+b)[0].loadStream(a):$(".stream"+b).html('<iframe src="http://www.twitch.tv/'+WatchingStreams[c]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe>');var d=URL;WatchingStreams.forEach(function(a){"undefined"!=a&&(d+="/"+a)}),window.history.replaceState(null,null,d)}},window.addToRecentStreams=function(){WatchingStreams.forEach(function(a){null!=a&&""!=a&&(-1!==$.inArray(a,RecentStreams)||RecentStreams.push(a))})},window.changeSelectedStream=function(a){SelectedStream=a;var b=a+1;$selectedStreamPopup.find("span").html('<span style="font-size: 200%;"> '+b+"</span>"),$selectedStreamPopup.show();var c=setInterval(function(){$selectedStreamPopup.fadeOut(300),clearInterval(c)},1e3)},window.showStreamsLoadScreen=function(){$streams.html('<div class="fa loadingDivHide"><i class="loadingDivHide fa fa-3x fa-cog fa-spin"></i><div class="fa-cog-text" style="color:white;">Working on it...</div></div>')},window.getFavStreamsAndSort=function(a){""!=a&&null!=a&&"undefined"!=typeof a&&(FavoritesString=a),console.log("refreshed SessionFavoritesString"),$.getJSON("https://api.twitch.tv/kraken/streams?limit=100&channel="+FavoritesString+"&callback=?").done(function(a){console.log("arr2"),console.log(a);var b=0;a.streams.forEach(function(a){null!=a&&""!=a&&a!={}&&(Favorites[b]=a,b++)});var c=Favorites.length;console.log("favorites.length"),console.log(Favorites.length);for(var d=[],e=0;c>e;e++)d[e]=e;for(var f=0;c-1>f;f++)for(var g=0;c-1>g;g++){var h=d[g],i=d[g+1];if(Favorites[h].viewers<Favorites[i].viewers){var j=d[g];d[g]=d[g+1],d[g+1]=j}}console.log("sorted favorites:"),console.log(Favorites);for(var k=0;k<Favorites.length;k++)Favorites[k]=Favorites[k].channel.name;localStorage.SortedFavoritesString=Favorites.toString(),deferred2.resolve(localStorage.SortedFavoritesString),cookies.setCookie("FRefreshSession",!0,.025)}).fail(function(){list.NoListLockout=!0,refreshingList=!1,console.log("AJAX REQUEST FOR RECENT STREAMS FAILED!")})}}b.exports=e},{}]},{},[1]);