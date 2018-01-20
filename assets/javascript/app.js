// Initialize Firebase
var config = {
    apiKey: "AIzaSyCA2fFb9VqaHrOXvHmhC0kkX44xOyB1kTY",
    authDomain: "trainscheduler-dcac1.firebaseapp.com",
    databaseURL: "https://trainscheduler-dcac1.firebaseio.com",
    projectId: "trainscheduler-dcac1",
    storageBucket: "trainscheduler-dcac1.appspot.com",
    messagingSenderId: "662389390493"
  };
  firebase.initializeApp(config);

//create a variable to reference firebase
var database = firebase.database();

//create a reference to the root of database  and child to store train time details
var trainSched = firebase.database().ref().child('trainSched');
var trainId = 0;
// var mins = "";

//Set initial date/time and update it every second
$("#current-time").html(moment().format('dddd, MMMM Do YYYY, h:mm:ss A'));
setInterval(function(){
  $("#current-time").html(moment().format('dddd, MMMM Do YYYY, h:mm:ss A'));
}, 1000);

//Calculate how many minutes until next full minute
var time = new Date();
var secondsRemaining = (60 - time.getSeconds()) * 1000 - time.getMilliseconds();

//Capture button click
$("#submit").on("click", function(event){
  //Don't refresh the page
  event.preventDefault();

  //Store and retreive data from form input
  var trainNameInput = $("#train-name-input").val().trim();
  var destinationInput = $("#destination-input").val().trim();
  var firstTrainInput = $("#first-train-input").val().trim();
  var frequencyInput= $("#frequency-input").val().trim();

  //Log for testing
  console.log(trainNameInput);
  console.log(destinationInput);
  console.log(firstTrainInput);
  console.log(frequencyInput);

  //Assign variable to new object
  var newTrain = {
    trainName: trainNameInput,
    destination: destinationInput,
    frequency:frequencyInput,
    firstTrain:firstTrainInput,
    mins:0,
  }
  //pushing newTrain object to firebase
  database.ref().push(newTrain);
  //Clears form inputs
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});


//When a new child added execute the following
database.ref().on("child_added", function(snapshot, prevChildKey){
  //assign variables to snapshots
  var trainName = snapshot.val().trainName;
  var destination = snapshot.val().destination;
  var firstTrain = snapshot.val().firstTrain;
  var frequency = snapshot.val().frequency;

  //assign variables to moment information
  //First train time pushed back one year to make sure it comes before the current time
  var firstTrainConvert = moment(firstTrain, "kk:mm").subtract(1, "years");
  console.log(firstTrainConvert);

  //Difference between times
  var timeDiff = moment().diff(moment(firstTrainConvert), "minutes");
  console.log("Difference in time: "  + timeDiff);

  //Time apart (remainder)
  var timeRemain =  timeDiff % frequency;
  console.log(timeRemain);

  //minutes until next train
  var mins = frequency - timeRemain;
  //Save minute variable to database
  // database.ref(snapshot.key + "/mins").set(mins);
  console.log("Minutes until train: " + mins);

  //next train
  var nextT = moment().add(mins, "minutes");

  //next train formatted to 24hr/military time
  var nextTrain= moment(nextT).format("kk:mm");
  console.log("Arrival time: " + nextTrain);

  //Update trains each minute
  function updateArrivalTimes(){
    // mins--;
    database.ref(snapshot.key + "/mins").set(mins);

    $(".trainRow").each(function(){
      if (mins <= 0){
        console.log("minutes = 0");
        console.log(mins);
        $('.mins').text(frequency);
        database.ref(snapshot.key + "/mins").set(frequency);
      } else {
          console.log("wait.");
          console.log(mins);
          $('.mins').text(mins);
      }
    });
  };

  //Append train info to the table
  var row = $("<tr class ='trainRow' id='train" + trainId +"'>")
    .append($("<td>" + trainName + "</td>"))
    .append($("<td>" + destination + "</td>"))
    .append($("<td>" + firstTrain + "</td>"))
    .append($("<td>" + frequency + "</td>"))
    .append($("<td class='next'>" + nextTrain + "</td>"))
    .append($("<td class='mins' id=mins" + trainId +"'>" + mins + "</td>"));
  var deleteButton = $("<button>").addClass("btn-danger");
    deleteButton.attr("id", "remove");
    deleteButton.attr("data-key", snapshot.key);
    deleteButton.html("Remove");

  row.append($('<td>').append(deleteButton));
  $(".table").append(row);
  trainId++;

  //Use timeout to start the interval at the next full minute
  setTimeout(function(){
    //run initially, then again every minute
    updateArrivalTimes();
    setInterval(function(){
      updateArrivalTimes();
    }, 60000);
  }, secondsRemaining);
//error handler
},function(errorObject){
    console.log("The read failed: " + errorObject.code);
});

//Set Remove button to delete assigned table row
$(document).on('click', '.btn-danger', function() {
  var removekey = $(this).attr('data-key');
  var currentRow = (this).closest('tr');
  console.log(removekey);
  database.ref().child(removekey).remove();
  console.log("child removed.")
  currentRow.remove();
}); 



