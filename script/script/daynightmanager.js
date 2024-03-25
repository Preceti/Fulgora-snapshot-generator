// function to draw the night/day cycle
// that's probably not how one should do an update loop, but for now it do the job
function daynightcycler(width,height) {
  // reset time
  timecounter = 0;
  // time of a day in second
  let daynightcycletime = 30;
  // time between each update in millisec (16 for 60 fps)
  let dayticktime = 16;
  // amount of space to move the overlay each update
  let baseoffset = width / ((daynightcycletime * 1000) / dayticktime);
  // set the time waiting between 2 updates
  let delay = (ms) => new Promise((res) => setTimeout(res, ms));
    //calculate position and size based on user browser window
  currentnightpos = 0;
  currentnightpos2 = currentnightpos - width;
    // start with recent list not updated for performance
    identifypassable();


  var daynightFunction = async () => {
    // repeat unless toggled off
    while (FSG.STATE.daynight === "on") {
      timecounter = (timecounter + 1) % 1000000;
      lightmode = "on";
      // update position
      currentnightpos = (currentnightpos + baseoffset) % width;
      currentnightpos2 = currentnightpos - width;

      // If there is a nightshadow , translate it
      let selecdaynight = d3.select("[daynight]")._groups[0][0];
      if (selecdaynight) {
        selecdaynight.transform.baseVal
          .getItem(0)
          .setTranslate(currentnightpos, 0);
      }
      // call on the lights check each update may be smarter to stagger with % so every 5 updates, 10% of nodes are checked for performance
      turnonthelights(timecounter,FSG.DATA.passablecelllist,FSG.DATA.datamap);
      animatetornadoes(timecounter);
      animateworms(timecounter, FSG.MAIN.svg);

      // wait before update
      await delay(dayticktime);
      // console.log("Waited" + dayticktime + "ms");
    }

    // remove last
    let selecdaynight = d3.select("[daynight]");
    selecdaynight.remove();
    daynight = "off";
    lightmode = "off";
    aretornadoesactive = false;
    turnonthelights(timecounter,FSG.DATA.passablecelllist,FSG.DATA.datamap,FSG.MAIN.svg);
  };

  // draw a shade shape that will slide to represent nightcycle
  drawtheshading(FSG.MAIN.width,FSG.MAIN.height);

  // actually start the controlled infinite loop
  daynightFunction();
}
