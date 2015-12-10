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
