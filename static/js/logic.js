
let myMap = L.map("map", {
    center: [40.72, -113.67],
    zoom: 5
  });

  
let TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  

const queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const COLOUR_DEPTHS = [0,3,6,9,12,15];
const RADIUS_MIN = 5;
const RADIUS_COEFF = 3;


function colourScale(depth) {
  if (depth <= COLOUR_DEPTHS[0]) {
    return 	"#ffc100";
  } else if (depth <= COLOUR_DEPTHS[1]) {
    return "#ff9a00";
  } else if (depth <= COLOUR_DEPTHS[2]) {
    return "#ff7400";
  } else if (depth <= COLOUR_DEPTHS[3]) {
    return "#ff4d00";
  } else if (depth <= COLOUR_DEPTHS[4]) {
    return "#ff0000";
  } else if (depth <= COLOUR_DEPTHS[5]) {
    return "#8B0000";
  } else {
    return "#6D071A";
  }
};


function markerRadius(magnitude) {
  let calcRadius = magnitude*RADIUS_COEFF;
  return Math.max(calcRadius, RADIUS_MIN);
}


function pointToLayer(feature, latlng) {
  let colour = colourScale(feature.geometry.coordinates[2])
  let circleOptions = {
    radius: markerRadius(feature.properties.mag),
    color: colour,
    fillColor: colour,
    fillOpacity: 0.5
  };
  return L.circleMarker(latlng, circleOptions);
}


function onEachFeature(feature, layer) {
  layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Earthquake magnitude: ${feature.properties.mag} depth: ${feature.geometry.coordinates[2]}</p>`);
}


function createFeatures(earthquakeData) {

  let geoJSONoptions = {
    "onEachFeature": onEachFeature,
    "pointToLayer": pointToLayer
  }
  let earthquakes = L.geoJSON(earthquakeData, geoJSONoptions);

  earthquakes.addTo(myMap);
}

d3.json(queryURL).then(createFeatures); 


function createLegend() {

  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = COLOUR_DEPTHS;
    let colors = COLOUR_DEPTHS.forEach(depth => colourScale);
    let labels = [];

    for (i = 0; i<limits.length -1; ++i){
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    }
    div.innerHTML += `&gt;${limits[limits.length-1]} <i style="background-color: ${colour[limits.length-1]}>&emsp;`;
    return div;
  };

  legend.addTo(myMap);

};

createLegend();
