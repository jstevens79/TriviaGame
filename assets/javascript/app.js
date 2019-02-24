

// set up a new game
var game = {
  loaded: false,
  gameStarted: false,
  score: 0,
  totalQuestions: 12,
  currentQuestion: 0,
  currentTimer: '',
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
  getQuestions: function() {
    // get the json
    $.getJSON( "./assets/javascript/trivia-data.json", function(data) {
      var results = data.results;
      var randomNumbers = [];

      while (randomNumbers.length < this.totalQuestions) {
        var rando = Math.floor(Math.random() * results.length);
        if (!randomNumbers.includes(rando)) {
          randomNumbers.push(rando)
        }
      }

      $.each(randomNumbers, function( key, val ) {
        var theQ = results[val];
        theQ.answered = null;
        game.questions.push(theQ);
      });

      this.setupQuestion()

    }.bind(this));    

  },
  setupGame: function() {
    var gameWrapper = $('<div>').addClass('gameWrapper');
    var questionsContainer = $('<div>').addClass('questionContainer');
    gameWrapper.append(questionsContainer);
    $('body').prepend(gameWrapper);
  },
  setupQuestion: function() {
    var theQ = this.questions[this.currentQuestion];
    console.log(theQ)
    var questionTxt = $('<p>').addClass('questionText').html(theQ.question);
    var answers = [];

    var correct = {answer: theQ.correct_answer, correct: true }
    answers.push(correct);

    $.each(theQ.incorrect_answers, function(ind, val){
      var incorrect = {answer: val, correct: false}
      answers.push(incorrect);
    })

    $('.questionContainer').append(questionTxt)

    $.each(answers, function(ind, val){
      var myAnswer = $('<div>').attr('data-answer', ind).text(val.answer);
      $('.questionContainer').append(myAnswer)
    })

    
    
  }
}


$(document).ready(function() {

  game.startGame()

})