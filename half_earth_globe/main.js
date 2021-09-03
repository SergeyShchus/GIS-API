// метод require дозволяє завантажувати модулі з бібліотеки JavaScript. 
//За ним слідують відкрита дужка і відкрита квадратних дужок. 
//У квадратних дужках модулі Map і SceneView перераховані в якості модулів esri для завантаження. 
//Рядок esri / Map завантажує код, специфічний для створення карти, в той час як рядок esri / views / SceneView завантажує код, що дозволяє переглядати карту в 3D. 
//Включення цих рядків в розділ require робить їх доступними в інших частинах програми. 
//Рядок domReady! наказує браузеру чекати виконання коду до тих пір, поки не буде завантажена вся сторінка.
require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/TileLayer",
    "esri/Basemap",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList",
    "esri/request",
    "esri/Graphic",
    "dojo/domReady!" // will not be called until DOM is ready
    ], function (
    Map,
    SceneView,
    TileLayer,
    Basemap,
    FeatureLayer,
    LayerList,
    request,
    Graphic
    ) {
  
    //Цей код створює шар з ім'ям satelliteLayer , який є екземпляром класу TileLayer , встановлює його для вилучення листів з певного URL-адреси і привласнює йому назву satellite .
      const satelliteLayer = new TileLayer({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        title: "satellite"
      })
      
      //Цей код створює інший шар з ім'ям fireflyLayer , який є екземпляром класу TileLayer , 
      //встановлює його для вилучення листів з певного URL-адреси і привласнює йому назву half-earth-firefly .
      const fireflyLayer = new TileLayer({
        url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/HalfEarthFirefly/MapServer",
        title: "half-earth-firefly"
      })
      
      //Ці рядки створюють екземпляр класу карти і встановлюють базову карту для карти в базову карту Знімки Esri за замовчуванням.
      const basemap = new Basemap({
        baseLayers: [satelliteLayer, fireflyLayer],
        title: "half-earth-basemap",
        id: "half-earth-basemap"
      });
  
      const rangelands = new TileLayer({
        url: 'https://tiles.arcgis.com/tiles/IkktFdUAcY3WrH25/arcgis/rest/services/gHM_Rangeland_inverted/MapServer'
      })
  
      const protected = new FeatureLayer({
        url: 'https://services5.arcgis.com/Mj0hjvkNtV7NRhA7/arcgis/rest/services/WDPA_v0/FeatureServer/1'
      })
      
      const map = new Map({
        basemap: basemap,
        layers: [protected, rangelands]
      });
    
    //Ці рядки створюють екземпляр класу SceneView і встановлюють карту, яку буде відображати сцена, на карту.
    //Він також вказує, що цей клас SceneView поміщається всередині елемента sceneContainer поділу HTML-сторінки.
      const view = new SceneView({
        map: map,
        container: "sceneContainer",
          //Ці рядки коду відключають ефект атмосфери, який надавав глобусу ореол. Замість цього ви встановлюєте суцільний колір фону, використовуючи нотацію RGB.
        environment: {
          atmosphereEnabled: false,
          background: {
            type: "color",
            color: [0,10,16]
          }
        },
          //Ці рядки видаляють елементи управління за замовчуванням, за винятком кнопок управління масштабуванням.
        ui: {
          components: ["zoom"]
         }
      });
      const layerList = new LayerList({
        view: view
      });
      
      view.ui.add(layerList, {
        position: "top-right"
      });  
      const uploadForm = document.getElementById("uploadForm");

      uploadForm.addEventListener("change", function (event) {
        const filePath = event.target.value.toLowerCase();
          //only accept .zip files
        if (filePath.indexOf(".zip") !== -1) {
            generateFeatureCollection(uploadForm)
        } 
        });
        function generateFeatureCollection(uploadFormNode) {
            const generateRequestParams = {
                filetype: "shapefile",
                  publishParameters: JSON.stringify({
                  targetSR: view.spatialReference
                }),
                f: "json"
              };
            request("https://www.arcgis.com/sharing/rest/content/features/generate", {
             query: generateRequestParams,
             body: uploadFormNode,
             responseType: "json"
            }).then(function (response) {
                addShapefileToMap(response.data.featureCollection);
                  console.log(response)
                })
            }
            function createFeaturesGraphics(layer) {
                console.log(layer)
                return layer.featureSet.features.map(function (feature) {
                  return Graphic.fromJSON(feature);
                });
              }
              function createFeatureLayerFromGraphic(graphics) {
                return new FeatureLayer({
                  objectIdField: "FID",
                  source: graphics,
                  title: 'User uploaded shapefile'
                });
              }
              function addShapefileToMap(featureCollection) {
                let sourceGraphics = [];
                const collectionLayers = featureCollection.layers;
                const mapLayers = collectionLayers.map(function (layer) {
                  const graphics = createFeaturesGraphics(layer);
                  sourceGraphics = sourceGraphics.concat(graphics);
                  const featureLayer = createFeatureLayerFromGraphic(graphics)
                  return featureLayer;
                });
                map.addMany(mapLayers);
                view.goTo({target: sourceGraphics, tilt: 40});
              }
    });
