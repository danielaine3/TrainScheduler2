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
	console.log("Difference in time: "	+timeDiff);
	//Time apart (remainder)
	var timeRemain =  timeDiff % frequency;
	console.log(timeRemain);
	//minutes until train
	var mins = (frequency - timeRemain);
	console.log("Minutes until train: " + mins);
	//next train
	var nextT = moment().add(mins, "minutes");
	//next train formatted to 24hr/military time
	var nextTrain= moment(nextT).format("kk:mm");
	console.log("Arrival time: " + nextTrain);
	//Append train info to the table
	$(".table").append("<tr><td>" + trainName + "</td><td>" 
		+ destination + "</td><td>" + firstTrain + "</td><td>" + frequency + 
		"</td><td>" + nextTrain + "</td><td>" + mins + "</td></tr>");
});