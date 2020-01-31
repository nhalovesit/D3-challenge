// Use D3 to create an animated scatter plot

// setting up the width, height, and margins of the graph

// get the width of the box
var width = parseInt(d3.select("#scatter").style("width"));

//height of the graph
var height = width - width / 4;

//margin spacing
var margin = 20;

// space for text
var label_area = 110;

// padding for the text
var text_bottom_padding = 40;
var text_left_padding = 40;

// actual canvas
 var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("width", height)
    .attr("class", "chart");

// radius for each state dot on the graph

var dotRadius;
function crGet() {
    if (width <= 530){
        dotRadius = 5;
    }
    else {
        dotRadius = 10;
    }
}
crGet();

// Adding the labels for each axis

// Bottom axis
// Group element to next bottom axis
svg.append("g").attr("class","x_text");

// x_text to select group without excess code
var x_text = d3.select(".x_text");

// changes based on the sizing of the window, a function makes is easier to change the location of the labels whenever
// the size of the window changes
function text_refresh_x() {
    x_text.attr(
        "transform",
        "translate(" + ((width - label_area) / 2 + label_area) + "," + (height - margin - text_bottom_padding) + ")"
    );
}
text_refresh_x();

// x_text to append the 3 SVG files
// poverty
x_text
    .append("text")
    .attr("y", -26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("In Poverty (%)");
// age
x_text
    .append("text")
    .attr("y", 0)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Age (Median)");
// Income
  x_text
    .append("text")
    .attr("y", 26)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Household Income (Median)");

// left axis

var left_text_X = margin - text_left_padding;
var left_text_Y = (height + label_area) / 2 - label_area;

// add second label group
svg.append("g").attr("class", "y_text");

// y_text
var y_text = d3.select(".y_text");

// next group's transform
function y_textRefresh() {
y_text.attr(
    "transform",
    "translate(" + left_text_X + ", " + left_text_Y + ")rotate(-90)"
);
}
y_textRefresh();

// 1. Obesity
y_text
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// 2. Smokes
y_text
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// 3. Lacks Healthcare
y_text
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

// Importing csv file
d3.csv("/assets/data/data.csv").then(function(data) {
    visualize(data);
});

// visualization function
function visualize(data) {
    // local variables
    var current_X = "poverty";
    var current_Y = "obesity";

    var xMin, xMax, yMin, yMax;

    // This function allows us to set up tool_tip rules (see d3-tip.js).
  var tool_tip = d3
  .tip()
  .attr("class", "d3-tip")
  .offset([40, -60])
  .html(function(d) {
    // x key
    var the_X;
    // Grab the state name.
    var theState = "<div>" + d.state + "</div>";
    // Snatch the y value's key and value.
    var theY = "<div>" + current_Y + ": " + d[current_Y] + "%</div>";
    // If the x key is poverty
    if (current_X === "poverty") {
      // Grab the x key and a version of the value formatted to show percentage
      the_X = "<div>" + current_X + ": " + d[current_X] + "%</div>";
    }
    else {
      // Otherwise
      // Grab the x key and a version of the value formatted to include commas after every third digit.
      the_X = "<div>" +
        current_X +
        ": " +
        parseFloat(d[current_X]).toLocaleString("en") +
        "</div>";
    }
    // Display what we capture.
    return theState + the_X + theY;
  });
// Call the tool_tip function.
svg.call(tool_tip);


// Removes repetitions 
// min and max for x
    function  xMinMax() {
      // min grabs the smallest form the column
        xMin = d3.min(data, function(d) {
            return parseFloat(d[current_X]) * 0.90;
        });

        xMax = d3.max(data, function(d) {
            return parseFloat(d[current_X]) * 1.10;
        });
    }


// min and max for y
    function  yMinMax() {
        yMin = d3.min(data, function(d) {
            return parseFloat(d[current_Y]) * 0.90;
        });

        yMax = d3.max(data, function(d) {
            return parseFloat(d[current_Y]) * 1.10;
        });
    }
  // change the classes (and appearance) of label text when clicked.
  function change_label(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }
    // instantiate the scatter plot

    // gets the min and max values of x and y
    xMinMax();
    yMinMax();

    // create the x and y scales for the plot
    var xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([margin + label_area, width - margin]);
    
    var yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin - label_area, margin]);
    
    
    // pass the scales into the axis methods to create the axis
     var xAxis  = d3.axisBottom(xScale);
     var yAxis = d3.axisLeft(yScale);

  // Determine x and y tick counts.
  // Note: Saved as a function for easy mobile updates.
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  
// append the axes in group elements
    svg
        .append("g")
        .call(xAxis)
        .attr("class","xAxis")
        .attr("transform", "translate(0," + (height - margin - label_area) + ")");
    svg
        .append("g")
        .call(yAxis)
        .attr("class","yAxis")
        .attr("transform", "translate(" + (margin + label_area) + ", 0)");

