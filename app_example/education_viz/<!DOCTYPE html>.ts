<!DOCTYPE html>
 
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
    <title>ArcGIS API for JavaScript Tutorials: Display a map</title>

    <style>
      html,
      body,
      #viewDiv {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
      }
    </style>

    <link rel="stylesheet" href="https://js.arcgis.com/4.20/esri/themes/light/main.css">
    <script src="https://js.arcgis.com/4.20/"></script>

    <script>
      require(["esri/config"
      ,"esri/Map"
      , "esri/views/MapView"
      ,"esri/Graphic"// https://developers.arcgis.com/javascript/latest/add-a-point-line-and-polygon/
      ,"esri/layers/GraphicsLayer"
    ]
    , function (esriConfig,Map, MapView, Graphic, GraphicsLayer) {

        esriConfig.apiKey = "AAPKfc54aa8824ce43438319302883c00f067M3SzvbHrLXNdw3pQ35B0rhTTv1gScC9JC-tUlqCeR5M6SjEJbtY2Im-Sba9biQ_";

        const map = new Map({
          basemap: "arcgis-topographic" // Basemap layer service
        });

        const view = new MapView({
          map: map,
          center: [23.683714, 48.616476], // Longitude, latitude
          zoom: 13, // Zoom level
          container: "viewDiv" // Div element
        });

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        const point = { //Create a point
    type: "point",
    longitude: 23.683714,
    latitude: 48.616476
 };
 const simpleMarkerSymbol = {
    type: "simple-marker",
    color: [226, 119, 40],  // Orange
    outline: {
        color: [255, 255, 255], // White
        width: 1
    }
 };

 const pointGraphic = new Graphic({
    geometry: point,
    symbol: simpleMarkerSymbol
 });
 graphicsLayer.add(pointGraphic);

 // Create a polygon geometry
 const polygon = {
    type: "polygon",
    rings: [
        [23.683714, 48.616476], //Longitude, latitude
        [23.703451, 48.614489], //Longitude, latitude
        [23.698163, 48.606939], //Longitude, latitude
        [23.678723, 48.606457],   //Longitude, latitude
        [23.675805, 48.612331]  //Longitude, latitude
    ]
 };

 const simpleFillSymbol = {
    type: "simple-fill",
    color: [227, 139, 79, 0.8],  // Orange, opacity 80%
    outline: {
        color: [255, 255, 255],
        width: 1
    }
 };

 const popupTemplate = {
    title: "{Name}",
    content: "{Description}"
 }
 const attributes = {
    Name: "Graphic",
    Description: "I am a polygon"
 }

 const polygonGraphic = new Graphic({
    geometry: polygon,
    symbol: simpleFillSymbol,

    attributes: attributes,
    popupTemplate: popupTemplate

 });
 graphicsLayer.add(polygonGraphic);

     // Create a line geometry
     const polyline = {
    type: "polyline",
    paths: [
        [23.683714, 48.616476], //Longitude, latitude
        [23.688110, 48.617340], //Longitude, latitude
        [23.696273, 48.614993],  //Longitude, latitude
        [23.703451, 48.614489],  //Longitude, latitude
        [23.701326, 48.611632]  //Longitude, latitude
    ]
 };
 const simpleLineSymbol = {
    type: "simple-line",
    color: [226, 119, 40], // Orange
    width: 2
 };

 const polylineGraphic = new Graphic({
    geometry: polyline,
    symbol: simpleLineSymbol
 });
 graphicsLayer.add(polylineGraphic);

      });
    </script>

  </head>
  <body>
    <div id="viewDiv"></div>
  </body>
</html>