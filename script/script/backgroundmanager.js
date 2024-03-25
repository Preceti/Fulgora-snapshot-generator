//Rules manager for background colors
function fbackgroundcolors(svg) {
  // first remove everything as nothing should be drawn under background
  svg.selectAll("*").remove();
  FSG.STATE.daynight = "off";
  // then draw background if needed
  if (FSG.STATE.isbackgroundcoloractivated === true) {
    if (FSG.STATE.planet === "Fulgora") {
      Fulgoracolorrule(FSG.DATA.datamap,FSG.MAIN.voronoid,FSG.DATA.Fulgoracolor);
    }
    if (FSG.STATE.planet === "Earthcolor") {
      //Fulgoracolorrule();
    }
    // redraw things once at the end, above it all as we just did background color
    drawingbasend(FSG.MAIN.delaunayd, FSG.MAIN.voronoid,svg);
    paintimpassable();
  }
}

// Actual rules for background colors
// function rule for Fulgora
function Fulgoracolorrule(datamap,voronoid) {
  // doing this once and looking up instead of using neighbors[...] divided by 8 the time dedicated to find which are the neighbouring cell
  redoadjacency(datamap,voronoid);
  // still the most costly operation with .includes
  // maybe prevent execution more than once a second ?

  // clean default tile
  watercelllist = [];
  icecelllist = [];
  landcelllist = [];
  shallowwatercelllist = [];
  mountaincelllist = [];
  deepwatercelllist = [];
  hillcelllist = [];
  bluemysterycelllist = [];
  // iterate through each cell
  for (element of datamap) {
    // apply rules
    // no ice on Fulgora
    // ruleforice(element);
    ruleforland(element,  FSG.DATA.averagecellarea, datamap);
    ruleforwater(element,datamap);
  }
  for (element of datamap) {
    // it doesn't work when put in the previous loop
    // why ? seem inefficient way to do
    ruleformountain(element,datamap);
  }
  for (element of datamap) {
    ruleforhills(element,datamap);
  }
  for (element of datamap) {
    ruleforshallowwater(element,datamap);
  }
  for (element of datamap) {
    rulefordeepwater(element,datamap);
  }
  for (element of datamap) {
    ruleforbluemystery(element,datamap);
  }
  // drawn at the end only 1 path per color although not the most optimal path
  dothepainting(FSG.STATE.planet,FSG.MAIN.svg);
}

// function to paint the colors after rules are applied
function dothepainting(planet,svg) {
  if (planet === "Fulgora") {
    // should be in the same order than the color in colorbject associated with the planet
    let Fulgorabackground = [
      deepwatercelllist,
      watercelllist,
      shallowwatercelllist,
      hillcelllist,
      landcelllist,
      mountaincelllist,
      bluemysterycelllist,
    ];
    let init = [];
    // for each cell list
    let l = Fulgorabackground.length;
    for (let i = 0; i < l; i++) {
      // remove previous
      let newpath = 0;
      // create new
      newpath = d3.path();
      // for each cell of the list
      let l2 = Fulgorabackground[i].length;
      for (let j = 0; j < l2; j++) {
        let polygon = polygonizemyID(Fulgorabackground[i][j]);
        newpath.moveTo(polygon[0][0], polygon[0][1]);
        // for each subsquent point of the list
        let l3 = polygon.length;
        for (let k = 1; k < l3 - 1; k++) {
          newpath.lineTo(polygon[k][0], polygon[k][1]);
        }
      }
      init.push(newpath);
    }

    paintallcellfillcolor(FSG.DATA.Fulgoracolor, init,svg);
  }
}

//ice
//cells located in the 10% upper and lower part of the map are receiving "ice color"
// is not fit to do the painting at the end because old
function ruleforice(element,datamap) {
  if (
    element[1] > 0.97 * height ||
    element[1] < 0.03 * height ||
    icecelllist.includes(datamap.indexOf(element))
  ) {
    paintcellfillcolor(datamap.indexOf(element), planet.ice, "ice");
    if (!icecelllist.includes(datamap.indexOf(element))) {
      icecelllist.push(datamap.indexOf(element));
    }
  } else {
    if (icecelllist.includes(datamap.indexOf(element))) {
      icecelllist.splice(datamap.indexOf(element), 1);
    }
  }
}

// land
function ruleforland(element, averagecellarea,datamap) {
  let cellID = datamap.indexOf(element);
  // amongst valid candidate
  if (element[1] < 0.96 * FSG.MAIN.height && element[1] > 0.04 * FSG.MAIN.height) {
    // calculate area of the cell
    let elementarea = -1 * d3.polygonArea(polygonizemyID(cellID));
    if (
      elementarea < FSG.DATA.ratiotonormalcell * averagecellarea &&
      !landcelllist.includes(cellID)
    ) {
      landcelllist.push(cellID);
    }
  }
}

// mountains
function ruleformountain(element,datamap) {
  let cellID = datamap.indexOf(element);
  if (
    areallneighbourland(element,datamap) &&
    landcelllist.includes(cellID) &&
    !mountaincelllist.includes(cellID)
  ) {
    mountaincelllist.push(cellID);
    landcelllist.splice(landcelllist.indexOf(cellID), 1);
  }
}

