import esri = __esri;

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import FeatureFilter = require("esri/views/layers/support/FeatureFilter");
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import { Geometry } from "esri/geometry";
import Graphic = require("esri/Graphic");
import { SimpleFillSymbol } from "esri/symbols";
import { SimpleRenderer } from "esri/renderers";
import { createChart, updateChart } from "./heatmapChart";

( async () => {

  const url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Tornado_Warnings_2002_through_2011/FeatureServer/0";

  const layer = new FeatureLayer({
    url,
    outFields: ["*"]
  });

  const countiesLayer = new FeatureLayer({
    title: "counties",
    portalItem: {
      // 7566e0221e5646f99ea249a197116605
      // 99fd67933e754a1181cc755146be21ca
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
  view.ui.add("chartDiv", "bottom-left");

  createChart();

  const layerView = await view.whenLayerView(layer) as esri.FeatureLayerView;

  // layerView.effect = {
  //   filter: {
  //     geometry: view.center,
  //     distance: 25,
  //     units: "miles"
  //   },
  //   insideEffect: "hue-rotate(90deg)",
  //   outsideEffect: "opacity(30%)"
  // };

  console.log(view);

  let previousId: number;
  view.on("drag", ["Control"], async (event) => {
    event.stopPropagation();
    

    const hitTestResponse = await view.hitTest(event);
    const hitTestResult = hitTestResponse.results.filter( (result) => {
      return result.graphic.layer && result.graphic.layer.title === "counties";
    })[0];

    let countyGraphic: esri.Graphic;
    if (!hitTestResult){
      // layerView.filter = new FeatureFilter({
      //   where: "1=1"
      // });
      // view.graphics.removeAll();
      return;
    } else {
      countyGraphic = hitTestResult.graphic;
    }

    const objectIdField = countiesLayer.objectIdField;
    if(previousId === countyGraphic.attributes[objectIdField]){
      return;
    } else {
      previousId = countyGraphic.attributes[objectIdField];
    }

    let queryOptions = {
      geometry: hitTestResult.mapPoint,//countyGraphic.geometry,
      distance: 25,
      units: "miles",
      spatialRelationship: "intersects"
    };

    const filterOptions = new FeatureFilter(queryOptions);

    // layerView.filter = filterOptions;
    layerView.effect = {
      filter: filterOptions,
      // insideEffect: "saturate(25%)",
      outsideEffect: "grayscale(75%) opacity(60%)"
    };

    const stats = await queryTimeStatistics(layerView, queryOptions);
    updateChart(stats);
    console.log(stats);
  });

  interface QueryTimeStatsParams {
    geometry: esri.Geometry,
    distance?: number,
    units?: string
  }

  async function queryTimeStatistics ( layerView: esri.FeatureLayerView, params: QueryTimeStatsParams): Promise<ChartData[]>{
    const { geometry, distance, units } = params;

    const query = layerView.layer.createQuery();

    query.outStatistics = [ new StatisticDefinition({
      onStatisticField: "MonthOfTheYear",
      outStatisticFieldName: "month_count",
      statisticType: "count"
    }),
     new StatisticDefinition({
      onStatisticField: "1",
      outStatisticFieldName: "value",
      statisticType: "count"
    }),
    new StatisticDefinition({
     onStatisticField: "Season",
     outStatisticFieldName: "season_count",
     statisticType: "count"
   }),
    new StatisticDefinition({
      onStatisticField: "(ExpiredDate - IssueDateTime) / (1000*60)",
      outStatisticFieldName: "avg_duration",
      statisticType: "avg"
    })];
// Season 
// DayOfMonth
    query.groupByFieldsForStatistics = [ "Season + '-' + timeOfDay" ];
    query.geometry = geometry;
    query.distance = distance;
    query.units = units;
    query.returnQueryGeometry = true;

    const queryResponse = await layerView.queryFeatures(query);
    // view.graphics.removeAll();
    // view.graphics.add(new Graphic({
    //   geometry: queryResponse.queryGeometry,
    //   symbol: new SimpleFillSymbol({
    //     color: [125,125,125,0.02],
    //     outline: {
    //       width: 1,
    //       color: "#06350E"
    //     }
    //   })
    // }))
    const responseChartData = queryResponse.features.map( feature => {
      const timeSpan = feature.attributes["Season + '-' + timeOfDay"].split("-");
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

  interface ChartData {
    timeOfDay: "Morning" | "Afternoon" | "Evening" | "Night" | string,
    season: "Winter" | "Spring" | "Summer" | "Fall" | string,
    value: number
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
