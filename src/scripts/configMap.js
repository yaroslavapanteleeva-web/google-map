import {Loader} from '@googlemaps/js-api-loader';
import { close, open } from './utils';

let map, marker, infoWindow, geo;
let markers = [];

const $btnCurrentLocation = document.querySelector('#current-location');
const $form = document.querySelector('#form');
const $modal = document.querySelector('#modal');
const $menu = document.querySelector('.left-panel');
const $inputLat = document.querySelector('#lat');
const $inputLng = document.querySelector('#lng');
const $inputTitle = document.querySelector('#title');
const $inputDescr = document.querySelector('#descr');

const $list = document.querySelector('.list__items');

const loader = new Loader({
    apiKey: "AIzaSyB7bucrvz1sZPgug0sSMKageU5pS1v1r_g",
    version: "weekly",
});

function menuMap(mapDiv) {
    const $menu = document.querySelector('.left-panel');
    const $menuOpen = document.createElement('div');
    $menuOpen.classList.add('menu-hamburger');
    const content = `
        <div class="menu-hamburger__icon">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="menu-hamburger__title">Меню</div>
    `;
    $menuOpen.innerHTML = content;
    mapDiv.appendChild($menuOpen);
    $menuOpen.addEventListener('click', () => {
        open($menu);
    })
}

loader.load().then(() => {
    const opt = {
        zoom: 5,
        center: {lat: 62.66841987344042, lng: 84.609977538208},
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.LEFT_BOTTOM,
            mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain","styled_map"]
        },
    }
    const styledMapType = new google.maps.StyledMapType(
        [
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#193341"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2c5a71"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#29768a"
                    },
                    {
                        "lightness": -37
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#406d80"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#406d80"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#3e606f"
                    },
                    {
                        "weight": 2
                    },
                    {
                        "gamma": 0.84
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "weight": 0.6
                    },
                    {
                        "color": "#1a3541"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2c5a71"
                    }
                ]
            }
        ],
        { name: "Тема" }
    );
    map = new google.maps.Map(document.getElementById("map"), opt);
    geo = new google.maps.Geocoder();
    infoWindow = new google.maps.InfoWindow();
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");
    // create block menu
    const menuMapDiv = document.createElement("div");
    menuMap(menuMapDiv);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(menuMapDiv);

    $btnCurrentLocation.addEventListener("click", () => {
        geocodeCurrentLocation(geo, map, infoWindow, marker);
        close($menu);
    });
    $form.addEventListener('submit', (e) => {
        e.preventDefault();
        geocodeLatLng(geo, map, $inputLat.value, $inputLng.value, $inputTitle.value, $inputDescr.value);
        close($menu);
        $modal.classList.remove('open');
        $inputLat.value = '';
        $inputLng.value = '';
        $inputTitle.value = '';
        $inputDescr.value = '';
    });
});

function geocodeCurrentLocation(geo, map, infoWindow, marker) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            const svgMarker = {
                path:
                    "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                fillColor: "red",
                fillOpacity: 1,
                strokeWeight: 0,
                rotation: 0,
                scale: 2,
                anchor: new google.maps.Point(15, 30),
            };
            marker = new google.maps.Marker({
                position: pos,
                map,
                icon: svgMarker
            });
            marker.setMap(map);
            map.setCenter(pos);
            google.maps.event.addListener(marker, 'click', (e) => {
                geo.geocode({location: pos}, (results, status) => {
                    if (status === "OK") {
                        if (results[0]) {
                            map.setZoom(15);
                            infoWindow.setContent(results[0].formatted_address);
                            infoWindow.open(map, marker);
                        } else {
                          window.alert("No results found");
                        }
                    } else {
                        window.alert("Geocoder failed due to: " + status);
                    }
                })
            })
        }, () => {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function geocodeLatLng(geo, map, lat, lng, title, descr) {
    const latlng = {
      lat: +lat,
      lng: +lng
    };
    const contentString = `<h2>${title}</h2><div>${descr}</div>`;
    geo.geocode({ location: latlng }, (results, status) => {
        if (status === "OK") {
            if (results[0]) {
                map.setZoom(15);
                const newMarker = new google.maps.Marker({
                    position: latlng
                });
                const newInfowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                newMarker.addListener('click', () => {
                    newInfowindow.open(map, newMarker);
                });
                map.setCenter(latlng);
                markers.push({marker: newMarker, title: title});
                $list.innerHTML = '';
                for (let i = 0; i < markers.length; i++) {
                    
                    markers[i]["marker"].setMap(map);
                    const content = `<li class="list__item">${markers[i].title}<span data-close="${i}">&times;</span></li>`;
                    $list.innerHTML += content;
                   
                }
                $list.querySelectorAll('[data-close]').forEach((el, index) => {
                    let id;
                    el.addEventListener('click', (e) => {
                        const target = e.target;
                        id = +(target.dataset.close);
                        markers[id]["marker"].setMap(null);
                        markers.splice(id, 1);
                        target.parentNode.remove();
                    })  
                });
            } else {
            window.alert("No results found");
            }
        } else {
            window.alert("Geocoder failed due to: " + status);
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}
