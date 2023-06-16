let canvas = d3.select('#canvas')


 
let drawTreeMap = (data) => {
    canvas.selectAll('*').remove();
    let hierarchy = d3.hierarchy(data, (node)=>{
        return node['children'];
    }).sum((node) =>{
        return node['value'];
    }).sort((node1,node2) =>{
        return node2['value'] - node1['value'];
    })

    let createTreeMap = d3.treemap()
                            .size([1000, 600])

    createTreeMap(hierarchy)

    
    let nodes = hierarchy.descendants();
    let leaves = hierarchy.leaves();

    
    let threatLeaves = hierarchy;
    console.log(leaves, nodes);

    let speciesBlocks = canvas.selectAll('g.speciesBlocks')
            .data(leaves) // Leaves [Species]
            .enter()
            .append('g')
            .attr('class', "speciesBlocks")
            .attr('transform', (tree) => {
                return 'translate(' + tree['x0'] + ', ' + tree['y0'] + ')'
            })
            /*.on('click', function(event, d) { 
                zoom(d);
            })*/

        speciesBlocks
            .append('rect')
            //Color 7
            .style("stroke", "black")
            .attr('fill', (tree) => {
                let category = tree['data']['name'].split('.')[0]
                if(category === '1'){
                    return '#ff6b6b'
                }else if(category === '2'){
                    return '#f06595'
                }else if(category === '3'){
                    return '#cc5de8'
                }else if(category === '4'){
                    return '#845ef7'
                }else if(category === '5'){
                    return '#5c7cfa'
                }else if(category === '6'){
                    return '#339af0'
                }else if(category === '7'){
                    return '#22b8cf'
                }else if(category === '8'){
                    return '#20c997'
                }else if(category === '9'){
                    return '#51cf66'
                }else if(category === '10'){
                    return '#94d82d'
                }else if(category === '11'){
                    return '#fcc419'
                }else if(category === '12'){
                    return '#ff922b'
                }
            }).attr('data-name', (tree) => {
                return tree['data']['name']
            }).attr('data-category',(tree) => {
                return tree['data']['name'].split('.')[0]
            }).attr('data-spLen', (tree) => {
                return tree['data']['num']
            }).attr('width', (tree) => {
                return tree['x1'] - tree['x0']
            }).attr('height', (tree) => {
                return tree['y1'] - tree['y0']
            })
            /*.on('mouseover', function (event, d) {
                tooltip.style('opacity', 1);
                tooltip.html("<strong>" + d.data.category + "</strong><br>" +
                "Number of species affected: " + d.data.value + "<br>" +
                "Number of threats: " + d.data.numT + "<br>" +
                "Species affected:" + d.data.species) //Add more information here
                  .style('left', (event.pageX + 10) + 'px')
                  .style('top', (event.pageY + 10) + 'px');
              })
              .on('mouseout', function () {
                tooltip.style('opacity', 0);
              })*/
              /*.on('click', function(event, d) {
                console.log(event, d);
                zoom(d);
              });*/

    let blocks = canvas.selectAll('g.blocks')
            .data(hierarchy.children) // First children [Genus]
            .enter()
            .append('g')
            .attr('class', "blocks")
            .attr('transform', (tree) => {
                return 'translate(' + tree['x0'] + ', ' + tree['y0'] + ')'
            })
            /*.on('click', function(event, d) { 
                zoom(d);
            })*/

        blocks
            .append('rect')
            //Color 7
            .style("stroke", "black")
            .attr('fill', "transparent")
            .attr('data-name', (tree) => {
                return tree['data']['name']
            }).attr('data-category',(tree) => {
                return tree['data']['name'].split('.')[0]
            }).attr('data-spLen', (tree) => {
                return tree['data']['num']
            }).attr('width', (tree) => {
                return tree['x1'] - tree['x0']
            }).attr('height', (tree) => {
                return tree['y1'] - tree['y0']
            })
     .on('mouseover', function (event, d) {
                tooltip.style('opacity', 1);
                tooltip.html("<strong>" +d.data.name +' '+ d.data.category + "</strong><br>" +
                "Number of species affected: " + (d.data.value !== undefined ? d.data.value : d.data.numS) + "<br>" +
                "Number of threats: " + d.data.numT + "<br>" +
                "Species affected:" + d.data.species) //Add more information here
                  .style('left', (event.pageX + 10) + 'px')
                  .style('top', (event.pageY + 10) + 'px');
              })
              .on('mouseout', function () {
                tooltip.style('opacity', 0);       
              })
              .on('click', function(event, d) {
                zoom(d);
                tooltip.style('opacity', 0)
              });

    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip');

    blocks.append('text')
            .text((tree) => {
                return tree['data']['name'];
            })
            .attr('x', 5)
            .attr('y', 20)
    blocks.append('text')
        .text((tree) => {
            return  tree['data']['category']
        })
        .attr('x', 5)
        .attr('y', 40)
    ;
};


