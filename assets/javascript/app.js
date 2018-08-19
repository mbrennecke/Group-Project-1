
var audio = new Audio ("../Group-Project-1/assets/sounds/beersound.wav")

var beermapAPI = "7d9d88201b9b82b413a7691e626322bc";

var googleMap = "AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A";

var returnedObject;
var newArr = [];


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

	function googleReviewCall(placeId) {
		var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeId +"&fields=name,rating,formatted_phone_number,opening_hours,price_level,reviews&key=AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A";
		googleAPICall(queryURL, 2);
	}
	
	$(document).on("click", "a", function(event) {
		var locId = $(this).attr("id");
		var locIdNum = locId.replace("item", "");
		var locIdNumParsed = parseInt(locIdNum);
		var googleAddr = newArr[locIdNumParsed].name + "%20" + newArr[locIdNumParsed].street + "%20" + newArr[locIdNumParsed].city + "%20" + newArr[locIdNumParsed].state;
		var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + googleAddr + "&inputtype=textquery&fields=place_id,geometry&key=AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A"; 
		googleAPICall(queryURL, 1);
		
	});
	
	

