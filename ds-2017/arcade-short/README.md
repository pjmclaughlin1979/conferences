# Using Arcade in your ArcGIS API for JavaScript Apps

length: 30 min
presenters: Kristian Ekenes, Dave Bayer
Mar. 8, 2017 2:30 pm - 3:00 pm
Palm Springs Convention Center, Demo Theater 1 - Oasis 1

### Summary

Arcade is a new scripting language that may be used to create custom visualizations and labeling expressions for apps built on the ArcGIS platform. Sometimes simple calculations can provide more insight instead of field values when creating data-driven visualizations and label expressions. Arcade allows you to drive both visualizations and labels by a value returned from an expression rather than a field value. This session will provide an overview of how to navigate the Arcade documenation while highlighting some of the key functions available in Arcade. View examples of how powerful Arcade can be when creating visualizations and labels for a FeatureLayer. Also, observe how the live Arcade editor in ArcGIS Online can be a powerful tool in helping you write, edit, and execute custom expressions.


### Demos

##### [Playground](https://developers.arcgis.com/arcade/playground/)

The playground allows you to choose an Arcade profile and experiment with any expression with test data.


##### [ArcGIS Online web map](https://jsapi.maps.arcgis.com/home/webmap/viewer.html?webmap=f3f83b97f9c14c1abe79ed49810ba023)

###### Visualization

1. Normalization/Rounding (% population that didn't go to school)
2. Calculating new values (% population that went to college)

###### Labels

3. % population that didn't report education


##### [Weather](https://ekenes.github.io/conferences/ds-2017/arcade-long/demos/weather/)

This app demonstrates how to use Arcade in simple and complex labeling expressions. As of the time of this presentation, the labeling profile is supported only in the 3.x versions of the ArcGIS API for JavaScript.

The calculation for determining wind direction (N/S/E/W) is done using a field that contains the compass direction of the wind (0-360).


##### [Predominance in JS app](https://ekenes.github.io/conferences/ds-2017/arcade-long/demos/political-parties/)

This app visualizes the predominant political party among registered voters in the county level accross the United States. The `Decode()` function of Arcade matches the maximum count of all relevant fields to a string value representing the respective party. This prevents the user or GIS analyst from unecessarily preforming a series of field calculations in new fields. If the expression is incorrect in any way, it is relatively simple to fix the script as opposed to recalculating fields. Also note that an Arcade expression is used to drive opacity. More opaque features represent counties where the predominant political party is relatively strong. Transparent counties incidate the predominant party barely edges the rival parties based on total count.


##### [Wind Chill](https://ekenes.github.io/conferences/ds-2017/arcade-long/demos/wind-chill/)

This sample shows how to use Arcade for performing larger calculations and logicial tests. In this case, wind chill and heat index are calculated based on other field values that are potentially updated very frequently. The math operations aren't very complex, but you can use Arcade to automatically create pseudo-fields such as "Apparent temperature" to display calculated data based on fields that are frequently updated, such as weather data.

