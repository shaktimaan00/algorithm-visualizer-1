var data, svg, bandScale, text;
data = [];
var time = 700;
for (var i = 0; i < 15; i++) {
  data.push(Math.floor(Math.random() * 100) + 1);
}
var h = 100,
  w = 800;
var heightScale = d3
  .scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, h]);

createChart();

function createChart() {
  svg = d3.select("#chart").append("svg");

  //var bandWidth = w / data.length - 1;

  bandScale = d3.scaleBand().domain(data).range([0, w]).padding(0.1);

  svg.attr("width", w).attr("height", h);

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return bandScale(d);
    })
    .attr("y", function (d) {
      return h - heightScale(d);
    })
    .attr("width", function () {
      return bandScale.bandwidth();
    })
    .attr("height", function (d) {
      return heightScale(d);
    })
    .style("fill", "rgb(173, 216, 230)");

  svg
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return bandScale(d) + 5;
    })
    .attr("y", function (d) {
      var val = h - heightScale(d);
      if (val > 20) {
        return val;
      } else {
        return 50;
      }
    })
    .style("width", bandScale.bandwidth)
    .style("fill", "black")
    .style("font-size", w / data.length / 3)
    .style("font-family", "sans-serif")
    .style("z-index", 1);
}

document.getElementById("random-data").addEventListener("click", function () {
  data = [];
  for (var i = 0; i < 15; i++) {
    data.push(Math.floor(Math.random() * 100) + 1);
  }
  svg.remove();
  createChart();
});
function selectionSort() {
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  async function sort() {
    // We need to wrap the loop into an async function for this to work
    var traverseColor = "#ffcaa1";
    var smallestColor = "#ab87ff";
    var unsortedColor = "#add8e6";
    for (var i = 0; i < data.length; i++) {
      smallest = data[i];
      pos = i;
      forColorAnimation(smallest, smallestColor);
      await timer(time);
      for (var j = i + 1; j < data.length; j++) {
        forColorAnimation(data[j], traverseColor);
        if (smallest > data[j]) {
          await timer(time);
          forColorAnimation(smallest, unsortedColor);
          smallest = data[j];
          pos = j;
        }

        forColorAnimation(smallest, smallestColor);
        await timer(time);
        forColorAnimation(data[j], unsortedColor);
      }
      if (data[i] != smallest) {
        temp = data[i];
        data[i] = smallest;
        data[pos] = temp;

        var swooshAudio = new Audio(
          "/algorithm-visualizer/sound-effects/swoosh.mp3"
        );
        swooshAudio.play();
      }
      forColorAnimation(smallest, "#56b4d3");
      sortAnimate(data);
      await timer(time); // then the created Promise can be awaited
    }
    svg.selectAll("rect").style("fill", "green");
    var completeAudio = new Audio(
      "/algorithm-visualizer/sound-effects/complete.mp3"
    );
    completeAudio.play();
  }
  sort();
}

document
  .getElementById("selection-sort")
  .addEventListener("click", selectionSort);

function sortAnimate(data) {
  var dOrder = data.map(function (d) {
    return d;
  });
  bandScale.domain(dOrder);
  svg
    .transition()
    .duration(750)
    .selectAll("rect")
    .attr("x", function (d) {
      return bandScale(d);
    });
  svg
    .transition()
    .duration(750)
    .selectAll("text")
    .attr("x", function (d) {
      return bandScale(d) + 5;
    });
}

function forColorAnimation(d, color) {
  var smi = heightScale(d);
  svg.selectAll("rect").each(function (d, i) {
    if (smi == d3.select(this).attr("height")) {
      d3.select(this).style("fill", color);
    }
  });
}
