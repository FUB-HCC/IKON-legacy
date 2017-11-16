
var dataset;
var fb1 = new Array();
var fb2 = new Array();
var fb3 = new Array();
var fb4 = new Array();
var all = new Array();
var angles = [];
var years = new Array();
var colors = new Array();
var colorsSys = new Array();
var start = false;
var scenario = 1;
var numProjects = 0;

var departments, activities;
var currentHue = 0;
var hueSpeed = 0.1;
var currentAlpha = 0;

//Call before setup
function init(path,callback) {
  myLoadJSON(path,callback);
}

//For CORS purposes
function myLoadJSON(url,callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(xmlhttp.responseText);
      processData(data,callback);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.setRequestHeader('Content-type', 'text/plain; charset=ISO-8859-1');
  xmlhttp.overrideMimeType('text/plain; charset=ISO-8859-1');
  xmlhttp.send();
}

//Process JSON Data
function processData(e,callback) {
  var tempYears = new Array();
  dataset = e;
  if (typeof dataset == "undefined") {
    console.log("No Data Received");
  } else {
    var d = 0;
    var minDate, maxDate;

    for (var i = 0; i < dataset.length; i++) {
      var newActivityID = '';
      var startDate;
      var endDate;
      var department;
      var title;
      var geldgeber;
      var antragsteller;
      var projektleiter;
      var st = new Date();
      var et = new Date();

      if (dataset[i].query.data["0"].property == "Abteilung_MfN") {
        department = dataset[i].query.data[0].dataitem["0"].item.toString();
        startDate = dataset[i].query.data[1].dataitem["0"].item.toString().split("/");
        newActivityID = dataset[i].query.data[5].dataitem["0"].item.toString();
        endDate = dataset[i].query.data[3].dataitem["0"].item.toString().split("/");
        title = dataset[i].query.data[9].dataitem["0"].item.toString();
        geldgeber = dataset[i].query.data[4].dataitem["0"].item.toString();
        antragsteller = dataset[i].query.data[2].dataitem["0"].item.toString();
        projektleiter = dataset[i].query.data[7].dataitem["0"].item.toString();
        for (var j = 0; j < dataset[j].query.data.length; j++) {
          if(dataset[i].query.data[j].property === "Hauptthema" ){
            hauptThema = dataset[i].query.data[j].dataitem["0"].item.toString();
          }else if(dataset[i].query.data[j].property === "Nebenthemen" ){
            nebenThemen = dataset[i].query.data[j].dataitem;
            var ntStringArray = [];
            for (var k = 0; k < nebenThemen.length; k++) {
              ntStringArray.push(nebenThemen[k].item.toString());
            }
          }else if(dataset[i].query.data[j].property === "Kooperationspartner" ){
            kooperationsPartner = dataset[i].query.data[j].dataitem["0"].item.toString();
          }
        }
      } else {

        startDate = dataset[i].query.data[0].dataitem["0"].item.toString().split("/");
        department = "FB 4";
        endDate = dataset[i].query.data[2].dataitem["0"].item.toString().split("/");
        newActivityID = dataset[i].query.data[4].dataitem["0"].item.toString();
        title = dataset[i].query.data[8].dataitem["0"].item.toString();
        geldgeber = dataset[i].query.data[3].dataitem["0"].item.toString();
        antragsteller = dataset[i].query.data[1].dataitem["0"].item.toString();
        projektleiter = dataset[i].query.data[6].dataitem["0"].item.toString();
        for (var j = 0; j < dataset[i].query.data.length; j++) {
          if(dataset[i].query.data[j].property === "Hauptthema" ){
            hauptThema = dataset[i].query.data[j].dataitem["0"].item.toString();
          }else if(dataset[i].query.data[j].property === "Nebenthemen" ){
            nebenThemen = dataset[i].query.data[j].dataitem;
            var ntStringArray = [];
            for (var k = 0; k < nebenThemen.length; k++) {
              ntStringArray.push(nebenThemen[k].item.toString());
            }
          }else if(dataset[i].query.data[j].property === "Kooperationspartner" ){
            kooperationsPartner = dataset[i].query.data[j].dataitem["0"].item.toString();
          }
        }
      }

      if (title.indexOf('[') > -1) {
        title = title.substr(1).slice(0, -1);
      }

      st.setFullYear(startDate[1], startDate[2], startDate[3]);
      et.setFullYear(endDate[1], endDate[2], endDate[3]);

      //dates.push({st, et});
      tempYears.push(st.getFullYear());
      tempYears.push(et.getFullYear());

    var pro = {
      antragsteller: antragsteller,
      end: et,
      forschungsbereich: department.substring(3),
      geldgeber: geldgeber,
      hauptthema: hauptThema,
      id: newActivityID,
      kooperationspartner: kooperationsPartner,
      nebenthemen: ntStringArray,
      projektleiter: projektleiter,
      start: st,
      titel: title
    };

    d = parseInt(department.replace(/^\D+/g, ""));
    switch(d) {
      case 1:
        fb1.push(pro);
        break;
      case 2:
        fb2.push(pro);
        break;
      case 3:
        fb3.push(pro);
        break;
      case 4:
        fb4.push(pro);
      }
    }
    all.push(fb1);
    all.push(fb2);
    all.push(fb3);
    all.push(fb4);

    numProjects = fb1.length + fb2.length + fb3.length + fb4.length;

    tempYears.sort();
    years = tempYears.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    });
    callback(all);
  }
}
