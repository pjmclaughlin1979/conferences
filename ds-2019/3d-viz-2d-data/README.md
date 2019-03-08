# Practical Guide for Building a 3D Web App From 2D Data

length: 60 min

presenters: Raluca Nicola, Kristian Ekenes

Mar. 7, 2019 10:30 a.m. - 11:30 a.m.

Palm Springs Convention Center, Smoketree A-E

## Summary

Have you hesitated to build 3D apps because they look complicated or you lack the necessary data? In this session, learn how to build a 3D app using your 2D data and the resources provided out of the box by Esri and the ArcGIS API for JavaScript. Even if your data doesn't contain Z-values, you can build sophisticated 3D apps that leverage modern browser technology to render your 2D features with 3D symbology.

## Outline

- Building extrusion
- 3D models
- Z values from attributes

## Demos

### [Trees](https://ekenes.github.io/conferences/ds-2019/3d-viz-2d-data/demos/trees/2-models.html)

Visualizes trees with their real world sizes using a 3D model provided out-of-the-box in the ArcGIS API for JavaScript.

### [GeoJSON earthquakes](https://ycabon.github.io/2019-devsummit-plenary/2_geojson.html)

Demonstrates how to use a layer's attributes to calculate z values for each feature so it renders its position
correctly in a 3D scene.

### [Ecological Marine Units](https://ekenes.github.io/esri-ts-samples/visualization/emu/3d/)

Visualizes points as 3D cylinders to represent a section of the Indian Ocean. Each point has various data attributes that can be explored, filtered, and sliced. This demonstrates how to represent a point as a volume and how to place that point correctly with a z value that comes from an attribute (not from geometry). It also shows how you can add exaggeration to an elevation surface to make a more pleasing visual. The exaggeration also coincides with all the elevation values in the data.

### [Hiking Trails](https://ralucanicola.github.io/hiking-app/)

A 3D progressive web application allowing you to explore Swiss hiking trails.

[Live app](https://ralucanicola.github.io/hiking-app/)

[Code](https://github.com/RalucaNicola/hiking-app)

### [3D elevation contours](https://ralucanicola.github.io/JSAPI_demos/malta-contour-lines/)

A 3D thematic representation of contour data.

[Live app](https://ralucanicola.github.io/JSAPI_demos/malta-contour-lines/)

[Code](https://github.com/RalucaNicola/JSAPI_demos/tree/master/malta-contour-lines)
