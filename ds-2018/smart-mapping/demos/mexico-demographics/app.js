require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Expand",
  "esri/widgets/ColorSlider",
  "esri/layers/FeatureLayer",
  "esri/renderers/smartMapping/statistics/histogram",
  "esri/renderers/smartMapping/creators/color",
  "esri/symbols/SimpleFillSymbol",
  "esri/tasks/support/Query",
  "esri/tasks/QueryTask",
  "esri/core/lang",
  "dojo/_base/array",
  "dojo/dom",
  "dojo/on",
  "dojo/domReady!"
], function (
  Map, MapView, BasemapGallery, Expand, ColorSlider,
  FeatureLayer, histogram, colorRendererCreator,
  SimpleFillSymbol, Query, QueryTask, esriLang, array, dom, on
){

  var currentExtentFilter = null;
  var colorSlider = null;
  var populationSlider = dom.byId("population-filter");

  ////////////////////////////////////////////////////
  ////
  ////  Options for defining the values used to
  ////  drive the visualizations
  ////
  ////////////////////////////////////////////////////

  var options = {
    noschool: {
      valueExpression: document.getElementById("arcade-no-school").text,
      sqlExpression: document.getElementById("sql-no-school").text,
      legendOptions: {
        title: "% population (12+) that attended no school"
      }
    },
    preschool: {
      valueExpression: document.getElementById("arcade-preschool").text,
      sqlExpression: document.getElementById("sql-preschool").text,
      legendOptions: {
        title: "% population (12+) that attended at least preschool"
      }
    },
    primary: {
      valueExpression: document.getElementById("arcade-primary").text,
      sqlExpression: document.getElementById("sql-primary").text,
      legendOptions: {
        title: "% population (12+) that attended at least primary school"
      }
    },
    secondary: {
      valueExpression: document.getElementById("arcade-secondary").text,
      sqlExpression: document.getElementById("sql-secondary").text,
      legendOptions: {
        title: "% population (12+) that attended at least secondary school"
      }
    },
    preparatory: {
      valueExpression: document.getElementById("arcade-high-school").text,
      sqlExpression: document.getElementById("sql-high-school").text,
      legendOptions: {
        title: "% population (12+) that attended at least preparatory school"
      }
    },
    college: {
      valueExpression: document.getElementById("arcade-college").text,
      sqlExpression: document.getElementById("sql-college").text,
      legendOptions: {
        title: "% population (12+) that attended college"
      }
    },
    womenToMen: {
      field: "POP_FEMALES_14UP",
      normalizationField: "POP_MALES_14UP",
      legendOptions: {
        title: "Ratio of women to men (14+)"
      }
    }
  };


  ////////////////////////////////////////////////////
  ////
  ////  Set up data, map, view, and widgets
  ////
  ////////////////////////////////////////////////////

  var url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Mexico_demographics/FeatureServer/0";

  var mexicoLayer = new FeatureLayer({
    url: url,
    visible: false,
    outFields: ["*"],
    popupTemplate: {
      title: "{NAME}",
      content: function(response){
        var a = response.graphic.attributes;
        var textContent = [
          "Of the ", a.TOTPOP_CY.toLocaleString('en-US'), " people that ",
          "live in ", a.NAME, ", the following completed ",
          "each level of education: ", "%<br><br>",
          "Preschool: ", finishedPreschool(a), "%<br>",
          "Primary: ", finishedPrimary(a), "%<br>",
          "Secondary: ", finishedSecondary(a), "%<br>",
          "Preparatory: ", finishedPreparatory(a), "%<br>",
          "College: ", finishedCollege(a), "%<br>",
          "No school: ", noSchool(a), "%"
        ];
        return textContent.join("");
      }
    }
  });

  ////////////////////////////////////////////////////
  ////
  ////  Functions that calculate the % of people
  ////  that completed each education level
  ////  FOR POPUP CONTENT
  ////
  ////////////////////////////////////////////////////

  function noSchool(attributes){
    var a = attributes;
    var finished = (a.EDUC01_CY / a.EDUCA_BASE) * 100;
    return Math.round(finished*100)/100;
  }

  function finishedPreschool(attributes){
    var a = attributes;
    var finished = ( (a.EDUC02_CY + a.EDUC03_CY + a.EDUC04_CY + a.EDUC05_CY + a.EDUC06_CY
      + a.EDUC07_CY + a.EDUC08_CY + a.EDUC09_CY + a.EDUC10_CY
      + a.EDUC11_CY + a.EDUC12_CY + a.EDUC13_CY
      + a.EDUC14_CY + a.EDUC15_CY) / a.EDUCA_BASE ) * 100;
    return Math.round(finished*100)/100;
  }

  function finishedPrimary(attributes){
    var a = attributes;
    var finished = ( (a.EDUC04_CY + a.EDUC05_CY + a.EDUC06_CY + a.EDUC07_CY
      + a.EDUC08_CY + a.EDUC09_CY + a.EDUC10_CY
      + a.EDUC11_CY + a.EDUC12_CY + a.EDUC13_CY
      + a.EDUC14_CY + a.EDUC15_CY) / a.EDUCA_BASE ) * 100;
    return Math.round(finished*100)/100;
  }

  function finishedSecondary(attributes){
    var a = attributes;
    var finished = ( (a.EDUC06_CY + a.EDUC08_CY + a.EDUC09_CY + a.EDUC10_CY
      + a.EDUC11_CY + a.EDUC12_CY + a.EDUC13_CY
      + a.EDUC14_CY + a.EDUC15_CY) / a.EDUCA_BASE) * 100;
    return Math.round(finished*100)/100;
  }

  function finishedPreparatory(attributes){
    var a = attributes;
    var finished = ( (a.EDUC09_CY + a.EDUC10_CY + a.EDUC11_CY + a.EDUC12_CY
      + a.EDUC13_CY + a.EDUC14_CY + a.EDUC15_CY) / a.EDUCA_BASE) * 100;
    return Math.round(finished*100)/100;
  }

  function finishedCollege(attributes){
    var a = attributes;
    var finished = ( (a.EDUC10_CY + a.EDUC12_CY + a.EDUC13_CY
      + a.EDUC14_CY + a.EDUC15_CY) / a.EDUCA_BASE) * 100;
    return Math.round(finished*100)/100;
  }

  var map = new Map({
    basemap: "gray",
    layers: [ mexicoLayer ]
  });

  var view = new MapView({
    map: map,
    container: "viewDiv"
  });

  var bg = new BasemapGallery({
    view: view,
    container: document.createElement("div")
  });

  var bgExpand = new Expand({
    view: view,
    content: bg.domNode,
    expandIconClass: "esri-icon-basemap"
  });
  view.ui.add(bgExpand, "top-right");

  bg.watch("activeBasemap", function(newBasemap){
    updateSmartMapping({
      newBasemap: newBasemap
    });
  });

  /**
   * Returns the field(s) or expressions used to drive
   * the visualization based on the selected attribute in the UI.
   *
   * @return {Object} Object containing the field(s) or expressions
   *                  that will be used to create the data-driven visualization.
   */
  function getDataValue (){
    var variableName = dom.byId("select-field").value;
    return options[variableName];
  }

  ////////////////////////////////////////////////////
  ////
  ////  Generate the renderer and create the slider
  ////  when the data loads
  ////
  ////////////////////////////////////////////////////

  view.when(function(){
    mexicoLayer.when(function(){
      return view.goTo(mexicoLayer.fullExtent).then(function(){
        updateSmartMapping();
      });
    });
  });

  /**
   * Generates the renderer for the given layer based on the given data.
   * Also creates/updates the color slider so that users can dynamically
   * change the renderer.
   *
   * @param {object} params - Method parameters.
   * @param {esri/Basemap} [params.basemap] - The basemap for which to generate the color scheme.
   * @param {esri/layers/FeatureLayer} [params.layer] - The feature layer to visualize.
   * @param {string} [params.theme] - The theme used to determine the visualization.
   */
  function updateSmartMapping(params){
    var dataValue = getDataValue();

    var basemap = params.newBasemap ? params.newBasemap : view.map.basemap;
    var layer = params.layer ? params.layer : mexicoLayer;
    var theme = params.theme ? params.theme : dom.byId("color-renderer-theme").value;
    var fieldName = dataValue.field;
    var normFieldName = dataValue.normalizationField;
    var valueExpression = dataValue.valueExpression;
    var sqlExpression = dataValue.sqlExpression;
    var legendOptions = dataValue.legendOptions;

    // Generate the color renderer based on the given field and
    // normalization field, (or expression), basemap and theme

    colorRendererCreator.createContinuousRenderer({
      basemap: basemap,
      layer: layer,
      field: fieldName,
      normalizationField: normFieldName,
      valueExpression: valueExpression,
      // sqlExpression: sqlExpression,
      theme: theme,
      legendOptions: legendOptions,
      view: view
    }).then(function (rendererResponse){
      if (!layer.visible) {
        layer.visible = true;
      }

      // Set the renderer on the layer
      layer.renderer = rendererResponse.renderer;

      //
      // Calculate the Histogram
      //
      histogram({
        layer: layer,
        field: fieldName,
        normalizationField: normFieldName,
        valueExpression: valueExpression,
        // sqlExpression: sqlExpression,
        numBins: 50,
        view: view
      }).then(function (histogramResponse){

        //
        // Update the ColorSlider and apply histogram
        //
        if(!colorSlider){
          colorSlider = new ColorSlider({
            visualVariable: rendererResponse.visualVariable,
            statistics: rendererResponse.statistics,
            histogram: histogramResponse,
            numHandles: getNumHandles(theme),
            syncedHandles: true,
            container: "color-slider-container"
          });
        } else {
          colorSlider.visualVariable = rendererResponse.visualVariable;
          colorSlider.statistics = rendererResponse.statistics;
          colorSlider.histogram = histogramResponse;
          colorSlider.numHandles = getNumHandles(theme);
          colorSlider.syncedHandles = true;
          colorSlider.maxValue = rendererResponse.statistics.max;
          colorSlider.minValue = rendererResponse.statistics.min;
        }

        ///////////////////////////////////////////////////////////////
        //
        // process slider handle changes and apply new visual variable
        // to renderer
        //
        ///////////////////////////////////////////////////////////////

        on(colorSlider, "data-change", function (sliderValueChange){
          console.log("yep");
          var renderer = layer.renderer.clone();
          renderer.visualVariables = [esriLang.clone(colorSlider.visualVariable)];
          layer.renderer = renderer;
        });

      }).otherwise(function (error){
        console.log("An error occurred while calculating the histogram, Error: %o", error);
      });

    }).otherwise(function (error){
      console.log("An error occurred while creating the color renderer, Error: %o", error);
    });
  }

  /**
   * Update ColorSlider handles based upon theme chosen.
   * @param   {string} theme - Theme used to create visualization
   * @return {number} The number of handles for the slider.
   */
  function getNumHandles(theme){
    var numHandles = 2;
    if (theme !== "high-to-low"){
      numHandles = 3;
    }
    return numHandles;
  }

  /**
   * Set definition expression on features when different population
   * range is selected.
   * @param   {Object|number} evt - Event object or value of population used
   * for the filter.
   * @param   {boolean} clear - Indicates if the extent filter should be cleared.
   * @return {string} The definition expression to apply to the layer.
   */
  function populationFilter (evt, clear){
    var newVal = (evt.target) ? evt.target.value : evt;
    var defExp = "TOTPOP_CY >= " + newVal;
    var existingExpression = mexicoLayer.definitionExpression;

    // If an existing filter on view extent already exists. Keep it
    // and handle the rest of the filtering in filterByExtent

    if(existingExpression && existingExpression.indexOf("OBJECTID") !== -1 && !clear){
      filterByExtent(true);
    }

    // If no extent filter exists, filter by attributes only and reset renderer
    // and slider values

    if(evt.target){
      mexicoLayer.definitionExpression = defExp;
      updateSmartMapping({ layer: mexicoLayer });
    }

    return defExp;
  }

  /**
   * Filter the features by extent and reset renderer and slider values
   *
   * @param {boolean} keepCurrentFilter - Indicates whether to keep the population
   *                                    filter on the layer while filtering by extent.
   */
  function filterByExtent (keepCurrentFilter){
    var defExp;
    var qt = new QueryTask({
      url: url
    });

    var extent = view.extent;
    // If an extent currently exists and user doesn't want it changed, keep it
    currentExtentFilter = (keepCurrentFilter === true) ? currentExtentFilter : extent;

    var params = new Query({
      geometry: currentExtentFilter,
      spatialRelationship: "intersects"
    });

    qt.executeForIds(params)
      .then(function(ids){

        // Generate SQL expression for querying for features whose OBJECTIDs
        // match those that are within the desired extent
        var exp = [ "OBJECTID in (" ];
        array.forEach(ids, function(id, num){
          exp.push(id);
          if(num !== ids.length - 1){
            exp.push(",");
          }
        });
        exp.push(")");
        var defExp = exp.join("");

        var selectedAttribute = populationSlider.value;

        // Keep filter on attributes if it exists
        if(selectedAttribute > 0){
          defExp += " AND " + populationFilter(selectedAttribute, true);
        }

        // Reset renderer and slider
        mexicoLayer.definitionExpression = defExp;
        updateSmartMapping({
          layer: mexicoLayer
        });
      });
  }

  ////////////////////////////////////////////////////
  ////
  ////  Event handlers
  ////
  ////////////////////////////////////////////////////

  // If the theme changes, update the renderer and the slider

 on(dom.byId("color-renderer-theme"), "change", function(evt){
   updateSmartMapping({
     layer: mexicoLayer,
     theme: evt.target.value
   });
 });

  on(dom.byId("select-field"), "change", updateSmartMapping);
  on(populationSlider, "change", populationFilter);
  on(populationSlider, "input", function(){
    dom.byId("population-display").innerText = parseInt(populationSlider.value).toLocaleString('en-US');
  });
  on(dom.byId("extent-filter"), "click", filterByExtent);

  // Clear extent filter if desired
  on(dom.byId("clear-extent-filter"), "click", function(evt){
    var defExp = null;

    var selectedPopulation = populationSlider.value;
    defExp = populationFilter(selectedPopulation, true);

    mexicoLayer.definitionExpression = defExp;
    updateSmartMapping({
      layer: mexicoLayer
    });
  });

});