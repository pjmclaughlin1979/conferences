Building interactive web apps using the JavaScript API's GeometryEngine
=======================================================================

Click the links below to access live views of the following samples used in this talk.

* [Orchards](https://ekenes.github.io/conferences/ds-2016/ge-demo-theater/demos/ge-orchards) - This simple editing app demos various capabilities of the GeometryEngine including geodesicArea, disjoint, equals, crosses, cut, union, within, intersects, difference, and offset. Use the cut operatiopn to see how fast the the Geometry Engine cuts and calculates the areas of geometries. Try adding a feature that overlaps existing features to see how you can "fix" geometries input by the user so they are topologically correct with existing geometries.

* [Requests avoided](https://ekenes.github.io/conferences/ds-2016/ge-demo-theater/demos/ge-orchards/requests.html) - This is the same as the previous sample with the exception that the number of network requests avoided is printed to the bottom right of the view.

* [GeometryEngine vs. GeometryService](https://ekenes.github.io/conferences/ds-2016/ge-demo-theater/demos/ge-gs) - This demo uses the 4.0 API to buffer 500 points (world cities) by 500 miles. This is done in two views. One uses the GeometryEngine, the other uses GeometryService. Both are timed. See how much faster the GeometryEngine calculates the buffers than the GeometryService.

* [Sensitive land](https://ekenes.github.io/conferences/ds-2016/ge-demo-theater/demos/ge-overlay) - This demo uses several of the overlay methods of the Geometry Engine to calculate the land area of sensitive and non-sensitive land within 10 miles of a buffered location. The following operations are used: geodesicBuffer, within, overlaps, intersect, intersects, union, difference, and geodesicArea.

* [Measurement](https://ekenes.github.io/conferences/ds-2016/ge-demo-theater/demos/ge-length) - This app demonstrates the difference between geodesicLength and planarLength when the spatial reference of the map is Web Mercator. If the SR of the map is Web Mercator or a Geographic Coordinate System, then you should always use geodesicLength/geodesicArea/geodesicBuffer. If you are working in a Projected Coordinate System other than Web Mercator then you should use planarLength/planarArea/buffer.

* [Geodesic vs. Planar buffer](https://ekenes.github.io/conferences/ds-2016/ge-deep-dive/demos/ge-buffer) - In this app, the location of the mouse cursor is buffered with both a planar and a geodesic buffer on each mouse move. Notice the difference between the two buffers as you move away from the equator. The geodesic buffer is more correct.