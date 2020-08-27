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
var markerClaremont = L.marker([54.98243,-1.61993], {icon:waitingIcon}).addTo(mymap);
markerClaremont.bindPopup("No data currently avialable, There are 225 total spots at this car park.");
var markerDean = L.marker([54.97045,-1.60973], {icon:waitingIcon}).addTo(mymap);
markerDean.bindPopup("No data currently avialable, There are 257 total spots at this car park.");
var markerEGarden = L.marker([54.97676,-1.61556], {icon:waitingIcon}).addTo(mymap);
markerEGarden.bindPopup("No data currently avialable, There are 449 total spots at this car park.");
var markerESquare = L.marker([54.97598,-1.61540], {icon:waitingIcon}).addTo(mymap);
markerESquare.bindPopup("No data currently avialable, There are 497 total spots at this car park.");
var markerEllison = L.marker([54.97606,-1.60804], {icon:waitingIcon}).addTo(mymap);
markerEllison.bindPopup("No data currently avialable, There are 126 total spots at this car park.");
var markerGrainger = L.marker([54.96869,-1.62210], {icon:waitingIcon}).addTo(mymap);
markerGrainger.bindPopup("No data currently avialable, There are 410 total spots at this car park.");
var markerManors = L.marker([54.97226,-1.60532], {icon:waitingIcon}).addTo(mymap);
markerManors.bindPopup("No data currently avialable, There are 484 total spots at this car park.");
var markerGate = L.marker([54.97261,-1.62011], {icon:waitingIcon}).addTo(mymap);
markerGate.bindPopup("No data currently avialable, There are 250 total spots at this car park.");
var markerQPark = L.marker([54.97223,-1.62013], {icon:waitingIcon}).addTo(mymap);
markerQPark.bindPopup("No data currently avialable, There are 266 total spots at this car park.");
var markerQuayside = L.marker([54.97101,-1.60527], {icon:waitingIcon}).addTo(mymap);
markerQuayside.bindPopup("No data currently avialable, There are 499 total spots at this car park.");
var markerStJames = L.marker([54.97404,-1.62257], {icon:waitingIcon}).addTo(mymap);
markerStJames.bindPopup("No data currently avialable, There are 545 total spots at this car park.");
var markerOxford = L.marker([54.97850,-1.61058], {icon:waitingIcon}).addTo(mymap);
markerOxford.bindPopup("No data currently avialable, There are 139 total spots at this car park.");
var markerDobson = L.marker([54.97654,-1.61139], {icon:waitingIcon}).addTo(mymap);
markerDobson.bindPopup("No data currently avialable, There are 552 total spots at this car park.");
var markerCarliol = L.marker([54.972946,-1.608363], {icon:waitingIcon}).addTo(mymap);
markerCarliol.bindPopup("No data currently avialable, There are 138 total spots at this car park.");
var markerStJohn = L.marker([54.970943,-1.615128], {icon:waitingIcon}).addTo(mymap);
markerStJohn.bindPopup("No data currently avialable, There are 19 total spots at this car park.");


const ws = new WebSocket("wss://api.newcastle.urbanobservatory.ac.uk/stream");

ws.addEventListener("message", ({ data }) =>{
    const carData = JSON.parse(data);
    var totalSpots;
    var occupiedSpots;
    var emptySpots;
    var percentFull;
    
    function updateMarkers(pf){
        if(pf <= .75){
            return emptyIcon;
        } else if(pf <= .90){
            return gettingFullIcon;
        } else{
            return fullIcon;
        }
    }

    if(carData.data.brokerage.broker.id.includes("UTMC Open Car Park Feeds")){
        
        if(carData.data.entity.meta.name.includes("Claremont Road")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerClaremont.bindPopup("There are " + emptySpots + " spots available at Claremont Road.");
            markerClaremont.setIcon(updateMarkers(percentFull));
        }
        if(carData.data.entity.meta.name.includes("Dean Street")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerDean.bindPopup("There are " + emptySpots + " spots available at Dean Street.");
            markerDean.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("Eldon Garden")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerEGarden.bindPopup("There are " + emptySpots + " spots available at Eldon Garden.");
            markerEGarden.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("Eldon Square")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerESquare.bindPopup("There are " + emptySpots + " spots available at Eldon Square.");
            markerESquare.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("Ellison Place")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerEllison.bindPopup("There are " + emptySpots + " spots available at Ellison Place.");
            markerEllison.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("Grainger Town")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerGrainger.bindPopup("There are " + emptySpots + " spots available at Grainger Town.");
            markerGrainger.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("Manors")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerManors.bindPopup("There are " + emptySpots + " spots available Manors.");
            markerManors.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("The Gate")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerGate.bindPopup("There are " + emptySpots + " spots available The Gate.");
            markerGate.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("Q-Park")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerQPark.bindPopup("There are " + emptySpots + " spots available at Q-Park.");
            markerQPark.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("Quayside Multi-Storey")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerQuayside.bindPopup("There are " + emptySpots + " spots available at Quayside Multi-Storey.");
            markerQuayside.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("St James' Park")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerStJames.bindPopup("There are " + emptySpots + " spots available at St James' Park.");
            markerStJames.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("Oxford Street")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerOxford.bindPopup("There are " + emptySpots + " spots available at Oxford Street.");
            markerOxford.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("NCP John Dobson St")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerDobson.bindPopup("There are " + emptySpots + " spots available John Dobson St.");
            markerDobson.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("NCP Carliol Sq")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerCarliol.bindPopup("There are " + emptySpots + " spots available Carliol Sq.");
            markerCarliol.setIcon(updateMarkers(percentFull));
        }

        if(carData.data.entity.meta.name.includes("NCP St John St")){
            totalSpots = carData.data.feed.meta.totalSpaces;
            occupiedSpots = carData.data.timeseries.value.data;
            emptySpots = totalSpots - occupiedSpots;
            percentFull = occupiedSpots/totalSpots;
            markerStJohn.bindPopup("There are " + emptySpots + " spots available St John Street.");
            markerStJohn.setIcon(updateMarkers(percentFull));
        }
                
    }
});
