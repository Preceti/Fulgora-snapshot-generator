// this is needed so that we can make the UI that has function touching the main svg before the main svg ?
var initUI = { color: "init", fullscreen: "notfullscreen" };

//measure which size user use for text
function init() {
  // change the title of the page, and provide some lorem ipsum like content to be used for measuring user display setup
  newPageTitle = "The title has changed!";
  document.title = newPageTitle;

  var heightof1text = 0;
  // create a dummy box that will be deleted later, that takes the height of the screen to make sure a text fit in
  let svgdummy = d3
    .create("svg")
    .attr("id", "dummytextcontainer")
    .attr("x", 0)
    .attr("y", 0)
    //max size given current browser's window
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);
  container.append(svgdummy.node());

  // then try to put a text of default 1em size in it
  let textmeasure = d3.selectAll("#dummytextcontainer");
  let dummytext =
    " this is a dummy text, maybe lorem ipsum or something to detect how many characters can fit on a single lane ? that seem unecessary for now";
  textmeasure
    .append("text")
    .text(dummytext)
    .attr("id", "dummytextformeasure")
    .attr("x", 0)
    // size of "1" unit of text size of vertical offset so that the top of the text fit the top of the container
    .attr("y", "1em")
    // size of "1" unit of text
    .attr("font-size", "1em")
    .attr("height", "1em");

  // then measure the text in pixels given the browser settings so as to adjust the rest later
  let elem1 = document.getElementById("dummytextformeasure");
  heightof1text = window.getComputedStyle(elem1, null).fontSize;

  // then delete the whole thing
  textmeasure.remove();
  //console.log(heightof1text);

  return heightof1text;
}