////////////////////////////////////////////////////////////////////// LOAD DATA //////////////////////////////////////////////////////////

var data = null;

$.ajax({
    url: "data/Threat_nest_List.json",
    contentType:"application/json; charset=utf-8",
    dataType: 'json',
    async: false,

    success: function(response){
        dataThreatTotal = response
    }
});

$.ajax({
    url: "data/Threat_Title_ALL_IUCN.json",
    contentType:"application/json; charset=utf-8",
    dataType: 'json',
    async: false,

    success: function(response){
        dataThreatType = response
    }
});



function createTreeData(data, type, word){
    let TH = {}
    let t = type
    let numTot = 0
    let numSpe = 0
    let value = 0
    let speciesList = []

    for (let key in data){
        //console.log(key)
        if (key.includes(word)) {
            numSpe +=1
            let list = data[key];
            //console.log(key)
            //console.log(list)
            list.forEach(function(element) {
                numTot +=1
                if (!(speciesList.includes(key))){
                    speciesList.push(key)
                    value +=1
                }
                //console.log(element)
                let name = element.split('.')[0];
                if (element.split('.').length === 3){
                        typeCat = type[element.split('.')[0]+'.'+element.split('.')[1]] + ' - '+ type[element];
                    }else {
                        typeCat = type[element]
                    }
                let entry = {'name': element, 'numT': 1,'category':typeCat, 'species':[key],'value':1};
                if (name in TH){
                    TH[name]['numT'] +=1
                    if (!(TH[name]['species'].includes(key))){
                        TH[name]['species'].push(key)
                        TH[name]['numS'] +=1
                        //console.log(key)
                    //console.log(name)
                    let children = TH[name]['children'];
                      let existingEntryIndex = children.findIndex(function(child) {
                        return child['name'] === element;
                      });
                      if (existingEntryIndex !== -1) {
                        children[existingEntryIndex]['numT'] += 1;
                        if (!children[existingEntryIndex]['species'].includes(key)) {
                            children[existingEntryIndex]['species'].push(key);
                            children[existingEntryIndex]['value'] += 1
                        }
                      } else {
                        children.push(entry);
                      }
                    }
                    
                }else{
                    let BigCat = typeCat = type[name]
                    TH[name] = {'name': name, 'numT':1, 'category':BigCat, 'numS':1, 'species':[key],'children':[entry]}
                }
                
            })
        }
            
    }
    //console.log( numTot, numSpe, value, speciesList)
    let threatDict = {'name':'All', 'children': Object.values(TH)}
        return threatDict
};
function createTreeDataNumbers1(data, type, word){
    let TH = {}
    let t = type
    let numTot = 0
    let numSpe = 0
    let value = 0
    let speciesList = []

    for (let key in data){
        //console.log(key)
        if (key.includes(word)) {
            numSpe +=1
            let list = data[key];
            //console.log(key)
            //console.log(list)
            list.forEach(function(element) {
                numTot +=1
                if (!(speciesList.includes(key))){
                    speciesList.push(key)
                    value +=1
                }
                //console.log(element)
                let name = element.split('.')[0];
                if (element.split('.').length === 3){
                        typeCat = type[element.split('.')[0]+'.'+element.split('.')[1]] + ' - '+ type[element];
                    }else {
                        typeCat = type[element]
                    }
                let entry = {'name': element, 'numT': 1,'category':typeCat, 'species':[key],'value':1};
                if (name in TH){
                    TH[name]['numT'] +=1
                    if (!(TH[name]['species'].includes(key))){
                        TH[name]['species'].push(key)
                        TH[name]['value'] +=1
                        //console.log(key)
                    //console.log(name)
                    let children = TH[name]['children'];
                      let existingEntryIndex = children.findIndex(function(child) {
                        return child['name'] === element;
                      });
                      if (existingEntryIndex !== -1) {
                        children[existingEntryIndex]['numT'] += 1;
                        if (!children[existingEntryIndex]['species'].includes(key)) {
                            children[existingEntryIndex]['species'].push(key);
                            children[existingEntryIndex]['value'] += 1
                        }
                      } else {
                        children.push(entry);
                      }
                    }
                    
                }else{
                    let BigCat = typeCat = type[name]
                    TH[name] = {'name': name, 'category':BigCat, 'species':[key],'children':[entry]}
                }
                
            })
        }
            
    }
    //console.log( numTot, numSpe, value, speciesList)
    let threatDict = {'name':'All', 'children': Object.values(TH)}
        return numSpe
};

