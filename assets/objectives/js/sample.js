var grobal_reload = false;

var BottomRangeSlider = function(containerID) {
    var self = this,
        $RangeSlider = $('#'+containerID),
        $SliderThumnb = $RangeSlider.find('.RangeSlider_Thumb2'),
        $SliderTrack = $RangeSlider.find('.RangeSlider_Track2'),
        $SliderTrackFill = $RangeSlider.find('.RangeSlider_TrackFill2'),
        $SliderTrackFillsmall = $RangeSlider.find('.RangeSlider_TrackFill_small2'),
        $ClickArea = $RangeSlider.find('.RangeSlider_ClickArea2'),
        $SliderPoints = $RangeSlider.find('.RangeSlider_Point2'),
        $SliderIn = $RangeSlider.find('.slider_in');


    
    this.value = 0;
    var global_start = 5;
    /* helper to find slider value based on filled track width */
    var findValueFromTrackFill = function(trackFillWidth) {
      var totalWidth = $SliderTrack.width(),
          onePercentWidth = totalWidth / 100,
          value = Math.round((trackFillWidth / onePercentWidth) / 20)*2;
      return value;
    }
    
    /* change highlighted number based on new value */
    var updateSelectedValue = function(newValue) {
      $SliderPoints.removeClass('RangeSlider_PointActive');
      $SliderPoints.eq( newValue ).addClass('RangeSlider_PointActive');
    }
    
    /* highlight track based on new value (and move thumb) */
    var updateHighlightedTrack = function(newPosition) {
      for(var i =0; i< 5; i++){
        if(i < newPosition/2)
          $SliderIn.eq( i ).css('background-color','red');
        else
          $SliderIn.eq( i ).css('background-color','#b3c5d7');
      }
      newPosition = newPosition + '0%';
      if(newPosition == '00%'){
        newPosition = global_start + '%'
        $SliderTrackFill.css({
          "background-color": "#b3c5d7",
          "width": newPosition
        });
        $SliderTrack.css({
          "background-color": "#b3c5d7"
        });
      }
      else if(newPosition == '100%'){
        newPosition = 100 - global_start + '%'
        $SliderTrackFill.css({
          "width": newPosition
        });
        $SliderTrack.css({
          "background-color": "red"
        });
      }
      else{
        $SliderTrackFill.css({
          "background-color": "red",
          "width": newPosition
        });
        $SliderTrack.css({
          "background-color": "#b3c5d7"
        });
      }
      // $SliderTrackFill.css('width', newPosition);
      
    }
    
    /* set up drag funcationality for thumbnail */
    var setupDrag = function($element, initialXPosition) {
      $SliderTrackFill.addClass('RangeSlider_TrackFill-stopAnimation2');
      var trackWidth = $SliderTrackFill.width();
      
      var newValue = findValueFromTrackFill( trackWidth );
      updateSelectedValue(newValue);
      
      $element.on('mousemove', function(e){
        var newPosition = trackWidth + e.clientX - initialXPosition;
        self.imitateNewValue( newPosition );
        
        newValue = findValueFromTrackFill( $SliderTrackFill.width() );
        updateSelectedValue(newValue);
      });
    }
    /* remove drag functionality for thumbnail */
    var finishDrag = function($element) {
      $SliderTrackFill.removeClass('RangeSlider_TrackFill-stopAnimation2');
      $element.off('mousemove');
      var newValue = findValueFromTrackFill( $SliderTrackFill.width() );
      self.updateSliderValue( newValue );
    }
    
    this.getSliderValue = function() {
      return this.value / 2;
    }

    /* method to update all things required when slider value updates */
    this.updateSliderValue = function(newValue) {
      updateSelectedValue( newValue );
      updateHighlightedTrack( newValue );
      self.value = newValue;
      
        
        // Check the values and change li and span
        if (self.value == 0) {
            
            // Change text in span
            $('.data-slider-wrapper .bar-wrapper2 ul li span').css('color', '#b3c5d7');

        } else if (self.value > 0 && self.value <= 2) {
    
            // Change text in span
            $('.data-slider-wrapper .bar-wrapper2 ul li span').css('color', '#b3c5d7');
            $('.data-slider-wrapper .bar-wrapper2 ul li#firstCheck span').css('color', '#000');

        } else if (self.value > 2 && self.value <= 4) {

            // Change text in span
            $('.data-slider-wrapper .bar-wrapper2 ul li span').css('color', '#b3c5d7');
            $('.data-slider-wrapper .bar-wrapper2 ul li#secondCheck span').css('color', '#000');

        } else if (self.value > 4 && self.value <= 6) {
            
            // Change text in span
            $('.data-slider-wrapper .bar-wrapper2 ul li span').css('color', '#b3c5d7');
            $('.data-slider-wrapper .bar-wrapper2 ul li#thirdCheck span').css('color', '#000');

        } else if (self.value > 6 && self.value <= 8) {

            // Change text in span
            $('.data-slider-wrapper .bar-wrapper2 ul li span').css('color', '#b3c5d7');
            $('.data-slider-wrapper .bar-wrapper2 ul li#fourthCheck span').css('color', '#000');
            
        } else {
    
            // Change text in span
            $('.data-slider-wrapper .bar-wrapper2 ul li span').css('color', '#b3c5d7');
            $('.data-slider-wrapper .bar-wrapper2 ul li#fourthCheck span').css('color', '#000');
        }
    }
    
    /* method to imitate new value without animation */
    this.imitateNewValue = function(XPosition) {
      $SliderTrackFill.addClass('RangeSlider_TrackFill-stopAnimation2');
      if ( XPosition > $SliderTrack.width() ) {
        XPosition = $SliderTrack.width();
      }
      var totalWidth = $SliderTrack.width(),
          onepieceWidth = totalWidth / 5,
          count = Math.floor(XPosition / onepieceWidth),
          start_pos = count * onepieceWidth;
      for(var i =0; i< 5; i++){
        if(i < count)
          $SliderIn.eq( i ).css('background-color','red');
        else
          $SliderIn.eq( i ).css('background-color','#b3c5d7');
      }
      $SliderTrack.css({
        "background-color": "#b3c5d7"
      });
      if(XPosition / totalWidth * 100 < global_start){
        // $SliderTrackFill.css('width', global_start + '%');
        $SliderTrackFill.css({
          "background-color": '#b3c5d7',
          "width": global_start + '%'
        });
      }else if(XPosition / totalWidth * 100 > 100 - global_start){
        // $SliderTrackFill.css('width', global_start + '%');
        $SliderTrackFill.css({
          "width": 100 - global_start + '%'
        });
      }else{
        $SliderTrackFill.css({
          "background-color": 'red',
          "width": XPosition + 'px'
        });
        /* $SliderTrackFill.css('width', XPosition + 'px');
        $SliderTrackFill.css('background-color', 'red'); */
      }
      // $SliderTrackFillsmall.css('width', XPosition - start_pos+ 'px');
      // $SliderTrackFillsmall.css('transform', 'translate(' + start_pos +'px'+', 0)');
    }
    
    /*
     * bind events when instance created
     */
    $ClickArea.on('mousedown', function(e){
      /* if a number or thumbnail has been clicked, use their event instead */
      var $target = $(e.target);
      if ( $target.hasClass('RangeSlider_Thumb2') ) {
        return false;
      }
      /* now we can continue based on where the clickable area was clicked */
      self.imitateNewValue( e.offsetX );
      setupDrag( $(this), e.clientX );
    });
    
    $ClickArea.on('mouseup', function(e){
      
      finishDrag( $(this) );
    });
    
    // update value when markers are clicked
    $SliderPoints.on('mousedown', function(e){
      e.stopPropagation();
      var XPos = $(this).position().left + ($(this).width()/2);
      self.imitateNewValue( XPos );
      setupDrag( $ClickArea, e.clientX );
    });
    
    // when thumbnail is clicked down, init the drag stuff
    $SliderThumnb.on('mousedown', function(e){
      e.stopPropagation();
      setupDrag( $(this), e.clientX );
    });
    
    // when the thumbnail is released, remove the drag stuff
    $SliderThumnb.on('mouseup', function(e){
      
      finishDrag( $(this) );
    });
  }