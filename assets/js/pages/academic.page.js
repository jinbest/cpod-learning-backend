parasails.registerPage('academic', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    data: { },
    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    errors: { },

    // Server error state for the form
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,


  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    var app = new Vue({
      created: function () {
        var slideMacIndex = 0;

        if (window.location.toString().indexOf('/academic-offers') > -1) {
          $(function () {


            showMacSlides();

            window.addEventListener('resize', function (event) {


            });
            $('#page-footer').css('display', 'flex');
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

            window.addEventListener('scroll', function (e) {

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

            setTimeout(function () {

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

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

              document.getElementById("btn-form-top-submit").addEventListener("touchstart", function (event) {

                event.target.style.backgroundColor = "#7AB3D3";

              }, false);
              document.getElementById("btn-form-top-submit").addEventListener("touchend", function (event) {

                event.target.style.backgroundColor = "#2487c1";

              }, false);

              document.getElementById("btn-form-bottom-submit").addEventListener("touchstart", function (event) {

                event.target.style.backgroundColor = "#7AB3D3";

              }, false);
              document.getElementById("btn-form-bottom-submit").addEventListener("touchend", function (event) {

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

            if (position > position_home_desc.top) {

              $('.home__desc').css('opacity', 1);
            }
            if (position > position_about_item_1_img.top) {

              $('.about-item_1 .about-item__bg').css('opacity', 1);
            }
            if (position > position_about_item_1_text.top) {

              $('.about-item_1 .about-item__text').css('opacity', 1);
            }
            if (position > position_about_item_2_img.top) {

              $('.about-item_2 .about-item__bg').css('opacity', 1);
            }
            if (position > position_about_item_2_text.top) {

              $('.about-item_2 .about-item__text').css('opacity', 1);
            }
            if (position > position_about_item_3_img.top) {

              $('.about-item_3 .about-item__bg').css('opacity', 1);
            }
            if (position > position_about_item_3_text.top) {

              $('.about-item_3 .about-item__text').css('opacity', 1);
            }
            if (position > position_about_item_4_img.top) {

              $('.about-item_4 .about-item__bg').css('opacity', 1);
            }
            if (position > position_about_item_4_text.top) {

              $('.about-item_4 .about-item__text').css('opacity', 1);
            }
            if (position > position_about_item_5_img.top) {

              $('.about-item_5 .about-item__bg').css('opacity', 1);
            }
            if (position > position_about_item_5_text.top) {

              $('.about-item_5 .about-item__text').css('opacity', 1);
            }
            if (position > position_about_item_6_img.top) {
              $('.about-item_6 .about-item__bg').css('opacity', 1);
            }
            if (position > position_about_item_6_text.top) {

              $('.about-item_6 .about-item__text').css('opacity', 1);
            }
            if (position > position_about_item_7_img.top) {

              $('.about-item_7 .about-item__bg').css('opacity', 1);
            }
            if (position > position_about_item_7_text.top) {

              $('.about-item_7 .about-item__text').css('opacity', 1);
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
            if (position > position_form.top) {

              $('.form-section').css('opacity', 1);
            }
            if (position > position_resources.top) {

              $('.resorces').css('opacity', 1);
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
            slideMacIndex++;
            if (slideMacIndex > slides.length) {
              slideMacIndex = 1
            }
            slides[slideMacIndex - 1].classList.add('active');
            slides_text[slideMacIndex - 1].classList.add('active');
            setTimeout(showMacSlides, 6000); // Change image every 2 seconds
          }

        }
      }
    })
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

    submittedForm1: async function () {
      // Show the success message.

    },


    handleParsingForm1: function () {
      // Clear out any pre-existing error messages.
      this.errors = {};
      var argins = this.data;

      // Validate email:
      if (!argins.email) {
        this.errors.email = true;
      }

      // Validate name:
      if (!argins.firstName) {
        this.errors.firstName = true;
      }

      // Validate topic:
      if (!argins.schoolName) {
        this.errors.schoolName = true;
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

