# Building Interactive Web Apps Using the JavaScript API's Geometry Engine

length: 60 min

presenters: Kristian Ekenes, Dave Bayer

Mar. 8, 2018 4:00 p.m. - 5:00 p.m.

Palm Springs Convention Center, Smoketree A-E

### Summary

This session delves into the ArcGIS API for JavaScript GeometryEngine and demonstrates a few of the powerful UX capabilities it can bring to web applications. We’ll review how GeometryEngine can be used to customize editing applications, providing instant feedback to the user. It allows you to control a user’s editing operations before they push final edits to the server. Also, come to learn about how the measurement and overlay methods of GeometryEngine can be used to enhance your apps. This session will inspire you to explore other GeometryEngine methods and create complex apps with capabilities that would otherwise not be possible without client-side geometry operations.


### Demos

##### [Editing demo](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-demo/)

This sample was featured in [this blog post](http://blogs.esri.com/esri/arcgis/2015/09/09/geometryengine-part-1-testing-spatial-relationships-and-editing/) in [a series featuring ways to use GeometryEngine](http://blogs.esri.com/esri/arcgis/tag/geometryengine/) in the ArcGIS API for JavaScript.

[![ge-demo](http://blogs.esri.com/esri/arcgis/files/2015/09/ge-editing.png)](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-demo/)

This app demonstrates how you can use the GeometryEngine to test spatial relationships of your features without making repeated network requests using a GeometryService. This can enhance the user experience while editing data. The edits and tests can be done client-side before they are pushed to the server.

[View the code](http://github.com/ekenes/conferences/tree/master/ds-2018/geometry-engine/demos/ge-demo/index.html)

[View the live sample](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-demo/)

[Click here](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-demo/requests.html) to view the number of network requests avoided in this app by using GeometryEngine

##### Other editing demos

The following demos demonstrate the various ways you can use GeometryEngine in editing apps to enforce topology rules interactively prior to pushing edits to the server.

* [Snapping/nearest vertex](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-nearestvertex/)
* [Simplify geometries](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-simplify/)
* [Prevent self-intersecting lines](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/simple-editing/)

##### Buffer demos

The following demos illustrate the visual difference between geodesic and planar buffers in a Web Mercator projection. When using a Web Mercator or WGS-84 projection, you always want to use geodesic buffers to minimize distortion.

* [Buffer in 2D vs. 3D view](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-buffer/)

##### [GeometyEngine vs. GeometryService](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-gs/)

[![ge-gs](http://blogs.esri.com/esri/arcgis/files/2015/09/ge-gs.png)](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-gs/)

This app times GeometryEngine and GeometryService performing the same operation and compares the two. *Spoiler Alert*: GeometryEngine wins, by a lot. 

Note that the speed difference depends on network speed, the browser and version used, as well as the number of input features in the operation. In this case, more than 500 points are buffered at one time, so the difference in speed is magnified.

[View the code](http://github.com/ekenes/conferences/tree/master/ds-2018/geometry-engine/demos/ge-gs/)

[View the live sample](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-gs/))

##### GeometryEngine measurement demos

The following samples were featured in the [blog post](http://blogs.esri.com/esri/arcgis/2015/09/16/geometryengine-part-2-measurement/) demonstrating the various measurement features of GeometryEngine.

##### [Geodesic vs Planar length](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-length/)

[![ge-geodesic-planar-length](http://blogs.esri.com/esri/arcgis/files/2015/09/ge-length.png)](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-length/)

This sample shows the difference between geodesic buffer and planar buffer in GeometryEngine using a Web Mercator Projection. Refer to [this blog post](http://blogs.esri.com/esri/arcgis/2015/09/16/geometryengine-part-2-measurement/) for an explanation of when to use each.

[View the code](http://github.com/ekenes/conferences/tree/master/ds-2018/geometry-engine/demos/ge-length)

[View the Web Mercator live sample](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-length/)

##### [GeometryEngine overlay demo](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-overlay/)

The following sample was featured in the [blog post](http://blogs.esri.com/esri/arcgis/2015/09/23/geometryengine-part-3-overlay-analysis/) demonstrating the GeometryEngine's overlay methods.

[![ge-overlay](http://blogs.esri.com/esri/arcgis/files/2015/09/ge-overlay2.gif)](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-overlay/)

This sample shows the difference between geodesic buffer and planar buffer in GeometryEngine using a Web Mercator Projection. Refer to [this blog post](http://blogs.esri.com/esri/arcgis/2015/09/23/geometryengine-part-3-overlay-analysis/) for an explanation of when to use each.

[View the code](http://github.com/ekenes/conferences/tree/master/ds-2018/geometry-engine/demos/ge-overlay)

[View the live sample](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/ge-overlay/)

##### [International Space Station: speed approximation](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/iss/)

[This app](http://ekenes.github.io/conferences/ds-2018/geometry-engine/demos/iss/) requests the location of the International Space Station every second and draws its path using a geodesic line. It also calculates the approximate distance travelled since the start of tracking in the app as well as the approximate speed of the space station.