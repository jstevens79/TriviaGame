

// set up a new game
var game = {
  loaded: false,
  gameStarted: false,
  score: 0,
  totalQuestions: 12,
  currentQuestion: null,
  currentTimer: '',
  questions: [],
  getQuestions: function() {
    // get the json
    $.getJSON( "./assets/javascript/trivia-data.json", function(data) {

      // get [number] random questions and push them to this.questions
      var randomNumbers = [];

      // function getNum(tot) {
      //   if (randomNumbers.length < tot) {
      //     var rando = Math.floor(Math.random() * data.results.length);
      //     if (!randomNumbers.includes(rando)){
      //       randomNumbers.push(rando)
      //     }
      //     getNum(tot)
      //   }
      // }      
      
      // getNum(this.totalQuestions)

      while (randomNumbers.length < this.totalQuestions) {
        var rando = Math.floor(Math.random() * data.results.length);
        if (!randomNumbers.includes(rando)) {
          randomNumbers.push(rando)
        }
      }
      

      $.each(randomNumbers, function( key, val ) {
         console.log(val)
      });

    }.bind(this));    

  },
  startGame: function() {
    // set up the initial variables
    this.loaded = false;
    this.gameStarted = false;
    this.score = 0;
    this.totalQuestions = 12;
    this.currentQuestion = null;
    this.currentTimer = '';
    this.questionsAnswered = [];

    this.getQuestions();

  }

}



$(document).ready(function() {

  game.startGame()

})