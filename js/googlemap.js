
var map;
function initMap() {
	var visit = {lat: 34.085386, lng: -118.043585};
	var markers = [];
	var locations = [
		{title: "rayray", location: {lat: 34.076377, lng: -118.043273}},
		{title: "riteAid", location: {lat: 34.074506, lng: -118.040498}},
		{title: "cvs", location: {lat: 34.090727, lng: -118.015660}},
		{title: "ktown", location: {lat: 34.059889, lng: -118.296802}},
		{title: "pcc", location: {lat: 34.143933, lng: -118.119168}}
	];

	map = new google.maps.Map(document.getElementById('map'), {
		center: visit,
		zoom: 12
	});
	
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
		markers.push(marker);
	}
	// self.locationMarker = ko.observableArray([
	// 	new Marker(self.name, self.location);
	// ]);

}
ko.applyBindings(new markerViewModel());