// this file is used to detect if the user click or press a key this is where hotkey association/keyboard should be changed
// click detector
// letters are used to call functions
//  First part of the list draw on map
FSG.ITF.clickdetector= function(event,datamap) {
  //console.log(datamap)
  //a call the function to add a new point
  if (FSG.STATE.keybeingpressed === "a") {
    newpoints(event,datamap);
    drawingbase(FSG.MAIN.delaunayd, FSG.MAIN.voronoid);
    console.log(datamap)
    FSG.STATE.daynight = "off";
    FSG.STATE.aretornadoesactive = false;
    if (FSG.STATE.isbackgroundcoloractivated === true) {
      fbackgroundcolors(FSG.MAIN.svg);
      console.log(datamap)
    }
  }

  // z smooth the graph
  if (FSG.STATE.keybeingpressed === "z") {
  // smoothing2();
    deepsmoothing(10);
   // drawallcentroids();
  //  replacecentroids(centroidcoordinatearray);

    FSG.STATE.daynight = "off";
    FSG.STATE.aretornadoesactive = false;
    if (FSG.STATE.isbackgroundcoloractivated == true) {
      fbackgroundcolors(FSG.MAIN.svg);
    }
  }

  // e paint an overlay on the cell to show it has been made "impassable terrain"
  if (FSG.STATE.keybeingpressed === "e") {
    markimpassable(whichcell(event));
  }

  // r highlight edges of clicked cell and write its ID
  if (FSG.STATE.keybeingpressed === "r") {
    let previouscell = activecell;
    if (activecell != "none") {
      delete1cell();
      deletelabels();
    }
    if (activecell === "none") {
      activecell = whichcell(event);
      if (activecell != previouscell) {
        draw1cell(activecell);
        writecellID(event);
      }
    }
  }

  // t paint all cells with a temporary overlay according to various criterions
  if (FSG.STATE.keybeingpressed === "t") {
    overlaymanager();
  }

  //y draw all centroids
  if (FSG.STATE.keybeingpressed === "y") {
    drawallcentroids();
  }

  //u replace earlier random points with new centroids and redo the voronoi diagram
  if (FSG.STATE.keybeingpressed === "u") {
    replacecentroids(centroidcoordinatearray);
  }

  //i draw a road to neighbouring cell
  if (FSG.STATE.keybeingpressed === "i") {
    drawroadtoneighbour(whichcell(event));
  }

  //o first select a cell as origin, then second click draw path from origin to target
  // lazy optimist
  if (FSG.STATE.keybeingpressed === "o") {
    pathfindclicker(whichcell(event));
  }

  //p first select a cell as origin, then second click draw path from origin to target
  // graph attempt
  if (FSG.STATE.keybeingpressed === "p") {
    pathfindclicker2(whichcell(event));
  }

  //m first select a cell as origin, then second click draw path from origin to target
  // graph attempt
  if (FSG.STATE.keybeingpressed === "m") {
    pathfindclicker3(whichcell(event));
  }

  // l to draw background colors
  if (FSG.STATE.keybeingpressed === "l") {
    if (FSG.STATE.isbackgroundcoloractivated === true) {
      FSG.STATE.isbackgroundcoloractivated = false;
      removebackgroundcolors();
    } else {
      FSG.STATE.isbackgroundcoloractivated = true;
      fbackgroundcolors();
    }
  }

  //k to hide/show impassable terrain
  if (FSG.STATE.keybeingpressed === "k") {
    if (FSG.STATE.isimpassableactivated === true) {
      FSG.STATE.isimpassableactivated = false;
      hideimpassableterrain();
    } else {
      FSG.STATE.isimpassableactivated = true;
      paintimpassable();
    }
  }

  //j to turn all "land" or "water" into impassable 3rd click reset
  if (FSG.STATE.keybeingpressed === "j") {
    //force visibility first anyway
    if (FSG.STATE.isimpassableactivated != true) {
      FSG.STATE.isimpassableactivated = true;
    }
    applyimpassablemode();
  }

  //h to detect and hightlight landmasses another time hide
  if (FSG.STATE.keybeingpressed === "h") {
    landmassesmanager();
  }

  // g to enable/ disable the day and night cycle
  if (FSG.STATE.keybeingpressed === "g") {
    if (FSG.STATE.daynight === "off") {
      FSG.STATE.daynight = "on";
      daynightcycler(FSG.MAIN.width,FSG.MAIN.height);
    } else {
      FSG.STATE.daynight = "off";
      daynightcycler(FSG.MAIN.width,FSG.MAIN.height);
    }
  }

  // f to activate the tornadoes ?
  if (FSG.STATE.keybeingpressed === "f") {
    smoothing(centroidcoordinatearray);
    smoothing(centroidcoordinatearray);
    smoothing(centroidcoordinatearray);
    smoothing(centroidcoordinatearray);

    tornadomanager();
  }
  
  // sound key
  if (FSG.STATE.keybeingpressed === "²") {
    if (FSG.SOUND.ambiantsound != "playing") {
      FSG.SOUND.ambiantsound = "playing";
      customrepeatplay(FSG.SOUND.FulgoraThunder,true);
      customrepeatplay(FSG.SOUND.FulgoraWind,true);
    } else {
      FSG.SOUND.ambiantsound = "off";
    }
  }

  // second row, write
  // q tell in the console the ID of the clicked cell
  if (FSG.STATE.keybeingpressed === "q") {
    console.log(whichcell(event));
  }

  // s tell in the console the area of the clicked cell
  if (FSG.STATE.keybeingpressed === "s") {
    console.log(d3.polygonArea(polygonizemyID(whichcell(event))));
  }

  // log in adjacency array
  if (FSG.STATE.keybeingpressed === "d") {
    console.log(readadjacency(datamap));
  }

  // used to test new functions
  if (FSG.STATE.keybeingpressed === "x") {
    showlandmassescontour(landmasseslist);
  }
  // used to test new functions
  if (FSG.STATE.keybeingpressed === "c") {
    if (FSG.STATE.daynight === "on") {
      FSG.STATE.daynight = "off";
      daynightcycler();
      deactivatetornadoes();
    }
    isbackgroundcoloractivated = false;
    cyclerandomdistrib();
  }

if(FSG.STATE.keybeingpressed=== undefined){
  console.log("try again pressing a key")
}

}

// keyboard detector
d3.selectAll("html").on("keydown", function (event) {
  FSG.STATE.keybeingpressed = event.key;
  let addpointbutton = d3.selectAll("#Addpoint");
  if  (FSG.STATE.keybeingpressed==="a"){    
    addpointbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Addedpoint.src + "");
  } 
  
});

// keyboard resetor
d3.selectAll("html").on("keyup", function () {
  FSG.STATE.keybeingpressed = null;
  let addpointbutton = d3.selectAll("#Addpoint");
  addpointbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Addpoint.src + "");
});
