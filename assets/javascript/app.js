

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
  },
  getQuestions: function() {
    // get the json
    $.getJSON( "./assets/javascript/trivia-data.json", function(data) {
      var results = data.results;
      this.shuffle(results);
      var questions = results.slice(0, this.totalQuestions);

      $.each(questions, function(ind, val) {
        var newObj = {
          answered: null, // <- may not need this...
          questionTime: game.maxTime,
          questionTimer: null,
          startTimer: function() {
            this.questionTimer = setInterval(function() {
              this.questionTime -= 1;
              game.renderTimer(this.questionTime);
              if (this.questionTime === 0) {
                this.answered = true; // <- may not need this...
                this.stopTimer();
              }
            }.bind(this), 1000)
          },
          stopTimer: function() {
            clearInterval(this.questionTimer)
          },
          answers: []

        }

        var correct = {answer: val.correct_answer, correct: true, selected: false};
        newObj.answers.push(correct);

        $.each(val.incorrect_answers, function(ind, ans) {
          var incorrect = {answer: ans, correct: false, selected: false}
          newObj.answers.push(incorrect);
        })

        game.shuffle(newObj.answers);
        var combined = {...val,...newObj};

        game.questions.push(combined);

      })


      this.setupQuestion();

    }.bind(this));    

  },
  setupGame: function() {
    var title = $('<h1>')
      .addClass('title')
      .html('<i class="fas fa-star"></i> Movie Trivia <i class="fas fa-star"></i>');
    var gameWrapper = $('<div>').addClass('gameWrapper');
    var questionArea = $('<div>').addClass('questionArea');
    var responseContainer = $('<div>').addClass('responseContainer');
    var questionsContainer = $('<div>').addClass('questionContainer');
    questionArea.append(questionsContainer, responseContainer)
    var timer = $('<div>').addClass('timerContainer').append(this.createTimer());
    gameWrapper.append(questionArea, timer);
    $('body').prepend(title, gameWrapper);
  },
  createTimer: function() {
    var timer = $('<div>').addClass('timer');
    var timerText = $('<span>').addClass('timerText').append('00:00');
    var clockWrapper = $('<div>').addClass('clockWrapper');
    var clockInner = $('<div>').addClass('clockInner');
    var clockHand = $('<div>').addClass('clockHand');
    clockWrapper.append(clockInner, clockHand);
    var clockContainer = $('<div>').addClass('clockContainer').append(clockWrapper);
    timer.append(timerText, clockContainer);
    return timer;
  },
  setupQuestion: function() {
    $('.questionContainer').empty();
    $('.responseContainer').empty();
    this.renderTimer(this.maxTime);
    var theQ = this.questions[this.currentQuestion];
    var questionTxt = $('<p>').addClass('questionText').html(theQ.question);
    var answers = $('<div>').addClass('answersContainer');
    $('.questionContainer').append(questionTxt, answers);
    
    this.renderAnswers();

    console.log(theQ)

    // start the timer
    theQ.startTimer();

    // handle clicks
    $('.answer').click(function() {
      // put all of this logic back into the question object
      theQ.stopTimer();
      $('.answer').off();
      theQ.answers[$(this).data('answer')].selected = true;

      game.renderAnswers(true);

      if (theQ.answers[$(this).data('answer')].correct) {
        $('.responseContainer').text('Good job!');
      } else {
        var getCorrect = theQ.answers.filter(function(ques){
          return ques.correct === true
        })

        setTimeout(function() {
          $('.responseContainer').text('No, the correct answer was ' + getCorrect[0].answer);
        }, 1000)

        
      }     
      
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
            myAnswer.addClass('disabled wrong')
          }
        }

      }

      $('.answersContainer').append(myAnswer)
    });

    if (grade !== undefined) {
      setTimeout(function(){
        game.goToNextQuestion();
      }, 1200)
    }
    
  },
  goToNextQuestion: function() {
     // next question test
     setTimeout(function() {
      game.currentQuestion += 1;
      game.setupQuestion();
    }, 3000);
  }
}


$(document).ready(function() {
  game.startGame()
})