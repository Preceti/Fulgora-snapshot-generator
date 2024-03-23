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
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "infobutton")
    .attr("x", positionlist.indexOf("infobutton") * UIheight)
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
    .attr("x", positionlist.indexOf("Sound") * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Musicon.src + "");
  let soundbutton = d3.selectAll("#Sound");
  soundbutton.on("click", function (event) {
    if (ambiantsound != "playing") {
      ambiantsound = "playing";
      customrepeatplay(FulgoraThunder);
      customrepeatplay(FulgoraWind);
      soundbutton.attr("href", "" + iconsforbuttons.Musicoff.src + "");
    } else {
      ambiantsound = "off";
      stopsound(FulgoraWind);
      stopsound(FulgoraThunder);
      soundbutton.attr("href", "" + iconsforbuttons.Musicon.src + "");
    }
  });

  // Add point
  // isn't actually a button is an indicator when the key that makes the next click add points is being pressed so user is aware it will work before clicking
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Addpoint")
    .attr("x", positionlist.indexOf("Addpoint") * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Addpoint.src + "");
  let addpointbutton = d3.selectAll("#Addpoint");
  addpointbutton.on("click", function (event) {
    keybeingpressed = event.key;
    if (keybeingpressed === "a") {
      addpointbutton.attr("href", "" + iconsforbuttons.Addedpoint.src + "");
    }
  });
  addpointbutton.on("keyup", function (event) {
    keybeingpressed = event.key;
    addpointbutton.attr("href", "" + iconsforbuttons.Addpoint.src + "");
  });

  // sun button , need to become a moon sometimes
  // should the UI update in a loop and change itself too ?
  // or try to catch everytime it should and dispatch the change from other source ?
  // old "g" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Sun")
    .attr("x", positionlist.indexOf("Sun") * UIheight)
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
    .attr("x", positionlist.indexOf("Shuffle") * UIheight)
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
    cyclerandomdistrib("shuffle");
    districountercounter();
  });

  // Smooth button
  // old "z" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Smooth")
    .attr("x", positionlist.indexOf("Smooth") * UIheight)
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
  // work with shuffle
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Loop")
    .attr("x", positionlist.indexOf("Loop") * UIheight)
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
    .attr("x", positionlist.indexOf("Color") * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Color.src + "");
  let colorbutton = d3.selectAll("#Color");
  colorbutton.on("click", function () {
    color(initUI.color);
  });

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

  // Paint overlay button
  // old "t" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Overlay")
    .attr("x", positionlist.indexOf("Overlay") * UIheight)
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
    .attr("x", positionlist.indexOf("Fullscreen") * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Fullscreen.src + "");
  let fullscreenbutton = d3.selectAll("#Fullscreen");
  fullscreenbutton.on("click", function () {
    fullscreen(initUI.fullscreen);
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

  // Paint/hide Impassable button
  // old "k" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Impassable")
    .attr("x", positionlist.indexOf("Impassable") * UIheight)
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
    .attr("x", positionlist.indexOf("Allpassable") * UIheight)
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

  // Change land/water/none Impassable button
  // old "j" key action
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Worms")
    .attr("x", positionlist.indexOf("Worms") * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Worms.src + "");
  let Wormsbutton = d3.selectAll("#Worms");
  Wormsbutton.on("click", function () {
    if (arewormsroaming === false) {
      arewormsroaming = true;
      Wormsbutton.attr("href", "" + iconsforbuttons.Wormsnot.src + "");
    } else if (arewormsroaming === true) {
      arewormsroaming = false;

      Wormsbutton.attr("href", "" + iconsforbuttons.Worms.src + "");
    }

    Wormsmanager();
  });

  // Left districounter
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Leftdistricounter")
    .attr("x", positionlist.indexOf("Leftdistricounter") * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Left.src + "");
  let Leftdistricounterbutton = d3.selectAll("#Leftdistricounter");
  Leftdistricounterbutton.on("click", function (event) {
    if (daynight === "on") {
      daynight = "off";

      daynightcycler();
      deactivatetornadoes();
    }
    isbackgroundcoloractivated = false;
    cyclerandomdistrib("previous");
    districountercounter();
  });
  // Right districounter
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "Rightdistricounter")
    .attr("x", positionlist.indexOf("Rightdistricounter") * UIheight)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.Right.src + "");
  let Rightdistricounterbutton = d3.selectAll("#Rightdistricounter");
  Rightdistricounterbutton.on("click", function (event) {
    if (daynight === "on") {
      daynight = "off";

      daynightcycler();
      deactivatetornadoes();
    }
    isbackgroundcoloractivated = false;
    cyclerandomdistrib("next");
    districountercounter();
  });

  // districounter first digit
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "districounter1")
    .attr("x", positionlist.indexOf("Districounter") * UIheight - UIheight / 4)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.zero.src + "");

  // districounter second digit
  svgtop
    .append("image")
    .attr("image-rendering", "pixelated")
    .attr("id", "districounter2")
    .attr("x", positionlist.indexOf("Districounter") * UIheight + UIheight / 4)
    .attr("y", 0)
    .attr("width", UIheight)
    .attr("height", UIheight)
    .attr("href", "" + iconsforbuttons.one.src + "");

  // it keep track of the the count to show in the counter that show the current count of the districounter
  // haha
  function districountercounter() {
    // the following piece of code is probably horrible, but i thought it would be funny to have a counter in hex or in sexagesimal maybe like it's an alien langage as part of a theme
    // i didn't know it's forbidden to use a digit as the key for part of the src  like iconsforbuttons.4.src

    let firstdigit = Math.floor((districounter + 1) / 10);
    let seconddigit = districounter + 1 - 10 * firstdigit;

    switch (firstdigit) {
      case 0:
        d3.select("#districounter1").attr(
          "href",
          "" + iconsforbuttons.zero.src + ""
        );
        break;

      case 1:
        d3.select("#districounter1").attr(
          "href",
          "" + iconsforbuttons.one.src + ""
        );
        break;
      case 2:
        d3.select("#districounter1").attr(
          "href",
          "" + iconsforbuttons.two.src + ""
        );
        break;
      case 3:
        d3.select("#districounter1").attr(
          "href",
          "" + iconsforbuttons.three.src + ""
        );
        break;
      case 4:
        d3.select("#districounter1").attr(
          "href",
          "" + iconsforbuttons.four.src + ""
        );
        break;
      case 5:
        d3.select("#districounter1").attr(
          "href",
          "" + iconsforbuttons.five.src + ""
        );
        break;
    }

    switch (seconddigit) {
      case 0:
        d3.select("#districounter2").attr(
          "href",
          "" + iconsforbuttons.zero.src + ""
        );
        break;
      case 1:
        d3.select("#districounter2").attr(
          "href",
          "" + iconsforbuttons.one.src + ""
        );
        break;
      case 2:
        d3.select("#districounter2").attr(
          "href",
          "" + iconsforbuttons.two.src + ""
        );
        break;
      case 3:
        d3.select("#districounter2").attr(
          "href",
          "" + iconsforbuttons.three.src + ""
        );
        break;
      case 4:
        d3.select("#districounter2").attr(
          "href",
          "" + iconsforbuttons.four.src + ""
        );
        break;
      case 5:
        d3.select("#districounter2").attr(
          "href",
          "" + iconsforbuttons.five.src + ""
        );
        break;
      case 6:
        d3.select("#districounter2").attr(
          "href",
          "" + iconsforbuttons.six.src + ""
        );
        break;
      case 7:
        d3.select("#districounter2").attr(
          "href",
          "" + iconsforbuttons.seven.src + ""
        );
        break;
      case 8:
        d3.select("#districounter2").attr(
          "href",
          "" + iconsforbuttons.eight.src + ""
        );
        break;
      case 9:
        d3.select("#districounter2").attr(
          "href",
          "" + iconsforbuttons.nine.src + ""
        );
        break;
    }
  }
}
