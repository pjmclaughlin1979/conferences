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
    basemap: "streets",
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

  const layerView = await view.whenLayerView(layer) as esri.FeatureLayerView;

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
      layerView.filter = new FeatureFilter({
        where: "1=1"
      });
      view.graphics.removeAll();
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
      geometry: countyGraphic.geometry
    };

    const filterOptions = new FeatureFilter(queryOptions);
    layerView.filter = filterOptions;

    const stats = await queryTimeStatistics(layerView, queryOptions);
    console.log(stats);
  });

  interface QueryTimeStatsParams {
    geometry: esri.Geometry,
    distance?: number,
    units?: string
  }

  async function queryTimeStatistics ( layerView: esri.FeatureLayerView, params: QueryTimeStatsParams): Promise<Object[]>{
    const { geometry, distance, units } = params;

    const query = layerView.layer.createQuery();

    query.outStatistics = [ new StatisticDefinition({
      onStatisticField: "1",
      outStatisticFieldName: "total_count",
      statisticType: "count"
    }), new StatisticDefinition({
      onStatisticField: "(ExpiredDate - IssueDateTime) / (1000*60)",
      outStatisticFieldName: "avg_duration",
      statisticType: "avg"
    }) ];
    query.groupByFieldsForStatistics = [ "MonthOfTheYear" ];
    query.geometry = geometry;
    query.distance = distance;
    query.units = units;
    query.returnQueryGeometry = true;

    const queryResponse = await layerView.queryFeatures(query);
    view.graphics.removeAll();
    view.graphics.add(new Graphic({
      geometry: queryResponse.queryGeometry,
      symbol: new SimpleFillSymbol()
    }))
    return queryResponse.features.map( feature => {
      return {
        month: feature.attributes.MonthOfTheYear,
        avg_duration_minutes: Math.round(feature.attributes.avg_duration),
        count: feature.attributes.total_count
      };
    });
  }

})();
