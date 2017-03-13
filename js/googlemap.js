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
    self.show = ko.observable(true);

    // use click binding in the list elements and
    // add this function:
    // http://knockoutjs.com/documentation/click-binding.html
    self.handleClick = function(location) {
      // the marker is accessible as location.marker
      // trigger the click event of the marker:
      // http://stackoverflow.com/questions/6794405/trigger-google-maps-marker-click
      callAjax(location);
      location.marker.setIcon(image);
    };

// create new marker objects and store them in self.locArray, an observable array, "location" in the function parameter refers to the copy of the element in "locations array" declared in line 5
// the locArray observable now contain all objects in locations[] in line 5 and marker objects
    locations.forEach(function(location) {
      location.marker = new google.maps.Marker({
        position: location.location,
        map: map,
        title: location.name,
        animate: google.maps.Animation.DROP,
      });
      location.marker.addListener("click", function() {
          callAjax(location);
          location.marker.setIcon(image);
      });
      self.locArray().push(location);
    });

    //var $ul = $("ul li");
    var ul = document.getElementById("filterList");
    var li = ul.getElementsByTagName("li");
  //   self.filterList = function(location) {
		// for (i = 0; i < self.locArray().length; i++) {
  //   		if(self.locArray()[i].name.toUpperCase().indexOf(self.filter().toUpperCase()) > -1) {
  //   			li[i].style.display = "";
  //   			// self.locArray()[i].marker.setMap(map);  	
  //   			self.locArray()[i].marker.setVisible(true);  		
  //   		} else {
  //   			li[i].style.display = "none";
  //   			// self.locArray()[i].marker.setMap(null);
  //   			self.locArray()[i].marker.setVisible(false);
  //   		}

  //   	}
  //   }

    // this filterLocations variable contain the array of locations that was typed in the filter input
    // ko.computed is used for more than one observable values, in this case: self.filter and self.locArray

    // scenario 1: default: no text input (else if statement): get the list names and return it
    // scenario 2: text input and matched letter (if statement): get that location's name place it into tempArray and if it does not contain any matched, place it into 
 //    self.filteredLocations = ko.computed(function() {
 //    	// make sure array is empty
 //    	self.tempArray().splice(0, self.tempArray().length);
 //    	for (i = 0; i < self.locArray().length; i++) {
 //    		if (self.filterText() == "") {
 //    			// no input, return all the list items
 //    			self.tempArray().push({
 //    				name: locations[i].name
 //    			});
 //    		} else if (locations[i].name.toUpperCase().indexOf(self.filterText().toUpperCase()) > -1) {
 //    			self.tempArray().push({
 //    				name: self.locArray()[i].name
 //    			});
 //    			if (locations[i].name.toUpperCase().indexOf(self.filterText().toUpperCase()) == -1) {
 //    				var x = 1;
 //    			}
 //    			self.locArray()[i].marker.setVisible(true);
 //    		}  else {
 //    			// input, but no letters matched, display none of the elements
 //    			self.tempArray().pop();
 //    		}
 //        return self.locArray();
 //    	};
	// }, this);

// create a temporary array with the copied objects of locArray, using slice() to copy would reference the objects to arr and would NOT be able to restore the original content
	var arr = jQuery.extend(true, [], self.locArray());

	self.filteredLocations = ko.computed(function() {		
		for (i = 0; i < arr.length; i++) {
			self.locArray().pop();
		}	
		for (i = 0; i < arr.length; i++) {
			if (self.filterText() == "") {
				self.locArray().push(arr[i]);
				self.locArray()[i].marker.setVisible(false);
				if (self.locArray()[i].name == arr[i].name) {
					self.locArray()[i].marker.setVisible(true);
				}		
// if the input is NOT empty and the it matches the names get those names			
			} else if (arr[i].name.toUpperCase().indexOf(self.filterText().toUpperCase()) > -1 &&
			self.filterText() != "") {
				self.locArray().push(arr[i]);
				if (self.locArray()[i].name == arr[i].name) {
					self.locArray()[i].marker.setVisible(true);
				}
				console.log(self.locArray()[i]);
			} else if (arr[i].name.toUpperCase().indexOf(self.filterText().toUpperCase()) == -1 &&
			self.filterText() != "") {
				arr[i].marker.setVisible(false);
				// self.locArray().push(arr[i]);
				// self.locArray()[i].marker.setVisible(false);
			}
		}
			
		return self.locArray();
	}, this);
}
// tasks:
        // - create a temporary array (e.g. var tempArr = [];)
        // - loop through the locArray
        // - check if self.filter() matches the name of the location
        // - if it matches => add the location to the temporary array
        // - finally, return the temporary array from the function (from the computed observable)

        // compare self.locArray and self.filter, if the toUpperCase() of the variables are greater than -1, display that filter, otherwise display none

// NOTE: you must use locArray() <-- parenthesis in order to return the array observable or any KO observables
        // for (i = 0; i < self.locArray().length; i++) {
        // // if a letter in the locArray name is typed and exists in locArray, push that name into tempArray
        // 	if (self.locArray()[i].name.toUpperCase().indexOf(self.filter()) > -1) {
        		
        // 	} 
       
        // }