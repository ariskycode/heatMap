var firmCount = [
    {stateId:	1	, count:	374153	},
    {stateId:	10	, count:	73418	},
    {stateId:	11	, count:	63408	},
    {stateId:	12	, count:	2100187	},
    {stateId:	13	, count:	929864	},
    {stateId:	15	, count:	118454	},
    {stateId:	16	, count:	146642	},
    {stateId:	17	, count:	1135017	},
    {stateId:	18	, count:	479059	},
    {stateId:	19	, count:	259121	},
    {stateId:	2	, count:	68032	},
    {stateId:	20	, count:	239118	},
    {stateId:	21	, count:	331546	},
    {stateId:	22	, count:	414291	},
    {stateId:	23	, count:	139570	},
    {stateId:	24	, count:	531953	},
    {stateId:	25	, count:	607664	},
    {stateId:	26	, count:	834087	},
    {stateId:	27	, count:	489494	},
    {stateId:	28	, count:	235454	},
    {stateId:	29	, count:	491606	},
    {stateId:	30	, count:	112419	},
    {stateId:	31	, count:	164089	},
    {stateId:	32	, count:	227156	},
    {stateId:	33	, count:	131638	},
    {stateId:	34	, count:	792088	},
    {stateId:	35	, count:	151363	},
    {stateId:	36	, count:	2008988	},
    {stateId:	37	, count:	805985	},
    {stateId:	38	, count:	68270	},
    {stateId:	39	, count:	904814	},
    {stateId:	4	, count:	499926	},
    {stateId:	40	, count:	327229	},
    {stateId:	41	, count:	339305	},
    {stateId:	42	, count:	975453	},
    {stateId:	44	, count:	94642	},
    {stateId:	45	, count:	367726	},
    {stateId:	46	, count:	81314	},
    {stateId:	47	, count:	550453	},
    {stateId:	48	, count:	2356748	},
    {stateId:	49	, count:	251419	},
    {stateId:	5	, count:	231959	},
    {stateId:	50	, count:	75827	},
    {stateId:	51	, count:	653193	},
    {stateId:	53	, count:	541522	},
    {stateId:	54	, count:	114435	},
    {stateId:	55	, count:	432980	},
    {stateId:	56	, count:	62427	},
    {stateId:	6	, count:	3548449	},
    {stateId:	72	, count:	0	},
    {stateId:	8	, count:	547352	},
    {stateId:	9	, count:	326693	}
];

var mapStyle = [
    {
        'stylers': [{'visibility': 'off'}]
    }, 
    {
        'featureType': 'landscape',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
    }, 
    {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'on'}, {'color': '#bfd4ff'}]
    }];
var map;

function initMap() {

// load the map
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40, lng: -100},
    zoom: 4,
    styles: mapStyle
});


// set up the style rules and events for google.maps.Data
map.data.setStyle(styleFeature);
map.data.addListener('mouseover', mouseInToRegion);
map.data.addListener('mouseout', mouseOutOfRegion);

// state polygons only need to be loaded once, do them now
loadMapShapes();

google.maps.event.addListenerOnce(map.data, 'addfeature', function() {
    firmCount.forEach(function(state) {
        console.log(state.stateId);
    map.data.getFeatureById(state.stateId).setProperty('count', state.count);
    });   
});

    }

/** Loads the state boundary polygons from a GeoJSON source. */
function loadMapShapes() {
// load US state outline polygons from a GeoJson file
    map.data.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/states.js', { idPropertyName: 'STATE' });
}


/**
* Applies a gradient style based on the 'census_variable' column.
* This is the callback passed to data.setStyle() and is called for each row in
* the data set.  Check out the docs for Data.StylingFunction.
*
* @param {google.maps.Data.Feature} feature
*/
function styleFeature(feature) {
    var low = [5, 69, 54];  // color of smallest datum
    var high = [151, 83, 34];   // color of largest datum

    // delta represents where the value sits between the min and max
    var delta = (feature.getProperty('count')) / (3548449);

    var color = [];
    for (var i = 0; i < 3; i++) {
        // calculate an integer color based on the delta
        color[i] = (high[i] - low[i]) * delta + low[i];
    }

    // determine whether to show this shape or not
    var showRow = true;
    if (feature.getProperty('count') == null ||
        isNaN(feature.getProperty('count'))) {
            showRow = false;
    }

    var outlineWeight = 0.5, zIndex = 1;
    if (feature.getProperty('state') === 'hover') {
        outlineWeight = zIndex = 2;
    }

    return {
        strokeWeight: outlineWeight,
        strokeColor: '#fff',
        zIndex: zIndex,
        fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
        fillOpacity: 0.75,
        visible: showRow
    };
}

/**
* Responds to the mouse-in event on a map shape (state).
*
* @param {?google.maps.MouseEvent} e
*/
function mouseInToRegion(e) {
    // set the hover state so the setStyle function can change the border
    e.feature.setProperty('state', 'hover');

    var percent = (e.feature.getProperty('count')) / 3548449 * 100;

    // update the label
    document.getElementById('data-label').textContent = e.feature.getProperty('NAME');
    document.getElementById('data-value').textContent = e.feature.getProperty('count');
    document.getElementById('data-box').style.display = 'block';
    document.getElementById('data-caret').style.display = 'block';
    document.getElementById('data-caret').style.paddingLeft = percent + '%';
}

/**
* Responds to the mouse-out event on a map shape (state).
*
* @param {?google.maps.MouseEvent} e
*/
function mouseOutOfRegion(e) {
    // reset the hover state, returning the border to normal
    e.feature.setProperty('state', 'normal');
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}