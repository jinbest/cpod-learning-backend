/*global console*/
$(".steps").on("click", ".step--active", function () {
  // $(this).removeClass("step--incomplete").addClass("step--complete");
  //   $(this).removeClass("step--active").addClass("step--inactive");
  $(this).prevAll().removeClass("step--incomplete").addClass("step--complete");
  //   $(this).next().removeClass("step--inactive").addClass("step--active");
});

$(".steps").on("click", ".step--complete", function () {
  $(this).removeClass("step--complete").addClass("step--incomplete");
  $(this).removeClass("step--inactive").addClass("step--active");
  $(this).nextAll().removeClass("step--complete").addClass("step--incomplete");
  //   $(this).nextAll().removeClass("step--active").addClass("step--inactive");
});

$(".item-gallery img").click(function () {
  if ($(this).parent().find("i").hasClass("gal-checked")) {
    $(this).parent().find("i").addClass("check-item");
    $(this).parent().find("i").removeClass("gal-checked");
  } else {
    $(this).parent().find("i").removeClass("check-item");
    $(this).parent().find("i").addClass("gal-checked");
  }
});

var stepOfLearnIntensely = null;
var stepOfUseApp = null;
var checkedObjective = [];

function getCheckedObjectives() {
  let chosedGallery = $(".item-gallery");

  for (let i = 0; i < chosedGallery.length; i++) {
    if (chosedGallery[i].lastElementChild.classList.contains("gal-checked")) {
      checkedObjective.push(chosedGallery[i].children[1].innerText);
    }
  }

  if (checkedObjective === undefined || checkedObjective.length == 0) {
    alert("please choose your objective!");
  }
  console.log("you have checked ", checkedObjective);
}

function getAnswerQ1() {
  let learnIntensely = $("#learn-intensely");
  let flag = true;

  let completeCounter = 0;

  for (let i = 0; i < learnIntensely[0].children.length && flag; i++) {
    for (
      let j = 0;
      j < learnIntensely[0].children[i].classList.length && flag;
      j++
    ) {
      if (learnIntensely[0].children[i].classList[j] == "step--incomplete") {
        if (i == 0) {
          alert("Please answer above questions.");
        } else {
          stepOfLearnIntensely = i;
        }

        flag = false;
        break;
      } else if (
        learnIntensely[0].children[i].classList[j] == "step--complete"
      ) {
        completeCounter++;
        if (completeCounter == 4) {
          stepOfLearnIntensely = 4;
        }
      }
    }
  }
  console.log("You are in ", stepOfLearnIntensely);
}

function getAnswerQ2() {
  let useApp = $("#use-app");
  let flag = true;

  let completeCounter = 0;

  for (let i = 0; i < useApp[0].children.length && flag; i++) {
    for (let j = 0; j < useApp[0].children[i].classList.length && flag; j++) {
      if (useApp[0].children[i].classList[j] == "step--incomplete") {
        if (i == 0) {
          alert("Please answer above questions.");
        } else {
          stepOfUseApp = i;
        }

        flag = false;
        break;
      } else if (useApp[0].children[i].classList[j] == "step--complete") {
        completeCounter++;
        if (completeCounter == 4) {
          stepOfUseApp = 4;
        }
      }
    }
  }
  console.log("You are in ", stepOfUseApp);
}

$("#submit_info").click(function () {
  getCheckedObjectives();
  getAnswerQ1();
  getAnswerQ2();
});


