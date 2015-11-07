function streamUtils (){


  window.fillStreamsFromURL = function (){
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
	  }finally{
	    var length = WatchingStreams.length || 0;
	    NumStreams=(length==0?1 :length==1?1 :length==2?2 :length==3?4: length==4?4 :4);
	   }

	  window.parseURL();
	  // alert('URL params used to populate streams. URL: ' + URL);
	}



	window.loadNewStream= function (name){
	    return function(){WatchingStreams[SelectedStream]=name;
	                      addToRecentStreams();
												var ss = SelectedStream;
												if (NumStreams==1) ss = 0;
												$('#chat'+SelectedStream).html('<iframe style="z-index: 5; float: left;" src="http://www.twitch.tv/'+name+'/chat" frameborder="0" scrolling="no" id="chat_embed" height="100%" width="100%"></iframe>');
		                      if (Flash_Installed) $("#twitch_embed_player_"+ss)[0].loadStream(name);
													else $('.stream'+ss).html('<iframe src="http://www.twitch.tv/'+WatchingStreams[c]+'/embed" frameborder="0" scrolling="no" height="100%" width="100%"></iframe>')

													var newURL = URL;
											WatchingStreams.forEach(function(stream){
												if (stream != 'undefined')
												 newURL += '/' + stream;
											});
											window.history.replaceState(null, null, newURL);
	                     };
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




	//CHANGES THE SELECTED STREAM AND MAKES THE POPUP COME UP
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





}

module.exports= streamUtils;
