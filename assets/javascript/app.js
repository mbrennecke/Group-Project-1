
var audio = new Audio ("../Group-Project-1/assets/sounds/beersound.mp3")

var beermapAPI = "7d9d88201b9b82b413a7691e626322bc";


var googleMap = "AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A";
var returnedObject;
var newArr = [];
var maps = "";
var reviews = "";




//this function listens for click event of form to search city
	$("#submit").on("click", function (event) {
		event.preventDefault();
		if ($("#city").val() == ""){
			return;
		}
		audio.play(audio);
		var city = $("#city").val().trim();
		$("#city").val("");
		console.log(audio);
		yelpCity = city;

		var queryURL = "http://beermapping.com/webservice/loccity/" + beermapAPI + "/"+ city +"&s=json";


		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			$("#brew-list").empty();
			newArr = [];
			returnedObject = response;
			for (var i=0; i<response.length; i++){
				if (response[i].status == "Brewpub" || response[i].status == "Brewery") {
					newArr.push(response[i]);
				}	
			}
			for (var i=0; i<newArr.length; i++){
				var linkId = "item" + i;
				$("#brew-list").append("<p><a href='#' class='beer-link' id='"+ linkId +"'>" + newArr[i].name + "</a><br><span class='address'>" + newArr[i].street + "<br>" + newArr[i].city + ", " + newArr[i].state + "</span></p>");
			}
			//yelpState = newArr[0].state;

		}).catch(function (error) {
			console.log(error);
		})

	
	});

	$(document).on("click", "a", function(event) {

		$.ajax({
			url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name,rating,formatted_phone_number,opening_hours,price_level,reviews&key=AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A",
			method: "GET",
		}).then(function (response) {
			console.log(response);
	});
	
	});

