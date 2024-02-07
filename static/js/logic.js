
let myMap = L.map("map", {
    center: [40.72, -113.67],
    zoom: 5
  });
  
  // Adding a tile layer (the background map image) to the map:
  
let TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  

let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



d3.json(queryURL).then(function(data) {

  function styling() {
    return {
      fillOpacity:1,
      weight:1,
    };


  function colourScale(depth) {
    switch(true){
      case depth >100:
        return "#44ce1b";
      case depth >80:
        return "#bbdb44";
      case depth >60:
        return "#f7e379";
      case depth >40:
        return "#f2a134";
      default:
        return "#000000";

    }

  function markerRadius(magnitude) {
    if (magnitude == 0) {
      return 1;
    }
    return magnitude*2;

    }


onEachFeature: function(feature, layer) {
      layer.bindPopup("magnitude: " + features.properties.mag + "depth:"+ features.geometry.coordinates[2]);
    }
  }).addTo(myMap);

  let features = data.features;

  console.log(features);

    let markers = [];

    for (let i = 0; i < features.length; i++) {

        let location = features.geometry;
        if (location) {
            markers.push([location.coordinates[1], location.coordinates[0]]);
        }
    }

    let markerEarthquake = L.markerCluster(markers).bindPopup("<h1>" + features.geometry.coordinates + "</h1>").addTo(myMap);

});




// myMap.addLayer(markers);