A deep dive on how the Geometry Engine can help you build better apps
=========================================================

Click the links below to access live views of the following samples used in this talk.

* [Orchards](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-demo) - This simple editing app demos various capabilities of the GeometryEngine including geodesicArea, disjoint, equals, crosses, cut, union, within, intersects, difference, and offset. Use the cut operatiopn to see how fast the the Geometry Engine cuts and calculates the areas of geometries. Try adding a feature that overlaps existing features to see how you can "fix" geometries input by the user so they are topologically correct with existing geometries.

* [Requests avoided](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-demo/requests.html) - This is the same as the previous sample with the exception that the number of network requests avoided is printed to the bottom right of the view.

* [GeometryEngine vs. GeometryService](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-gs) - This demo uses the 4.0 API to buffer 500 points (world cities) by 500 miles. This is done in two views. One uses the GeometryEngine, the other uses GeometryService. Both are timed. See how much faster the GeometryEngine calculates the buffers than the GeometryService.

* [Sensitive land](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-overlay) - This demo uses several of the overlay methods of the Geometry Engine to calculate the land area of sensitive and non-sensitive land within 10 miles of a buffered location. The following operations are used: geodesicBuffer, within, overlaps, intersect, intersects, union, difference, and geodesicArea.

* [Measurement](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-length) - This app demonstrates the difference between geodesicLength and planarLength when the spatial reference of the map is Web Mercator. If the SR of the map is Web Mercator or a Geographic Coordinate System, then you should always use geodesicLength/geodesicArea/geodesicBuffer. If you are working in a Projected Coordinate System other than Web Mercator then you should use planarLength/planarArea/buffer.

* [Geodesic vs. Planar buffer](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-buffer) - In this app, the location of the mouse cursor is buffered with both a planar and a geodesic buffer on each mouse move. Notice the difference between the two buffers as you move away from the equator. The geodesic buffer is more correct.

* [Missle launch in 2D](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/missilelaunch/www) - This app depicts the difference between geodesicBuffer and buffer using missile ranges.

* [Missle launch in 3D (using 4.0)](https://ekenes.github.io/conferences/ds-2016/demos/ge-deep-dive/missilelaunch4/www) - This app demonstrates the difference between geodesicBuffer and buffer using missile ranges in a 3D SceneView.

* [Snapping](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-nearestvertex) - This demos how to enable snapping in custom editing apps using the GeometryEngine's nearestVertex and nearestCoordinate methods. 

* [Simplify](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-simplify) - This app demos how you can check if a geometry is simple. If it is not simple, you can use the simplify method in the GeometryEngine to simplify it.

* [Geo fence - visualize the StreamLayer](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-viz/coffee-color.html) - This app uses the geometryEngine to buffer coffee shop locations in Seattle by a specified distance. A stream service of buses is then renderered based on how many buffers each point intersects. The intersects method is used inside a function set on the field property of a colorInfo visual variable to determine this.

* [Geo fence - visualize the stores](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-viz/coffee-stores.html) - This app uses the geometryEngine to buffer coffee shop locations in Seattle by a specified distance. The points representing coffee shops are sized based on the number of busses from a Stream service intersect the buffer. This is figured in a simple function set to the field property of the parameters object passed into a smart mapping module for determining the appropriate size range.

* [Production editing app (TypeScript)](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/editingdemo/www) - This app demonstrates how you could use the Geometry Engine in a production editing app to check the validity of geometries client side before sending them back to the server using applyEdits() on the FeatureLayer.