//SETUP KEYBOARD KEYPRESS LISTENERS
function setupKeyListeners(){

  $("html").keypress(function( event ) {
    var player = $("#twitch_embed_player_"+SelectedStream)[0];


      //WHEN IN SINGLE STREAM MODE THIS WILL SWITCH TO THE STREAM NUMBER PRESSED
    switch(event.which){

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
            //SELECTS THE CHAT
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

      //PAUSING, MUTING, UNMUTING
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



        //HIDING LIST
      case 97:
          window.$colList.toggle();
             var $collapseList = $(".collapseList");
             var lw = $colList.width();
          if (window.ListIsHidden){window.ListIsHidden=false; $collapseList.css({top: 0, left: lw, position:'absolute', 'z-index': 2});}
          else {window.ListIsHidden=true; $collapseList.css({top: 0, left: 0, position:'absolute', 'z-index': 2});}
          // ResetOuterColumnDrag();
          // // renderStreams();
          // // ResetAllDragColumns();
          break;

        //HIDING CHAT
      case 100:
          window.$chat.toggle();
          cResizer.ResetStreamColumnDrag();
          // ResetOuterColumnDrag();
          // // renderStreams();
          // // ResetAllDragColumns();
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
