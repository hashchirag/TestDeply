(function($) {
  $.fn.emc = function(options) {

    var defaults = {
        key: [],
        scoring: "normal",
        progress: true
      },
      settings = $.extend(defaults, options),
      $quizItems = $('[data-quiz-item]'),
      $choices = $('[data-choices]'),
      itemCount = $quizItems.length,
      chosen = [],
      $option = null,
      $label = null;

    var username = "";
    var jee_test = "";
    var cookie = "";
    var count = 0;
    // function init() {
    //   username = getParameterByName('username');
    //   jee_test = getParameterByName('jee_test');
    //   console.log(username + jee_test);
    // }
    //
    // function getParameterByName(name, url) {
    //   if (!url) url = window.location.href;
    //   name = name.replace(/[\[\]]/g, "\\$&");
    //   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    //     results = regex.exec(url);
    //   if (!results) return null;
    //   if (!results[2]) return '';
    //   return decodeURIComponent(results[2].replace(/\+/g, " "));
    // }


    emcInit();

    function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
    }

    function checkCookie() {
      cookie = getCookie("values");


      if (cookie != "") {
        var res = cookie.split(",");
        console.log("Welcome again " + res[0]);

        console.log(res[0]);
        console.log(res[1]);
        username = res[0];
      } else {
        alert("Enable cookies and restart");
      }
    }

    checkCookie();

    if (settings.progress) {
      var $bar = $('#emc-progress'),
        $inner = $('<div id="emc-progress_inner"></div>'),
        $perc = $('<span id="emc-progress_ind">0/' + itemCount + '</span>');
      $bar.append($inner).prepend($perc);
    }

    function emcInit() {
      $quizItems.each(function(index, value) {
        var $this = $(this),
          $choiceEl = $this.find('.choices'),
          choices = $choiceEl.data('choices');
        for (var i = 0; i < choices.length; i++) {
          $option = $('<input name="' + index + '" id="' + index + '_' + i + '" type="radio">');
          $label = $('<label for="' + index + '_' + i + '">' + choices[i] + '</label>');
          $choiceEl.append($option).append($label);

          $option.on('change', function() {
            return getChosen();
          });
        }
      });
    }

    function getChosen() {
      chosen = [];
      $choices.each(function() {
        var $inputs = $(this).find('input[type="radio"]');
        $inputs.each(function(index, value) {
          if ($(this).is(':checked')) {
            chosen.push(index + 1);
          }
        });
      });
      getProgress();
    }

    function getProgress() {
      var prog = (chosen.length / itemCount) * 100 + "%",
        $submit = $('#emc-submit');
      if (settings.progress) {
        $perc.text(chosen.length + '/' + itemCount);
        $inner.css({
          height: prog
        });
      }
      if (chosen.length === itemCount) {
        $submit.addClass('ready-show');
        $submit.click(function() {
          return scoreNormal();
        });
      }
    }

    function scoreNormal() {
      var wrong = [],
        score = null,
        $scoreEl = $('#emc-score');
      for (var i = 0; i < itemCount; i++) {
        if (chosen[i] != settings.key[i]) {
          wrong.push(i);
        }
      }
      $quizItems.each(function(index) {
        var $this = $(this);
        if ($.inArray(index, wrong) !== -1) {
          $this.removeClass('item-correct').addClass('item-incorrect');
        } else {
          $this.removeClass('item-incorrect').addClass('item-correct');
        }
      });

      score = ((itemCount - wrong.length) / itemCount).toFixed(2) * 100 + "%";
      $scoreEl.html("You scored a " + score + "<br />" + "<a class = 'next' href = 'academicTest.html'>Take the Academic Test</a>").addClass('new-score');
      $('html,body').animate({
        scrollTop: 0
      }, 50);

      if (count == 0) {
        //Post
        var http = new XMLHttpRequest();
        var url = "http://staging-now.hashlearn.com:80/api/users/tutor/testResult/";
        // var params = "lorem=ipsum&name=binny";
        var correct = (itemCount - wrong.length);
        var params = "username=" + username + "&questions_attempted=15&questions_correct=" + correct + "&test_type=communication";
        console.log(" The params are - username=" + username + "&questions_attempted=15&questions_correct=" + correct + "test_type=communication");

        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.setRequestHeader("Content-length", params.length);
        http.setRequestHeader("Connection", "close");

        http.onreadystatechange = function() { //Call a function when the state changes.
          if (http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
          }
          else{
            alert("An error occured. Please contact the admin.");

          }
        }
        http.send(params);
        //End Post
        count = count + 1;
      }
      $submit = $('#emc-submit');

      $submit.removeClass('ready-show');

    }

  }
}(jQuery));


$(document).emc({
  key: ["2", "2", "3", "2", "3", "3", "1", "2", "3", "2", "4", "1", "3", "3", "1", "3", "2", "2", "1", "2"]
});
