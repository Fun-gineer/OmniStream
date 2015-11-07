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
