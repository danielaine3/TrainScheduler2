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

//create a referene to the root of database  and child to store train time details
var trainSched = firebase.database().ref().child('trainSched');

moment().format
var militaryFormat = 'KK:mm';

var date = null;


//FUNCTIONS

//Update current date and time
var updatedTime = function(){
  date = moment();
  $("#current-time").html(date.format('dddd, MMMM Do YYYY, h:mm:ss A'));

};

/*This function received the firebase snapshot and uses it to calculate the next train
and minutes to arrive. It updates the table with data received*/

function updateData(snapshot){

    //Assign variable to new object
    var newTrain = {
      trainName: snapshot.val().trainName,
      nextTrain: null,
      mins:0

    };

    //Log current time
    var currentTime = moment();
    console.log("current time is: " + currentTimt.format('KK.mm'));

    //declare variables
    var firstTrain = moment(snapshot.val().firstTrain, militaryFormat);
    console.log("First train departure for " + snapshot.val().trainName + 
      "in military time: " + firstTrain.format('KK.mm'));

    var nextTrain;
    var timeRemain;
    var mins;
    var timeDiff;

    //If the first train time is in future, display next train time as first train time
    //Else calculate next train time
    if (firstTrain.isAfter(currentTime)){
      console.log("first train time is in future.");

      //Next train times is same as first train time
      var nextTrain = firstTrain;
      console.log("Next train time for " + snapshot.val().trainName + ": " + mins);
    }else{
      console.log("Test time is in past");

      //Difference between times
      var timeDiff = currentTime.diff(firstTrain, 'minutes');
      console.log("Difference in time: "  +timeDiff);

      //Time apart (remainder)
      var timeRemain =  timeDiff % frequency;
      console.log(timeRemain);

      //minutes until train
      var mins = (frequency - timeRemain);
      console.log("Minutes until train: " + mins);

      //next train
      var nextT = currentTime.add(mins, "minutes");
      console.log("NextT")
    }

    newTrain.nextTrain = nextTrain;
    newTrain.mins = mins;

    return trainVar;

}

//Update the train times once every minute
function updateTrainTime(){
  console.log("---------------------------------");
  console.log("Updating train time once for every minute");
  trainSched.once('value', function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var newTrain = {
        trainName: snapshot.val().trainName,
        nextTrain: null,
        frequency: 0
      };

      newTrain = updateData(childSnapshot);

      var idTrainTime = childSnapshot.val().trainName.substr(0,3) + "Next";
      console.log(idTrainTime);
      var idMin = childSnapshot.val().trainName.substr(0,3) + "min";

      $("#" + idTrainTime).html(newTrain.nextTrain.format('KK.mm A'));
      $("#" + idMin).html.newTrain.mins;

    });
  });

}

//----------------
//Display current date/time
$(document).ready(function(){
  updatedTime();
  setInterval(updatedTime, 1000);

  //update the train times once every minute
  setInterval(updateTrainTime, 1000 * 10);

});

//Load all old and new rows to train schedule table
trainSched.on("child_added", function(snapshot){
  //Testing and debugging. testTime in military time
  var testTime = moment('10:00', militaryFormat);
  console.log("Test time in military forman: " +testTime.forman('KK:mm'));

  var newTrain = {
    trainName: snapshot.val().trainName,
    nextTrain: null,
    frequency: 0
  };

  //Call function updateData to update the train table
  newTrain = updateData(snapshot);
  console.log(newTrain);

  //Log snapshot
  console.lg("Added: " +snapshot.val());

  //Calculate next train time and minutes to next train
  var html = '';

  var idTrainTime = childSnapshot.val().trainName.substr(0,3) + "Next";
  console.log(idTrainTime);
  var idMin = childSnapshot.val().trainName.substr(0,3) + "min";

  //Append train info to the table
  $(".table").append("<tr><td>" + trainName + "</td><td>" 
    + destination + "</td><td>" + firstTrain + "</td><td>" + frequency + 
    "</td><td>" + nextTrain + "</td><td>" + mins + "</td></tr>");

});

//---------------
//---------------

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

    var newTrain = {
      trainName: trainNameInput,
      destination: destinationInput,
      frequency:frequencyInput,
      firstTrain:firstTrainInput,
    }

  	//pushing newTrain object to firebase
  	database.ref().push(newTrain);
  	//Clears form inputs
  	$("#train-name-input").val("");
  	$("#destination-input").val("");
  	$("#first-train-input").val("");
  	$("#frequency-input").val("");
});

// //When a new child added execute the following
// database.ref().on("child_added", function(snapshot, prevChildKey){

// 	//assign variables to snapshots
// 	var trainName = snapshot.val().trainName;
// 	var destination = snapshot.val().destination;
	
// 	var frequency = snapshot.val().frequency;

// 	//assign variables to moment information
// 	//First train time pushed back one year to make sure it comes before the current time
// 	var firstTrainConvert = moment(firstTrain, "kk:mm").subtract(1, "years");
// 	console.log(firstTrainConvert);



// 	//next train formatted to 24hr/military time
// 	var nextTrain= moment(nextT).format("kk:mm");
// 	console.log("Arrival time: " + nextTrain);

// 	//Append train info to the table
// 	$(".table").append("<tr><td>" + trainName + "</td><td>" 
// 		+ destination + "</td><td>" + firstTrain + "</td><td>" + frequency + 
// 		"</td><td>" + nextTrain + "</td><td>" + mins + "</td></tr>");
// });