function createTreeDataNumbers2(data, type, word){
    let TH = {}
    let t = type
    let numTot = 0
    let numSpe = 0
    let value = 0
    let speciesList = []

    for (let key in data){
        //console.log(key)
        if (key.includes(word)) {
            numSpe +=1
            let list = data[key];
            //console.log(key)
            //console.log(list)
            list.forEach(function(element) {
                numTot +=1
                if (!(speciesList.includes(key))){
                    speciesList.push(key)
                    value +=1
                }
                //console.log(element)
                let name = element.split('.')[0];
                if (element.split('.').length === 3){
                        typeCat = type[element.split('.')[0]+'.'+element.split('.')[1]] + ' - '+ type[element];
                    }else {
                        typeCat = type[element]
                    }
                let entry = {'name': element, 'numT': 1,'category':typeCat, 'species':[key],'value':1};
                if (name in TH){
                    TH[name]['numT'] +=1
                    if (!(TH[name]['species'].includes(key))){
                        TH[name]['species'].push(key)
                        TH[name]['value'] +=1
                        //console.log(key)
                    //console.log(name)
                    let children = TH[name]['children'];
                      let existingEntryIndex = children.findIndex(function(child) {
                        return child['name'] === element;
                      });
                      if (existingEntryIndex !== -1) {
                        children[existingEntryIndex]['numT'] += 1;
                        if (!children[existingEntryIndex]['species'].includes(key)) {
                            children[existingEntryIndex]['species'].push(key);
                            children[existingEntryIndex]['value'] += 1
                        }
                      } else {
                        children.push(entry);
                      }
                    }
                    
                }else{
                    let BigCat = typeCat = type[name]
                    TH[name] = {'name': name, 'category':BigCat, 'species':[key],'children':[entry]}
                }
                
            })
        }
            
    }
    //console.log( numTot, numSpe, value, speciesList)
    let threatDict = {'name':'All', 'children': Object.values(TH)}
        return value
};



function zoom(d) {
    if (d.depth === 0) {
      // If clicked on the root node, zoom out to the initial view
      drawTreeMap(dataTest);
    } else {
      // If clicked on a child node, zoom in to show its children
      drawTreeMap(d.data);
    }
  };

const searchBar = document.getElementById('search-bar');
  const searchButton = document.getElementById('search-button');

  let searchText = '';

  searchBar.addEventListener('input', (event) => {
    searchText = event.target.value;
  });

  searchButton.addEventListener('click', () => {
    search(searchText);
  });

  searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      search(searchText);
    }
  });

  function search(text) {
    console.log(`Searching for "${text}"...`);
    // Add your search functionality here.
    let selectedWord = text; //Add Search Word
    let TreeDict = createTreeData(dataThreatTotal,dataThreatType,selectedWord);
    let TreeNum1 = createTreeDataNumbers1(dataThreatTotal,dataThreatType,selectedWord);
    let TreeNum2 = createTreeDataNumbers2(dataThreatTotal,dataThreatType,selectedWord);

    console.log(TreeDict);
    /*console.log(TreeNum1);
    console.log(TreeNum2);
    console.log((TreeNum2/TreeNum1*100).toFixed(2))
    console.log('Here "${TreeNum2}" of "{TreeNum1}" species are threatened.')*/
    let message = `${(TreeNum2/TreeNum1*100).toFixed(2)}% (${TreeNum2} of ${TreeNum1} species) are threatened. This is how the threats are distributed`
    var treeDataDiv = document.getElementById('treeData')
    treeDataDiv.textContent = message;
    drawTreeMap(TreeDict);
  };


