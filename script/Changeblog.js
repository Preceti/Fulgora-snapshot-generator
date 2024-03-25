let changeblog = {
  day7:{ 
    date :"25/04",
  things:[
    "I realized seeing other players creation in my favourite game FACTORIO that there is always room for improvements, i'm sometimes a tad perfectionnist, and quite ignorant in javascript programming which is a good combo to make terrible things, so i decided to try something for reorganization, it breaks everything, mostly the UI as now all value will be wrapped into an object that will be easy to inspect and query at all time for debug and the program itself, and when changing all names i'm also backtracking the logic that i made when it was my first days of this project and i knew even less than now what i was doing",
    " This leads to such a broken version and a bit of a longer process than usual for updates that i decided to try to make an experimental branch on github to test how it works",  ]
  },
  day6:{ 
    date :"23/04",
  things:[
    " Found a problem :The square grid and the overlay for neihgours allow to see some floating point errors making some adjacent cell not able to recognize their neighbour i suppose due to not seeing 2 points shared but only 1 in some cases, i noticed some square have 5 points while the 5th is 0.000000003 away from the 4rth and those fail adjacency detection",
    "I'm considering extracting more part of the 'script' file to dedidaced scrip to help organisation, and in doing so i'd like to rework the draw order, the shadow at night used to properly display above tornados but only when redrawn and not translated every update, which cost a lot more performance",
    "Considering trying to minimize DOM object creation/destruction, by better changing .attr instead, and selecting them more precisely, maybe it will help what i'm seeing as the highest thing in the performance recorder",

  ]
  },
  day5: {
    date: "22/03",
    things: [
      "Ended up complicating the generation of random points with display code to match the position with the UI needlessly, gave me this idea about making stupidly long titles of page using the day to day changeblog, to leverage the best ideas over time and show disdain for referencing",
      ,
      "some more circle and grid experiments, donut is operationnal,  added icons counter for more visibility when switching, and the shuffle buttons works properly",
    ],
  },
  day4: {
    date: "21/03",
    thing:
      "Today, i thought it would be easy to draw the largest circle that can fit in any cell, the radius is half the distance the closest neighbour and center is centroid if graph is smooth enough. Maybe use this to draw some oil as a sticker image on the ground. Made me want to try other experiment with circles like for worms range of awareness, and maybe blur effects for point generation on the map. Grid like maps are nice canvas for additionnal points because the density is already close to average for all cell, making any additionnal point emerging from the 'ocean', can be used to draw real like geographical map like earth, or DONUT",
  },
  day3: {
    date: "20/23",
    thing:
      "Worms are moving at constant speed accross orientation and face it but they can go from facing west to south east in a single frame, while it could be made incremental rotation ?",
  },
  day2: {
    date: "19/03",
    things: [
      "Adding worms as test subject to try and get something moving from cell to cell in a consistent speed accross orientation following randombased motion. Considering interaction with tornadoes in favor of the tornado or being set on fire by lightning and then becoming oil tile or item on the ground, but then oil also need to be set on fire by lighning or it would accumulate on the map without regulation. Maybe worms could try to avoid picking their random destination amongst cells at nights if they can and it would look cool on the map.",
      "I think some buttons are new too, but those are mostly for testing like scaffold to understand how to make and what to make they do not have proper interaction with the keyboard.Except the 'a' key, which isn't a buton Maybe tooltip on hover would help making things less confusing, improved visual or a little thingy circling around the button that is 'toggled' as a fallback plan for making things move using the built in web .translate or those from d3 if i can't make myself the position function for worms to try a lower challenge before trying again the bigger one.",
      "Algorithm for drawing contour of landmasses still seem like the big boss,  stuck on the (double triple...) donut problem. contour is not enough it would consider the inner part as filled if not properly extruded and it's unclear what are the different cases of points belonging to which contour that can occur. Things like 12 tiles joining in a single point and half of them are not part of the landmass, how to draw ? no idea how to exclude small segment from cells as a way to avoid those situations though i know it's possible. i'd rather allow some very weird things to occur to make it more interesting.",
      "Ideally there is no need to read text once it's open and it works for all keyboard, you could change planets and it would show some things happening that makes you want to click some things after observation to see how the world would react to the poke.",
    ],
  },
  day1: {
    date: "18/03",
    thing:
      "Realized i could write stuff here to document things i add and don't finish to add because i'm considering options until i forget about them, to avoid adding them again with a different name once i'm finally decided.",
  },
  day0: {
    date: "complicated",
    thing:
      "Today very important question, here is the situation : [1] You take a time machine to go back in time,  [2] find one of your previous reincarnation,  [3] then proceed to disingenuously argue with it , until [4] your oldself throw a tantrum and [5] slap you in the face.  How is your karma affected through process [1] to [5] ?",
  },
// template 
  dayx:{ 
    date :"xx/x",
  things:[
    "",
    "",  ]
  },

};
