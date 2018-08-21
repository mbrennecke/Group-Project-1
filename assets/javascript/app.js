$(document).ready(function() {
	
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
  
  
	$("#map-canvas").hide();
	$("#no-city").hide();
	

 var placeId = "ChIJTWY5tdOaa4cRrfqurdOVGUQ";
	var userId = localStorage.getItem("username");
var x = document.cookie;

var audio = new Audio ("../Group-Project-1/assets/sounds/beersound.mp3")
var beermapAPI = "7d9d88201b9b82b413a7691e626322bc";

var googleMap = "AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A";
var returnedObject;
var newArr = [];
var maps = "";
var reviews = "";
var map;
				var infoWindow;
				var service;

			


//this function listens for click event of form to search city
	$("#submit").on("click", function (event) {
		event.preventDefault();
		$("#no-city").hide();
		if ($("#city").val() == ""){
			return;
		}
		audio.play(audio);
		var city = $("#city").val().trim();
		$("#city").val("");


		var queryURL = "http://beermapping.com/webservice/loccity/" + beermapAPI + "/"+ city +"&s=json";

		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			$("#brew-list").empty();
			newArr = [];
			returnedObject = response;
			if (response[0].city == null) {
				$("#bad-city").append(city);
				$("#no-city").show();
				
			}
			for (var i=0; i<response.length; i++){
				if (response[i].status == "Brewpub" || response[i].status == "Brewery") {
					newArr.push(response[i]);
				}	
			}
			for (var i=0; i<newArr.length; i++){
				var linkId = "item" + i;
				$("#brew-list").append("<p><a href='#' class='beer-link' id='"+ linkId +"'>" + newArr[i].name + "</a><br><span class='address'>" + newArr[i].street + "<br>" + newArr[i].city + ", " + newArr[i].state + "</span></p>");
			}

		}).catch(function (error) {
			console.log(error);
		})

	
	});
	
	function googleAPICall(queryURL, call) {
		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			switch(call) {
				case 1:
					placeId = response.candidates[0].place_id;
					
					googleReviewCall();
					
					break;
				case 2:
						$("#hours").append('<p>Hours:</p>');
						$("#hours").append('<ul id="hours-list">');
						for (var i = 0; i<response.result.opening_hours.weekday_text.length; i++) {
							$("#hours-list").append('<li>' + response.result.opening_hours.weekday_text[i] + "</li>");
						};
						
						$("#review").append("<p>Review:</p>");
						$("#review").append("<p>"+response.result.name +"<br>"+response.result.formatted_address+"</p>");
						$("#review").append("<p id='stars'>");
						$("#stars").append("Rating ");
						var rating = Math.floor(response.result.rating);
						
						for (var i=0; i<rating; i++){
							$("#stars").append("&#11088;");
							
						}
						$("#review").append('<button type="button" class="btn btn-light" id="fav-btn">Add to Favs</button>');
						initialize();
					break;
				default:
					break;
			}
		});
	}
	
	
		
			
				

				function initialize() {
					$("#map-canvas").show();
				  var mapOptions = {
					zoom: 15,
					center: new google.maps.LatLng(39.7392, 104.9903)
				  };
				  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

				  infoWindow = new google.maps.InfoWindow();
				  var service = new google.maps.places.PlacesService(map);
				  
				  service.getDetails({
					placeId: placeId
				  }, function(result, status) {
					if (status != google.maps.places.PlacesServiceStatus.OK) {
					  alert(status);
					  return;
					}
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

				
			

			function googleReviewCall() {
				var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeId +"&fields=name,rating,address_components,formatted_address,formatted_phone_number,opening_hours,price_level,reviews&key=AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A";
				googleAPICall(queryURL, 2);
			}
	
	$(document).on("click", "a", function(event) {
		
		$("#review").empty();
		$("#hours").empty();
		var locId = $(this).attr("id");
		var locIdNum = locId.replace("item", "");
		var locIdNumParsed = parseInt(locIdNum);
		var googleAddr = newArr[locIdNumParsed].name + "%20" + newArr[locIdNumParsed].street + "%20" + newArr[locIdNumParsed].city + "%20" + newArr[locIdNumParsed].state;
		var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + googleAddr + "&inputtype=textquery&fields=place_id,geometry&key=AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A"; 
		googleAPICall(queryURL, 1);
		
	});
	var userVal = database.ref("/userID");
	var userFavsDB = database.ref("/favs");
	var checkVal = true;
	var userFavs = [];

	function userFavsUpdate() {
		userVal.child(userId).once('value', function(snapshot) {
		var exists = (snapshot.val() !== null);
		if (exists) {
					alert('user ' + userId + ' exists!');
				  } else {
					alert('user ' + userId + ' does not exist!');
				  }
		});
	}
	
	var onIce = false;
	
	$(document).on("click", "#fav-btn", function(event) {
		if (onIce) {
		
		if (userFavs.indexOf(placeId) < 0){
			userFavs.push(placeId);
			}
			//var query = userVal.orderByChild("user");
			 userVal.orderByChild("user").equalTo(userId).on("child_added", function(snapshot) {
				  console.log(snapshot.key);
				});
		
			if (checkVal){
				userId = Date.now();
				//document.cookie = "username=" + userId + "; expires=Fri, 23 Aug 2019 00:00:00 UTC;";
				localStorage.setItem("username", userId);
				userVal.push({
					user:userId,
					favs: userFavs		
				});
			}
		}
			
		
			if (userFavs.indexOf(placeId) < 0){
				userFavs.push(placeId);
				userFavsDB.push({
					favs: placeId
				});
			}
			userVal.on("child_added", function(childSnapshot){
				append
			});
		
			});
			
	
	
	});