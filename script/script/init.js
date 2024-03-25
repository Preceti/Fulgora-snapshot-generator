// I had not seen that somewhere i came up with it myself, not idea what i'm doing but i thought i would make it easy to know what's going

// This will be the main wrapper for all values so people can't complain the global variable are risky they can interfere or be removed because i've read they complain about that a lot
const FSG = {};
// STATE is used to know what is being displayed, if tornado are active or which planet potentially
// it store the state initialization , loading, active, ...
FSG.STATE = { color: "init", fullscreen: "notfullscreen" };
// ITF is for interface, it is used to store functions that can be called, or "forgotten"
FSG.ITF = {};
// example : everything that concern initialization will be removed once things are loaded
FSG.ITF.init = {};
// The DATA duh
FSG.DATA = {};
// The Sound
FSG.SOUND = {};
// Everything that concern the upper UI and will not be removed
FSG.UITOP = {};
// Everything that concern the main box that is not directly the data
FSG.MAIN = {};
// init function called during loading and then removed
FSG.ITF.init.function = function () {
  //measure which size user use for text
  // change the title of the page, and provide some lorem ipsum like content to be used for measuring user display setup
  newPageTitle = "The title has changed!";
  document.title = newPageTitle;
  FSG.ITF.init.heightof1text = 0;
  // create a dummy box that will be deleted later, that takes the height of the screen to make sure a text fit in
  FSG.ITF.init.svgdummy = d3
    .create("svg")
    .attr("id", "dummytextcontainer")
    .attr("x", 0)
    .attr("y", 0)
    //max size given current browser's window
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);
  container.append(FSG.ITF.init.svgdummy.node());

  // then try to put a text of default 1em size in it
  FSG.ITF.init.textmeasure = d3.select("#dummytextcontainer");
  FSG.ITF.init.dummytext =
    " this is a dummy text, maybe lorem ipsum or something to detect how many characters can fit on a single lane ? that seem unecessary for now";
  FSG.ITF.init.textmeasure
    .append("text")
    .text(FSG.ITF.init.dummytext)
    .attr("id", "dummytextformeasure")
    .attr("x", 0)
    // size of "1" unit of text size of vertical offset so that the top of the text fit the top of the container
    .attr("y", "1em")
    // size of "1" unit of text
    .attr("font-size", "1em")
    .attr("height", "1em");

  // then measure the text in pixels given the browser settings so as to adjust the rest later
  FSG.ITF.init.elem1 = document.getElementById("dummytextformeasure");
  FSG.UITOP.heightof1text = window.getComputedStyle(
    FSG.ITF.init.elem1,
    null
  ).fontSize;

  // then delete the whole thing
  FSG.ITF.init.textmeasure.remove();
  //console.log(FSG.ITF.init.textmeasure);
    delete FSG.ITF.init;
  return FSG.UITOP.heightof1text;
};
