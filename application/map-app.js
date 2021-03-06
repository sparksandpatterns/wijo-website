var map = L.map('map', {attributionControl: false, minZoom: 6}).setView([48.964516, 10.181227], 6);
L.control.attribution({position: 'topright'}).addTo(map);

// improve experience on mobile
if (map.tap) map.tap.disable();

// adding layers
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a> | <a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a>' +
               '<br><b><a href="http://journalistik.tu-dortmund.de/fileadmin/Mitarbeiter/Schacht/DDJ_Karte/index.html" target="_blank">Vollbild anzeigen</a></b>',
  id: 'datendrang.3cbaa7ef',
  accessToken: 'pk.eyJ1IjoiZGF0ZW5kcmFuZyIsImEiOiJjaWczYXBsZTAxcGQ1dXJtM3IydXBxbXMwIn0.s2c_Q7uvRnMO8cB3RokJ3A'
}).addTo(map);

var oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied: true, nearbyDistance: 30});

var addMarkersToMap = function addMarkersToMap(data) {
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      var icon = new L.Icon({
            iconUrl: feature.properties.icon,
            iconSize: [70, 70],
      });
      return L.marker(latlng, {icon: icon});
    },
    onEachFeature: function (feature, layer) {

      oms.addMarker(layer);

      if(feature.properties.leitung) {leitung = "<p><b>Verantwortlich:</b> " + feature.properties.leitung + "</p>"}
      else {leitung = ""}

      if(feature.properties.orga) {orga = "<b>" + feature.properties.orga + "</b> | "}
      else {orga = ""}

      popupHtml = (
        "<h1><a target='_blank' href='" + feature.properties.link + "'><b>" + feature.properties.name + "</b></a></h1>" +
        "<p>" + orga + "<em>" + feature.properties.ort + "</em></p>" + leitung
      )

      var popup = L.popup({
        autoPan: false,
        keepInView: true,
        autoPanPaddingBottomRight: new L.Point(10, 50),
        offset: new L.Point(10, -10),
      }).setContent(popupHtml);

      layer.bindPopup(popup);

      oms.addListener('click', function(marker) {
            popup.setLatLng(marker.getLatLng());
      });

      oms.addListener('spiderfy', function(markers) {
        this.closePopup();
      });

    }
  });
  map.addLayer(geoJsonLayer);
  //map.addControl( new L.Control.Search({layer: geoJsonLayer, propertyName: 'name'}) );
};

  $.getJSON( "./data/ddj.geojson", function(data) {
  addMarkersToMap(data);
});
