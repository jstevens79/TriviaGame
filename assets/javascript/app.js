

// set up a new game
var game = {
  loaded: false,
  gameStarted: false,
  score: 0,
  totalQuestions: 12,
  currentQuestion: 0,
  maxTime: 20,
  questions: [],
  startGame: function() {
    // set up the initial variables
    this.loaded = false;
    this.gameStarted = false;
    this.score = 0;
    this.totalQuestions = 12;
    this.currentQuestion = 0;
    this.questionsAnswered = [];
    this.setupGame();
    this.getQuestions();

  },
  shuffle: function(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  },
  renderTimer: function(time) {
    function timeConvert() {
      if (time < 10) {
        return '0' + time;
      }
      return time;
    }
    
    $('.timerText').text('00:' + timeConvert());
    $('.clockHand').css({
      'transform' : 'translateX(-50%) rotate(' + (time * 6) + 'deg)'
    })
    //$('.timer').text(time);
  },
  getQuestions: function() {
    // get the json
    $.getJSON( "./assets/javascript/trivia-data.json", function(data) {
      var results = data.results;
      this.shuffle(results);

      for (var i = 0; i < this.totalQuestions; i++) {
        results[i].answered = null;
        results[i].questionTime = game.maxTime;
        results[i].questionTimer = null;
        results[i].startTimer = function(){
          results[i].questionTimer = setInterval(function() {
            this.questionTime -= 1;
            game.renderTimer(this.questionTime);
            if (this.questionTime === 0) {
              this.stopTimer();
            }
          }.bind(this), 1000);
        };
        results[i].stopTimer = function() {
          clearInterval(results[i].questionTimer);
          console.log('stop');
        };
        results[i].answers = [];

        var correct = {answer: results[i].correct_answer, correct: true, selected: false};
        results[i].answers.push(correct);

        $.each(results[i].incorrect_answers, function(ind, val){
          var incorrect = {answer: val, correct: false, selected: false}
          results[i].answers.push(incorrect);
        })

        this.shuffle(results[i].answers);

        game.questions.push(results[i]);
      }

      this.setupQuestion();

    }.bind(this));    

  },
  setupGame: function() {
    var gameWrapper = $('<div>').addClass('gameWrapper');
    var timer = $('<div>').addClass('timerContainer').append(this.createTimer());
    var questionsContainer = $('<div>').addClass('questionContainer');
    gameWrapper.append(timer, questionsContainer);
    $('body').prepend(gameWrapper);
  },
  createTimer: function() {
    var timer = $('<div>').addClass('timer');
    var timerText = $('<span>').addClass('timerText').append('00:00');
    var clockWrapper = $('<div>').addClass('clockWrapper');
    var clockInner = $('<div>').addClass('clockInner');
    var clockHand = $('<div>').addClass('clockHand');
    clockWrapper.append(clockInner, clockHand);
    timer.append(timerText, clockWrapper)
    return timer;
  },
  setupQuestion: function() {
    $('.questionContainer').empty();
    this.renderTimer(this.maxTime);
    var theQ = this.questions[this.currentQuestion];
    var questionTxt = $('<p>').addClass('questionText').html(theQ.question);
    var answers = $('<div>').addClass('answersContainer');
    $('.questionContainer').append(questionTxt, answers);
    
    this.renderAnswers();

    // start the timer
    theQ.startTimer();

    // handle clicks
    $('.answer').click(function() {
      theQ.stopTimer();
      $('.answer').off();
      theQ.answers[$(this).data('answer')].selected = true;

      game.renderAnswers(true);

      if (theQ.answers[$(this).data('answer')].correct) {
        //$(this).append('<i class="far fa-check-circle"></i>');
        
      } else {
        //$(this).append('<i class="far fa-times-circle"></i>');

      }

      // next question test
      setTimeout(function() {
        game.currentQuestion += 1;
        game.setupQuestion()
      }, 3000);
      
    });
    
  },
  renderAnswers: function(grade) {

    var answers = this.questions[this.currentQuestion].answers;
    $('.answersContainer').empty();
    
    $.each(answers, function(ind, val){

      var myAnswer = $('<div>')
        .attr('data-answer', ind)
        .addClass('answer')
        .html(val.answer); 

      if (grade !== undefined) {
        if (val.selected) {
          if (val.correct) {
            myAnswer.addClass('disabled selected correct');
          } else {
            myAnswer.addClass('disabled selected wrong');
          }
        } else {
          if (val.correct) {
            myAnswer.addClass('disabled unselected correct')
          } else {
            myAnswer.addClass('disabled')
          }
        }
      }
      
        
      $('.answersContainer').append(myAnswer)
    });
  }
}


$(document).ready(function() {
  game.startGame()
})