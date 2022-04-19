import maplibregl from 'maplibre-gl'; // or "const maplibregl = require('maplibre-gl');"
import * as d3 from 'd3'
import * as topojson from 'topojson'
import ScrollyTeller from "shared/js/scrollyteller"
import overlaysGeo from 'assets/json/areas-16m.json'

const atomEl = d3.select('#maplibre-container').node();
const isMobile = window.matchMedia('(max-width: 800px)').matches;

const width = atomEl.getBoundingClientRect().width;
const height = isMobile ? window.innerHeight : 426 * width / 714.96;

d3.select('#maplibre-container').style('height', height + 'px')

let bounds = [
		[22.1328398030001097,44.3810488950000490],
		[40.1595430910001028,52.3689492800000806]
	];

var map = new maplibregl.Map({
container: 'maplibre-container', // container id
style: {
	version: 8,
	sources: {
		'raster-tiles': {
			type: 'raster',
			tiles: ['https://interactive.guim.co.uk/maptiles/xyz-tiles/{z}/{x}/{y}.jpg'],
			tileSize: 256
		}
	},
	'layers': [
		{
			id: 'simple-tiles',
			type: 'raster',
			source: 'raster-tiles',
			minzoom: 3,
			maxzoom: 12
		}
	]
},
center: [30.5238,50.45466], // starting position
zoom: 3, // starting zoom
minZoom: 3,
maxZoom: 12
});



map.fitBounds(bounds,{maxZoom:5})

/*map.scrollZoom.disable();
map.boxZoom.disable();*/
//map.dragPan.disable();

map.on('load', function () {
	map.resize();

    map.addSource('vector-tiles', {
        type: 'vector',
        tiles: ['https://interactive.guim.co.uk/maptiles/vector-tiles-test/{z}/{x}/{y}.pbf'],
        minZoom: 0,
		maxZoom: 3
    });

    let layer = topojson.merge(overlaysGeo, overlaysGeo.objects.areas.geometries.filter(f => f.properties.layer === 'overlay-2202'))

	map.addSource('disputed', {
		'type': 'geojson',
		'data': layer
	})

	map.addLayer({
		'id': 'disputed',
		'type': 'fill',
		'source': 'disputed',
		'layout': {},
		'paint': {
			'fill-color': '#c70000',
			'fill-opacity': 0.3
		}
	});
})

map.on('zoom', () => {
	console.log(map.getZoom())
	console.log('------------------------------------')
	console.log( map.getBounds())
})

const scrolly = new ScrollyTeller({
	parent: document.querySelector("#scrolly-1"),
    triggerTop: .5, // percentage from the top of the screen that the trigger should fire
    triggerTopMobile: 0.75,
    transparentUntilActive: false
});

scrolly.addTrigger({num: 1, do: () => {
	map.fitBounds(bounds, {maxZoom:5})

	console.log(map.getZoom())
	
}})

scrolly.addTrigger({num: 2, do: () => {

	console.log('paso por aqui')

	map.flyTo({
		center: [30.523399,50.450100],
		zoom: 10,
		curve: 3, 
		essential: true
	});

}})

scrolly.addTrigger({num: 3, do: () => {

	console.log('paso por aqui')

	map.flyTo({
		center: [33.947754, 46],
		zoom: 6,
		curve: 3, 
		essential: true
	});

}})

scrolly.watchScroll();


