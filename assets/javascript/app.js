$(document).ready(function () {
	//initialize firebase database
	var config = {
		apiKey: "AIzaSyBtF6DH3zWElPvboPT3NLs2yGIQPG8xfE8",
		authDomain: "beer-bound-69b80.firebaseapp.com",
		databaseURL: "https://beer-bound-69b80.firebaseio.com",
		projectId: "beer-bound-69b80",
		storageBucket: "beer-bound-69b80.appspot.com",
		messagingSenderId: "445520032555"
	};
	firebase.initializeApp(config);


	var database = firebase.database();

	//hides alert when a city is not found or bad data is entered
	$("#no-city").hide();

	//variable for the place id for google
	var placeId;
	//sound when search is run
	var audio = new Audio("../Group-Project-1/assets/sounds/beersound.mp3")
	var beermapAPI = "7d9d88201b9b82b413a7691e626322bc";

	var googleMap = "AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A";
	//global variable for the API response
	var returnedObject;
	//array for storing only breweries and brewpubs returned from BeermapAPI
	var newArr = [];

	//variables need by Google maps API
	var map;
	var infoWindow;
	var service;
	//global to use in favorites list
	var faveBrew;



	//this function listens for click event of form to search city
	$("#submit").on("click", function (event) {
		event.preventDefault();
		//clear data windows on new search
		$("#brew-list").empty();
		$("#review").empty();
		$("#hours").empty();
		$("#map-canvas").empty();
		//hides the bad city alert
		$("#no-city").hide();
		//if no data is entered, the search is not run
		if ($("#city").val() == "") {
			return;
		}
		//"pop, kuuuuuuusshhhhhhhh" on search
		audio.play(audio);
		var city = $("#city").val().trim();
		//resets the city search input
		$("#city").val("");

		//Beer maps query
		var queryURL = "https://beermapping.com/webservice/loccity/" + beermapAPI + "/" + city + "&s=json";
		//call to beer maps api
		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			//clear data windows on new search
			$("#brew-list").empty();
			
			//empty the array of breweries
			newArr = [];
			//set the response 
			returnedObject = response;
			//if bad city or no city entered, show error message
			if (response[0].city == null) {
				$("#bad-city").append(city);
				$("#no-city").show();

			}
			//create array of brewpubs and breweries
			for (var i = 0; i < response.length; i++) {
				if (response[i].status == "Brewpub" || response[i].status == "Brewery") {
					newArr.push(response[i]);
				}
			}
			//format and show list of breweries
			for (var i = 0; i < newArr.length; i++) {
				//creates an id on each item with its index
				var linkId = "item" + i;
				$("#brew-list").append("<p><a href='#' class='beer-link' id='" + linkId + "'>" + newArr[i].name + "</a><br><span class='address'>" + newArr[i].street + "<br>" + newArr[i].city + ", " + newArr[i].state + "</span></p>");
			}

		}).catch(function (error) {
			console.log(error);
		})


	});
	
	//click event when user clicks on a brewery in the list
	$(document).on("click", ".beer-link", function (event) {
		//clears out data windows
		$("#review").empty();
		$("#hours").empty();
		$("#map-canvas").empty();
		//gets id from element
		var locId = $(this).attr("id");
		//removes "item" from the id to just get the number
		var locIdNum = locId.replace("item", "");
		//makes the id number an integer
		var locIdNumParsed = parseInt(locIdNum);
		//uses id number as array index
		var googleAddr = newArr[locIdNumParsed].name + "%20" + newArr[locIdNumParsed].street + "%20" + newArr[locIdNumParsed].city + "%20" + newArr[locIdNumParsed].state;
		//creates the query url to send to google, with parameters to be returned
		var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + googleAddr + "&inputtype=textquery&fields=place_id,geometry&key=AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A";
		googleAPICall(queryURL, 1);

	});	

	//call to google maps and places
	function googleAPICall(queryURL, call) {
		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			//needed to research callbacks to make this not needed
			switch (call) {
				//call to google maps to get the place id
				case 1:
					placeId = response.candidates[0].place_id;
					googleReviewCall();
					break;
				//call from google places for review information data
				case 2:
					//creates the hours list
					$("#hours").append('<ul id="hours-list">');
					for (var i = 0; i < response.result.opening_hours.weekday_text.length; i++) {
						$("#hours-list").append('<li>' + response.result.opening_hours.weekday_text[i] + "</li>");
					};
					//shows address for the place
					$("#review").append("<p>" + response.result.name + "<br>" + response.result.formatted_address + "</p>");
					faveBrew = response.result.name;
					//creates the stars in the review based on google rating					
					$("#review").append("<p id='stars'>");
					$("#stars").append("Rating ");
					//google rating can be a decimal number, this makes it a whole
					var rating = Math.floor(response.result.rating);
					for (var i = 0; i < rating; i++) {
						$("#stars").append("&#11088;");
					}
					//adds favorites button
					$("#review").append('<button type="button" class="btn btn-light" id="fav-btn">Add to Favs</button>');
					initialize();
					break;
				default:
					break;
			}
		});
	}

	//creates api request for selected fields for google places, utilizing the place id
	function googleReviewCall() {
		var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeId + "&fields=name,rating,address_components,formatted_address,formatted_phone_number,opening_hours,price_level,reviews&key=AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A";
		googleAPICall(queryURL, 2);
	}

	//google maps map creation
	function initialize() {
		$("#map-canvas").show();
		var mapOptions = {
			zoom: 15,
			//default start centered on Denver
			center: new google.maps.LatLng(39.7392, 104.9903)
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		infoWindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);

		service.getDetails({
			placeId: placeId
		}, function (result, status) {
			if (status != google.maps.places.PlacesServiceStatus.OK) {
				alert(status);
				return;
			}
			//custom map marker in shape of beer glass
			var iconBase = {
				url: "assets/images/beermapicon.png",
				scaledSize: new google.maps.Size(30, 30),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(0, 0)
			};
			var marker = new google.maps.Marker({
				map: map,
				position: result.geometry.location,
				icon: iconBase,
			});
			var address = result.adr_address;
			var newAddr = address.split("</span>,");

			infoWindow.setContent(result.name + "<br>" + newAddr[0] + "<br>" + newAddr[1] + "<br>" + newAddr[2]);
			infoWindow.open(map, marker);
		});

	}


	
	//creates the child element in the database for favorites
	var userFavsDB = database.ref("/favs");
	//empty array for to try to limit amount of duplicates in database
	var userFavs = [];

	//listener for when favorite is to be added
	$(document).on("click", "#fav-btn", function (event) {
		//attempt to limit the duplication of favorites in a session
		if (userFavs.indexOf(placeId) < 0) {
			userFavs.push(placeId);
			//push to database of user favorites
			userFavsDB.push({
				favs: placeId,
				brewery: faveBrew
			});
		}

	});
	
	//creates list of favorites on update or page load
	database.ref("favs").on("child_added", function (childSnapshot) {
		var favBrewery = childSnapshot.val().brewery;
		$("#favs").append('<li><a href="#" class="fav-list" id="' + childSnapshot.val().favs + '">' + favBrewery + '</a></li>');
	});	

	//listener for when a favorite is clicked
	$(document).on("click", ".fav-list", function (event) {
		placeId = $(this).attr("id");
		//clears data windows
		$("#review").empty();
		$("#hours").empty();
		$("#map-canvas").empty();
		googleReviewCall();
	});





});