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
