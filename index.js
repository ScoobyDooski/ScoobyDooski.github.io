//Initialising Leaflet JS Map and tileset
var mymap = L.map('mapid').setView([54.978, -1.618], 15);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2Nvb2J5ZG9vc2tpIiwiYSI6ImNrY3lkbXJoZjA4eTQycm5oaW8wcjhtdmkifQ.t3uw0LN6qHE1ppd_dKODFg'
}).addTo(mymap);
//Used to create different icon images used to change color of icons later
var fullIcon = L.icon({
    iconUrl: 'images/red.png',
    iconSize: [35, 50]
});
var emptyIcon = L.icon({
    iconUrl: 'images/green.png',
    iconSize: [35, 50]
})
var gettingFullIcon = L.icon({
    iconUrl: 'images/yellow.png',
    iconSize: [35, 50]
})
var waitingIcon = L.icon({
    iconUrl: 'images/black.png',
    iconSize: [35,50]
})
//Websocket connection to Urban observatory API
const ws = new WebSocket("wss://api.newcastle.urbanobservatory.ac.uk/stream");

//Creates the array of all car park locations, as well as their relevant info
const markers = [{name: "Claremont Road", markerName: "markerClaremont", location: [54.98243,-1.61993], totalSpots: 255},
{name: "Dean Street", markerName: "markerDean", location: [54.97045,-1.60973], totalSpots: 257},
{name: "Eldon Garden", markerName: "markerEGarden", location: [54.97676,-1.61556], totalSpots: 449},
{name: "Eldon Square", markerName: "markerESquare", location: [54.97598,-1.61540], totalSpots: 497},
{name: "Ellison Place", markerName: "markerEllison", location: [54.97606,-1.60804], totalSpots: 126},
{name: "Grainger Town", markerName: "markerGrainger", location: [54.96869,-1.62210], totalSpots: 410},
{name: "Manors", markerName: "markerManors", location: [54.97226,-1.60532], totalSpots: 484},
{name: "The Gate", markerName: "markerGate", location: [54.97261,-1.62011], totalSpots: 250},
{name: "Q-Park", markerName: "markerQ-Park", location: [54.97223,-1.62013], totalSpots: 266},
{name: "Quayside Multi-Storey", markerName: "markerQuayside", location: [54.97101,-1.60527], totalSpots: 499},
{name: "St James' Park", markerName: "markerStJames", location: [54.97404,-1.62257], totalSpots: 545},
{name: "Oxford Street", markerName: "markerOxford", location: [54.97850,-1.61058], totalSpots: 139},
{name: "NCP John Dobson St", markerName: "markerDobson", location: [54.97654,-1.61139], totalSpots: 552},
{name: "NCP Carliol Sq", markerName: "markerCarliol", location: [54.972946,-1.608363], totalSpots: 138},
{name: "NCP St John St", markerName: "markerStJohn", location: [54.970943,-1.615128], totalSpots: 19},]

//Itterates through the array of car parks above and creates the initial markers and places them on the map
var i;
for (i = 0; i < markers.length; i++){
    var newMarker = L.marker(markers[i].location, {icon:waitingIcon}).addTo(mymap);
    newMarker.bindPopup("No data currently available, There are " + markers[i].totalSpots + " total spots at this car park.");
    markers[i].markerName = newMarker;
};

//Returns the correct marker image depending on the occupacy level
function changeIcon(pf){
    if(pf <= .75){
        return emptyIcon;
    } else if(pf <= .90){
        return gettingFullIcon;
    } else{
        return fullIcon;
    }
}

//Event listener for the Urban Observatory API
ws.addEventListener("message", ({ data }) =>{
    //Turns the data stream comming in from API to JSON for ease of use
    const carData = JSON.parse(data);
 
    let totalSpots;
    let occupiedSpots;
    let emptySpots;
    let percentFull;

    //Goes through the marker array to check if any new data from API matches any of our car parks.
    function updateMarkers(){
        for(i = 0; i < markers.length; i++){
            //If we get a match, pull in the data from that car park.
            if(carData.data.entity.meta.name.includes(markers[i].name)){
                totalSpots = carData.data.feed.meta.totalSpaces;
                occupiedSpots = carData.data.timeseries.value.data;
                emptySpots = totalSpots - occupiedSpots;
                percentFull = occupiedSpots/totalSpots;
                //Updates the marker on the map for that specifc car park
                markers[i].markerName.bindPopup("There are " + emptySpots + " spots available at " + markers[i].name + ".")
                markers[i].markerName.setIcon(changeIcon(percentFull));
            }
        }
    }

    if(carData.data.brokerage.broker.id.includes("UTMC Open Car Park Feeds")){
        updateMarkers();
    }
});