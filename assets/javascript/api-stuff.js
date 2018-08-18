
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
	


	

	

var start = Date.now();

$("#Yelp-Api").on("click", function () {
    var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=by-chloe&location=denver";
    console.log("gettingData");

    $.ajax({
        url: myurl,
        headers: {
            'Authorization': 'Bearer myQkJirdprwS7KhRTJdxdN17IMWvBUPgWEM0-2iucZ7xwZMV5Fa13rQlRQdZb0NHihit4qRM1oRlzEpDxWY68jgauMor9KGKVEZAaYghUvznKLcgzkATkoZOxLd1W3Yx',
        },
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log("Time Lag: " + (Date.now() - start));
            console.log(data);
        }
    });
});

$("#Map-Api").on("click", function () {
    var queryURL = "http://beermapping.com/webservice/locstate/7d9d88201b9b82b413a7691e626322bc/co&s=json";
    console.log("gettingData");  


    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        console.log("Time Lag: " + (Date.now() - start));
    }).catch(function (error) {
        console.log(error);
    })

});

yelpLookUp = $(this).text();
			
			var queryURL = "https://api.yelp.com/v3/businesses/search/?term=Golden%20City%20Brewery&location=golden,co";
			
			var settings = {
			  "async": true,
			  "crossDomain": true,
			  "url": "https://api.yelp.com/v3/businesses/search?text=coffee&latitude=37.786882&longitude=-122.399972",
			  "method": "GET",
			  "headers": {
				"Authorization": "Bearer myQkJirdprwS7KhRTJdxdN17IMWvBUPgWEM0-2iucZ7xwZMV5Fa13rQlRQdZb0NHihit4qRM1oRlzEpDxWY68jgauMor9KGKVEZAaYghUvznKLcgzkATkoZOxLd1W3Yx",
			  }
			}

			$.ajax(settings).done(function (response) {
			  console.log(response);
			}).catch(function (error) {
			console.log(error);
			})