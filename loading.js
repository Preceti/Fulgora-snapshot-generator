// generic definition and initialization
// minimum and maximum size of icons of UI based on init measures
// size needed to position the rest under it properly
let str = init().toString();
str = str.slice(0, -1);
str = str.slice(0, -1);
str = parseFloat(str);
let UIheight = 0;
if (str <= 24) {
  console.log(
    "icons too small can't be clicked instead of " +
      str +
      " pixel, they are capped at " +
      24
  );
  UIheight = 24;
} else if (str >= 96) {
  console.log(
    "icons too big are ugly instead of " +
      str +
      " pixel, they are capped at " +
      96
  );
  UIheight = 96;
} else if (str > 24 && str < 96) {
  UIheight = str;
  console.log("icons are  " + str + " pixel, that's between 24 and 96 ! ");
}

// svg definition : bounding box
const boundwidth = 0;
var width = window.innerWidth;
var height = window.innerHeight - (boundwidth + UIheight);
//you can change this number to change the number cell at start
const numberofcellsatstart = 2500;
//bigger number here means more land vs water
// [0.5-1.5] are quite extreme bound already
// 0.72 is ok for most value between 1000 and  20K points
const ratiotonormalcell = 0.72;

// empty variable initialization
var keybeingpressed = null;
var mouse = null;
var centroidcoordinatearray = [];
var centroidcoordinatearrayrough = [];
var hasorigin = "none";
var hastarget = "none";
var hasoriginp = "none";
var hastargetp = "none";
var impassablecelllist = [];
var passablecelllist = [];
var adjacencysuperarray = [];
var cleanadjacencysuperarray = [];
var activecell = "none";
var overlayactive = "none";
var landmasses = "none";
var landmasseslist = [];
var landmassesedgelist = [];
var daynight = "off";
var lightmode = "off";
var currentnightpos = 0;
var currentnightpos2 = 0;
// when circle is small one can't see there is a bit missing with pi = 3
var tau = 2 * Math.PI;
var faketau = Math.floor(100 * tau) / 100;
var fakertau = 6;
var aretornadoesactive = false;
var arewormsroaming = false;
var wormpopulationrange = [5 , 15];
var activeworm=[];
var targetwormpopulation = Math.max(Math.min( Math.floor(numberofcellsatstart/100) , wormpopulationrange[1]),wormpopulationrange[0]);
var tornadospawner = [];
var tornadoprespawner = [];
var tornadopostspawner = [];
var tornadoprecaster = [];
var lightningcasted = [];
var thunderstruck = [];
var tornadoanimationframe = 12;
var timecounter = 0;
var averagecellarea = (height * width) / numberofcellsatstart;
var tornadosize = 1.2 * Math.sqrt(averagecellarea);

//make background off by default for performance when smoothing
var isbackgroundcoloractivated = false;
//make impassable on by default
var isimpassableactivated = true;
// make no choice for what is impassable. ( "none"/ "land" / "water")
var impassablemode = "none";
// list of type of cells
var icecelllist = [];
var watercelllist = [];
var landcelllist = [];
var shallowwatercelllist = [];
var deepwatercelllist = [];
var mountaincelllist = [];
var hillcelllist = [];
var bluemysterycelllist = [];

// color from factorio Fulgora planet
const Fulgoracolor = {
  colornames: [
    "deepwater",
    "water",
    "shallowwater",
    "hills",
    "land",
    "mountain",
    "bluemystery",
  ],
  colorscheme: [
    "#3a2029",
    "#4a2829",
    "#987954",
    "#734131",
    "#845542",
    "#737974",
    "#006299",
  ],
  //deepwater = "sand deep"
  deepwater: "#3a2029",
  //water = "sandshallow"
  water: "#4a2829",
  //shallowwater = "edge island":
  shallowwater: "#987954",
  //hills = "fillislandred"
  hills: "#734131",
  //land = "fill island tan"
  land: "#845542",
  //mountain =  "fill island blue"
  mountain: "#737974",
  // this is specific to Fulgora
  bluemystery: "#006299",
};

// Earth like color
const Earthcolor = {
  land: "#a5d260",
  ice: "#99ccff",
  mountain: "#98492f",
  hills: "#cc8800",
  shallowwater: "#2f6397",
  water: "#212869",
  deepwater: "#12123b",
};

// links for images for buttons
const icons = [];
const iconsforbuttons = {
  Addpoint: { src: "icons/Addpoint.png" },
  Addedpoint: { src: "icons/Addedpoint.png" },
  Fire: { src: "icons/Fire.png" },
  Impassable: { src: "icons/Impassable.png" },
  Impassablehidden: { src: "icons/Impassablehidden.png" },
  Lightning: { src: "icons/Lightning.png" },
  Night: { src: "icons/Night.png" },
  Overlay: { src: "icons/Overlay.png" },
  Shuffle: { src: "icons/Shuffle.png" },
  Smooth: { src: "icons/Smooth.png" },
  Sun: { src: "icons/Sun.png" },
  Tornado: { src: "icons/Tornado.png" },
  Info: { src: "icons/Info.png" },
  Color: { src: "icons/Color.png" },
  Nocolor: { src: "icons/nocolor.png" },
  Loop: { src: "icons/Loop.png" },
  Fullscreen: { src: "icons/fullscreen.png" },
  Notfullscreen: { src: "icons/notfullscreen.png" },
  Landimpassable: { src: "icons/landimpassable.png" },
  Waterimpassable: { src: "icons/waterimpassable.png" },
  Allpassable: { src: "icons/Allpassable.png" },
  Musicon: { src: "icons/Musicon.png" },
  Musicoff: { src: "icons/Musicoff.png" },
  Worms :{src :"icons/Worms.png"},
  Wormsnot:{ src:"icons/Wormsnot.png"}
};
loadUIicons();

// function to load icons images
function loadUIicons() {
  Object.keys(iconsforbuttons).forEach(function (key) {
    function readthing(iconsforbuttons, key) {
      return iconsforbuttons[key];
    }
    iconsforbuttons[key].image = new Image();
    iconsforbuttons[key].image.src = readthing(iconsforbuttons, key).src;

    //console.log(readthing(iconsforbuttons,key).src)
    //console.log(iconsforbuttons)
  });

  //console.log(iconsforbuttons.Sun.image)
}

// svg creation at the top to act as UI container
var svgtop = d3
  .create("svg")
  .attr("id", "UItopcontainer")
  .attr("x", 0)
  .attr("y", 0)
  .attr("background-color", "#221f1e")
  .attr("fill-color", "#221f1e")
  .attr("fill", "#221f1e")
  .attr("fill-opacity", 0.5)
  .attr("width", width)
  .attr("height", UIheight)
  .attr("display", "block");
// .attr("stroke", "black")
//  .attr("stroke-width", 2);
container.append(svgtop.node());
