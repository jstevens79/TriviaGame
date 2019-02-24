

// set up a new game
var game = {
  loaded: false,
  gameStarted: false,
  score: 0,
  totalQuestions: 12,
  currentQuestion: 0,
  currentTime: 0,
  currentTimer: '',
  maxTime: 30,
  questions: [],
  startGame: function() {
    // set up the initial variables
    this.loaded = false;
    this.gameStarted = false;
    this.score = 0;
    this.totalQuestions = 12;
    this.currentQuestion = 0;
    this.currentTimer = '';
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
  getQuestions: function() {
    // get the json
    $.getJSON( "./assets/javascript/trivia-data.json", function(data) {
      var results = data.results;
      this.shuffle(results);

      for (var i = 0; i < this.totalQuestions; i++) {
        results[i].answered = null;
        results[i].questionTime = 0;
        results[i].questionTimer = null;
        results[i].startTimer = function(){
          results[i].questionTimer = setInterval(function() {
            this.questionTime += 1;
            console.log(this.questionTime)
            if (this.questionTime === 5) {
              this.stopTimer();
            }
          }.bind(this), 1000);
        };
        results[i].stopTimer = function() {
          clearInterval(results[i].questionTimer);
          console.log('stop');
        };
        results[i].answers = [];

        var correct = {answer: results[i].correct_answer, correct: true};
        results[i].answers.push(correct);

        $.each(results[i].incorrect_answers, function(ind, val){
          var incorrect = {answer: val, correct: false}
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
    var questionsContainer = $('<div>').addClass('questionContainer');
    gameWrapper.append(questionsContainer);
    $('body').prepend(gameWrapper);
  },
  setupQuestion: function() {
    // write to dom
    var theQ = this.questions[this.currentQuestion];
    var questionTxt = $('<p>').addClass('questionText').html(theQ.question);

    $('.questionContainer').append(questionTxt);
    
    $.each(theQ.answers, function(ind, val){
      var myAnswer = $('<div>')
        .attr('data-answer', ind)
        .addClass('answer')
        .html(val.answer);
      $('.questionContainer').append(myAnswer)
    });

    // start the timer
    theQ.startTimer();

    // listen for events

    $('.answer').click(function() {
      //$('.answer').off(); <--------------------- re-enable this

      if (answers[$(this).data('answer')].correct) {
        // do stuff if it's correct
      } else {
        //do stuff if it's wrong
      }
      
    });
    
  }
}


$(document).ready(function() {

  game.startGame()

})