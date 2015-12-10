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
