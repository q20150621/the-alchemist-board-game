function generatePath(){
    let AndalusiaContainer = document.getElementById('Andalusia')
    let lineContainer= document.getElementById('AndalusiaLineContainer')
    const totalOffest = [200,200]
    const axises = [ //x,y,line to [x,y] or function ({})
        [70,0,[70,80]],
        [70,80],
        [100,170],
        [150,110],
        [250,90],
        [360,90],
        [420,30],
        [380,-20],
        [300,-40],
        [180,-35],
    ]
    axises.forEach(axisFunc=>{
        let newPathNode = document.createElement('div')
        let newLine = document.createElement('line')
        newPathNode.setAttribute('class','path');

        if(typeof axisFunc == "function"){
            switch(axisFunc({node:newPathNode,line:newLine})){
                case "noline":
                    newLine = null;
                    break;
            }
        }else{
            const axis = axisFunc;
            newPathNode.style.left = `${axis[0]+totalOffest[0]}px`
            newPathNode.style.top = `${axis[1]+totalOffest[1]}px`
            if(axis.length==3){ // has line axis
                newLine.setAttribute('x1',`${axis[0]+totalOffest[0]}`)
                newLine.setAttribute('y1',`${axis[1]+totalOffest[1]}`)
                newLine.setAttribute('x2',`${axis[2][0]+totalOffest[0]}`)
                newLine.setAttribute('y2',`${axis[2][1]+totalOffest[1]}`)
            }else{
                newLine = null
            }
        }
        if(newLine !== null){
            lineContainer.appendChild(newLine);
        }
        AndalusiaContainer.appendChild(newPathNode)
    })
}
try{
    generatePath()
}catch(err){
    alert(err.message)
}
