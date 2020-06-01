var slideMacIndex = 0;
if(window.location.toString().indexOf('/corporate') > -1){
  $(function () {
    changeCarouselHeight();

    var position_resorces = $(".resorces").offset();
    var position_lessons_title = $(".lessons__title").offset();
    var position_lessons_content = $(".lessons__content").offset();
    var position_section_resorces = $(".section__resources").offset();
    var position_section_resorces_text = $(".section__resources__text").offset();
    var position_section_resorces_slider = $(".section__resources__slider").offset();
    var position_tools = $(".tools").offset();
    var position_section_form = $(".section_form").offset();
    var position_form = $(".container_form").offset();
    var position_carousel = $(".container_carousel").offset();

    window.addEventListener('scroll', function (e) {

      showHiddenElement(
        position_resorces,
        position_lessons_title,
        position_lessons_content,
        position_section_resorces,
        position_section_resorces_text,
        position_section_resorces_slider,
        position_tools,
        position_section_form,
        position_form,
        position_carousel
      );
    });

    setTimeout(function () {
      $('.about').css('opacity', 1);

      showHiddenElement(
        position_resorces,
        position_lessons_title,
        position_lessons_content,
        position_section_resorces,
        position_section_resorces_text,
        position_section_resorces_slider,
        position_tools,
        position_section_form,
        position_form,
        position_carousel
      );

    }, 1000);

    showMacSlides();

    var jcarousel = $('.jcarousel');
    jcarousel
      .on('jcarousel:reload jcarousel:create', function () {
        var carousel = $(this),
          width = carousel.innerWidth();

        if (width >= 1200) {
          width = width / 6;
        } else if (width >= 900) {
          width = width / 4;
        } else if (width >= 600) {
          width = width / 3;
        } else if (width >= 350) {
          width = width / 2;
        }

        carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
      })
      .jcarousel({
        wrap: 'circular'
      })
      .jcarouselAutoscroll({
        interval: 1000,
        target: '+=1',
        autostart: true
      });

    $('.jcarousel-control-prev').jcarouselControl({
      target: '-=2'
    });
    $('.jcarousel-control-next').jcarouselControl({
      target: '+=2'
    });

    const contactForm = $('#contact_form');
    const button = $('#btn_ip_submit');
    // const app = new Vue({
    //   el: '#app',
    //   data: {
    //     errors: [],
    //     name: null,
    //     age: null,
    //     movie: null
    //   },
    //   methods:{
    //     checkForm: function (e) {
    //       if (this.name && this.age) {
    //         return true;
    //       }
    //
    //       this.errors = [];
    //
    //       if (!this.name) {
    //         console.log(this)
    //         this.errors.push('Name required.');
    //       }
    //       if (!this.age) {
    //         this.errors.push('Age required.');
    //       }
    //
    //       e.preventDefault();
    //     }
    //   }
    // })
    contactForm.validate({
      errorElement: "span",
      errorClass: "has-error",
      rules: {
        'name': {
          required: true,
          minlength: 1
        },
        'email': {
          required: true,
          minlength: 1,
          email: true
        },
        'subject': {
          required: true,
          minlength: 1
        },
      },
      errorPlacement: function (error, element) {
        error.insertAfter(element);
        let parent = $(element).parents()[1];
        $(parent).addClass('form__row_error');
      },
      highlight: function (element) {
        // $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
      },
      unhighlight: function (element) {
        // $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
      },
      success: function (element) {

        let parent = $(element).parents()[1];
        let parent_elem = $(parent);

        if (parent_elem.hasClass('form__row_error')) {
          parent_elem.removeClass('form__row_error');
        }

        element.removeClass('has-error');
        //.closest('.form-group').removeClass('has-error').addClass('has-success');
      },
      messages: {
        'name': {
          required: 'Please enter your full name.'
        },
        'email': {
          required: 'Please enter your email'
        },
        'subject': {
          required: 'Please enter a subject'
        },
      }
    });

    contactForm.on('click', 'button', function (e) {

      e.preventDefault();

      let form_valid = contactForm.valid();
      if (form_valid) {

        button.prop('disabled', true);
        button.html('Sending...');
        $('#ip-msg').html('');

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          var is_mobile = 1;
        } else {
          var is_mobile = 0;
        }

        if (is_mobile) {
          document.getElementsByName("mobile_device")[0].value = 1;
        } else {
          document.getElementsByName("mobile_device")[0].value = 0;
        }

        $.ajax({
          type: "POST",
          url: "/group-offering/contact/",
          data: contactForm.serialize(),
          success: function (res) {
            let result = JSON.parse(res);
            if (result.status != 1) {
              // failed
              contactForm.submit();
              button.prop('disabled', false);
              button.html('Send');
            } else {
              // success
              $('#ip-msg').html(
                `<div class="${result.alertClass}">
                                ${result.alertMsg}
                            </div>`
              );
              $('#contact_form textarea').val('');
              button.prop('disabled', false);
              button.html('Send');

              var form = document.getElementsByClassName("form")[0];
              var section_form = document.getElementsByClassName("section_form")[0];
              var section_form_before = document.getElementsByClassName("section_form_before")[0];

              var form_margin_bottom = form.style.marginBottom;
              var section_form_height = section_form.clientHeight;
              var section_form_before_height = section_form_before.clientHeight;

              if (is_mobile) {
                if (section_form_height < section_form_before_height) {
                  section_form.style.height = section_form_before_height + "px";
                }
              } else {
                form.style.marginBottom = "20px";
              }

              $('html, body').animate({
                scrollTop: $(".form__title").offset().top
              }, 500);

              setTimeout(function () {
                $('#ip-msg').html('');
                if (is_mobile) {
                  if (section_form_height < section_form_before_height) {
                    section_form.style.height = section_form_height + "px";
                  }
                } else {
                  form.style.marginBottom = form_margin_bottom;
                }
              }, 10000);
            }
          }
        });
      }
    });

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

      document.getElementById("btn_ip_submit").addEventListener("touchstart", function (event) {

        event.target.style.color = "#fff";
        event.target.style.backgroundColor = "#2487c1";

      }, false);
      document.getElementById("btn_ip_submit").addEventListener("touchend", function (event) {

        event.target.style.color = "#2487c1";
        event.target.style.backgroundColor = "transparent";

      }, false);
    }

    window.addEventListener('resize', function (event) {

      changeCarouselHeight();
    });
  });

  function changeCarouselHeight() {

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

  function showHiddenElement(
    position_resorces,
    position_lessons_title,
    position_lessons_content,
    position_section_resorces,
    position_section_resorces_text,
    position_section_resorces_slider,
    position_tools,
    position_section_form,
    position_form,
    position_carousel
  ) {

    let size = 100;
    let position_bottom = window.innerHeight;
    let position_scroll = window.scrollY;
    let position = position_bottom + position_scroll - size;

    if (position > position_lessons_title.top) {

      $('.lessons__title').css('opacity', 1);
    }
    if (position > position_lessons_content.top) {

      $('.lessons__content').css('opacity', 1);
    }
    if (position > position_resorces.top) {

      $('.resorces').css('opacity', 1);
    }
    if (position > position_section_resorces.top) {

      $('.section__resources').css('opacity', 1);
    }
    if (position > position_section_resorces_text.top) {

      $('.section__resources__text').css('opacity', 1);
    }
    if (position > position_section_resorces_slider.top) {

      $('.section__resources__slider').css('opacity', 1);
    }
    if (position > position_tools.top) {

      $('.tools').css('opacity', 1);
    }
    if (position > position_section_form.top) {

      $('.section_form_before').css('opacity', 1);
    }
    if (position > position_form.top) {

      $('.container_form').css('opacity', 1);
    }
    if (position > position_carousel.top) {

      $('.container_carousel').css('opacity', 1);
    }
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
    if (window.slideMacIndex > slides.length) {
      window.slideMacIndex = 1
    }
    slides[window.slideMacIndex - 1].classList.add('active');
    slides_text[window.slideMacIndex - 1].classList.add('active');
    setTimeout(showMacSlides, 6000); // Change image every 2 seconds
  }

}
