// the loading is a function that is a property of FSG and should be remove once done
FSG.ITF.loading = function (){
  console.log("loading started")
  // can be written in { } and hidden for clarity because it act on global var
 {// generic definition and initialization
    // minimum and maximum size of icons of UI based on init measures
    // size needed to position the rest under it properly
    FSG.UITOP.str = FSG.ITF.init.function().toString();
    FSG.UITOP.str = FSG.UITOP.str.slice(0, -1);
    FSG.UITOP.str = FSG.UITOP.str.slice(0, -1);
    FSG.UITOP.str = parseFloat(FSG.UITOP.str);
    FSG.UITOP.UIheight = 0;
    if (FSG.UITOP.str <= 24) {
      console.log(
        "icons too small can't be clicked instead of " +
        FSG.UITOP.str +
          " pixel, they are capped at " +
          24
      );
      FSG.UITOP.UIheight = 24;
    } else if (FSG.UITOP.str >= 96) {
      console.log(
        "icons too big are ugly instead of " +
        FSG.UITOP.str +
          " pixel, they are capped at " +
          96
      );
      FSG.UITOP.UIheight = 96;
    } else if (FSG.UITOP.str > 24 && FSG.UITOP.str < 96) {
      FSG.UITOP.UIheight = FSG.UITOP.str;
      console.log("icons are  " + FSG.UITOP.str + " pixel, that's between 24 and 96 ! ");
    }}

// Values that are part of the simulation STATE = global

//you can change this number to change the number cell at start
FSG.DATA.numberofcellsatstart = 1500;
// svg definition : bounding box
FSG.MAIN.boundwidth = 0;
FSG.MAIN.width=window.innerWidth;
FSG.MAIN.height= window.innerHeight - (FSG.MAIN.boundwidth + FSG.UITOP.UIheight);
//make background off by default for performance when smoothing
FSG.STATE.isbackgroundcoloractivated = false;
//make impassable on by default
FSG.STATE.isimpassableactivated = true;
FSG.STATE.daynight = "off";
FSG.STATE.delaunayd = "off";
FSG.STATE.voronoid ="on";
FSG.DATA.impassablecelllist = [];
FSG.DATA.passablecelllist = [];
FSG.STATE.aretornadoesactive = false;
FSG.STATE.arewormsroaming = false;
FSG.DATA.averagecellarea = (FSG.MAIN.height * FSG.MAIN.width) / FSG.DATA.numberofcellsatstart;
// only Fulgora can load now =)
// var to change the color palette
FSG.STATE.planet = "Fulgora";
//bigger number here means more land vs water
// [0.5-1.5] are quite extreme bound already
// 0.72 is ok for most value between 1000 and  20K points
FSG.DATA.ratiotonormalcell = 0.72;
FSG.STATE.meshwidth=2;



// empty variable initialization
var keybeingpressed = null;
var mouse = null;
var centroidcoordinatearray = [];
var centroidcoordinatearrayrough = [];
var hasorigin = "none";
var hastarget = "none";
var hasoriginp = "none";
var hastargetp = "none";
var adjacencysuperarray = [];
var cleanadjacencysuperarray = [];
var activecell = "none";
var overlayactive = "none";
var landmasses = "none";
var landmasseslist = [];
var landmassesedgelist = [];

var lightmode = "off";
var currentnightpos = 0;
var currentnightpos2 = 0;
// when circle is small one can't see there is a bit missing with pi = 3
var tau = 2 * Math.PI;
var faketau = Math.floor(100 * tau) / 100;
var fakertau = 6;


var wormpopulationrange = [5, 15];
var activeworm = [];
var targetwormpopulation = Math.max(
  Math.min(Math.floor(FSG.DATA.numberofcellsatstart / 100), wormpopulationrange[1]),
  wormpopulationrange[0]
);
var tornadospawner = [];
var tornadoprespawner = [];
var tornadopostspawner = [];
var tornadoprecaster = [];
var lightningcasted = [];
var thunderstruck = [];
var tornadoanimationframe = 12;
var timecounter = 0;

var tornadosize = 1.2 * Math.sqrt(FSG.DATA.averagecellarea);



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
FSG.DATA.Fulgoracolor = {
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
FSG.UITOP.iconsforbuttons = {
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
  Worms: { src: "icons/Worms.png" },
  Wormsnot: { src: "icons/Wormsnot.png" },
  Left: { src: "icons/Left.png" },
  Right: { src: "icons/Right.png" },
  zero: { src: "font/0.png" },
  one: { src: "font/1.png" },
  two: { src: "font/2.png" },
  three: { src: "font/3.png" },
  four: { src: "font/4.png" },
  five: { src: "font/5.png" },
  six: { src: "font/6.png" },
  seven: { src: "font/7.png" },
  eight: { src: "font/8.png" },
  nine: { src: "font/9.png" },
  Delaunay:{src:"icons/delaunay.png"},
  Delaunaynot:{src:"icons/delaunaynot.png"},
};

loadUIicons();

// function to load icons images
function loadUIicons() {
  Object.keys(FSG.UITOP.iconsforbuttons).forEach(function (key) {
    function readthing(iconsforbuttons, key) {
      return iconsforbuttons[key];
    }
    FSG.UITOP.iconsforbuttons[key].image = new Image();
    FSG.UITOP.iconsforbuttons[key].image.src = readthing(FSG.UITOP.iconsforbuttons, key).src;
  });
}




// svg creation at the top to act as UI container
 FSG.UITOP.svgtop = d3
  .create("svg")
  .attr("id", "UItopcontainer")
  .attr("x", 0)
  .attr("y", 0)
  .attr("background-color", "#221f1e")
  .attr("fill-color", "#221f1e")
  .attr("fill", "#221f1e")
  .attr("fill-opacity", 0.5)
  .attr("width", FSG.MAIN.width)
  .attr("height", FSG.UITOP.UIheight)
  .attr("display", "block");
// .attr("stroke", "black")
//  .attr("stroke-width", 2);
container.append(FSG.UITOP.svgtop.node());


// svg creation underneath to act as main container
FSG.MAIN.svg = d3
  .create("svg")
  .attr("id", "maincontainer")
  .attr("y", FSG.UITOP.UIheight)
  .attr("position", "fixed")
  .attr("display", "block")
  .attr("width",FSG.MAIN.width)
  .attr("height", FSG.MAIN.height);
container.append(FSG.MAIN.svg.node());


// random data to initialize with something that look nice 
FSG.DATA.datamap = Array.from({ length: FSG.DATA.numberofcellsatstart }).map(() => {
  return [
    Math.round(FSG.MAIN.width * Math.random()),
    Math.round(FSG.MAIN.height * Math.random()),
  ];
});



// create initial delaunay triangulation from array of points
FSG.MAIN.delaunayd = d3.Delaunay.from(FSG.DATA.datamap);
//create initial voronoi diagram from the previous delaunay triangulation
FSG.MAIN.voronoid = FSG.MAIN.delaunayd.voronoi([0, 0, FSG.MAIN.width, FSG.MAIN.height]);
// ok this is an attempt
delete FSG.init;

}
FSG.ITF.loading();
