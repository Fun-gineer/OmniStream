class listManager{

  //ADD MORE STUFF TO THE LIST WHEN THE SCROLLBAR REACHES THE BOTTOM
  constructor(){

    this.BASE_TWITCH_REQUEST_URL= 'https://api.twitch.tv/kraken/streams?';

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
  }


// SETUP OF THE STREAM LIST VIEW WITH CLICK LISTENERS
  populateList (reqURL, refreshingList){
      //PREVENTS OTHER LIST EVENTS FROM BEING FIRED SO THAT MULTIPLE SETS OF AJAX REQUESTS DON'T COINCIDE
      this.NoListLockout=false;

      if(refreshingList) this.flushNumListedStreams();

        var that= this;
      $.getJSON(this.BASE_TWITCH_REQUEST_URL+'offset='+this.NumListedStreamsStart+'&limit='+this.NumListedStreamsEnd+'&callback=?', function(result){   //the ? for the callback name signals jQuery that it is a JSONP request and not a JSON request. jQuery registers and calls the callback function automatically.
          //response data are now in the result variable
      //  var jsonString = JSON.stringify(result);
      //  var result = JSON.parse(result);
       that.listLoader(result, refreshingList, refreshingList, that.NumListedStreamsEnd);
      });
    }

//LOAD THE STREAMS LIST ON THE LEFT
//YOU'RE EITHER REFRESHING THE LIST OR ADDING TO THE LIST

//YOU PASS IN A DIFFERENT LIST EVERY TIME, SO YOU ONLY NEED TO KEEP A STATIC COUNTER TO KEEP THE INDEX POSITION WHILE FILTERING
//WHEN USING LISTLOADER ON ITS OWN, YOU NEED TO USE flushNumListedStreams() TO CLEAR THE VALUE OF this.NumListedStreamsStart...
//NOTE listLoader HAS NO TOLERANCE FOR EMPTY LIST ENTRIES (ABORTS FUNCTION ON SIGHT), AND REQUIRES YOU TO KEEP THE
//START AND FINISH LIST PUSH POSITIONS YOURSELF IF YOU ARE MAKING MULTIPLE CALLS TO IT...
//changingCat IS FOR WHEN YOU CLICK A NEW CATEGORY BUTTON, IT WILL RUN ONCE WITHOUT FILTERING TO POPULATE List, AND THEN ONCE WITH
//TO RENDER THE LIST PROPERLY FILTERED
  listLoader(list, refreshingList,changingCat, streamIteratorEnd) {

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

             $('.listHoverClass').hover(
               function(){$(this).find('.listHidden').show();},
               function(){if(CHideGame) $(this).find('#gameName').hide();
                          if(CHideDesc) $(this).find('#gameStatus').hide();
               }
             );
          $('.listStreamName').css({bottom: 0, position:'absolute', width: '100%'})

          if(window.FirstTimeRenderingStreams){
            window.renderStreams();
          }
              //ADD THE LISTENERS TO RENDER THE STREAMS
          $('.Pic'+c).click(loadNewStream(list.streams[i-this.NumListedStreamsStart].channel.name));  //RENDERS ALL THE STREAMS

          if(filtering==false) this.ListStaticCounter++;
          else this.FilteringListStaticCounter++;

          this.NoListLockout=true;   //RELINQUISH LOCK
      };
    };


//RESETS THE STREAM COUNTER FOR THE LIST TO BEGIN ANEW
	flushNumListedStreams(){
	  this.NumListedStreamsEnd= this.CNumListedStreamsEnd;
		this.NumListedStreamsStart= this.CNumListedStreamsStart;
	}



  controlListScroll(){

              var _this= this;
      $(".colList ul").scroll(function() {
        if($(document).scrollTop() == 0 && _this.NumListedStreamsEnd<251 && _this.ListAddCooldown==false) {
          if ($('#topStreams').hasClass('activeButton')) {
            _this.NumListedStreamsEnd+=25;
            _this.NumListedStreamsStart+=25;
            _this.addToTopStreams(false);
          }
          if ($('#favStreams').hasClass('activeButton')){
            _this.addToFavStreams('',false);
          }
          if ($('#recStreams').hasClass('activeButton')) {
            _this.NumListedStreamsEnd+=25;
            _this.NumListedStreamsStart+=25;
            _this.addToRecStreams(false);
          }


          _this.ListAddCooldown=true;
          _this.addListTimer=setInterval(addListReset, 1500);
        };
      });

          //REFRESH THE LIST EVERY MINUTE
          //TODO BROKEN, NEEDS TO BE CUSTOMIZED TO THE SELECTED LISTBAR ITEM
    _this.refreshListInterval=setInterval(_this.populateList(_this.BASE_TWITCH_REQUEST_URL,true), _this.CListRefreshTimeMinutes*60000);

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
        this.populateList(this.BASE_TWITCH_REQUEST_URL, refreshing);
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
