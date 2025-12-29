// Game developed by Vedant Vyawhare
let turn = "X";
let isgameover = false;
let isAiMode = false;
let scores = { X: 0, O: 0, Draws: 0 };

const changeTurn = () => turn === "X" ? "O" : "X";

const updateScoreUI = (winner) => {
    if (winner === "Draw") {
        scores.Draws++;
        document.getElementById("draw-score").innerText = scores.Draws;
    } else {
        scores[winner]++;
        document.getElementById(`${winner.toLowerCase()}-score`).innerText = scores[winner];
    }
};

const checkWin = () => {
    let boxtexts = document.getElementsByClassName("boxtext");
    let wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let winDetected = false;
    wins.forEach((e) => {
        if (boxtexts[e[0]].innerText === boxtexts[e[1]].innerText &&
            boxtexts[e[2]].innerText === boxtexts[e[1]].innerText &&
            boxtexts[e[0]].innerText !== "") {
            
            let winner = boxtexts[e[0]].innerText;
            document.querySelector(".info").innerText = winner + " Wins!";
            isgameover = true;
            winDetected = true;
            updateScoreUI(winner);

            e.forEach(index => {
                document.getElementsByClassName("box")[index].classList.add("winning-box");
            });
        }
    });

    if (!winDetected) {
        let isDraw = Array.from(boxtexts).every(el => el.innerText !== "");
        if (isDraw) {
            document.querySelector(".info").innerText = "It's a Draw!";
            isgameover = true;
            updateScoreUI("Draw");
        }
    }
};

const computerMove = () => {
    if (isgameover) return;
    setTimeout(() => {
        let boxtexts = document.getElementsByClassName("boxtext");
        let emptyIndices = [];
        Array.from(boxtexts).forEach((el, i) => { if (el.innerText === "") emptyIndices.push(i); });

        if (emptyIndices.length > 0 && !isgameover) {
            let move = emptyIndices.includes(4) ? 4 : emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            let box = document.getElementsByClassName("box")[move];
            box.querySelector(".boxtext").innerText = turn;
            box.querySelector(".boxtext").style.color = "var(--neon-pink)";
            
            checkWin();
            if (!isgameover) {
                turn = changeTurn();
                document.querySelector(".info").innerText = "Turn for " + turn;
            }
        }
    }, 500);
};

Array.from(document.getElementsByClassName("box")).forEach(element => {
    let boxtext = element.querySelector(".boxtext");
    element.addEventListener("click", () => {
        if (boxtext.innerText === "" && !isgameover) {
            if (isAiMode && turn === "O") return;

            boxtext.innerText = turn;
            boxtext.style.color = turn === "X" ? "var(--neon-blue)" : "var(--neon-pink)";
            
            checkWin();
            if (!isgameover) {
                turn = changeTurn();
                document.querySelector(".info").innerText = "Turn for " + turn;
                if (isAiMode && turn === "O") computerMove();
            }
        }
    });
});

document.getElementById("reset").addEventListener("click", () => {
    Array.from(document.querySelectorAll(".boxtext")).forEach(el => el.innerText = "");
    Array.from(document.querySelectorAll(".box")).forEach(box => box.classList.remove("winning-box"));
    turn = "X";
    isgameover = false;
    document.querySelector(".info").innerText = "Turn for " + turn;
});

const modeBtn = document.getElementById("modeBtn");
modeBtn.addEventListener("click", () => {
    isAiMode = !isAiMode;
    modeBtn.innerText = isAiMode ? "Mode: vs AI" : "Mode: PvP Arena";
    document.getElementById("reset").click();
});