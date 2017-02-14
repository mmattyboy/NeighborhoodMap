
var map;
var markers = [];

function initMap() {
	var visit = {lat: 34.085386, lng: -118.043585};

	map = new google.maps.Map(document.getElementById('map'), {
		center: visit,
		zoom: 12
	});

    ko.applyBindings(new markerViewModel());

	// for(var i = 0; i < locations.length; i ++) {
	// 	var position = locations[i].location;
	// 	var title = locations[i].title;
	// 	var marker = new google.maps.Marker({
	// 		position: position,
	// 		map: map,
	// 		title: title,
	// 		animate: google.maps.Animation.DROP
	// 	});
	// 	markers.push(marker);
	// }
}


// var Marker = function(name, location) {
// 	var self = this;
// 	self.name = name;
// 	self.location = ko.observable(location);
// };

function markerViewModel() {
	var self = this;

    self.locArray = ko.observableArray([]);
    self.filter = ko.observable('');
    self.filteredLocations = ko.computed(function() {
        // tasks:
        // - create a temporary array (e.g. var tempArr = [];)
        // - loop through the locArray
        // - check if self.filter() matches the name of the location
        // - if it matches => add the location to the temporary array
        // - finally, return the temporary array from the function (from the computed observable)
    });



	self.locations = [
		{name: "rayray", location: {lat: 34.076377, lng: -118.043273}},
		{name: "riteAid", location: {lat: 34.074506, lng: -118.040498}},
		{name: "cvs", location: {lat: 34.090727, lng: -118.015660}},
		{name: "ktown", location: {lat: 34.059889, lng: -118.296802}},
		{name: "pcc", location: {lat: 34.143933, lng: -118.119168}}
	];

	for(var i = 0; i < self.locations.length; i ++) {
		var position = self.locations[i].location;
		var title = self.locations[i].name;
		var marker = new google.maps.Marker({
			position: position,
			map: map,
			title: title,
			animate: google.maps.Animation.DROP
		});

        // task: create an event listener for the marker (search for "google marker event click")
        // and show an infowindow object when the marker is clicked (search for "google maps infowindow")

        self.locations[i].marker = marker;

        self.locArray.push(self.locations[i]);

        markers.push(marker);
	}

    // task: loop through


}