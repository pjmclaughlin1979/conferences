import esri = __esri;
import FeatureFilter = require("esri/views/layers/support/FeatureFilter");
import FeatureEffect = require("esri/views/layers/support/FeatureEffect");

declare var am4core: any;
declare var am4charts: any;

declare var am4themes_dataviz: any;
declare var am4themes_animated: any;

am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);

let overHandler: any;
let mousemoveEnabled = true;

export function createChart(layerView: esri.FeatureLayerView, data: ChartData[]): any {
  let chart = am4core.create("chartDiv", am4charts.XYChart);
  chart.maskBullets = false;

  let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  let yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

  xAxis.dataFields.category = "timeOfDay";
  yAxis.dataFields.category = "season";

  xAxis.renderer.grid.template.disabled = true;
  xAxis.renderer.minGridDistance = 40;

  yAxis.renderer.grid.template.disabled = true;
  yAxis.renderer.inversed = true;
  yAxis.renderer.minGridDistance = 30;

  let series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.categoryX = "timeOfDay";
  series.dataFields.categoryY = "season";
  series.dataFields.value = "value";
  series.sequencedInterpolation = true;
  series.defaultState.transitionDuration = 3000;

  let bgColor = new am4core.InterfaceColorSet().getFor("background");

  let columnTemplate = series.columns.template;
  columnTemplate.strokeWidth = 1;
  columnTemplate.strokeOpacity = 0.2;
  columnTemplate.stroke = bgColor;
  columnTemplate.tooltipText = "{season}, {timeOfDay}: {value.workingValue.formatNumber('#.')}";
  columnTemplate.width = am4core.percent(100);
  columnTemplate.height = am4core.percent(100);

  series.heatRules.push({
    target: columnTemplate,
    property: "fill",
    min: am4core.color(bgColor),
    max: chart.colors.getIndex(0)
  });

  // heat legend
  let heatLegend = chart.bottomAxesContainer.createChild(am4charts.HeatLegend);
  heatLegend.width = am4core.percent(100);
  heatLegend.series = series;
  heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
  heatLegend.valueAxis.renderer.minGridDistance = 30;

  function filterChart (event: any) {
    // console.log("over", event);
    handleHover(event.target);

    const dataItem = event.target.dataItem;
    const season = dataItem.categoryY;
    const timeOfDay = dataItem.categoryX;
    if(mousemoveEnabled){
      layerView.filter = new FeatureFilter({
        where: `Season = '${season}' AND timeOfDay = '${timeOfDay}'`
      });
    }
    
  }

  // heat legend behavior
  overHandler = series.columns.template.events.on("over", filterChart);

  series.columns.template.events.on("hit", (event: any) => {
    mousemoveEnabled = !mousemoveEnabled;
    filterChart(event);
    console.log("hit", event);
    handleHover(event.target);
    console.log("event handler: ", overHandler);
  })

  function handleHover(column: any) {
    if (!isNaN(column.dataItem.value)) {
      heatLegend.valueAxis.showTooltipAt(column.dataItem.value)
    }
    else {
      heatLegend.valueAxis.hideTooltip();
    }
  }

  document.getElementById("chartDiv").addEventListener("mouseleave", () => {
    if(mousemoveEnabled){
      layerView.filter = new FeatureFilter({
        where: `1=1`
      });
    }
  });

  series.columns.template.events.on("out", (event: any) => {
    // console.log("out", event);
    heatLegend.valueAxis.hideTooltip();
  })

  chart.data = data;
  return chart;
}

export function updateChart(chart:any, data: Object[]){
  chart.data = data;
}
