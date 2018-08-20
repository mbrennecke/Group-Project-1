$(document).ready(function() {
	$("#map-canvas").hide();
	});

 var placeId = "ChIJTWY5tdOaa4cRrfqurdOVGUQ";


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
					var placeId = response.candidates[0].place_id;
					googleReviewCall(placeId);
					mapMaker(placeId);
					break;
				case 2:
						console.log(queryURL);
						for (var i = 0; i<response.result.opening_hours.weekday_text.length; i++) {
							$("#hours").append("<p>" + response.result.opening_hours.weekday_text[i] + "</p>");
						};
						
						var rating = Math.floor(response.result.rating);
						for (var i=0; i<rating; i++){
							$("#stars").append("&#11088;");
						}
						
					break;
				default:
					break;
			}
		});
	}
	
	function mapMaker() {
		
	$("#map-canvas").show();
		var map;
var infoWindow;
var service;

function initialize() {
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
    var marker = new google.maps.Marker({
      map: map,
      position: result.geometry.location
    });
    var address = result.adr_address;
    var newAddr = address.split("</span>,");

    infoWindow.setContent(result.name + "<br>" + newAddr[0] + "<br>" + newAddr[1] + "<br>" + newAddr[2]);
    infoWindow.open(map, marker);
  });

}

google.maps.event.addDomListener(window, 'load', initialize);
	}

	function googleReviewCall() {
		var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeId +"&fields=name,rating,formatted_phone_number,opening_hours,price_level,reviews&key=AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A";
		googleAPICall(queryURL, 2);
	}
	
	$(document).on("click", "a", function(event) {
		$("#stars").empty();
		$("#hours").empty();
		var locId = $(this).attr("id");
		var locIdNum = locId.replace("item", "");
		var locIdNumParsed = parseInt(locIdNum);
		var googleAddr = newArr[locIdNumParsed].name + "%20" + newArr[locIdNumParsed].street + "%20" + newArr[locIdNumParsed].city + "%20" + newArr[locIdNumParsed].state;
		var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + googleAddr + "&inputtype=textquery&fields=place_id,geometry&key=AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A"; 
		googleAPICall(queryURL, 1);
		
	});
	
	

