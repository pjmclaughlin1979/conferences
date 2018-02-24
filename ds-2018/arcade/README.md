# ArcGIS API for JavaScript: Using Arcade with Your Apps

length: 60 min

presenters: Kristian Ekenes, Dave Bayer

Mar. 8, 2018 1:00 p.m. - 2:00 p.m.

Palm Springs Convention Center, Primrose A

### Summary

Arcade is a scripting language that may be used to create custom visualizations, popup content, and labeling expressions for apps built on the ArcGIS platform. Sometimes simple calculations can provide more insight instead of field values when creating data-driven visualizations. Arcade allows you to drive visualizations, popup content, and labels by a value returned from an expression rather than a field value. This session will provide an overview of how to navigate the Arcade documenation while highlighting some of the key functions available in Arcade and the ArcGIS API for JavaScript. View examples of how powerful Arcade can be when creating visualizations and labels for a FeatureLayer. Also, observe how the live Arcade editor in ArcGIS Online can be a powerful tool in helping you write, edit, debug, and execute custom expressions.


### Demos

##### [Playground](https://developers.arcgis.com/arcade/playground/)

The playground allows you to choose an Arcade profile and experiment with any expression with test data.


##### [ArcGIS Online web map](https://jsapi.maps.arcgis.com/home/webmap/viewer.html?webmap=f3f83b97f9c14c1abe79ed49810ba023)

###### Visualization

1. Normalization/Rounding (% population that didn't go to school)
2. Calculating new values (% population that went to college)
4. Predominant value (color) + strength of win (opacity)

###### Labels

3. % population that didn't report education
5. Predominant gap (label)


##### [Predominance in JS app](http://ekenes.github.io/conferences/ds-2018/arcade-long/demos/political-parties/)

This app visualizes the predominant political party among registered voters in the county level across the United States. The `Decode()` function of Arcade matches the maximum count of all relevant fields to a string value representing the respective party. This prevents the user or GIS analyst from unnecessarily preforming a series of field calculations in new fields. If the expression is incorrect in any way, it is relatively simple to fix the script as opposed to recalculating fields. Also note that an Arcade expression is used to drive opacity. More opaque features represent counties where the predominant political party is relatively strong. Transparent counties indicate the predominant party barely edges the rival parties based on total count.


##### [Weather](http://ekenes.github.io/conferences/ds-2018/arcade-long/demos/weather/)

This app demonstrates how to use Arcade in simple and complex labeling expressions. As of the time of this presentation, the labeling profile is supported only in the 3.x versions of the ArcGIS API for JavaScript.

The calculation for determining wind direction (N/S/E/W) is done using a field that contains the compass direction of the wind (0-360).

[See a 3D version of this app](https://developers.arcgis.com/javascript/latest/sample-code/layers-featurelayer-labeling-3d/live/index.html)

##### [Wind Chill](http://ekenes.github.io/conferences/ds-2018/arcade-long/demos/wind-chill/)

This sample shows how to use Arcade for performing larger calculations and logicial tests. In this case, wind chill and heat index are calculated based on other field values that are potentially updated very frequently. The math operations aren't very complex, but you can use Arcade to automatically create pseudo-fields such as "Apparent temperature" to display calculated data based on fields that are frequently updated, such as weather data.


##### [Earthquake dates](http://ekenes.github.io/esri-js-samples/4/visualization/arcade-time-day/)

This sample demonstrates how to use the date functions and time offsets to render data based on the local time in the time zone in which the event occurred. In this case we render earthquakes from the last month based on whether or not they occurred in the morning or evening in the local time of the event.


##### [NYC 311 calls](http://ekenes.github.io/esri-js-samples/3/visualization/clustering/)

This sample demonstrates how to use the date functions and time offsets to render data based on the local time in the time zone in which the event occurred. In this case we visualize 311 calls in New York City (2015 data) based on whether or not they occurred in the morning, afternoon, evening, or nighttime of the local time of the event.

##### [Portability: RendererList](http://ekenes.github.io/conferences/ds-2018/arcade-long/demos/renderer-list/)

This app uses the LayerList widget to provide options to the user for setting different renderers on the same data source. Therefore the app avoids making duplicate layer/data queries when loading the visualizations saved in a web map. This sample demonstrates the portability of Arcade since most of the renderers were authored with Arcade in the ArcGIS Online map viewer, but can be read into a custom web application using the ArcGIS API for JavaScript. 

The renderers and data used in this sample were loaded from the [Mexico educational attainment](https://jsapi.maps.arcgis.com/home/item.html?id=8bcfd58b039a4477a0eb734fe6c8d4fe) web map.


##### [Reference Arcade expressions in PopupTemplate](https://developers.arcgis.com/javascript/latest/sample-code/popuptemplate-arcade/live/index.html)

This sample demonstrates how to display values returned from an Arcade expression in a PopupTemplate defined on a FeatureLayer. Arcade is useful for creating visualizations in a FeatureLayer based on a value calculated from an expression executed on the client. PopupTemplates can reference the same expressions used in renderers to effectively communicate the data-driven visualization.


##### [Elevation options](https://developers.arcgis.com/javascript/latest/sample-code/scene-elevationinfo/live/index.html)

This sample shows how to change the elevation information of a 2D FeatureLayer for 3D visualization. Various options are available to customize the elevation of features in a 3D scene by modifying the elevationInfo property of a FeatureLayer.

An Arcade expression can be used to offset the elevation of features from the surface in a 3D app.


##### [Create a Geofence](https://developers.arcgis.com/javascript/3/samples/streamlayer_arcade_geofence/)

This sample demonstrates how to leverage geometry operations within Arcade expressions. A StreamLayer is loaded representing fictional locations of city buses in Los Angeles. The renderer of the layer indicates whether a bus is located within a 3-mile buffer of the LA Convention Center. This is computed using the BufferGeodetic() function included in the Arcade language. Arcade is also used in the popup to compute the distance of each bus from the convention center in miles.