var mymap = L.map('mapid').setView([54.978, -1.618], 15);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2Nvb2J5ZG9vc2tpIiwiYSI6ImNrY3lkbXJoZjA4eTQycm5oaW8wcjhtdmkifQ.t3uw0LN6qHE1ppd_dKODFg'
}).addTo(mymap);
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

const ws = new WebSocket("wss://api.newcastle.urbanobservatory.ac.uk/stream");

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

var i;
for (i = 0; i < markers.length; i++){
    var newMarker = L.marker(markers[i].location, {icon:waitingIcon}).addTo(mymap);
    newMarker.bindPopup("No data currently avialable, There are " + markers[i].totalSpots + " total spots at this car park.");
    markers[i].markerName = newMarker;
};

function changeIcon(pf){
    if(pf <= .75){
        return emptyIcon;
    } else if(pf <= .90){
        return gettingFullIcon;
    } else{
        return fullIcon;
    }
}

ws.addEventListener("message", ({ data }) =>{
    const carData = JSON.parse(data);
 
    let totalSpots;
    let occupiedSpots;
    let emptySpots;
    let percentFull;

    function updateMarkers(){
        for(i = 0; i < markers.length; i++){
            if(carData.data.entity.meta.name.includes(markers[i].name)){
                totalSpots = carData.data.feed.meta.totalSpaces;
                occupiedSpots = carData.data.timeseries.value.data;
                emptySpots = totalSpots - occupiedSpots;
                percentFull = occupiedSpots/totalSpots;
                markers[i].markerName.bindPopup("There are " + emptySpots + " spots available at " + markers[i].name + ".")
                markers[i].markerName.setIcon(changeIcon(percentFull));
            }
        }
    }

    if(carData.data.brokerage.broker.id.includes("UTMC Open Car Park Feeds")){
        updateMarkers();
    }
});