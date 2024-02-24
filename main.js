let count, theName;
window.onload = function () {
    if (!window.localStorage.getItem("best")) {
        window.localStorage.setItem("best", 1000);
        document.querySelector(".best-score span").innerHTML = 1000;
        window.localStorage.setItem("best-name", "God");
        document.querySelector(".best-score .name").innerHTML = "God";
    }
    document.querySelector(".best-score span").innerHTML = window.localStorage.getItem("best");
    document.querySelector(".best-score .name").innerHTML = window.localStorage.getItem("best-name");
    if (window.sessionStorage.getItem("current-player")) {
        document.querySelector(".name span").innerHTML = window.sessionStorage.getItem("current-player");
        theName = window.sessionStorage.getItem("current-player");
        count = 0;
        document.querySelector(".control-buttons").remove();
        turnOnThetTimer();
    }
}

document.querySelector(".control-buttons span").onclick = function () {
    let yourName = prompt("What's Your Name?");
    if (yourName == null || yourName == "") {
        document.querySelector(".name span").innerHTML = "Unknown";
        theName = "Unknown";
    } else {
        document.querySelector(".name span").innerHTML = yourName;
        theName = yourName;
    }
    window.sessionStorage.setItem("current-player", theName);
    count = 0;
    document.querySelector(".control-buttons").remove();
    turnOnThetTimer();
};

let duration = 1000;
let blocksContainer = document.querySelector(".memory-game-blocks");
let blocks = Array.from(blocksContainer.children);
let orderRange = [...Array(blocks.length).keys()];
orderRange = shuffle(orderRange);

blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
    block.addEventListener("click", function () {
        flipBlock(block);
    });
});

function flipBlock(selectedBlock) {
    selectedBlock.classList.add("is-flipped");
    let allFlippedBlocks = blocks.filter((block) => block.classList.contains("is-flipped"));
    if (allFlippedBlocks.length == 2) {
        stopClicking();
        checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
    }
}

function stopClicking() {
    blocksContainer.classList.add("no-clicking");
    setTimeout(() => {
        blocksContainer.classList.remove("no-clicking");
    }, duration);
}

function checkMatchedBlocks(firstBlock, secondBlock) {
    let triesElement = document.querySelector(".tries span");
    if (firstBlock.dataset.club === secondBlock.dataset.club) {
        firstBlock.classList.remove("is-flipped");
        secondBlock.classList.remove("is-flipped");
        firstBlock.classList.add("has-match");
        secondBlock.classList.add("has-match");
        count += 2;
        document.getElementById("success").play();
        if (count === blocks.length) {
            let best = window.localStorage.getItem("best");
            if (parseInt(triesElement.innerHTML) < best) {
                let div = document.createElement("div");
                div.className = "win-best";
                div.innerHTML = `
                    <div>
                        <h4>Congrats ${theName} !</h4>
                        <p>New Best Score (${parseInt(triesElement.innerHTML)}) !</p>
                        <span>Play Again!</span>
                        <span>New Game</span>
                    </div>
                `;
                document.body.appendChild(div);

                window.localStorage.setItem("best", parseInt(triesElement.innerHTML));
                document.querySelector(".best-score span").innerHTML = parseInt(triesElement.innerHTML);
                window.localStorage.setItem("best-name", theName);
                document.querySelector(".best-score .name").innerHTML = theName;

                document.querySelectorAll(".win-best span")[0].addEventListener("click", function () {
                    // window.sessionStorage.getItem("current-player").status = true;
                    window.location.reload();
                });
                document.querySelectorAll(".win-best span")[1].addEventListener("click", function () {
                    let yourName = prompt("What's Your Name?");
                    if (yourName == null || yourName == "") {
                        document.querySelector(".name span").innerHTML = "Unknown";
                        theName = "Unknown";
                    } else {
                        document.querySelector(".name span").innerHTML = yourName;
                        theName = yourName;
                    }
                    window.sessionStorage.setItem("current-player", theName);
                    count = 0;
                    location.reload();
                });
            } else {
                let div = document.createElement("div");
                div.className = "win";
                div.innerHTML = `
                    <div>
                        <h4>Congrats ${theName} !</h4>
                        <p>You Won !</p>
                        <span>Play Again!</span>
                        <span>New Game</span>
                    </div>
                `;
                document.body.appendChild(div);
                document.querySelectorAll(".win span")[0].addEventListener("click", function () {
                    // window.sessionStorage.getItem("current-player").status = true;
                    window.location.reload();
                });
                document.querySelectorAll(".win span")[1].addEventListener("click", function () {
                    let yourName = prompt("What's Your Name?");
                    if (yourName == null || yourName == "") {
                        document.querySelector(".name span").innerHTML = "Unknown";
                        theName = "Unknown";
                    } else {
                        document.querySelector(".name span").innerHTML = yourName;
                        theName = yourName;
                    }
                    window.sessionStorage.setItem("current-player", theName);
                    count = 0;
                    location.reload();
                });
            }
        }
    } else {
        triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;
        setTimeout(() => {
            firstBlock.classList.remove("is-flipped");
            secondBlock.classList.remove("is-flipped");
        }, duration)
        document.getElementById("fail").play();
    }
}

function shuffle(array) {
    let current = array.length;
    let temp, random;

    while (current) {
        random = Math.floor(Math.random() * current);
        current--;
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }

    return array;
}
    
function turnOnThetTimer() {
    let dateGoal = new Date().getTime() + 1000 * 120 + 2000 ;
    let counter = setInterval(() => {
        let dateNow = new Date().getTime();
        let dateDif = dateGoal - dateNow;

        let days = Math.floor(dateDif / (1000 * 60 * 60 * 24));
        let hours = Math.floor((dateDif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let mins = Math.floor((dateDif % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((dateDif % (1000 * 60)) / (1000));

        document.querySelector(".mins").innerHTML = mins < 10 ? `0${mins}` : mins;
        document.querySelector(".seconds").innerHTML = seconds < 10 ? `0${seconds}` : seconds;

        if(mins == 0 && seconds <= 10) {
            document.querySelector(".timer").style.backgroundColor = "red";
        }

        if (mins == 0 && seconds == 0) {
            clearInterval(counter);
            document.getElementById("losing").play();
            let div = document.createElement("div");
            div.className = "lose";
            div.innerHTML = `
                <div>
                    <h4>Hard Luck ${theName} !</h4>
                    <p>You Lost !</p>
                    <span>Play Again!</span>
                    <span>New Game</span>
                </div>
            `;
            document.body.appendChild(div);
            document.querySelectorAll(".lose span")[0].addEventListener("click", function () {
                // window.sessionStorage.getItem("current-player").status = true;
                window.location.reload();
            });
            document.querySelectorAll(".lose span")[1].addEventListener("click", function () {
                let yourName = prompt("What's Your Name?");
                if (yourName == null || yourName == "") {
                    document.querySelector(".name span").innerHTML = "Unknown";
                    theName = "Unknown";
                } else {
                    document.querySelector(".name span").innerHTML = yourName;
                    theName = yourName;
                }
                window.sessionStorage.setItem("current-player", theName);
                count = 0;
                location.reload();
            });
        }
    }, 1000)
}

/*
let mins = Math.floor((dateDif % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((dateDif % (1000 * 60)) / (1000));

        document.querySelector(".mins").innerHTML = mins < 10 ? `0${mins}` : mins;
        document.querySelector(".seconds").innerHTML = seconds < 10 ? `0${seconds}` : seconds;
*/