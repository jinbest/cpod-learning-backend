parasails.registerPage('corporate', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formData: { /* … */},
    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */},

    // Server error state for the form
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,
    //Success massage
    msg: '',
    modal: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    submittedForm: async function () {
      // Show the success message.
      this.msg = 'Thank you. We will get back to you soon.';
      this.cloudSuccess = true;
    },
    openModal: async function (modal) {
      // Show the success message.
      this.modal = modal;
    },
    closeModal: async function (modal) {
      // Show the success message.
      this.modal = "";
    },
    removeSucces: async function (modal) {
      // remove the success message.
      this.msg = '';
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      var argins = this.formData;

      // Validate email:
      if (!argins.emailAddress) {
        this.formErrors.emailAddress = true;
      }

      // Validate name:
      if (!argins.fullName) {
        this.formErrors.fullName = true;
      }

      // Validate topic:
      if (!argins.topic) {
        this.formErrors.topic = true;
      }

      // Validate message:
      if (!argins.message) {
        this.formErrors.message = true;
      }

      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;
    },

  }
});
var app = new Vue({
  created: function () {
    var slideMacIndex = 0;
    if (window.location.toString().indexOf('/corporate') > -1) {
      $(function () {
        changeCarouselHeight();
        $('#page-footer').css('display','flex');
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
  }
});


