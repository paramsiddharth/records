const data = {
  nodes: [
    {
      id: "Param",
      group: 1,
	  link: 'https://www.paramsid.com',
    },
    {
      id: "Henry",
      group: 4,
	  link: 'https://instagram.com/kabirishenry',
    },
    {
      id: "AT",
      group: 2,
	  link: 'https://www.linkedin.com/in/ashikha-tripathi-863461197/',
    },
    {
      id: "Medha",
      group: 3,
	  link: 'https://www.linkedin.com/in/medha-tripathi23/',
    },
    {
      id: "Divyanshi",
      group: 4,
	  link: 'https://www.linkedin.com/in/divyanshi-verma-psy050824/',
    },
    {
      id: "Trisha",
      group: 4,
	  link: 'https://www.instagram.com/tri.x.sha',
    },
  ],
  links: [
    {
      source: "Param",
      target: "AT",
      value: 20,
    },
    {
      source: "Param",
      target: "Henry",
      value: 20,
    },
    {
      source: "Param",
      target: "Trisha",
      value: 20,
    },
    {
      source: "Param",
      target: "Divyanshi",
      value: 20,
    },
    {
      source: "Param",
      target: "Medha",
      value: 20,
    },
  ],
};

// Specify the dimensions of the chart.
const width = 928;
const height = 200;

const mousePosition = {
	x: 0,
	y: 0,
};

/**
 * @type {HTMLAudioElement}
 */
const musicTag = document.querySelector('#music');
const maxVol = 0.5;
const songs = [
  'Never_Going_To',
  'Mashooqa',
  'Dil_Tut_Gaya_Na',
  'Neutrino',
  'Something_I_Do',
  'Na_Kono_Sikayat',
  'Delhi_Se',
  'Early_Morning_Confusion',
  'Good_Friend_Bad_Friend',
  'Gatifull',
  'Pak_Raza',
  'Pyar_Zehreela',
  'Naainsaafi',
];

window.addEventListener('load', () => {
  // Select random song
  const song = songs[Math.floor(Math.random() * songs.length)]
  
  musicTag.src = `https://www.paramsid.com/files/${song}.mp3`;
  const e = () => {
    musicTag.play().then(() => {
      let currentTime = 0;
      try {
        currentTime = Math.random() * (musicTag.duration * 3 / 4);
        if (isNaN(currentTime)) {
          currentTime = 0;
        }
      } catch {}
      musicTag.currentTime = currentTime;
      musicTag.volume = 0;
      const fade = setInterval(() => {
        musicTag.volume = Math.min(maxVol, musicTag.volume + 0.01);
        if (musicTag.volume === maxVol) {
          clearInterval(fade);
        }
      }, 150);
      document.removeEventListener('mousemove', e);
    }).catch(() => {});
  };
  document.addEventListener('mousemove', e);
});

document.addEventListener('mousemove', (event) => {
	mousePosition.x = event.pageX;
	mousePosition.y = event.pageY;
});

// Specify the color scale.
const color = d3.scaleOrdinal(d3.schemeCategory10);

// The force simulation mutates links and nodes, so create a copy
// so that re-evaluating this cell produces the same result.
const links = data.links.map((d) => ({ ...d }));
const nodes = data.nodes.map((d) => ({ ...d }));

// Create a simulation with several forces.
const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3.forceLink(links).id((d) => d.id)
  )
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2))
  .on("tick", ticked);

const tip = d3
  .select("#cont")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Create the SVG container.
const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto;");

// Add a line for each link, and a circle for each node.
const link = svg
  .append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll()
  .data(links)
  .join("line")
  .attr("stroke-width", (d) => Math.sqrt(d.value));

const node = svg
  .append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll()
  .data(nodes)
  .join("circle")
  .attr("r", 10)
  .attr("fill", (d) => color(d.group))
  .on("mouseover", function (_, d) {
    tip.transition().duration(200).style("opacity", 0.9);
    tip
      .html("<p> " + d.id + "</p>")
      .style("left", mousePosition.x + 30 + "px")
      .style("top", mousePosition.y - 28 + "px");
	  document.querySelector('#ext').style.opacity = 1;
	  document.querySelector('#lnk').setAttribute('href', d.link);
	  document.querySelector('#lnk').textContent = d.id;
  })
  .on("click", function (_, d) {
    window.open(d.link, "_blank");
  })
  .on("mouseout", function (d) {
    tip.transition().duration(500).style("opacity", 0);
  });

node.append("title").text((d) => d.id);

// Add a drag behavior.
node.call(
  d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
);

// Set the position attributes of links and nodes each time the simulation ticks.
function ticked() {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
}

// Reheat the simulation when drag starts, and fix the subject position.
function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

// Update the subject (dragged node) position during drag.
function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

// Restore the target alpha so the simulation cools after dragging ends.
// Unfix the subject position now that it’s no longer being dragged.
function dragended(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

// When this cell is re-run, stop the previous simulation. (This doesn’t
// really matter since the target alpha is zero and the simulation will
// stop naturally, but it’s a good practice.)
// invalidation.then(() => simulation.stop());

document.querySelector("#cont").appendChild(svg.node());