// function to test if all neighbour are land
function areallneighbourland(cellID,datamap) {
  let neighboured = adjacencysuperarray[datamap.indexOf(cellID)];
  // much better than the old !!!
  // let neighboured = [...voronoid.neighbors(datamap.indexOf(cellID))];

  var allneighbourareland = true;
  for (element of neighboured) {
    // actually hills and other mountains are also land
    if (!landcelllist.includes(element)) {
      if (!hillcelllist.includes(element)) {
        if (!mountaincelllist.includes(element)) {
          allneighbourareland = false;
        }
      }
    }
  }

  return allneighbourareland;
}

// water is the default
function ruleforwater(element,datamap) {
  let cellID = datamap.indexOf(element);
  // some of the ice tile are turned into water, and all the empty tile too
  if (icecelllist.includes(cellID)) {
    let diceroll = Math.random();
    if (diceroll <= 0.3) {
      icecelllist.splice(icecelllist.indexOf(element), 1);
      if (!watercelllist.includes(cellID)) {
        watercelllist.push(cellID);
      }
    }
  } else {
    if (!landcelllist.includes(cellID)) {
      if (!watercelllist.includes(cellID)) {
        watercelllist.push(cellID);
      }
    }
  }
}

// shallow water
function ruleforshallowwater(element,datamap) {
  let cellID = datamap.indexOf(element);
  // is done after water which is the fill for empty tile
  // aim : any tile that is water and touching a coast
  // for each neighbour check if it's land and if tile is not  already shallow water
  if (
    hassomelandneighbour(element,datamap) &&
    watercelllist.includes(cellID) &&
    !shallowwatercelllist.includes(cellID)
  ) {
    shallowwatercelllist.push(cellID);
    watercelllist.splice(watercelllist.indexOf(cellID), 1);
  }
}

//function to test if the cell as some land neighbour
function hassomelandneighbour(cellID,datamap) {
  let neighboured = adjacencysuperarray[datamap.indexOf(cellID)];
  //[...voronoid.neighbors(datamap.indexOf(cellID))];

  var hassomelandneighbour = false;
  for (element of neighboured) {
    if (
      landcelllist.includes(element) ||
      hillcelllist.includes(element) ||
      mountaincelllist.includes(element)
    ) {
      hassomelandneighbour = true;
      return hassomelandneighbour;
    }
  }
  return hassomelandneighbour;
}

// hills
function ruleforhills(element,datamap) {
  let cellID = datamap.indexOf(element);
  // if there is a mountain neighbour a diceroll
  // for each neighbour check if it's land and if tile is not  already shallow water
  if (
    hassomemountainneighbour(element,datamap) &&
    landcelllist.includes(cellID) &&
    !hillcelllist.includes(cellID) &&
    !mountaincelllist.includes(cellID)
  ) {
    hillcelllist.push(cellID);
    landcelllist.splice(landcelllist.indexOf(cellID), 1);
  }
  /* since no diceroll can downgrade hill or mountain yet, this is not necessary
    if (
      hillcelllist.includes(datamap.indexOf(element)) &&
      !hassomemountainneighbour(element)
    ) {
      hillcelllist.splice(hillcelllist.indexOf(datamap.indexOf(element)), 1);
      landcelllist.push(datamap.indexOf(element));
      paintcellfillcolor(datamap.indexOf(element), planet.land, "land");
      console.log("not useless")
    }
    */
}

//function to test if the cell has some mountain neighbors
function hassomemountainneighbour(cellID,datamap) {
  let neighboured = adjacencysuperarray[datamap.indexOf(cellID)];
  //[...voronoid.neighbors(datamap.indexOf(cellID))];

  var hassomemountainneighbour = false;
  for (element of neighboured) {
    if (mountaincelllist.includes(element)) {
      hassomemountainneighbour = true;
      return hassomemountainneighbour;
    }
  }
  neighboured = [];
  return hassomemountainneighbour;
}

// deep water
function rulefordeepwater(element,datamap) {
  let cellID = datamap.indexOf(element);
  // water whose only connexion is other water
  if (
    areallneighbourarewater(element,datamap) &&
    watercelllist.includes(cellID) &&
    !deepwatercelllist.includes(cellID)
  ) {
    deepwatercelllist.push(cellID);
    watercelllist.splice(watercelllist.indexOf(cellID), 1);
  }
}

// function to test if all neighbour are water
function areallneighbourarewater(element,datamap) {
  let neighboured = adjacencysuperarray[datamap.indexOf(element)];
  // [...voronoid.neighbors(datamap.indexOf(element))];

  let allneighbourarewater = true;
  for (element of neighboured) {
    if (
      !watercelllist.includes(element) &&
      !deepwatercelllist.includes(element)
    ) {
      allneighbourarewater = false;
    }
  }
  neighboured = [];
  return allneighbourarewater;
}

// function for the bluemystery
function ruleforbluemystery(element,datamap) {
  let cellID = datamap.indexOf(element);
  if (mountaincelllist.includes(cellID) || hillcelllist.includes(cellID)) {
    let diceroll = Math.random();
    if (mountaincelllist.includes(cellID)) {
      if (diceroll <= 0.3) {
        bluemysterycelllist.push(cellID);
        mountaincelllist.splice(mountaincelllist.indexOf(cellID), 1);
      }
    } else {
      if (diceroll <= 0.1) {
        bluemysterycelllist.push(cellID);
        hillcelllist.splice(hillcelllist.indexOf(cellID), 1);
      }
    }
  }
}
