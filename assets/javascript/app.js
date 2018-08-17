var beermapAPI = "7d9d88201b9b82b413a7691e626322bc";

var yelpClient = "ogfrOLDoPooXqSpvb0BqGw";

var yelpAPI = "myQkJirdprwS7KhRTJdxdN17IMWvBUPgWEM0-2iucZ7xwZMV5Fa13rQlRQdZb0NHihit4qRM1oRlzEpDxWY68jgauMor9KGKVEZAaYghUvznKLcgzkATkoZOxLd1W3Yx";

var googleMap = "AIzaSyBPA6roP9n1wLdaIto4JBw1gCGBXCcJu4A";

var returnedObject;
var newArr = [];

            $("#map-api").on("click", function () {
				var city = $("#city").val().trim();
                var start = Date.now();
                console.log("gettingData");  
        
                var queryURL = "http://beermapping.com/webservice/loccity/7d9d88201b9b82b413a7691e626322bc/"+ city +"&s=json";
        
        
                $.ajax({
                    url: queryURL,
                    method: "GET",
                }).then(function (response) {
                    console.log(response);
					returnedObject = response;
                    console.log("Time Lag: " + (Date.now() - start));
					for (var i=0; i<response.length; i++){
						if (response[i].status == "Brewpub" || response[i].status == "Brewery") {
							newArr.push(response[i]);
						}	
					}
					for (var i=0; i<newArr.length; i++){
						$("#brew-list").append("<p class='beer-link'>" + newArr[i].name + "</p>");
					}
	
		
                }).catch(function (error) {
                    console.log(error);
                })
        
			
            });

                $("#Yelp-Api").on("click", function () {
        var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=by-chloe&location=denver";

        $.ajax({
            url: myurl,
            headers: {
                'Authorization': 'Bearer myQkJirdprwS7KhRTJdxdN17IMWvBUPgWEM0-2iucZ7xwZMV5Fa13rQlRQdZb0NHihit4qRM1oRlzEpDxWY68jgauMor9KGKVEZAaYghUvznKLcgzkATkoZOxLd1W3Yx',
            },
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data);
            }
        });
    });
	


	

	
