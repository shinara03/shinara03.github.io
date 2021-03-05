const svgWidth = 280
    const svgHeight = 540
    const rectWidth = 70
    const rectHeight = 90
    const infoSvgWidth = 800
    const infoSvgHeight = 500
    const infoRectWidth = 80
    // const svgWidth = 600
    // const svgHeight = 240
    // const rectWidth = 100
    // const rectHeight = 60


      
    function calculateGridPos(i) {
      const perRow = Math.floor(svgWidth / rectWidth)
      return [(i % perRow) * rectWidth, (Math.floor(i / perRow)) * rectHeight]
    }

    function scaledData(data) {
      const sizeScale = d3.scaleLinear()
        .domain([0, 50])
        .range([0, infoSvgHeight])

      return _.map(data, (d, i) => {
        return {
          index: d.index,
          name: d.name, 
          image: d.image,
          calories: d.calories, 
          scaledFat: sizeScale(d.totalFat),
          scaledChol: sizeScale(d.cholesterol), 
          scaledSodium: sizeScale(d.sodium),
          scaledCarb: sizeScale(d.totalCarbohydrate),
          scaledProtein: sizeScale(d.protein),
          scaledVitamin: sizeScale(d.vitaminD), 
          scaledCalcium: sizeScale(d.calcium), 
          scaledIron: sizeScale(d.iron), 
          scaledPotassium: sizeScale(d.potassium)
        }
      })}

    d3.json("chocolates.json").then((chocolates) => {

      const scaledChocolates = scaledData(chocolates)
      
      let yScale = d3
        .scaleLinear()
        .domain([50, 0])
        .range([0, infoSvgHeight])

      let yAxis = d3.axisLeft()
                    .scale(yScale)
                    .tickFormat(d => d + "%")

      let xScale = d3
        .scalePoint()
        .range([0, 720])
        .domain(['Fat', 'Cholesterol', 'Sodium', 'Carbohydrate',
          'Protein', 'Vitamin D', 'Calcium', 'Iron', 'Potassium',''])
    
      let xAxis = d3.axisBottom()
        .scale(xScale)

      const svg = d3
        .select("#first-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        // .attr('transform', 'translate(100,0)')

      d3.select("svg")
        .selectAll('rect')
        .data(scaledChocolates).enter().append('rect')
        .attr('transform', (d, i) => `translate(${calculateGridPos(i)})`)
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .attr('fill', '#5e3101')
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        // .attr('class', 'chocolate-box' )
        .on('mouseover', function() {
          d3.select(this)
            .style('fill', '#7B3F00')
        })
        .on('mouseout', function() {
          d3.select(this)
            .style('fill', '#5e3101')
        })
        .on('click', function(d) {
          // d3.select('#info')
          //   .text(d.name)
          //   .append('img')
          //   .attr('width', '200px')
          //   .attr('height', '200px')
          //   .attr('src', d.image)
          // d3.select('#info')
          //   .append('svg')
          //   .attr("width", '100px')
          //   .attr("height", '100px')
          //   .attr('fill', 'black')
          for(let i = 1; i <= scaledChocolates.length; i++) {
            if(i !== d.index) {
              document.getElementById(`chocolate-${i}`).className = "hidden"
            }
          }
          document.getElementById(`chocolate-${d.index}`).className = "open"
          d3.select(`#chocolate-${ d.index }`)
            .select('svg')
            .remove('svg')
          d3.select(`#chocolate-${d.index}`)
            .append('svg')
            .attr('class', 'chocolate-box')
            .attr('overflow', 'visible')
            .attr('width', infoSvgWidth)
            .attr('height', infoSvgHeight)
            .selectAll('rect')
            .data(Object.values(scaledChocolates[d.index-1]).slice(4))
            .enter()
            .append('rect')
            .attr('width', infoRectWidth)
            .attr('x', (d, i) => i * infoRectWidth)
            .attr('height', d => d)
            .attr('y', d => infoSvgHeight - d)
            .attr('fill', 'plum')
            .attr('stroke', 'black')
            .transition()
          d3.select(`#chocolate-${d.index}`)
            .select('svg')
            .append("g")
            .attr("transform", "translate(0,0)")
            .call(yAxis)
            .style("font-size", "20px")
          d3.select(`#chocolate-${d.index}`)
            .select('svg')
            .append("g")
            .attr('class', 'x-axis')
            .attr("transform", `translate(0, ${infoSvgHeight})`)
            .call(xAxis)
            .style("font-size", "13px")
          d3.select(`#chocolate-${d.index}`)
            .select('svg')
            .select('.x-axis')
            .selectAll('text')
            .attr('transform', 'translate(40, 0)')

            
        })
    
      // const chocolateInfoDiv = d3.select('#info')
      //   .selectAll('div')
      //   .data(chocolates)
      //   .enter()
      //   .append('div')
      //   .attr('id', function(d, i) {
      //     return `chocolate-info-${i}` 
      //   })

      // for(let i = 0; i < chocolates.length; i++) {
      //   d3.select(`#chocolate-info-${i}`)
      //   .selectAll('div')
      //   .data([chocolates[i].name, chocolates[i].type])
      //   .enter()
      //   .append('div')
      //   .text(d => d)
      // }
    })  