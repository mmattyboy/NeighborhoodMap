var map;
var markers = [];
var infowindow;
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

    ko.applyBindings(new markerViewModel());

}



// this function is needed for purpose of organizing and because of closure in the addListener
// creates an initial info window showing a default loading text and update the text to the ajax request when received to the wikiUrl link of nearby locations
function callAjax(location) {
    infowindow.setContent('Loading...');
    infowindow.open(map, location.marker);
    $.ajax({
        url: "http://api.geonames.org/findNearbyWikipediaJSON?" + "lat=" + location.location.lat + "&lng=" + location.location.lng + "&username=aqphoen",
        success: function(data) {
            var url = data.geonames[0].wikipediaUrl;

            infowindow.setContent('<a target="_blank" href="https://' + url + '">Find out more about ' + location.name + '</a>');
            infowindow.open(map, location.marker);

        },
        error: function(response) {
          infowindow.setContent('Content could not be loaded...');
          infowindow.open(map, location.marker);
        }
    });

}

function markerViewModel() {
    var self = this;
    self.locArray = ko.observableArray([]);
    self.filter = ko.observable('');

    // use click binding in the list elements and
    // add this function:
    // http://knockoutjs.com/documentation/click-binding.html
    self.handleClick = function(location) {
      // the marker is accessible as location.marker
      // trigger the click event of the marker:
      // http://stackoverflow.com/questions/6794405/trigger-google-maps-marker-click
      callAjax(location);
    };

    locations.forEach(function(location) {
      location.marker = new google.maps.Marker({
        position: location.location,
        map: map,
        title: location.name,
        animate: google.maps.Animation.DROP,
      });
      location.marker.addListener("click", function() {
          callAjax(location);
      });
      self.locArray.push(location);
    });


    // this filterLocations variable contain the array of locations that was typed in the filter input
    self.filteredLocations = ko.computed(function() {
        // tasks:
        // - create a temporary array (e.g. var tempArr = [];)
        // - loop through the locArray
        // - check if self.filter() matches the name of the location
        // - if it matches => add the location to the temporary array
        // - finally, return the temporary array from the function (from the computed observable)
        for (var i = 0; i < self.locArray.length; i++) {
            if (self.filter() == locations[i]) {
                self.locArray.shift();
                self.locArray.push(locations[i]);
            }

        }
    });


}
