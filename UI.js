// run once
createUIbuttons();

// really we want buttons for functions that can be activated without requiring a click in a precise location on the graph
// eg=> smoothing the graph
// drawing all centroids
// adding overlay on all tiles ...
function createUIbuttons() {
  // Info Button ?
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "infobutton")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Info.src + "");
  let infobutton = d3.selectAll("#infobutton");
  infobutton.on("click", function (event) {
    alert(
      "click while pressing a key => key that do something => [² a z e r t y u i o p m l k j h g f c]key that print something in console=> [q s d x] To make fulgora press z then click a few times, then press l and click once, to feel the tornadoes press f and click"
    );
  });

  // Sound  button
  // old "²" key
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Sound")
    .attr("x", 1 * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Musicoff.src + "");
  let soundbutton = d3.selectAll("#Sound");
  soundbutton.on("click", function (event) {
    if (ambiantsound != "playing") {
      ambiantsound = "playing";
      customrepeatplay(FulgoraThunder);
      customrepeatplay(FulgoraWind);
    } else {
      ambiantsound = "off";
      stopsound(FulgoraWind)
      stopsound(FulgoraThunder)
    }
 

  });

  // sun button , need to become a moon sometimes
  // should the UI update in a loop and change itself too ?
  // or try to catch everytime it should and dispatch the change from other source ?
  // old "g" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Sun")
    .attr("x", 2 * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Sun.src + "");

  let sunbutton = d3.selectAll("#Sun");
  sunbutton.on("click", function (event) {
    if (daynight === "off") {
      daynight = "on";
      daynightcycler();
    } else {
      daynight = "off";
      daynightcycler();
    }
  });

  // shuffle button
  // old "c" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Shuffle")
    .attr("x", 3 * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Shuffle.src + "");
  let shufflebutton = d3.selectAll("#Shuffle");
  shufflebutton.on("click", function (event) {
    if (daynight === "on") {
      daynight = "off";

      daynightcycler();
      deactivatetornadoes();
    }
    isbackgroundcoloractivated = false;
    cyclerandomdistrib();
  });

  // Smooth button
  // old "z" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Smooth")
    .attr("x", 4 * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Smooth.src + "");
  let smoothbutton = d3.selectAll("#Smooth");
  smoothbutton.on("click", function (event) {
    drawallcentroids();
    replacecentroids(centroidcoordinatearray);
    // things seem to work without this for some reason
    //  graph = makegraph(datamap);
    daynight = "off";
    aretornadoesactive = false;
    if (isbackgroundcoloractivated == true) {
      fbackgroundcolors();
    }
  });

  // Loop  button
  // to work with shuffle
  // somewhat not implemented
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Loop")
    .attr("x", 5 * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Loop.src + "");
  let loopbutton = d3.selectAll("#Loop");
  loopbutton.on("click", function (event) {
    console.log("should randomize the points with current distrib");
    cyclerandomdistrib("not");
  });

  // Paint color button
  // old "l" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Color")
    .attr("x", 6 * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Color.src + "");
  let colorbutton = d3.selectAll("#Color");
  colorbutton.on("click", function () {
    color(initUI.color);
  });

  // Paint overlay button
  // old "t" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Overlay")
    .attr("x", 7 * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Overlay.src + "");
  let overlaybutton = d3.selectAll("#Overlay");
  overlaybutton.on("click", function () {
    overlaymanager();
  });

  // fullscreen button
  // doesn't work properly
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Fullscreen")
    .attr("x", 8 * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Fullscreen.src + "");
  let fullscreenbutton = d3.selectAll("#Fullscreen");
  fullscreenbutton.on("click", function () {
    fullscreen(initUI.fullscreen);
  });

  // Paint/hide Impassable button
  // old "k" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Impassable")
    .attr("x", 9 * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Impassable.src + "");
  let impassablebutton = d3.selectAll("#Impassable");
  impassablebutton.on("click", function () {
    if (isimpassableactivated === true) {
      isimpassableactivated = false;
      hideimpassableterrain();
      impassablebutton.attr(
        "href",
        "" + iconsforbuttons.Impassablehidden.src + ""
      );
    } else {
      isimpassableactivated = true;
      paintimpassable();
      impassablebutton.attr("href", "" + iconsforbuttons.Impassable.src + "");
    }
  });

  // Change land/water/none Impassable button
  // old "j" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Allpassable")
    .attr("x", 10 * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Allpassable.src + "");
  let Allpassablebutton = d3.selectAll("#Allpassable");
  Allpassablebutton.on("click", function () {
    //force visibility first anyway
    if (isimpassableactivated != true) {
      isimpassableactivated = true;
      impassablebutton.attr("href", "" + iconsforbuttons.Impassable.src + "");
    }
    applyimpassablemode();

    if (impassablemode === "water") {
      Allpassablebutton.attr(
        "href",
        "" + iconsforbuttons.Waterimpassable.src + ""
      );
    }
    if (impassablemode === "land") {
      Allpassablebutton.attr(
        "href",
        "" + iconsforbuttons.Landimpassable.src + ""
      );
    }
    if (impassablemode === "none") {
      Allpassablebutton.attr("href", "" + iconsforbuttons.Allpassable.src + "");
    }
  });

  // not sure those should be included in the createUIButtons function or put aside
  // helper function for fullscreen
  function fullscreen(r) {
    if (r === "init") {
      initUI.fullscreen = "notfullscreen";
      console.log("too early would throw error");
    } else if (r === "fullscreen") {
      let fullscreenbutton = d3.selectAll("#Fullscreen");
      document.exitFullscreen();
      initUI.fullscreen = "notfullscreen";
      fullscreenbutton.attr("href", "" + iconsforbuttons.Fullscreen.src + "");
    } else if (r === "notfullscreen") {
      let fullscreenbutton = d3.selectAll("#Fullscreen");
      initUI.fullscreen = "fullscreen";
      // doesn't reproduce F11 functionnality in that a refresh of the page will also exit fullscreen when entered this way rather than with F11
      document.querySelector("html").requestFullscreen();
      //window.open("url.html",'','fullscreen=yes')
      //that would have been too easy
      // need to re-measure and redraw
      //location.reload();
      fullscreenbutton.attr(
        "href",
        "" + iconsforbuttons.Notfullscreen.src + ""
      );
    }
  }

  // helper function for color
  function color(r) {
    if (r === "init") {
      initUI.color = "passed";
      console.log("too early would throw error");
    } else if (r === "passed") {
      let colorbutton = d3.selectAll("#Color");
      if (isbackgroundcoloractivated === true) {
        colorbutton.attr("href", "" + iconsforbuttons.Color.src + "");
        isbackgroundcoloractivated = false;
        removebackgroundcolors();
      } else {
        colorbutton.attr("href", "" + iconsforbuttons.Nocolor.src + "");
        isbackgroundcoloractivated = true;
        fbackgroundcolors();
      }
    }
  }
}
