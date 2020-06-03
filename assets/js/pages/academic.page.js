var slideMacIndex = 0;
if(window.location.toString().indexOf('/academic-offers') > -1){
  $(function() {

    changeCarouselHeight();
    showMacSlides();

    window.addEventListener('resize', function(event){

      changeCarouselHeight();
    });
    $('#page-footer').css('display','flex');
    var position_home_desc = $(".home__desc").offset();
    var position_about_item_1_img = $(".about-item_1 .about-item__bg").offset();
    var position_about_item_1_text = $(".about-item_1 .about-item__text").offset();
    var position_about_item_2_img = $(".about-item_2 .about-item__bg").offset();
    var position_about_item_2_text = $(".about-item_2 .about-item__text").offset();
    var position_about_item_3_img = $(".about-item_3 .about-item__bg").offset();
    var position_about_item_3_text = $(".about-item_3 .about-item__text").offset();
    var position_about_item_4_img = $(".about-item_4 .about-item__bg").offset();
    var position_about_item_4_text = $(".about-item_4 .about-item__text").offset();
    var position_about_item_5_img = $(".about-item_5 .about-item__bg").offset();
    var position_about_item_5_text = $(".about-item_5 .about-item__text").offset();
    var position_about_item_6_img = $(".about-item_6 .about-item__bg").offset();
    var position_about_item_6_text = $(".about-item_6 .about-item__text").offset();
    var position_about_item_7_img = $(".about-item_7 .about-item__bg").offset();
    var position_about_item_7_text = $(".about-item_7 .about-item__text").offset();
    var position_section_resorces = $(".section__resources").offset();
    var position_section_resorces_text = $(".section__resources__text").offset();
    var position_section_resorces_slider = $(".section__resources__slider").offset();
    var position_form = $(".form-section").offset();
    var position_resources = $(".resorces").offset();

    window.addEventListener('scroll', function(e) {

      showHiddenElement(
        position_home_desc,
        position_about_item_1_img,
        position_about_item_1_text,
        position_about_item_2_img,
        position_about_item_2_text,
        position_about_item_3_img,
        position_about_item_3_text,
        position_about_item_4_img,
        position_about_item_4_text,
        position_about_item_5_img,
        position_about_item_5_text,
        position_about_item_6_img,
        position_about_item_6_text,
        position_about_item_7_img,
        position_about_item_7_text,
        position_section_resorces,
        position_section_resorces_text,
        position_section_resorces_slider,
        position_form,
        position_resources,
      );
    });

    setTimeout(function(){

      $('.home__desc').css('opacity', 1);

      showHiddenElement(
        position_home_desc,
        position_about_item_1_img,
        position_about_item_1_text,
        position_about_item_2_img,
        position_about_item_2_text,
        position_about_item_3_img,
        position_about_item_3_text,
        position_about_item_4_img,
        position_about_item_4_text,
        position_about_item_5_img,
        position_about_item_5_text,
        position_about_item_6_img,
        position_about_item_6_text,
        position_about_item_7_img,
        position_about_item_7_text,
        position_section_resorces,
        position_section_resorces_text,
        position_section_resorces_slider,
        position_form,
        position_resources,
      );

    }, 1000);


    const formTop = $('#form-top');
    const formBottom = $('#form-bottom');
    const submitTop = $('#btn-form-top-submit');
    const submitBottom = $('#btn-form-bottom-submit');


    formTop.validate({
      errorElement: "span",
      errorClass: "has-error",
      rules: {
        'first_name': {
          required: true,
          minlength: 1
        },
        'school_name': {
          required: true,
          minlength: 1
        },
        'email': {
          required: true,
          minlength: 1,
          email: true
        },
      },
      errorPlacement: function(error, element) {
        error.insertAfter(element);
        let parent = $(element).parents()[0];
        $(parent).addClass('form__row_error');
      },
      highlight: function(element) {

      },
      unhighlight: function(element) {

      },
      success: function(element) {

        let parent = $(element).parents()[0];
        let parent_elem = $(parent);

        if(parent_elem.hasClass('form__row_error')){
          parent_elem.removeClass('form__row_error');
        }

        element.removeClass('has-error');
      },
      messages: {
        'first_name': {
          required: 'Please enter your first name.'
        },
        'school_name': {
          required: 'Please enter school name.'
        },
        'email': {
          required: 'Please enter your email.'
        },
      }
    });

    formBottom.validate({
      errorElement: "span",
      errorClass: "has-error",
      rules: {
        'first_name': {
          required: true,
          minlength: 1
        },
        'school_name': {
          required: true,
          minlength: 1
        },
        'email': {
          required: true,
          minlength: 1,
          email: true
        },
      },
      errorPlacement: function(error, element) {
        error.insertAfter(element);
        let parent = $(element).parents()[0];
        $(parent).addClass('form__row_error');
      },
      highlight: function(element) {
        // $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
      },
      unhighlight: function(element) {
        // $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
      },
      success: function(element) {

        let parent = $(element).parents()[0];
        let parent_elem = $(parent);

        if(parent_elem.hasClass('form__row_error')){
          parent_elem.removeClass('form__row_error');
        }

        element.removeClass('has-error');
        //.closest('.form-group').removeClass('has-error').addClass('has-success');
      },
      messages: {
        'first_name': {
          required: 'Please enter your first name.'
        },
        'school_name': {
          required: 'Please enter school name.'
        },
        'email': {
          required: 'Please enter your email.'
        },
      }
    });


    formTop.on('click','button', function(e){

      e.preventDefault();

      let form_valid = formTop.valid();
      if(form_valid) {

        submitTop.button('loading');
        $('#form-top-msg').html('');
        $.ajax({
          type: "POST",
          url: "/group-offering/contact-academic/",
          data: formTop.serialize(),
          success: function (res) {
            let result = JSON.parse(res);
            if (result.status != 1) {
              // failed
              $('#form-top-msg').html(
                `<div class="${result.alertClass}">
                                ${result.alertMsg}
                            </div>`
              );
              submitTop.button('reset');
            } else {
              // success
              $('#form-top-msg').html(
                `<div class="${result.alertClass}">
                                ${result.alertMsg}
                            </div>`
              );
              submitTop.button('reset');
            }

            setTimeout(function () {
              $('#form-top-msg').html('');
            }, 10000);
          }
        });
      }
    });

    formBottom.on('click','button', function(e){

      e.preventDefault();

      let form_valid = formBottom.valid();
      if(form_valid) {

        submitBottom.button('loading');
        $('#form-bottom-msg').html('');
        $.ajax({
          type: "POST",
          url: "/group-offering/contact-academic/",
          data: formBottom.serialize(),
          success: function (res) {
            let result = JSON.parse(res);
            if (result.status != 1) {
              // failed
              $('#form-bottom-msg').html(
                `<div class="${result.alertClass}">
                                ${result.alertMsg}
                            </div>`
              );
              submitBottom.button('reset');
            } else {
              // success
              $('#form-bottom-msg').html(
                `<div class="${result.alertClass}">
                                ${result.alertMsg}
                            </div>`
              );
              submitBottom.button('reset');
            }

            setTimeout(function () {
              $('#form-bottom-msg').html('');
            }, 10000);
          }
        });
      }
    });

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

      document.getElementById("btn-form-top-submit").addEventListener("touchstart", function( event ) {

        event.target.style.backgroundColor = "#7AB3D3";

      }, false);
      document.getElementById("btn-form-top-submit").addEventListener("touchend", function( event ) {

        event.target.style.backgroundColor = "#2487c1";

      }, false);

      document.getElementById("btn-form-bottom-submit").addEventListener("touchstart", function( event ) {

        event.target.style.backgroundColor = "#7AB3D3";

      }, false);
      document.getElementById("btn-form-bottom-submit").addEventListener("touchend", function( event ) {

        event.target.style.backgroundColor = "#2487c1";


      }, false);
    }

  });

  function showHiddenElement(
    position_home_desc,
    position_about_item_1_img,
    position_about_item_1_text,
    position_about_item_2_img,
    position_about_item_2_text,
    position_about_item_3_img,
    position_about_item_3_text,
    position_about_item_4_img,
    position_about_item_4_text,
    position_about_item_5_img,
    position_about_item_5_text,
    position_about_item_6_img,
    position_about_item_6_text,
    position_about_item_7_img,
    position_about_item_7_text,
    position_section_resorces,
    position_section_resorces_text,
    position_section_resorces_slider,
    position_form,
    position_resources,
  ) {

    let size = 100;
    let position_bottom = window.innerHeight;
    let position_scroll = window.scrollY;
    let position = position_bottom + position_scroll - size;

    if(position > position_home_desc.top){

      $('.home__desc').css('opacity', 1);
    }
    if(position > position_about_item_1_img.top){

      $('.about-item_1 .about-item__bg').css('opacity', 1);
    }
    if(position > position_about_item_1_text.top){

      $('.about-item_1 .about-item__text').css('opacity', 1);
    }
    if(position > position_about_item_2_img.top){

      $('.about-item_2 .about-item__bg').css('opacity', 1);
    }
    if(position > position_about_item_2_text.top){

      $('.about-item_2 .about-item__text').css('opacity', 1);
    }
    if(position > position_about_item_3_img.top){

      $('.about-item_3 .about-item__bg').css('opacity', 1);
    }
    if(position > position_about_item_3_text.top){

      $('.about-item_3 .about-item__text').css('opacity', 1);
    }
    if(position > position_about_item_4_img.top){

      $('.about-item_4 .about-item__bg').css('opacity', 1);
    }
    if(position > position_about_item_4_text.top){

      $('.about-item_4 .about-item__text').css('opacity', 1);
    }
    if(position > position_about_item_5_img.top){

      $('.about-item_5 .about-item__bg').css('opacity', 1);
    }
    if(position > position_about_item_5_text.top){

      $('.about-item_5 .about-item__text').css('opacity', 1);
    }
    if(position > position_about_item_6_img.top){

      $('.about-item_6 .about-item__bg').css('opacity', 1);
    }
    if(position > position_about_item_6_text.top){

      $('.about-item_6 .about-item__text').css('opacity', 1);
    }
    if(position > position_about_item_7_img.top){

      $('.about-item_7 .about-item__bg').css('opacity', 1);
    }
    if(position > position_about_item_7_text.top){

      $('.about-item_7 .about-item__text').css('opacity', 1);
    }
    if(position > position_section_resorces.top){

      $('.section__resources').css('opacity', 1);
    }
    if(position > position_section_resorces_text.top){

      $('.section__resources__text').css('opacity', 1);
    }
    if(position > position_section_resorces_slider.top){

      $('.section__resources__slider').css('opacity', 1);
    }
    if(position > position_form.top){

      $('.form-section').css('opacity', 1);
    }
    if(position > position_resources.top){

      $('.resorces').css('opacity', 1);
    }
  }

  function changeCarouselHeight(){

    var slides = document.getElementsByClassName("mac-slider__item");
    var slides_text = document.getElementsByClassName("resources_slider_text_item");
    for (i = 0; i < slides.length; i++) {
      slides[i].classList.remove('active');
      slides_text[i].classList.remove('active');
    }

    document.getElementById("greatest_carousel_item").classList.add('active');
    document.getElementById("greatest_carousel_mac_item").classList.add('active');

    var height = document.getElementById("greatest_carousel_item").clientHeight;

    document.getElementsByClassName("resources_slider_text_list")[0].style.height = height + 20 + 'px';
  }

  function showMacSlides() {
    var i;
    var slides = document.getElementsByClassName("mac-slider__item");
    var slides_text = document.getElementsByClassName("resources_slider_text_item");

    for (i = 0; i < slides.length; i++) {

      slides[i].classList.remove('active');
      slides_text[i].classList.remove('active');
    }
    window.slideMacIndex++;
    if (window.slideMacIndex > slides.length) {window.slideMacIndex = 1}
    slides[window.slideMacIndex-1].classList.add('active');
    slides_text[window.slideMacIndex-1].classList.add('active');
    setTimeout(showMacSlides, 6000); // Change image every 2 seconds
  }

}
