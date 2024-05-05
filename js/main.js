(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	//right sidebar collapse code
	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

  	//left sidebar collapse code
  	$('#sidebarrightCollapse').on('click', function () {
			$('#sidebarright').toggleClass('active');
});

})(jQuery);


//create a map and set default view
var mymap = L.map('map-div')
mymap.setView([41.31, 27.98], 13);

//add to online maps as a layer
var backgroundLayerAsOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
var backgroundLayerAsSatellite = L.tileLayer('https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=Dip0tA0TRqiYwXuH5ezr');
var backgroundLayerAsTer = L.tileLayer('https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=Dip0tA0TRqiYwXuH5ezr');


mymap.addLayer(backgroundLayerAsOSM);

// Function to toggle layer visibility for OSM
function toggleLayerOSM() {
    if (this.checked) {
        mymap.addLayer(backgroundLayerAsOSM);
    } else {
        mymap.removeLayer(backgroundLayerAsOSM);
    }
}

// Attach toggleLayer function to the checkbox for OSM
var toggleCheckboxOSM = document.getElementById('toggleLayerOSM');
toggleCheckboxOSM.addEventListener('change', toggleLayerOSM);

// Function to toggle layer visibility for Satellite
function toggleLayerSat() {
    if (this.checked) {
        mymap.addLayer(backgroundLayerAsSatellite);
    } else {
        mymap.removeLayer(backgroundLayerAsSatellite);
    }
}

// Attach toggleLayer function to the checkbox for satellite
var toggleCheckboxSat = document.getElementById('toggleLayerSat');
toggleCheckboxSat.addEventListener('change', toggleLayerSat);

// Function to toggle layer visibility for Terrain
function toggleLayerTer() {
    if (this.checked) {
        mymap.addLayer(backgroundLayerAsTer);
    } else {
        mymap.removeLayer(backgroundLayerAsTer);
    }
}

// Attach toggleLayer function to the checkbox for Terrain
var toggleCheckboxTer = document.getElementById('toggleLayerTer');
toggleCheckboxTer.addEventListener('change', toggleLayerTer);


//show lat lon coordinate in footer div
mymap.on('mousemove', function (e) {
    var str = "Enlem : " + e.latlng.lat.toFixed(5) + " Boylam : "
        + e.latlng.lng.toFixed(5) + " Zoom Level : " + mymap.getZoom();
    $("#map_coords").html(str);
})


//show EPSG5352 coordinate in footer div
mymap.on('mousemove', function (e) {
    var wgs84_lat = parseFloat(e.latlng.lat.toFixed(9));
    var wgs84_lon = parseFloat(e.latlng.lng.toFixed(9));

    // define EPSG:5352 coordinate system
    var epsg5352 = '+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs';
    var targetProjection = proj4(epsg5352);

    // transform WGS84 coordinate to EPSG:5352 coordinate
    var transformedCoords = proj4('EPSG:4326', epsg5352, [wgs84_lon, wgs84_lat]);

    // show coordinate
    var transformed_lon = transformedCoords[0];
    var transformed_lat = transformedCoords[1];

    var str = "X : " + transformed_lat.toFixed(3) + " Y : " + transformed_lon.toFixed(3);
    $("#map_coords-itrf").html(str);
})

//add geojson data from qgis
// load geoJson, create layer and html
var geojsonParselLayer = new L.GeoJSON.AJAX("../resources/PARSEL.geojson", {
    style: function (feature) {
        return {
            fillColor: 'orange', // Poligonun iç rengi
            weight: 2,          // Poligonun kenar kalınlığı
            opacity: 1,         // Poligonun kenar çizgisi opaklığı
            color: 'yellow',       // Poligonun kenar çizgisi rengi
            fillOpacity: 0.7    // Poligonun iç opaklığı
        };
    },
    onEachFeature: function (feature, layer) {
        var str = "<h6>İlçe : " + feature.properties.İLÇE + "</h6><hr>";
        str += "<h6>Mahalle : " + feature.properties.MAHALLE + "</h6><hr>";
        str += "<h6>Ada No : " + feature.properties.ADA_NO + "</h6><hr>";
        str += "<h6>Parsel No : " + feature.properties.PARSEL_NO + "</h6><hr>";
        str += "<h6>Alanı : " + feature.properties["PARSEL_ALANI(m2)"] + " m²</h6><hr>";
        str += "<h6>Malik : " + feature.properties.MALİK_ADI + "</h6><hr>";

        
        layer.bindPopup(str);
    }
});

// Add created Layer to map 


function toggleLayerYerlesimPlani() {
    if (this.checked) {
        geojsonParselLayer.addTo(mymap);
    } else {
        geojsonParselLayer.removeFrom(mymap);
    }
}

// Attach toggleLayer function to the checkbox for yerlesimplani
var toggleCheckboxYerlesimPlani = document.getElementById('toggleYerlesimPlani');
toggleCheckboxYerlesimPlani.addEventListener('change', toggleLayerYerlesimPlani);

var opacitySliderYerlesim = document.getElementById("opacityYerlesim");
        opacitySliderYerlesim.addEventListener("input", function () {
            var opacityValue = parseFloat(opacitySliderYerlesim.value);
            geojsonParselLayer.setStyle({ fillOpacity: opacityValue });
            if(opacityValue == 0){
                geojsonParselLayer.setStyle({weight:0});
            }
            else{
                geojsonParselLayer.setStyle({weight:2});
            }
        });


