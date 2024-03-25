// run once
createUIbuttons();

// really we want buttons for functions that can be activated without requiring a click in a precise location on the graph
// eg=> smoothing the graph
// drawing all centroids
// adding overlay on all tiles ...
function createUIbuttons() {
  // changing the position here reposition the buttons easy shift
  let positionlist = [
    "infobutton",
    "Sound",
    "Addpoint",
    "Sun",
    "Shuffle",
    "Leftdistricounter",
    "Districounter",
    "Rightdistricounter",
    "Loop",
    "Smooth",
    "Delaunay",
    "Color",
    "Overlay",
    "Fullscreen",
    "Impassable",
    "Allpassable",
    "Worms",
    "left",
    "planet",
    "planetislarge",
    "planetislarge",
    "right",
  ];

  // Info Button ?
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "infobutton")
    .attr("x", positionlist.indexOf("infobutton") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Info.src + "");
  let infobutton = d3.selectAll("#infobutton");
  infobutton.on("click", function (event) {
    alert(
      "click while pressing a key => key that do something => [² a z e r t y u i o p m l k j h g f c]key that print something in console=> [q s d x] To make fulgora press z then click a few times, then press l and click once, to feel the tornadoes press f and click"
    );
  });

  // Sound  button
  // old "²" key
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Sound")
    .attr("x", positionlist.indexOf("Sound") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Musicon.src + "");
  let soundbutton = d3.selectAll("#Sound");
  soundbutton.on("click", function (event) {
    if (FSG.SOUND.ambiantsound != "playing") {
      FSG.SOUND.ambiantsound = "playing";
      FSG.SOUND.customrepeatplay(FSG.SOUND.FulgoraThunder,true);
      FSG.SOUND.customrepeatplay(FSG.SOUND.FulgoraWind,true);
      soundbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Musicoff.src + "");
    } else {
      FSG.SOUND.ambiantsound = "off";
      FSG.SOUND.stopsound(FSG.SOUND.FulgoraWind);
      FSG.SOUND.stopsound(FSG.SOUND.FulgoraThunder);
      soundbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Musicon.src + "");
    }
  });

  // Add point
  // isn't actually a button is an indicator when the key that makes the next click add points is being pressed so user is aware it will work before clicking
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Addpoint")
    .attr("x", positionlist.indexOf("Addpoint") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Addpoint.src + "");
  let addpointbutton = d3.select("#Addpoint");
  addpointbutton.on("click", function (event) {
    keybeingpressed = event.key;
    if (keybeingpressed === "a") {
      addpointbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Addedpoint.src + "");
    }
  });
  addpointbutton.on("keyup", function (event) {
    keybeingpressed = event.key;
    addpointbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Addpoint.src + "");
  });

  // sun button , need to become a moon sometimes
  // should the UI update in a loop and change itself too ?
  // or try to catch everytime it should and dispatch the change from other source ?
  // old "g" key action
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Sun")
    .attr("x", positionlist.indexOf("Sun") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Sun.src + "");

  let sunbutton = d3.select("#Sun");
  sunbutton.on("click", function (event) {
    if (FSG.STATE.daynight === "off") {
      FSG.STATE.daynight = "on";
      daynightcycler(FSG.MAIN.width,FSG.MAIN.height);
    } else {
      FSG.STATE.daynight = "off";
      daynightcycler(FSG.MAIN.width,FSG.MAIN.height);
    }
  });

  // shuffle button
  // old "c" key action
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Shuffle")
    .attr("x", positionlist.indexOf("Shuffle") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Shuffle.src + "");
  let shufflebutton = d3.selectAll("#Shuffle");
  shufflebutton.on("click", function (event) {
    if (FSG.STATE.daynight === "on") {
      FSG.STATE.daynight = "off";

      daynightcycler();
      deactivatetornadoes();
    }
    FSG.STATE.isbackgroundcoloractivated = false;
    cyclerandomdistrib("shuffle",FSG.MAIN.width,FSG.MAIN.height,FSG.DATA.numberofcellsatstart,FSG.DATA.averagecellarea,FSG.DATA.datamap);
    districountercounter();
  });

  // Smooth button
  // old "z" key action
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Smooth")
    .attr("x", positionlist.indexOf("Smooth") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Smooth.src + "");
  let smoothbutton = d3.selectAll("#Smooth");
  smoothbutton.on("click", function (event) {
   deepsmoothing(2);
    // things seem to work without this for some reason
    //  graph = makegraph(datamap);
    FSG.STATE.daynight = "off";
    FSG.STATE.aretornadoesactive = false;
    if (FSG.STATE.isbackgroundcoloractivated == true) {
      fbackgroundcolors(FSG.MAIN.svg);
    }
  });

  // Loop  button
  // work with shuffle
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Loop")
    .attr("x", positionlist.indexOf("Loop") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Loop.src + "");
  let loopbutton = d3.selectAll("#Loop");
  loopbutton.on("click", function (event) {
    console.log("should randomize the points with current distrib");
    cyclerandomdistrib("not",FSG.MAIN.width,FSG.MAIN.height,FSG.DATA.numberofcellsatstart,FSG.DATA.averagecellarea,FSG.DATA.datamap);
  });

  // Paint color button
  // old "l" key action
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Color")
    .attr("x", positionlist.indexOf("Color") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Color.src + "");
  let colorbutton = d3.select("#Color");
  colorbutton.on("click", function () {
    color(FSG.STATE.color);
  });

  // helper function for color
  function color(r) {
    if (r === "init") {
      FSG.initUI.color = "passed";
      console.log("too early would throw error");
    } else if (r === "passed") {
      let colorbutton = d3.select("#Color");
      if (FSG.STATE.isbackgroundcoloractivated === true) {
        colorbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Color.src + "");
        FSG.STATE.isbackgroundcoloractivated = false;
        FSG.SOUND.customrepeatplay(FSG.SOUND.Woodpecker,false)
        removebackgroundcolors();
      
      } else {
        colorbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Nocolor.src + "");
        FSG.STATE.isbackgroundcoloractivated = true;
        FSG.SOUND.customrepeatplay(FSG.SOUND.poomsplash,false)
        fbackgroundcolors(FSG.MAIN.svg);
        
     
      }
    }
  }

  // Paint overlay button
  // old "t" key action
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Overlay")
    .attr("x", positionlist.indexOf("Overlay") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Overlay.src + "");
  let overlaybutton = d3.select("#Overlay");
  overlaybutton.on("click", function () {
    overlaymanager();
    customrepeatplay(FSG.SOUND.Swoosh,false)
  });

  // fullscreen button
  // doesn't work properly
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Fullscreen")
    .attr("x", positionlist.indexOf("Fullscreen") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Fullscreen.src + "");
  let fullscreenbutton = d3.select("#Fullscreen");
  fullscreenbutton.on("click", function () {
    fullscreen(FSG.STATE.fullscreen);
  });

  // not sure those should be included in the createUIButtons function or put aside
  // helper function for fullscreen
  function fullscreen(r) {
    if (r === "init") {
      initUI.fullscreen = "notfullscreen";
      console.log("too early would throw error");
    } else if (r === "fullscreen") {
      let fullscreenbutton = d3.select("#Fullscreen");
      document.exitFullscreen();
      FSG.STATE.fullscreen = "notfullscreen";
      fullscreenbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Fullscreen.src + "");
    } else if (r === "notfullscreen") {
      let fullscreenbutton = d3.select("#Fullscreen");
      FSG.STATE.fullscreen = "fullscreen";
      // doesn't reproduce F11 functionnality in that a refresh of the page will also exit fullscreen when entered this way rather than with F11
      document.querySelector("html").requestFullscreen();
      //window.open("url.html",'','fullscreen=yes')
      //that would have been too easy
      // need to re-measure and redraw
      //location.reload();
      fullscreenbutton.attr(
        "href",
        "" + FSG.UITOP.iconsforbuttons.Notfullscreen.src + ""
      );
    }
  }

  // Paint/hide Impassable button
  // old "k" key action
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Impassable")
    .attr("x", positionlist.indexOf("Impassable") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Impassable.src + "");
  let impassablebutton = d3.select("#Impassable");
  impassablebutton.on("click", function () {
    if (isimpassableactivated === true) {
      isimpassableactivated = false;
      hideimpassableterrain();
      impassablebutton.attr(
        "href",
        "" + FSG.UITOP.iconsforbuttons.Impassablehidden.src + ""
      );
    } else {
      isimpassableactivated = true;
      paintimpassable();
      impassablebutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Impassable.src + "");
    }
  });

  // Change land/water/none Impassable button
  // old "j" key action
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Allpassable")
    .attr("x", positionlist.indexOf("Allpassable") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Allpassable.src + "");
  let Allpassablebutton = d3.select("#Allpassable");
  Allpassablebutton.on("click", function () {
    //force visibility first anyway
    if (isimpassableactivated != true) {
      isimpassableactivated = true;
      impassablebutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Impassable.src + "");
    }
    applyimpassablemode();

    if (impassablemode === "water") {
      Allpassablebutton.attr(
        "href",
        "" + FSG.UITOP.iconsforbuttons.Waterimpassable.src + ""
      );
    }
    if (impassablemode === "land") {
      Allpassablebutton.attr(
        "href",
        "" + FSG.UITOP.iconsforbuttons.Landimpassable.src + ""
      );
    }
    if (impassablemode === "none") {
      Allpassablebutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Allpassable.src + "");
    }
  });

  // activate worms
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Worms")
    .attr("x", positionlist.indexOf("Worms") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Worms.src + "");
  let Wormsbutton = d3.select("#Worms");
  Wormsbutton.on("click", function () {
    if (arewormsroaming === false && daynight ==="on") {
      arewormsroaming = true;
      Wormsbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Wormsnot.src + "");
    } else if (arewormsroaming === true ) {
      arewormsroaming = false;

      Wormsbutton.attr("href", "" + FSG.UITOP.iconsforbuttons.Worms.src + "");
    }

    Wormsmanager();
  });

  // Left districounter
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Leftdistricounter")
    .attr("x", positionlist.indexOf("Leftdistricounter") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Left.src + "");
  let Leftdistricounterbutton = d3.select("#Leftdistricounter");
  Leftdistricounterbutton.on("click", function (event) {
    if (FSG.STATE.daynight === "on") {
      FSG.STATE.daynight = "off";

      daynightcycler();
      deactivatetornadoes();
    }
    FSG.STATE.isbackgroundcoloractivated = false;
    cyclerandomdistrib("previous",FSG.MAIN.width,FSG.MAIN.height,FSG.DATA.numberofcellsatstart,FSG.DATA.averagecellarea,FSG.DATA.datamap);
    districountercounter();
  });
  // Right districounter
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Rightdistricounter")
    .attr("x", positionlist.indexOf("Rightdistricounter") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Right.src + "");
  let Rightdistricounterbutton = d3.select("#Rightdistricounter");
  Rightdistricounterbutton.on("click", function (event) {
    if (FSG.STATE.daynight === "on") {
      FSG.STATE.daynight = "off";

      daynightcycler();
      deactivatetornadoes();
    }
    isbackgroundcoloractivated = false;
    cyclerandomdistrib("next",FSG.MAIN.width,FSG.MAIN.height,FSG.DATA.numberofcellsatstart,FSG.DATA.averagecellarea,FSG.DATA.datamap);
    districountercounter();
  });

  // districounter first digit
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "districounter1")
    .attr("x", positionlist.indexOf("Districounter") * FSG.UITOP.UIheight - FSG.UITOP.UIheight / 4)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.zero.src + "");

  // districounter second digit
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "districounter2")
    .attr("x", positionlist.indexOf("Districounter") * FSG.UITOP.UIheight + FSG.UITOP.UIheight / 4)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height",FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.one.src + "");

  // it keep track of the the count to show in the counter that show the current count of the districounter
  // haha
  function districountercounter() {
    // the following piece of code is probably horrible, but i thought it would be funny to have a counter in hex or in sexagesimal maybe like it's an alien langage as part of a theme
    // i didn't know it's forbidden to use a digit as the key for part of the src  like FSG.UITOP.iconsforbuttons.4.src

    let firstdigit = Math.floor((districounter + 1) / 10);
    let seconddigit = districounter + 1 - 10 * firstdigit;

    switch (firstdigit) {
      case 0:
        d3.select("#districounter1").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.zero.src + ""
        );
        break;

      case 1:
        d3.select("#districounter1").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.one.src + ""
        );
        break;
      case 2:
        d3.select("#districounter1").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.two.src + ""
        );
        break;
      case 3:
        d3.select("#districounter1").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.three.src + ""
        );
        break;
      case 4:
        d3.select("#districounter1").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.four.src + ""
        );
        break;
      case 5:
        d3.select("#districounter1").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.five.src + ""
        );
        break;
    }

    switch (seconddigit) {
      case 0:
        d3.select("#districounter2").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.zero.src + ""
        );
        break;
      case 1:
        d3.select("#districounter2").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.one.src + ""
        );
        break;
      case 2:
        d3.select("#districounter2").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.two.src + ""
        );
        break;
      case 3:
        d3.select("#districounter2").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.three.src + ""
        );
        break;
      case 4:
        d3.select("#districounter2").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.four.src + ""
        );
        break;
      case 5:
        d3.select("#districounter2").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.five.src + ""
        );
        break;
      case 6:
        d3.select("#districounter2").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.six.src + ""
        );
        break;
      case 7:
        d3.select("#districounter2").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.seven.src + ""
        );
        break;
      case 8:
        d3.select("#districounter2").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.eight.src + ""
        );
        break;
      case 9:
        d3.select("#districounter2").attr(
          "href",
          "" + FSG.UITOP.iconsforbuttons.nine.src + ""
        );
        break;
    }
  }

  // delaunay / not
  FSG.UITOP.svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Delaunay")
    .attr("x", positionlist.indexOf("Delaunay") * FSG.UITOP.UIheight)
    .attr("y", 0)
    .attr("width", FSG.UITOP.UIheight)
    .attr("height", FSG.UITOP.UIheight)
    .attr("href", "" + FSG.UITOP.iconsforbuttons.Delaunay.src + "");
  let Delaunaybutton = d3.select("#Delaunay");
  Delaunaybutton.on("click", function () {
    if ( FSG.STATE.delaunayd==="off"){
    FSG.STATE.delaunayd = "on";
    d3.select("#Delaunay").attr("href", "" + FSG.UITOP.iconsforbuttons.Delaunaynot.src + "");
    drawdelaunayd(FSG.MAIN.delaunayd, FSG.MAIN.svg)
 
    }else
    {FSG.STATE.delaunayd = "on";
    removedelaunayd();
    d3.select("#Delaunay").attr("href", "" + FSG.UITOP.iconsforbuttons.Delaunay.src + "");
     //delete FSG.MAIN.delaunayd
     FSG.STATE.delaunayd="off";
    

    }
  });

}
