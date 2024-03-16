// click detector
// letters are used to call function for now
//  First part of the list draw on map
function clickdetector(event) {
  //a call the function to add a new point
  if (keybeingpressed === "a") {
    newpoints(event);
    drawingbase(delaunayd, voronoid);
    daynight = "off";
    aretornadoesactive = false;
    if (isbackgroundcoloractivated === true) {
      fbackgroundcolors();
    }
  }

  // z smooth the graph
  if (keybeingpressed === "z") {
    drawallcentroids();
    replacecentroids(centroidcoordinatearray);
    // graph = makegraph(datamap);
    daynight = "off";
    aretornadoesactive = false;
    if (isbackgroundcoloractivated == true) {
      fbackgroundcolors();
    }
  }

  // e paint an overlay on the cell to show it has been made "impassable terrain"
  if (keybeingpressed === "e") {
    markimpassable(whichcell(event));
  }

  // r highlight edges of clicked cell and write its ID
  if (keybeingpressed === "r") {
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
  if (keybeingpressed === "t") {
    overlaymanager();
  }

  //y draw all centroids
  if (keybeingpressed === "y") {
    drawallcentroids();
  }

  //u replace earlier random points with new centroids and redo the voronoi diagram
  if (keybeingpressed === "u") {
    replacecentroids(centroidcoordinatearray);
  }

  //i draw a road to neighbouring cell
  if (keybeingpressed === "i") {
    drawroadtoneighbour(whichcell(event));
  }

  //o first select a cell as origin, then second click draw path from origin to target
  // lazy optimist
  if (keybeingpressed === "o") {
    pathfindclicker(whichcell(event));
  }

  //p first select a cell as origin, then second click draw path from origin to target
  // graph attempt
  if (keybeingpressed === "p") {
    pathfindclicker2(whichcell(event));
  }

  //m first select a cell as origin, then second click draw path from origin to target
  // graph attempt
  if (keybeingpressed === "m") {
    pathfindclicker3(whichcell(event));
  }

  // l to draw background colors
  if (keybeingpressed === "l") {
    if (isbackgroundcoloractivated === true) {
      isbackgroundcoloractivated = false;
      removebackgroundcolors();
    } else {
      isbackgroundcoloractivated = true;
      fbackgroundcolors();
    }
  }

  //k to hide/show impassable terrain
  if (keybeingpressed === "k") {
    if (isimpassableactivated === true) {
      isimpassableactivated = false;
      hideimpassableterrain();
    } else {
      isimpassableactivated = true;
      paintimpassable();
    }
  }

  //j to turn all "land" or "water" into impassable 3rd click reset
  if (keybeingpressed === "j") {
    //force visibility first anyway
    if (isimpassableactivated != true) {
      isimpassableactivated = true;
    }
    applyimpassablemode();
  }

  //h to detect and hightlight landmasses another time hide
  if (keybeingpressed === "h") {
    landmassesmanager();
  }

  // g to enable/ disable the day and night cycle
  if (keybeingpressed === "g") {
    if (daynight === "off") {
      daynight = "on";
      daynightcycler();
    } else {
      daynight = "off";
      daynightcycler();
    }
  }

  // f to activate the tornadoes ?
  if (keybeingpressed === "f") {
    smoothing(centroidcoordinatearray);
    smoothing(centroidcoordinatearray);
    smoothing(centroidcoordinatearray);
    smoothing(centroidcoordinatearray);

    tornadomanager();
  }

  // sound key
  if (keybeingpressed === "²") {
    if (ambiantsound != "playing") {
      ambiantsound = "playing";
      customrepeatplay(FulgoraThunder);
      customrepeatplay(FulgoraWind);
    } else {
      ambiantsound = "off";
    }
  }

  // second row, write
  // q tell in the console the ID of the clicked cell
  if (keybeingpressed === "q") {
    console.log(whichcell(event));
  }

  // s tell in the console the area of the clicked cell
  if (keybeingpressed === "s") {
    console.log(d3.polygonArea(polygonizemyID(whichcell(event))));
  }

  // log in adjacency array
  if (keybeingpressed === "d") {
    console.log(readadjacency(datamap));
  }

  // used to test new functions
  if (keybeingpressed === "x") {
    showlandmassescontour(landmasseslist);
  }
  // used to test new functions
  if (keybeingpressed === "c") {
    if (daynight === "on") {
      daynight = "off";
      daynightcycler();
      deactivatetornadoes();
    }
    isbackgroundcoloractivated = false;
    cyclerandomdistrib();
  }
}

// keyboard detector
d3.selectAll("html").on("keydown", function (event) {
  keybeingpressed = event.key;
});

// keyboard resetor
d3.selectAll("html").on("keyup", function () {
  keybeingpressed = null;
});
