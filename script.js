let M = {};
let V = {};
let C = {};

////////// MODEL /////////
let base = async function()
{
   let response = await fetch('/dataok.json');
   M.data = await response.json();
   C.init();
}
base();


M.getDataForMarkers = function(){
  let res = M.data.map( o => {return {festival: o.nom_de_la_manifestation, region: o.region, coord: o.coordonnees_insee.split(','), domaine: o.domaine, site: o.site_web, debut: o.date_debut_ancien, fin: o.date_de_fin_ancien} });
  return res;
}


M.getDataForGraph = function(){
    let res = M.data.map(r => {return {region: r.region} });
    return res;
}
// M.info = function(){
//   let data = M.data
//   for (let i=0; i<data.length; i++) {
//     let coordo = data[i].coordonnees_insee;
//     let regions = data[i].region;
//     console.log(regions);
//     console.log(coordo);
//   }
// }

// M.coordo = function(coordo){
//   let data = M.data;
//   let res = data.find(e=> e.coordonnees_insee == coordo);
//   res = {...res};
//   return res;
// }



//---------- Filtres régions ---------//
M.regionFilter = function(nb){
let data = M.data;
let regions = data.find(e => e.region == regions);
const result = regions.filter(nregion => nregion.length == "Pays de la Loire");
console.log(result);
}



////////// VIEW //////////

//---------- Carte ---------//
const zoomLevel = 6;
const map = L.map('map').setView([46.13417, 2.373047],zoomLevel);

const mainLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
mainLayer.addTo(map);


function onMapClick(e) {
  var popup = L.popup()
  .setLatLng(e.latlng)
  .setContent("Vous cliquez sur la map, essayez de cliquer sur un point")
  .openOn(map);
}
    
map.on('click', onMapClick);

//---------- Graphique ---------//
const ctx = document.getElementById('myChart');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire','Corse',"Grand Est",'Hauts-de-France','Île-de-France','Normandie','Nouvelle-Aquitaine','Occitanie','Pays de la Loire',"Provence-Alpes-Côte d'Azur","DOMTOM"],
    datasets: [{
      label: 'Festival par région',
      data: [431, 145, 219, 119, 24, 217,167,399,128,362,382,190,319,34],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

V.setManyMarkers = function(data){
  for(let o of data){
    V.setMarker(o.festival, o.coord, o.domaine, o.debut, o.fin, o.site);
  }
}

V.setMarker = function(label, gps, style, debut, fin, site){
  let marker = L.marker(gps).addTo(map)
      .bindPopup(label +"<br> Domaine: "+ style+"<br> Début: "+debut+"<br> Fin: "+fin +"<br> Site: "+site  )
}



////////// CONTROLLER //////////
// C.marker = function(coordo){
//   let coord = M.info(coordo);
//   let marker = L.marker([coord]).addTo(map)
//       .bindPopup('Hellfest')
//       .openPopup();
// }


C.init = function() {
  let data = M.getDataForMarkers();
  V.setManyMarkers(data);
}
        
        
        
        
        