import esri = __esri;

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import FeatureFilter = require("esri/views/layers/support/FeatureFilter");
import FeatureEffect = require("esri/views/layers/support/FeatureEffect");
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import { Geometry } from "esri/geometry";
import Graphic = require("esri/Graphic");
import { SimpleFillSymbol } from "esri/symbols";
import { SimpleRenderer } from "esri/renderers";
import { createChart, updateChart } from "./heatmapChart";

import Expand = require("esri/widgets/Expand");

( async () => {

  const url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Tornado_Warnings_2002_through_2011/FeatureServer/0";

  const layer = new FeatureLayer({
    url,
    outFields: ["*"]
  });

  const countiesLayer = new FeatureLayer({
    title: "counties",
    portalItem: {
      id: "7566e0221e5646f99ea249a197116605"
    },
    renderer: new SimpleRenderer({
      symbol: new SimpleFillSymbol({
        color: [ 0,0,0,0 ],
        outline: null
      })
    })
  });

  const map = new EsriMap({
    basemap: "gray-vector",
    layers: [ layer, countiesLayer ]
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    extent: {
      "spatialReference": {
        "wkid": 3857
      },
      "xmin": -12413984.889735641,
      "ymin": 2697099.652298753,
      "xmax": -7370364.015367912,
      "ymax": 6865057.930631735
    }
  });

  await view.when();
  view.ui.add(new Expand({
    view,
    content: document.getElementById("chartContainer"),
    expandIconClass: "esri-icon-chart",
    group: "top-left"
  }), "top-left");
  view.ui.add(new Expand({
    view,
    content: document.getElementById("seasons-filter"),
    expandIconClass: "esri-icon-filter",
    group: "top-left"
  }), "top-left");

  const layerView = await view.whenLayerView(layer) as esri.FeatureLayerView;

  const layerStats = await queryLayerStatistics(layer);
  console.log(JSON.stringify(layerStats));
  let chart = createChart(layerView, layerStats);

  let mousemoveEnabled = true;
  const seasonsElement = document.getElementById("seasons-filter");
  seasonsElement.addEventListener("mousemove", filterBySeason);

  function filterBySeason (event: any) {
    const selectedSeason = event.target.getAttribute("data-season");
    const seasonsNodes = document.querySelectorAll(`.season-item`);
    seasonsNodes.forEach( (node:HTMLDivElement) => {
      const season = node.innerText;
      if(season !== selectedSeason){
        if(node.classList.contains("visible-season")) {
          node.classList.remove("visible-season");
        }
      } else {
        if(!node.classList.contains("visible-season")) {
          node.classList.add("visible-season");
        }
      }
    });

    layerView.filter = new FeatureFilter({
      where: `Season = '${selectedSeason}'`
    });
  }

  seasonsElement.addEventListener("mouseleave", () => {
    const seasonsNodes = document.querySelectorAll(`.season-item`);
    if (mousemoveEnabled){
      seasonsNodes.forEach( (node:HTMLDivElement) => {
        node.classList.add("visible-season");
      });
      layerView.filter = new FeatureFilter({
        where: `1=1`
      });
    }
  });

  seasonsElement.addEventListener("click", (event:any) => {
    mousemoveEnabled = !mousemoveEnabled;
    if(mousemoveEnabled){
      filterBySeason(event);
      seasonsElement.addEventListener("mousemove", filterBySeason);
    } else {
      seasonsElement.removeEventListener("mousemove", filterBySeason);
    }
  });

  console.log(view);

  view.on("drag", ["Control"], async (event) => {
    event.stopPropagation();

    let queryOptions = {
      geometry: view.toMap(event),
      distance: 50,
      units: "miles",
      spatialRelationship: "intersects"
    };

    const filterOptions = new FeatureFilter(queryOptions);

    // layerView.filter = filterOptions;
    layerView.effect = new FeatureEffect({
      filter: filterOptions,
      // insideEffect: "saturate(25%)",
      outsideEffect: "grayscale(75%) opacity(60%)"
    });

    const stats = await queryTimeStatistics(layerView, queryOptions);
    updateChart(chart, stats);
  });

  interface QueryTimeStatsParams {
    geometry?: esri.Geometry,
    distance?: number,
    units?: string
  }

  async function queryTimeStatistics ( layerView: esri.FeatureLayerView, params: QueryTimeStatsParams): Promise<ChartData[]>{
    const { geometry, distance, units } = params;

    const query = layerView.layer.createQuery();

    query.outStatistics = [
      new StatisticDefinition({
        onStatisticField: "1",
        outStatisticFieldName: "value",
        statisticType: "count"
      })
    ];
    query.groupByFieldsForStatistics = [ "Season + '-' + timeOfDay" ];
    query.geometry = geometry;
    query.distance = distance;
    query.units = units;
    query.returnQueryGeometry = true;

    const queryResponse = await layerView.queryFeatures(query);

    const responseChartData = queryResponse.features.map( feature => {
      const timeSpan = feature.attributes["EXPR_1"].split("-");
      const season = timeSpan[0];
      const timeOfDay = timeSpan[1];
      return {
        timeOfDay,
        season, 
        value: feature.attributes.value
      };
    });

    return createDataObjects(responseChartData);
  }

  async function queryLayerStatistics(layer: esri.FeatureLayer): Promise<ChartData[]> {
    const query = layer.createQuery();
    query.outStatistics = [
      new StatisticDefinition({
        onStatisticField: "1",
        outStatisticFieldName: "value",
        statisticType: "count"
      })
    ];
    query.groupByFieldsForStatistics = [ "Season + '-' + timeOfDay" ];

    const queryResponse = await layer.queryFeatures(query);

    const responseChartData = queryResponse.features.map( feature => {
      const timeSpan = feature.attributes["EXPR_1"].split("-");
      const season = timeSpan[0];
      const timeOfDay = timeSpan[1];
      return {
        timeOfDay,
        season, 
        value: feature.attributes.value
      };
    });
    return createDataObjects(responseChartData);
  }

  function createDataObjects(data: ChartData[]): ChartData[] {
    const timesOfDay = [ "Morning" , "Afternoon" , "Evening" , "Night" ];
    const seasons = [ "Winter" , "Spring" , "Summer" , "Fall" ];

    let formattedChartData: ChartData[] = [];

    timesOfDay.forEach( timeOfDay => {
      seasons.forEach( season => {

        const matches = data.filter( datum => {
          return datum.season === season && datum.timeOfDay === timeOfDay;
        });

        formattedChartData.push({
          timeOfDay,
          season,
          value: matches.length > 0 ? matches[0].value : 0
        });

      });
    });

    return formattedChartData;
  }

})();
