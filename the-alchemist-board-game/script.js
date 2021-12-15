var debugging = false;
var gameStarted = false;
var rollable = false;
var currentMap = 0;
var currentSpot = 0;
var totalTurn = 0;
var temperaryDice = false;
var rollResult;
var gold = 0;
var knowledge = 0;
var currentDiceNum = 0;
var currentDiceSide = 0;
function exclamationIcon() {
    var exclamation = document.createElement('img');
    exclamation.setAttribute('src', 'yellow-exclamation-point.png');
    exclamation.style.height = "30px";
    exclamation.style.marginLeft = "15px";
    exclamation.style.marginTop = "-15px";
    return exclamation;
}
function lockIcon() {
    var lockImage = document.createElement('img');
    lockImage.setAttribute('src', 'redlocklocked.png');
    lockImage.style.width = "18px";
    lockImage.style.marginLeft = "10px";
    return lockImage;
}
function questionIcon() {
    var question = document.createElement('img');
    question.setAttribute('src', 'question-mark.png');
    question.style.width = "18px";
    question.style.marginLeft = "10px";
    question.style.marginTop = "-10px";
    return question;
}
function Hoverbox(text, styler) {
    if (styler === void 0) { styler = function (box) {
        box.style.backgroundColor = "white";
        box.style.borderRadius = "10px";
        box.style.border = "2px solid black";
        box.style.borderRadius = "10px";
        box.style.width = "200px";
        box.style.marginLeft = "40px";
        box.style.marginTop = "10px";
        box.style.borderTopLeftRadius = "0";
        box.style.zIndex = "2";
    }; }
    var resultBox = document.createElement('div');
    resultBox.setAttribute('class', 'hoverbox');
    resultBox.innerText = text;
    styler(resultBox);
    return resultBox;
}
function applyHoverbox(_a) {
    var displayTarget = _a.displayTarget, displayText = _a.displayText, hoverTarget = _a.hoverTarget, styler = _a.styler;
    var hoverBox = Hoverbox(displayText, styler);
    hoverTarget.addEventListener('mouseover', function (ev) {
        displayTarget.appendChild(hoverBox);
    });
    hoverTarget.addEventListener('mouseleave', function (ev) {
        var boxes = displayTarget.getElementsByClassName('hoverbox');
        for (var i = 0; i < boxes.length; i++) {
            displayTarget.removeChild(boxes[i]);
        }
    });
}
function clearBoard() {
    var board = document.getElementById('BoardContainer');
    board.innerHTML = "";
    var lineContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    lineContainer.setAttribute('id', 'LineContainer');
    board.appendChild(lineContainer);
}
function generatePath(_a) {
    var axises = _a.axises, _b = _a.totalOffset, totalOffset = _b === void 0 ? [0, 0] : _b, lineContainer = _a.lineContainer, boardContainer = _a.boardContainer;
    axises.forEach(function (axisFunc) {
        var newPathNode = document.createElement('div');
        var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newPathNode.setAttribute('class', 'path');
        var axis;
        var isOverride = false;
        if (typeof axisFunc == "function") {
            var result = axisFunc({ pathNode: newPathNode, line: newLine });
            switch (typeof result) {
                case "string":
                    if (result == "override") {
                        isOverride = true;
                    }
                    break;
                case "object":
                    if (Array.isArray(result))
                        axis = result;
                    break;
            }
        }
        else {
            axis = axisFunc;
        }
        if (!isOverride) {
            newPathNode.style.left = axis[0] + totalOffset[0] + "px";
            newPathNode.style.top = axis[1] + totalOffset[1] + "px";
            if (axis.length == 3) { // has line axis
                newLine.setAttribute('x1', "" + (axis[0] + totalOffset[0] + 20));
                newLine.setAttribute('y1', "" + (axis[1] + totalOffset[1] + 10));
                newLine.setAttribute('x2', "" + (axis[2][0] + totalOffset[0] + 20));
                newLine.setAttribute('y2', "" + (axis[2][1] + totalOffset[1] + 10));
            }
            else {
                newLine = null;
            }
        }
        if (newLine !== null) {
            lineContainer === null || lineContainer === void 0 ? void 0 : lineContainer.appendChild(newLine);
        }
        boardContainer.appendChild(newPathNode);
    });
}
function moveInStraightLine(_a) {
    var target = _a.target, from = _a.from, to = _a.to, duration = _a.duration;
    var dx = to[0] - from[0];
    var dy = to[1] - from[1];
    var _loop_1 = function (t) {
        setTimeout(function () {
            target.style.left = (from[0] + dx * t).toString();
            target.style.top = (from[1] + dy * t).toString();
        }, t * duration);
    };
    for (var t = 0; t <= 1; t += 0.01) {
        _loop_1(t);
    }
}
function generateAndalusia() {
    clearBoard();
    gold = 1;
    knowledge = 0;
    currentDiceNum = 2;
    currentDiceSide = 6;
    currentMap = MAPS.ANDALUSIA;
    currentSpot = 0;
    generateChess([270, 200]);
    var boardContainer = document.getElementById('BoardContainer');
    var lineContainer = document.getElementById('LineContainer');
    var background = document.createElement('img');
    background.src = "Andalusia.jpg";
    background.setAttribute('id', 'background');
    boardContainer.appendChild(background);
    var axises = [
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "red";
            return [270, 200, [270, 280]];
        },
        [270, 280, [350, 310]],
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var lockImage = lockIcon();
            lockImage.setAttribute('id', 'andalusialock');
            pathNode.appendChild(lockImage);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Roll 2 dice with same number to unlock",
                hoverTarget: lockImage,
            });
            return [300, 370, [350, 310]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var exclamation = exclamationIcon();
            pathNode.appendChild(exclamation);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Gain 3 gold",
                hoverTarget: exclamation,
            });
            return [350, 310, [450, 290]];
        },
        [450, 290, [560, 290]],
        [560, 290, [620, 230]],
        [620, 230, [580, 180]],
        [580, 180, [500, 160]],
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var exclamation = exclamationIcon();
            pathNode.appendChild(exclamation);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Gain 1 knowledge",
                hoverTarget: exclamation,
            });
            return [500, 160, [380, 165]];
        },
        [380, 165, [270, 200]],
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var exclamation = exclamationIcon();
            pathNode.appendChild(exclamation);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Loss random % + 50% of gold",
                hoverTarget: exclamation,
            });
            pathNode.style.backgroundColor = "lime";
            return [305, 470, [300, 370]];
        }
    ];
    generatePath({
        axises: axises,
        lineContainer: lineContainer,
        boardContainer: boardContainer
    });
    var lines = lineContainer.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'line');
    for (var i = 0; i < lines.length; i++) {
        lines[i].style.stroke = "rgb(65, 65, 65)";
        lines[i].style.strokeWidth = "2";
    }
}
function generateMorocco() {
    clearBoard();
    currentMap = MAPS.MOROCCO;
    currentDiceNum = 1;
    currentDiceSide = 6;
    currentSpot = 0;
    var popuptext = document.createElement('div');
    popuptext.innerText = "Now using 1 six sided dice";
    currentDiceNum = 1;
    createPopup({ content: popuptext });
    generateChess([470, 90]);
    var boardContainer = document.getElementById('BoardContainer');
    var lineContainer = document.getElementById('LineContainer');
    var background = document.createElement('img');
    background.src = "Morocco.png";
    background.setAttribute('id', 'background');
    boardContainer.appendChild(background);
    var axises = [
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "red";
            return [470, 90, [360, 140]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var exclamation = exclamationIcon();
            pathNode.appendChild(exclamation);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Gain 1 knowledge",
                hoverTarget: exclamation,
            });
            return [360, 140, [380, 220]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var exclamation = exclamationIcon();
            pathNode.appendChild(exclamation);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Gain [dice number] gold",
                hoverTarget: exclamation,
            });
            return [150, 200, [100, 300]];
        },
        [100, 300, [200, 340]],
        [200, 340, [270, 300]],
        [270, 300, [360, 360]],
        [360, 360, [470, 400]],
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var question = questionIcon();
            question.setAttribute('id', 'moroccolock');
            pathNode.appendChild(question);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Join the caravan: 10 gold",
                hoverTarget: question,
            });
            return [470, 400, [500, 320]];
        },
        [500, 320, [540, 220]],
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var exclamation = exclamationIcon();
            pathNode.appendChild(exclamation);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Gain 1 knowledge",
                hoverTarget: exclamation,
            });
            return [540, 220, [460, 200]];
        },
        [460, 200, [380, 220]],
        [380, 220, [280, 220]],
        [280, 220, [230, 150]],
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var exclamation = exclamationIcon();
            pathNode.appendChild(exclamation);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Gain [dice number] gold",
                hoverTarget: exclamation,
            });
            return [230, 150, [150, 200]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "lime";
            var lockImage = lockIcon();
            pathNode.appendChild(lockImage);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Go to desert",
                hoverTarget: lockImage,
            });
            return [480, 450, [470, 400]];
        },
    ];
    generatePath({
        axises: axises,
        lineContainer: lineContainer,
        boardContainer: boardContainer,
    });
    var lines = lineContainer.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'line');
    for (var i = 0; i < lines.length; i++) {
        lines[i].style.stroke = "orange";
        lines[i].style.strokeWidth = "2";
    }
}
function generateDesert() {
    clearBoard();
    currentDiceNum = 1;
    currentDiceSide = 3;
    currentSpot = 0;
    var popuptext = document.createElement('div');
    popuptext.innerText = "Now using 1 three sided dice";
    currentDiceNum = 1;
    createPopup({ content: popuptext });
    currentMap = MAPS.DESERT;
    generateChess([90, 100]);
    var boardContainer = document.getElementById('BoardContainer');
    var lineContainer = document.getElementById('LineContainer');
    var background = document.createElement('img');
    background.src = "desert.png";
    background.setAttribute('id', 'background');
    boardContainer.appendChild(background);
    var dynamicX = 20, xDelta = 70;
    var orangeStyler = function (box) {
        box.style.backgroundColor = "white";
        box.style.borderRadius = "10px";
        box.style.border = "2px solid black";
        box.style.borderRadius = "10px";
        box.style.width = "200px";
        box.style.marginLeft = "40px";
        box.style.marginTop = "30px";
        box.style.borderTopLeftRadius = "0";
        box.style.zIndex = "2";
    };
    var axises = [
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            dynamicX += xDelta;
            pathNode.style.backgroundColor = "red";
            return [dynamicX, 100, [dynamicX + xDelta, 100]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            dynamicX += xDelta;
            pathNode.style.backgroundColor = "orange";
            applyHoverbox({
                displayTarget: pathNode,
                hoverTarget: pathNode,
                displayText: "When dice rolls 3, go back 1",
                styler: orangeStyler,
            });
            return [dynamicX, 100, [dynamicX + xDelta, 100]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            dynamicX += xDelta;
            pathNode.style.backgroundColor = "orange";
            applyHoverbox({
                displayTarget: pathNode,
                hoverTarget: pathNode,
                displayText: "When dice rolls 3, go back 1",
                styler: orangeStyler,
            });
            return [dynamicX, 100, [dynamicX + xDelta, 100]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            dynamicX += xDelta;
            pathNode.style.backgroundColor = "orange";
            applyHoverbox({
                displayTarget: pathNode,
                hoverTarget: pathNode,
                displayText: "When dice rolls 3, go back 1",
                styler: orangeStyler,
            });
            return [dynamicX, 100, [dynamicX + xDelta, 100]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            dynamicX += xDelta;
            var exclamation = exclamationIcon();
            pathNode.appendChild(exclamation);
            applyHoverbox({
                displayTarget: pathNode,
                hoverTarget: exclamation,
                displayText: "Gain 1 knowledge",
            });
            return [dynamicX, 100, [dynamicX + xDelta, 100]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            dynamicX += xDelta;
            return [dynamicX, 100, [dynamicX + xDelta, 100]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            dynamicX += xDelta;
            pathNode.style.backgroundColor = "orange";
            applyHoverbox({
                displayTarget: pathNode,
                hoverTarget: pathNode,
                displayText: "When dice rolls 3, go back 1",
                styler: orangeStyler,
            });
            return [dynamicX, 100, [dynamicX + xDelta, 100]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            dynamicX += xDelta;
            pathNode.style.backgroundColor = "orange";
            applyHoverbox({
                displayTarget: pathNode,
                hoverTarget: pathNode,
                displayText: "When dice rolls 3, go back 1",
                styler: orangeStyler,
            });
            return [dynamicX, 100, [dynamicX + xDelta, 100]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            dynamicX += xDelta;
            pathNode.style.backgroundColor = "orange";
            applyHoverbox({
                displayTarget: pathNode,
                hoverTarget: pathNode,
                displayText: "When dice rolls 3, go back 1",
                styler: orangeStyler,
            });
            return [dynamicX, 100, [dynamicX + xDelta, 100]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "lime";
            dynamicX += xDelta;
            return [dynamicX, 100];
        },
    ];
    generatePath({
        axises: axises,
        lineContainer: lineContainer,
        boardContainer: boardContainer,
    });
    var lines = lineContainer.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'line');
    for (var i = 0; i < lines.length; i++) {
        lines[i].style.stroke = "rgb(65,65,65)";
        lines[i].style.strokeWidth = "2";
    }
}
function generateOasis() {
    clearBoard();
    var popuptext = document.createElement('div');
    popuptext.innerText = "Now using 1 three sided dice";
    currentDiceNum = 1;
    createPopup({ content: popuptext });
    currentSpot = 0;
    currentMap = MAPS.OASIS;
    generateChess([100, 300]);
    var boardContainer = document.getElementById('BoardContainer');
    var lineContainer = document.getElementById('LineContainer');
    var background = document.createElement('img');
    background.src = "oasis.png";
    background.setAttribute('id', 'background');
    boardContainer.appendChild(background);
    var axises = [
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "red";
            return [100, 300, [240, 270]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "purple";
            pathNode.style.borderColor = "rgb(196, 196, 196)";
            var exclamation = exclamationIcon();
            pathNode.appendChild(exclamation);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Change dice to 2 sided until knowledge reach 3",
                hoverTarget: exclamation,
            });
            return [240, 270, [260, 360]];
        },
        [260, 360, [320, 440]],
        [320, 440, [400, 360]],
        [400, 360, [480, 370]],
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "purple";
            pathNode.style.borderColor = "rgb(196, 196, 196)";
            var exclamation = exclamationIcon();
            pathNode.appendChild(exclamation);
            applyHoverbox({
                displayTarget: pathNode,
                displayText: "Gain 5 gold",
                hoverTarget: exclamation,
            });
            return [480, 370, [580, 270]];
        },
        [580, 270, [730, 230]],
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "lime";
            return [730, 230];
        },
    ];
    generatePath({
        axises: axises,
        lineContainer: lineContainer,
        boardContainer: boardContainer,
    });
    var lines = lineContainer.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'line');
    for (var i = 0; i < lines.length; i++) {
        lines[i].style.stroke = "lime";
        lines[i].style.strokeWidth = "2";
    }
}
function generateToPyramid() {
    clearBoard();
    currentSpot = 0;
    currentMap = MAPS.TOPYRAMID;
    generateChess([350, 400]);
    var boardContainer = document.getElementById('BoardContainer');
    var lineContainer = document.getElementById('LineContainer');
    var background = document.createElement('img');
    background.src = "toPyramid.png";
    background.setAttribute('id', 'background');
    boardContainer.appendChild(background);
    var axises = [
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "red";
            return [350, 400, [375, 340]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var excla = exclamationIcon();
            pathNode.appendChild(excla);
            applyHoverbox({
                displayText: "Gain 2 knowledge",
                displayTarget: pathNode,
                hoverTarget: excla,
            });
            return [375, 340, [385, 280]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var excla = exclamationIcon();
            pathNode.appendChild(excla);
            applyHoverbox({
                displayText: "Gain 2 knowledge",
                displayTarget: pathNode,
                hoverTarget: excla,
            });
            return [385, 280, [395, 220]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            var excla = exclamationIcon();
            pathNode.appendChild(excla);
            applyHoverbox({
                displayText: "Gain 2 knowledge",
                displayTarget: pathNode,
                hoverTarget: excla,
            });
            return [395, 220, [400, 160]];
        },
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "purple";
            var excla = exclamationIcon();
            pathNode.appendChild(excla);
            applyHoverbox({
                displayText: "If knowledge < 5 lose all gold",
                displayTarget: pathNode,
                hoverTarget: excla,
            });
            return [400, 160, [405, 100]];
        },
        [405, 100, [405, 40]],
        function (_a) {
            var pathNode = _a.pathNode, line = _a.line;
            pathNode.style.backgroundColor = "lime";
            return [405, 40];
        }
    ];
    generatePath({
        axises: axises,
        lineContainer: lineContainer,
        boardContainer: boardContainer,
    });
    var lines = lineContainer.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'line');
    for (var i = 0; i < lines.length; i++) {
        lines[i].style.stroke = "rgb(65,65,65)";
        lines[i].style.strokeWidth = "2";
    }
}
function createPopup(_a) {
    var content = _a.content, _b = _a.styler, styler = _b === void 0 ? function (popup) {
        popup.style.position = "fixed";
        popup.style.zIndex = "3";
        popup.style.backgroundColor = "white";
        popup.style.width = "200px";
        popup.style.height = "160px";
        popup.style.left = "50%";
        popup.style.top = "50%";
        popup.style.padding = "30px 20px 20px 20px";
        popup.style.border = "2px solid black";
        popup.style.transform = "translate(-50%, -50%)";
    } : _b;
    var popupWindow = document.createElement('div');
    var closeButton = document.createElement('button');
    closeButton.setAttribute('id', 'popup-closing-button');
    closeButton.innerText = "x";
    closeButton.style.float = "right";
    closeButton.style.margin = "-25px -15px 0 0";
    closeButton.style.borderRadius = "100%";
    closeButton.onclick = function () {
        document.body.removeChild(popupWindow);
    };
    popupWindow.appendChild(closeButton);
    popupWindow.appendChild(content);
    styler(popupWindow);
    document.body.appendChild(popupWindow);
    return popupWindow;
}
function generateChess(startPos) {
    var chess = document.createElement('img');
    chess.setAttribute('id', 'THECHESS');
    chess.src = "chess.png";
    chess.style.left = startPos[0].toString();
    chess.style.top = startPos[1].toString();
    chess.style.width = "40px";
    chess.style.position = "absolute";
    chess.style.marginTop = "-25px";
    chess.style.marginLeft = "2px";
    chess.style.zIndex = "2";
    document.getElementById('BoardContainer').appendChild(chess);
    return chess;
}
function rollDice(diceSide, diceNum) {
    var finalResults = [];
    var finalResult;
    var target = document.getElementById('startgame');
    for (var i = 0; i < diceNum; i++) {
        finalResults.push(Math.floor(Math.random() * diceSide) + 1);
    }
    finalResults.forEach(function (n) { finalResult += n; });
    var id = setInterval(function () {
        var result = "";
        for (var i = 0; i < diceNum; i++) {
            result += (Math.floor(Math.random() * diceSide) + 1).toString() + ' ';
        }
        target.innerText = result;
    }, 50);
    setTimeout(function () {
        clearInterval(id);
        target.innerText = finalResults.join(' ');
    }, 2000);
    return finalResults;
}
function moveChess(amount) {
    var pathes;
    switch (currentMap) {
        case MAPS.ANDALUSIA:
            pathes = pathCollection.andalusia;
            break;
        case MAPS.MOROCCO:
            pathes = pathCollection.morocco;
            break;
        case MAPS.DESERT:
            pathes = pathCollection.desert;
            break;
        case MAPS.OASIS:
            pathes = pathCollection.oasis;
            break;
        case MAPS.TOPYRAMID:
            pathes = pathCollection.topyramid;
            break;
    }
    var newSpot;
    var loop = function (i) {
        if (debugging)
            console.log("moveChess: " + pathes[currentSpot].connectedPath);
        if (pathes[currentSpot].connectedPath != null) {
            if (pathes[currentSpot].onLeave == "3back1" && rollResult.reduce(function (a, b) { return a + b; }, 0) == 3) {
                for (var j = 0; j < rollResult.length; j++) {
                    rollResult[j] = 0;
                }
                rollResult[0] = -1;
                alert("Tribal war happening nearby, go back 1");
                moveInStraightLine({
                    target: document.getElementById('THECHESS'),
                    from: pathes[currentSpot].pos,
                    to: pathes[currentSpot - 1].pos,
                    duration: 500,
                });
                currentSpot--;
                document.getElementById('startgame').innerText = "Roll";
                rollable = true;
            }
            else {
                newSpot = pathes[currentSpot].connectedPath.id;
                moveInStraightLine({
                    target: document.getElementById('THECHESS'),
                    from: pathes[currentSpot].pos,
                    to: pathes[newSpot].pos,
                    duration: 500,
                });
                currentSpot = newSpot;
                i++;
                setTimeout(function () {
                    if (i == amount) {
                        i += pathes[currentSpot] && pathes[currentSpot].stopAt();
                    }
                    else {
                        if (pathes[currentSpot] && pathes[currentSpot].moveOver() == "stop") {
                            pathes[currentSpot].stopAt();
                            i = amount;
                        }
                    }
                }, 500);
                if (i < amount) {
                    setTimeout(loop, 600, i);
                }
                else {
                    if (temperaryDice && knowledge > 2) {
                        temperaryDice = false;
                        alert("Dice side back to 3");
                        currentDiceSide = 3;
                    }
                    document.getElementById('startgame').innerText = "Roll";
                    rollable = true;
                }
            }
        }
        else {
            pathes[currentSpot].stopAt();
            document.getElementById('startgame').innerText = "Roll";
            rollable = true;
        }
    };
    loop(0);
}
var ChessPath = /** @class */ (function () {
    function ChessPath(_a) {
        var x = _a.x, y = _a.y, id = _a.id, _b = _a.moveOver, moveOver = _b === void 0 ? function () { } : _b, _c = _a.stopAt, stopAt = _c === void 0 ? function () { } : _c, connectedPath = _a.connectedPath, extraArg = _a.extraArg;
        this.x = x;
        this.y = y;
        this.id = id;
        this.moveOver = moveOver;
        this.stopAt = stopAt;
        this.connectedPath = connectedPath;
        this.extraArg = extraArg;
    }
    Object.defineProperty(ChessPath.prototype, "pos", {
        get: function () {
            return [this.x, this.y];
        },
        enumerable: false,
        configurable: true
    });
    return ChessPath;
}());
var PathCollection = /** @class */ (function () {
    function PathCollection() {
        this.andalusia = this._prepareAndalusia();
        this.morocco = this._prepareMorocco();
        this.desert = this._prepareDesert();
        this.oasis = this._prepareOasis();
        this.topyramid = this._prepareToPyramid();
    }
    PathCollection.prototype._prepareToPyramid = function () {
        var pyramid = [
            new ChessPath({ x: 350, y: 400, id: 0 }),
            new ChessPath({ x: 375, y: 340, id: 1, stopAt: function () {
                    knowledge += 2;
                    alert("Learned things from the Alchemist");
                    alert("Gain 2 knowledge");
                } }),
            new ChessPath({ x: 385, y: 280, id: 2, stopAt: function () {
                    knowledge += 2;
                    alert("Learned things from the Alchemist");
                    alert("Gain 2 knowledge");
                } }),
            new ChessPath({ x: 395, y: 220, id: 3, stopAt: function () {
                    knowledge += 2;
                    alert("Learned things from the heart");
                    alert("Gain 2 knowledge");
                } }),
            new ChessPath({ x: 400, y: 160, id: 4, moveOver: function () {
                    return "stop";
                }, stopAt: function () {
                    alert('People in military camp arrested you');
                    if (knowledge < 5) {
                        alert('They took all the gold');
                        alert("Loss " + gold + " gold");
                        gold = 0;
                    }
                    else {
                        alert('You turn yourself to wind and escaped');
                    }
                } }),
            new ChessPath({ x: 405, y: 100, id: 5 }),
            new ChessPath({ x: 405, y: 40, id: 6, stopAt: function () {
                    var finaltext = document.createElement('div');
                    var title = document.createElement('div');
                    title.innerText = "You reach the Pyramid";
                    title.style.textAlign = "center";
                    var score = document.createElement('div');
                    score.append("Score: " + (knowledge * knowledge + gold * gold + 2 * knowledge * gold));
                    score.append(document.createElement('hr'));
                    score.append("(knowledge+gold)^2");
                    score.append(document.createElement('hr'));
                    score.append("Turns used: " + totalTurn);
                    var popup = createPopup({ content: finaltext });
                    finaltext.appendChild(title);
                    finaltext.appendChild(score);
                    popup.removeChild(popup.getElementsByTagName('button')[0]);
                } }),
        ];
        for (var i = 0; i < 6; i++) {
            pyramid[i].connectedPath = pyramid[i + 1];
        }
        return pyramid;
    };
    PathCollection.prototype._prepareOasis = function () {
        var oasis = [
            new ChessPath({ x: 100, y: 300, id: 0 }),
            new ChessPath({ x: 240, y: 270, id: 1, moveOver: function () {
                    return "stop";
                }, stopAt: function () {
                    alert("Meet Fatima");
                    if (knowledge < 3) {
                        alert("Fatima slows you down: change dice to 2 sided");
                        currentDiceSide = 2;
                        temperaryDice = true;
                    }
                    else {
                        alert("Not affected");
                    }
                } }),
            new ChessPath({ x: 260, y: 360, id: 2 }),
            new ChessPath({ x: 320, y: 440, id: 3 }),
            new ChessPath({ x: 400, y: 360, id: 4 }),
            new ChessPath({ x: 480, y: 370, id: 5, moveOver: function () {
                    return "stop";
                }, stopAt: function () {
                    alert("Forecasted the attack. Rewarded 5 (50) gold.");
                    alert("Meet the Alchemist");
                    gold += 5;
                } }),
            new ChessPath({ x: 580, y: 270, id: 6 }),
            new ChessPath({ x: 730, y: 230, id: 7, stopAt: function () {
                    alert('Leaving Oasis');
                    generateToPyramid();
                } }),
        ];
        for (var i = 0; i < 7; i++) {
            oasis[i].connectedPath = oasis[i + 1];
        }
        return oasis;
    };
    PathCollection.prototype._prepareDesert = function () {
        var y = 100;
        var desert = [
            new ChessPath({ x: 90, y: y, id: 0 }),
            new ChessPath({ x: 160, y: y, id: 1 }),
            new ChessPath({ x: 230, y: y, id: 2 }),
            new ChessPath({ x: 300, y: y, id: 3 }),
            new ChessPath({ x: 370, y: y, id: 4, stopAt: function () {
                    alert("Talked with englishman. Gain 1 knowledge");
                    knowledge++;
                } }),
            new ChessPath({ x: 440, y: y, id: 5 }),
            new ChessPath({ x: 510, y: y, id: 6 }),
            new ChessPath({ x: 580, y: y, id: 7 }),
            new ChessPath({ x: 650, y: y, id: 8 }),
            new ChessPath({ x: 720, y: y, id: 9, stopAt: function () {
                    alert("Tribal war made it dangerous to travel.");
                    alert("Reach Oasis");
                    generateOasis();
                } }), //goal
        ];
        desert[0].connectedPath = desert[1];
        desert[1].connectedPath = desert[2];
        desert[2].connectedPath = desert[3];
        desert[3].connectedPath = desert[4];
        desert[4].connectedPath = desert[5];
        desert[5].connectedPath = desert[6];
        desert[6].connectedPath = desert[7];
        desert[7].connectedPath = desert[8];
        desert[8].connectedPath = desert[9];
        desert[1].onLeave = "3back1";
        desert[2].onLeave = "3back1";
        desert[3].onLeave = "3back1";
        desert[6].onLeave = "3back1";
        desert[7].onLeave = "3back1";
        desert[8].onLeave = "3back1";
        return desert;
    };
    PathCollection.prototype._prepareMorocco = function () {
        var morocco = [
            new ChessPath({ x: 470, y: 90, id: 0 }),
            new ChessPath({ x: 360, y: 140, id: 1, stopAt: function () {
                    alert("Gain 1 knowledge when helping the candy seller");
                    knowledge++;
                } }),
            new ChessPath({ x: 380, y: 220, id: 2 }),
            new ChessPath({ x: 280, y: 220, id: 3 }),
            new ChessPath({ x: 230, y: 150, id: 4, stopAt: function () {
                    alert("Gain " + rollResult.reduce(function (a, b) { return a + b; }, 0) + " gold for working at the crystal shop");
                    gold += rollResult.reduce(function (a, b) { return a + b; }, 0);
                } }),
            new ChessPath({ x: 150, y: 200, id: 5, stopAt: function () {
                    alert("Gain " + rollResult.reduce(function (a, b) { return a + b; }, 0) + " gold for working at the crystal shop");
                    gold += rollResult.reduce(function (a, b) { return a + b; }, 0);
                } }),
            new ChessPath({ x: 100, y: 300, id: 6 }),
            new ChessPath({ x: 200, y: 340, id: 7 }),
            new ChessPath({ x: 270, y: 300, id: 8 }),
            new ChessPath({ x: 360, y: 360, id: 9 }),
            new ChessPath({ x: 470, y: 400, id: 10 }),
            new ChessPath({ x: 500, y: 320, id: 11 }),
            new ChessPath({ x: 540, y: 220, id: 12, stopAt: function () {
                    alert("Learned new things from Morocco. Gain 1 knowledge");
                    knowledge += 1;
                } }),
            new ChessPath({ x: 460, y: 200, id: 13 }),
            new ChessPath({ x: 480, y: 450, id: 14, stopAt: function () {
                    alert("Meet the englishman");
                    alert("Reach Desert");
                    generateDesert();
                } }), //goal
        ];
        morocco[0].connectedPath = morocco[1];
        morocco[1].connectedPath = morocco[2];
        morocco[2].connectedPath = morocco[3];
        morocco[3].connectedPath = morocco[4];
        morocco[4].connectedPath = morocco[5];
        morocco[5].connectedPath = morocco[6];
        morocco[6].connectedPath = morocco[7];
        morocco[7].connectedPath = morocco[8];
        morocco[8].connectedPath = morocco[9];
        morocco[9].connectedPath = morocco[10];
        morocco[10].connectedPath = morocco[11];
        morocco[10].stopAt = function () {
            var questionWindow = document.createElement('div');
            var textPart = document.createElement('div');
            textPart.innerText = "Buy ticket to join the caravan (10 gold)";
            var answerPart = document.createElement('div');
            answerPart.style.display = "flex";
            var yesButton = document.createElement('button');
            yesButton.innerText = "yes";
            var noButton = document.createElement('button');
            noButton.innerText = "no";
            questionWindow.appendChild(textPart);
            questionWindow.appendChild(answerPart);
            answerPart.appendChild(yesButton);
            answerPart.appendChild(noButton);
            var popup = createPopup({ content: questionWindow });
            noButton.onclick = function () {
                popup.parentNode.removeChild(popup);
            };
            yesButton.onclick = function () {
                if (gold >= 10) {
                    alert('Path unlocked. Roll any number to go to Desert');
                    morocco[10].connectedPath = morocco[14];
                    gold -= 10;
                    var lock = document.getElementById('moroccolock');
                    lock.parentNode.removeChild(lock);
                    popup.parentNode.removeChild(popup);
                }
                else {
                    alert('Cannot afford');
                    popup.parentNode.removeChild(popup);
                }
            };
        };
        morocco[11].connectedPath = morocco[12];
        morocco[12].connectedPath = morocco[13];
        morocco[13].connectedPath = morocco[2];
        return morocco;
    };
    PathCollection.prototype._prepareAndalusia = function () {
        var andalusia = [
            new ChessPath({ x: 270, y: 200, id: 0, extraArg: { roll: "start" } }),
            new ChessPath({ x: 270, y: 280, id: 1 }),
            new ChessPath({ x: 350, y: 310, id: 2, stopAt: function () {
                    alert("Sold some wool, gain 3 gold.");
                    gold += 3;
                    return 0;
                } }),
            new ChessPath({ x: 450, y: 290, id: 3, }),
            new ChessPath({ x: 560, y: 290, id: 4, }),
            new ChessPath({ x: 620, y: 230, id: 5, }),
            new ChessPath({ x: 580, y: 180, id: 6, }),
            new ChessPath({ x: 500, y: 160, id: 7, stopAt: function () {
                    alert("Learned something from sheep, gain 1 knowledge.");
                    knowledge += 1;
                    return 0;
                }, extraArg: { roll: "split", x: 300, y: 370 } }),
            new ChessPath({ x: 380, y: 165, id: 8, }),
            new ChessPath({ x: 300, y: 370, id: 9, }),
            new ChessPath({ x: 305, y: 470, id: 10, stopAt: function () {
                    var randomNum = Math.floor(Math.random() * 100);
                    alert("Meet the theive, lose " + randomNum + "% + 50% gold (total:" + (randomNum + 50) + "% max:100%)");
                    alert("Reach Morocco");
                    var lostAmount = (randomNum + 50) < 100 ? (randomNum + 50) : 100;
                    lostAmount /= 100;
                    gold -= gold * lostAmount;
                    gold = Math.floor(gold);
                    generateMorocco();
                    return 0;
                } }) //goal
        ];
        andalusia[0].connectedPath = andalusia[1];
        andalusia[1].connectedPath = andalusia[2];
        andalusia[3].connectedPath = andalusia[4];
        andalusia[4].connectedPath = andalusia[5];
        andalusia[5].connectedPath = andalusia[6];
        andalusia[6].connectedPath = andalusia[7];
        andalusia[7].connectedPath = andalusia[8];
        andalusia[8].connectedPath = andalusia[0];
        andalusia[2].connectedPath = andalusia[3];
        andalusia[2].extraArg = {
            altPath: andalusia[9]
        };
        andalusia[9].connectedPath = andalusia[10];
        return andalusia;
    };
    return PathCollection;
}());
var pathCollection = new PathCollection();
var MAPS;
(function (MAPS) {
    MAPS[MAPS["ANDALUSIA"] = 1] = "ANDALUSIA";
    MAPS[MAPS["MOROCCO"] = 2] = "MOROCCO";
    MAPS[MAPS["DESERT"] = 3] = "DESERT";
    MAPS[MAPS["OASIS"] = 4] = "OASIS";
    MAPS[MAPS["TOPYRAMID"] = 5] = "TOPYRAMID";
})(MAPS || (MAPS = {}));
var andaunlock = false;
document.getElementById('startgame').onclick = function (ev) {
    if (!gameStarted) {
        generateAndalusia();
        gameStarted = true;
        rollable = true;
        var button = ev.target;
        button.innerText = "Roll";
        var popuptext = document.createElement('div');
        popuptext.innerText = "Now using 2 six sided dice";
        createPopup({ content: popuptext });
        knowledge += 1;
    }
    else if (rollable) {
        rollable = false;
        totalTurn++;
        rollResult = rollDice(currentDiceSide, currentDiceNum);
        setTimeout(function () {
            if (currentMap == MAPS.ANDALUSIA && rollResult[0] == rollResult[1] && !andaunlock) {
                andaunlock = true;
                var newAlert = document.createElement('div');
                alert("Path to Morocco unlocked.");
                var lock = document.getElementById('andalusialock');
                lock.parentNode.removeChild(lock);
                pathCollection.andalusia[2].connectedPath = pathCollection.andalusia[2].extraArg.altPath;
            }
        }, 2500);
        setTimeout(moveChess, 2500, rollResult.reduce(function (a, b) { return a + b; }, 0));
    }
};
document.getElementById('howtoplaybutton').onclick = function () {
    var rule = document.createElement('div');
    rule.innerText = "Click Start Game to start the game. Once game started, click roll to roll dice. The goal is to go to the green spot on the map. Spot with exclamation mark on it calls an event when land on it. Spot with question mark on it gives you a choice when land on it. Purple spot force you to stop. Orange spot slows you down. Move the mouse to the spot or the marks to see more information. You can click the Status button to see your status.";
    createPopup({ content: rule, styler: function (popup) {
            popup.style.position = "fixed";
            popup.style.zIndex = "3";
            popup.style.backgroundColor = "white";
            popup.style.width = "200px";
            popup.style.height = "450px";
            popup.style.left = "50%";
            popup.style.top = "50%";
            popup.style.padding = "30px 20px 20px 20px";
            popup.style.border = "2px solid black";
            popup.style.transform = "translate(-50%, -50%)";
        } });
};
document.getElementById('infobutton').onclick = function () {
    if (gameStarted) {
        var infos = document.createElement('div');
        infos.append(currentDiceNum + " dice: " + currentDiceSide + " sided");
        infos.append(document.createElement('br'));
        infos.append("Gold: " + gold);
        infos.append(document.createElement('br'));
        infos.append("Knowledge: " + knowledge);
        infos.append(document.createElement('br'));
        infos.append("Turns: " + totalTurn);
        createPopup({ content: infos });
    }
    else {
        var message = document.createElement('div');
        message.innerText = "Game not started.";
        createPopup({ content: message });
    }
};
document.getElementById('howtomultiplayer').onclick = function () {
    var rule = document.createElement('div');
    rule.innerText = "Open another same tab to add a player";
    createPopup({ content: rule });
};
document.getElementById('resetbutton').onclick = function () {
    window.location.reload();
};
document.getElementById('developertool').onclick = function () {
    var consoleContainer = document.createElement('div');
    var consoleInput = document.createElement('input');
    var consoleSubmit = document.createElement('button');
    consoleContainer.appendChild(consoleInput);
    consoleContainer.appendChild(consoleSubmit);
    consoleInput.innerText = "set";
    var popup = createPopup({ content: consoleContainer });
    consoleSubmit.onclick = function () {
        eval(consoleInput.value);
        popup.parentNode.removeChild(popup);
    };
};
