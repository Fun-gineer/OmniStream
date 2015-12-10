function initFinished(){

//WINDOW RESIZE LISTENERS
	//KEEPS THE COLLAPSE CARETS PROPERLY ALIGNED ON BROWSER RESIZE
		$(window).resize(function() {
			var $collapseList = $(".collapseList");
			var $collapseChat = $('.collapseChat');
			if(!ListIsHidden) $collapseList.css({top: 0, left: $colList.width(), position:'absolute', 'z-index': 2});
			$collapseChat.css({top: 0, right: 0, position:'absolute', 'z-index': 2});
		});

	//KEEPS THE CARET AND MENU BAR ICONS THE PROPER SIZE ON BROWSER RESIZE
		$(window).resize(function(){
			//MAKE TOGGLE ICONS BIGGER FOR SMALLER DEVICES
			    if (mobile.isMobile()) {
						$('.fa').addClass('fa-2x');
			      $('.fa-caret-right').addClass('fa-4x');
			      $('.fa-caret-left').addClass('fa-4x');
			    } else {
						$('.fa').removeClass('fa-2x');
						$('.fa-caret-left').addClass('fa-2x');
						$('.fa-caret-right').addClass('fa-2x');
						$('.fa-caret-right').removeClass('fa-4x');
			      $('.fa-caret-left').removeClass('fa-4x');

					}

					if(mobile.isPhone()){

					}
		});


//CLICK PROPAGATION
    //filter and settings windows won't close when you click the buttons
    $(".toggleableFilter").click(function(e) {
    		 e.stopPropagation();
    });
    $(".toggleableSetting").click(function(e) {
    		e.stopPropagation();
    });
      //filter and settings windows won't close when you type input into the inputs
    $('#game').keypress(function(e){
    	e.stopPropagation();
    })
    $('#streamer').keypress(function(e){
    	e.stopPropagation();
    })
    $('#Username').keypress(function(e){
    	e.stopPropagation();
    })


//CROSS BROWSER SCROLL PANE CUSTOMISATION
    	$('.scroll-pane').jScrollPane({
    		showArrows: true,
    		arrowScrollOnHover: true,
    		// horizontalGutter: 30,
    		// verticalGutter: 30
    	});
      // // Add some content to #pane2
      // var pane2api = $('#pane2').data('jsp');
      // var originalContent = pane2api.getContentPane().html();
      // pane2api.getContentPane().html(originalContent + originalContent + originalContent);
      //
      // // Reinitialise the #pane2 scrollpane
      // pane2api.reinitialise();


//TOOLTIP INIT FOR BOOTSTRAP
      $('[data-toggle="tooltip"]').tooltip();

}

module.exports= initFinished;
