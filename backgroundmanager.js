//Rules manager for background colors
function fbackgroundcolors() {
    // first remove everything as nothing should be drawn under background
    svg.selectAll("*").remove();
    daynight="off";
    // then draw background if needed
    if (isbackgroundcoloractivated === true) {
      if (planet === Fulgoracolor) {
        Fulgoracolorrule();
      }
      // redraw things once at the end, above it all as we just did background color
      drawingbasend(delaunayd, voronoid);
      paintimpassable();
    }
  }
  
  // Actual rules for background colors
  // function rule for Fulgora
  function Fulgoracolorrule() {
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
      ruleforland(element, averagecellarea);
      ruleforwater(element);
    }
    for (element of datamap) {
      // it doesn't work when put in the previous loop
      // why ? seem inefficient way to do
      ruleformountain(element);
    }
    for (element of datamap) {
      ruleforhills(element);
    }
    for (element of datamap) {
      ruleforshallowwater(element);
    }
    for (element of datamap) {
      rulefordeepwater(element);
    }
    for (element of datamap) {
      ruleforbluemystery(element);
    }
  

    // drawn at the end only 1 path per color although not the most optimal path
    dothepainting(planet);


  }
  

  // better function to paint the colors after rules are applied
  // 1 path per background color performance test 
  function dothepainting(planet){
    if (planet === Fulgoracolor){
      // should be in the same order than the color in colorbject associated with the planet
      let Fulgorabackground =[deepwatercelllist,watercelllist,shallowwatercelllist,hillcelllist,landcelllist,mountaincelllist,bluemysterycelllist]
      let init = [];
      // for each cell list
      for (let i=0;i<Fulgorabackground.length;i++){
        // remove previous
        let newpath = 0;
        // create new
         newpath= d3.path();        
        // for each cell of the list
        for (let j=0;j<Fulgorabackground[i].length;j++){
          let polygon = polygonizemyID(Fulgorabackground[i][j])
          newpath.moveTo(polygon[0][0],polygon[0][1])
          // for each subsquent point of the list
          for ( let k=1;k<polygon.length-1;k++){
            newpath.lineTo(polygon[k][0],polygon[k][1])
          }
        }
        init.push(newpath)
      }
    
      paintallcellfillcolor(Fulgoracolor,init)
    }
  }
  
  //ice
  //cells located in the 10% upper and lower part of the map are receiving "ice color"
  function ruleforice(element) {
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
  function ruleforland(element, averagecellarea) {
    // amongst valid candidate
    if (element[1] < 0.96 * height && element[1] > 0.04 * height) {
      // exclude some for lake or mountains
      // calculate area of the cell
      let elementarea =
        -1 * d3.polygonArea(polygonizemyID(datamap.indexOf(element)));
      if (
        elementarea < ratiotonormalcell * averagecellarea &&
        !landcelllist.includes(datamap.indexOf(element))
      ) {
        landcelllist.push(datamap.indexOf(element));
      }
    }
  }
  
  // mountains
  function ruleformountain(element) {
    if (
      areallneighbourland(element) &&
      landcelllist.includes(datamap.indexOf(element)) &&
      !mountaincelllist.includes(datamap.indexOf(element))
    ) {
      mountaincelllist.push(datamap.indexOf(element));
      landcelllist.splice(landcelllist.indexOf(datamap.indexOf(element)), 1);
    }
  }
  
  // function to test if all neighbour are land
  function areallneighbourland(cellID) {
    let neighboured = [...voronoid.neighbors(datamap.indexOf(cellID))];
  
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
    neighboured = [];
  
    return allneighbourareland;
  }
  
  // water is the default
  function ruleforwater(element) {
    // some of the ice tile are turned into water, and all the empty tile too
    if (icecelllist.includes(datamap.indexOf(element))) {
      let diceroll = Math.random();
      if (diceroll <= 0.3) {
        icecelllist.splice(icecelllist.indexOf(element), 1);
        if (!watercelllist.includes(datamap.indexOf(element))) {
          watercelllist.push(datamap.indexOf(element));
        }
      }
    } else {
      if (!landcelllist.includes(datamap.indexOf(element))) {
        if (!watercelllist.includes(datamap.indexOf(element))) {
          watercelllist.push(datamap.indexOf(element));
        }
      }
    }
  }
  
  // shallow water
  function ruleforshallowwater(element) {
    // is done after water which is the fill for empty tile
    // aim : any tile that is water and touching a coast
    // for each neighbour check if it's land and if tile is not  already shallow water
    if (
      hassomelandneighbour(element) &&
      watercelllist.includes(datamap.indexOf(element)) &&
      !shallowwatercelllist.includes(datamap.indexOf(element))
    ) {
      shallowwatercelllist.push(datamap.indexOf(element));
      watercelllist.splice(watercelllist.indexOf(datamap.indexOf(element)), 1);
    }
  }
  
  //function to test if the cell as some land neighbour
  function hassomelandneighbour(cellID) {
    let neighboured = [...voronoid.neighbors(datamap.indexOf(cellID))];
  
    var hassomelandneighbour = false;
    for (element of neighboured) {
      if (
        landcelllist.includes(element) ||
        hillcelllist.includes(element) ||
        mountaincelllist.includes(element)
      ) {
        hassomelandneighbour = true;
      }
    }
    return hassomelandneighbour;
  }
  
  // hills
  function ruleforhills(element) {
    // if there is a mountain neighbour a diceroll
    // for each neighbour check if it's land and if tile is not  already shallow water
    if (
      hassomemountainneighbour(element) &&
      landcelllist.includes(datamap.indexOf(element)) &&
      !hillcelllist.includes(datamap.indexOf(element)) &&
      !mountaincelllist.includes(datamap.indexOf(element))
    ) {
      hillcelllist.push(datamap.indexOf(element));
      landcelllist.splice(landcelllist.indexOf(datamap.indexOf(element)), 1);
    }
    /* since no diceroll can downgrade hill or mountain, this is not necessary
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
  function hassomemountainneighbour(cellID) {
    let neighboured = [...voronoid.neighbors(datamap.indexOf(cellID))];
    var hassomemountainneighbour = false;
    for (element of neighboured) {
      if (mountaincelllist.includes(element)) {
        hassomemountainneighbour = true;
      }
    }
    neighboured = [];
    return hassomemountainneighbour;
  }
  
  // deep water
  function rulefordeepwater(element) {
    // water whose only connexion is other water
    if (
      areallneighbourarewater(element) &&
      watercelllist.includes(datamap.indexOf(element)) &&
      !deepwatercelllist.includes(datamap.indexOf(element))
    ) {
      deepwatercelllist.push(datamap.indexOf(element));
      watercelllist.splice(watercelllist.indexOf(datamap.indexOf(element)), 1);
    }
  }
  
  // function to test if all neighbour are water
  function areallneighbourarewater(element) {
    let neighboured = [...voronoid.neighbors(datamap.indexOf(element))];
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
  function ruleforbluemystery(element) {
    if (
      mountaincelllist.includes(datamap.indexOf(element)) ||
      hillcelllist.includes(datamap.indexOf(element))
    ) {
      let diceroll = Math.random();
      if (mountaincelllist.includes(datamap.indexOf(element))) {
        if (diceroll <= 0.3) {
          bluemysterycelllist.push(datamap.indexOf(element));
          mountaincelllist.splice(
            mountaincelllist.indexOf(datamap.indexOf(element)),
            1
          );
        }
      } else {
        if (diceroll <= 0.1) {
          bluemysterycelllist.push(datamap.indexOf(element));
          hillcelllist.splice(hillcelllist.indexOf(datamap.indexOf(element)), 1);
        }
      }
    }
  }
  