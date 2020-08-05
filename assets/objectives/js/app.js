$(document).ready(function () {
   $('.data-slider-wrapper .rangeslider-thumb').click(function (){
     var myInputValue = $('.data-slider-wrapper .range input').val();
       
       if(myInputValue > 0 && myInputValue <= 20) {
           $('.data-slider-wrapper .bar-wrapper ul li span').css('color', '#b3c5d7');
           $('.data-slider-wrapper .bar-wrapper ul li#firstCheck span').css('color', '#000');
           
       } else if (myInputValue > 20 && myInputValue <= 40) {
           $('.data-slider-wrapper .bar-wrapper ul li span').css('color', '#b3c5d7');
           $('.data-slider-wrapper .bar-wrapper ul li#secondCheck span').css('color', '#000');
       } else if (myInputValue > 40 && myInputValue <= 60) {
           $('.data-slider-wrapper .bar-wrapper ul li span').css('color', '#b3c5d7');
           $('.data-slider-wrapper .bar-wrapper ul li#thirdCheck span').css('color', '#000');
       } else {
           $('.data-slider-wrapper .bar-wrapper ul li span').css('color', '#b3c5d7');
           $('.data-slider-wrapper .bar-wrapper ul li#fourthCheck span').css('color', '#000');
       }
   });
    
    
    
    $('.data-slider-wrapper .vectorslider-thumb').click(function () {
       console.log($('.data-slider-wrapper .vector input').val()) ;
    });
});