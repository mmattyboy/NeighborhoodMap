var map;
var markers = [];
var infowindow;
var image = "image/white-pin.png";
var locations = [
    { name: "rayray", location: { lat: 34.076377, lng: -118.043273 } },
    { name: "riteAid", location: { lat: 34.074506, lng: -118.040498 } },
    { name: "cvs", location: { lat: 34.090727, lng: -118.015660 } },
    { name: "ktown", location: { lat: 34.059889, lng: -118.296802 } },
    { name: "pcc", location: { lat: 34.143933, lng: -118.119168 } }
];



function initMap() {
    var visit = { lat: 34.085386, lng: -118.043585 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: visit,
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow({});

    ko.applyBindings(new MarkerViewModel());
}

function showErrorMessage() {
	alert("An error was found while loading the page.");
}

// this function is needed for purpose of organizing and because of closure in the addListener
// creates an initial info window showing a default loading text and update the text to the ajax request when received to the wikiUrl link of nearby locations
function callAjax(location) {
    infowindow.setContent('<img src="image/spin.svg">');
    infowindow.open(map, location.marker);
    $.ajax({
        url: "http://api.geonames.org/findNearbyWikipediaJSON?" + "lat=" + location.location.lat + "&lng=" + location.location.lng + "&username=aqphoen",
        success: function(data) {
            var url = data.geonames[0].wikipediaUrl;

            infowindow.setContent('<a target="_blank" href="https://' + url + '">Find out more about nearby locations ' + location.name + '</a>');
            infowindow.open(map, location.marker);

        },
        error: function(response) {
          infowindow.setContent('Content could not be loaded...');
          infowindow.open(map, location.marker);
        }
    });

}

function MarkerViewModel() {
    var self = this;
    self.locArray = ko.observableArray([]);
    self.tempArray = ko.observableArray([]);
    self.filterText = ko.observable('');

    // use click binding in the list elements and
    // add this function:
    // http://knockoutjs.com/documentation/click-binding.html
    self.handleClick = function(location) {
      // the marker is accessible as location.marker
      // trigger the click event of the marker:
      // http://stackoverflow.com/questions/6794405/trigger-google-maps-marker-click
      callAjax(location);
      location.marker.setAnimation(google.maps.Animation.DROP);
      
    };

// create new marker objects and store them in self.locArray, an observable array, "location" in the function parameter refers to the copy of the element in "locations array" declared in line 5
// the locArray observable now contain all objects in locations[] in line 5 and marker objects
    locations.forEach(function(location) {
      location.marker = new google.maps.Marker({
        position: location.location,
        map: map,
        title: location.name,
        animation: google.maps.Animation.DROP,
      });
      location.marker.addListener("click", function() {
          self.handleClick(location);
      });
      self.locArray().push(location);
    });

// create a temporary array with the copied objects of locArray, using slice() to copy would reference the objects to arr and would NOT be able to restore the original content
	var arr = jQuery.extend(true, [], self.locArray());

	self.filteredLocations = ko.computed(function() {	
	// make sure the array is clear	
		for (i = 0; i < arr.length; i++) {
			self.locArray().pop();
		}	
		for (i = 0; i < arr.length; i++) {
		// default: no input text, show all markers and list
			if (self.filterText() == "") 
			{
				self.locArray().push(arr[i]);
				self.locArray()[i].marker.setVisible(false);
				if (self.locArray()[i].name == arr[i].name) {
					self.locArray()[i].marker.setVisible(true);
				}				
			} 
		// if filterbox is not empty and contain matching names in the locations array, push those into locArray and display those amrkers
			else if (arr[i].name.toUpperCase().indexOf(self.filterText().toUpperCase()) > -1 &&
			self.filterText() != "") 
			{
				self.locArray().push(arr[i]);
				if (locations.name == arr[i].name) {
					locations.marker.setVisible(true);
				}
			} 
		// the rest of the elements with the names that don't match, don't display those markers, list items are not displayed because they are not pushed to begin with
			else if (arr[i].name.toUpperCase().indexOf(self.filterText().toUpperCase()) == -1 &&
			self.filterText() != "") 
			{
				arr[i].marker.setVisible(false);
			}
		}
			
		return self.locArray();
	}, this);
}