// for dots and labels
var dots = svg.selectAll("g dots").data(thedata).enter();
// append the dots
dots
.append("circle")
.attr("cx", function(d) {
    return xScale(d[current_X]);
})
.attr("cy", function(d){
    return yScale(d[current_Y]);
})
.attr("r", dotRadius)
.attr("class", function(d) {
    return "stateCircle " + d.abbr;
})
// Hover rules
.on("mouseover", function(d) {
    // Show the tool_tip
    tool_tip.show(d, this);
    // Highlight the state circle's border
    d3.select(this).style("stroke", "#323232");
  })
  .on("mouseout", function(d) {
    // Remove the tool_tip
    tool_tip.hide(d);
    // Remove highlight
    d3.select(this).style("stroke", "#e3e3e3");
  });

  // With the circles on our graph, we need matching labels.
  // Let's grab the state abbreviations from our data
  // and place them in the center of our dots.
  dots
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[current_X]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[current_Y]) + dotRadius / 2.5;
    })
    .attr("font-size", dotRadius)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tool_tip
      tool_tip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tool_tip
      tool_tip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });
// Part 4: Make the Graph Dynamic
  // ==========================
  // This section will allow the user to click on any label
  // and display the data it references.

  // Select all axis text and add this d3 click event.
  d3.selectAll(".aText").on("click", function() {
    // Make sure we save a selection of the clicked text,
    // so we can reference it without typing out the invoker each time.
    var self = d3.select(this);

    // We only want to run this on inactive labels.
    // It's a waste of the processor to execute the function
    // if the data is already displayed on the graph.
    if (self.classed("inactive")) {
      // Grab the name and axis saved in label.
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      // When x is the saved axis, execute this:
      if (axis === "x") {
        // Make current_X the same as the data name.
        current_X = name;

        // Change the min and max of the x-axis
        xMinMax();

        // Update the domain of x.
        xScale.domain([xMin, xMax]);

        // Now use a transition when we update the xAxis.
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[current_X]);
            })
            .duration(300);
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[current_X]);
            })
            .duration(300);
        });

        // Finally, change the classes of the last active label and the clicked label.
        change_label(axis, self);
      }
      else {
        // When y is the saved axis, execute this:
        // Make current_Y the same as the data name.
        current_Y = name;

        // Change the min and max of the y-axis.
        yMinMax();

        // Update the domain of y.
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[current_Y]);
            })
            .duration(300);
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[current_Y]) + dotRadius / 3;
            })
            .duration(300);
        });

        // Finally, change the classes of the last active label and the clicked label.
        change_label(axis, self);
      }
    }
  });

  // Part 5: Mobile Responsive
  // =========================
  // With d3, we can call a resize function whenever the window dimensions change.
  // This make's it possible to add true mobile-responsiveness to our charts.
  d3.select(window).on("resize", resize);

  // One caveat: we need to specify what specific parts of the chart need size and position changes.
  function resize() {
    // Redefine the width, height and left_text_Y (the three variables dependent on the width of the window).
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    left_text_Y = (height + label_area) / 2 - label_area;

    // Apply the width and height to the svg canvas.
    svg.attr("width", width).attr("height", height);

    // Change the xScale and yScale ranges
    xScale.range([margin + label_area, width - margin]);
    yScale.range([height - margin - label_area, margin]);

    // With the scales changes, update the axes (and the height of the x-axis)
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - label_area) + ")");

    svg.select(".yAxis").call(yAxis);

    // Update the ticks on each axis.
    tickCount();

    // Update the labels.
    text_refresh_x();
    y_textRefresh();

    // Update the radius of each dot.
    crGet();

    // With the axis changed, let's update the location and radius of the state circles.
    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[current_Y]);
      })
      .attr("cx", function(d) {
        return xScale(d[current_X]);
      })
      .attr("r", function() {
        return dotRadius;
      });

    // We need change the location and size of the state texts, too.
    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[current_Y]) + dotRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[current_X]);
      })
      .attr("r", dotRadius / 3);
  }
}
