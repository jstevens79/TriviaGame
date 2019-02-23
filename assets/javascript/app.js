

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
    $.getJSON( "./assets/javascript/trivia-data.json", function( data ) {
      
      // get 12 random questions and push them to this.questions

      // $.each( data, function( key, val ) {
      //   console.log(val)
      // });
    });    

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
  }

}







$(document).ready(function() {


  console.log('get started');


})