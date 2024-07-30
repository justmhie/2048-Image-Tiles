let board;
let score = 0;
let rows = 4;
let columns = 4;

let is8192Exist = false;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

function handleSlide(event) {
    console.log(event.code);

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
        event.preventDefault();

        if (event.code === "ArrowLeft") {
            slideLeft();
        } else if (event.code === "ArrowRight") {
            slideRight();
        } else if (event.code === "ArrowUp") {
            slideUp();
        } else if (event.code === "ArrowDown") {
            slideDown();
        }

        if (hasLost()) {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            return; // Ensure no new tile is added if game is lost
        }

        setTwo();
        document.getElementById("score").innerText = score;
        checkWin();
    }
}

document.addEventListener("keydown", handleSlide);

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = row.slice();
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            if (originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-right 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = row.slice();
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            if (originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-left 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = col.slice();
        col = slide(col);
        let changedIndices = [];
        for (let r = 0; r < rows; r++) {
            if (originalCol[r] !== col[r]) {
                changedIndices.push(r);
            }
        }

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = col.slice();
        col.reverse();
        col = slide(col);
        col.reverse();
        let changedIndices = [];
        for (let r = 0; r < rows; r++) {
            if (originalCol[r] !== col[r]) {
                changedIndices.push(r);
            }
        }

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-top 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }
}

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 8192 && !is8192Exist) {
                alert("Victory! You have reached 8192! You are incredibly awesome");
                is8192Exist = true;
            }
        }
    }
}

function hasLost() {
    if (hasEmptyTile()) return false;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const currentTile = board[r][c];
            if (
                (r > 0 && board[r - 1][c] === currentTile) ||
                (r < rows - 1 && board[r + 1][c] === currentTile) ||
                (c > 0 && board[r][c - 1] === currentTile) ||
                (c < columns - 1 && board[r][c + 1] === currentTile)
            ) {
                return false;
            }
        }
    }

    return true;
}

function restartGame(){
	// this loop is responsible to change each tile values to zero.
   for(let r = 0; r < rows; r++){
	   for(let c = 0; c < columns; c++){
		   board[r][c] = 0;    // change all values to 0
	   }
   }

   score = 0;

   setTwo()    // new tile   
}

document.addEventListener('touchstart', (event) =>{
   startX = event.touches[0].clientX;
   startY = event.touches[0].clientY;
})

document.addEventListener('touchend', (event) => {

   if(!event.target.className.includes("tile")){
	   return; // "I will do nothing, since you haven't touched a tile"
   }

   // touchstart - touchend
   let diffX = startX - event.changedTouches[0].clientX;
   let diffY = startY - event.changedTouches[0].clientY;

   if(Math.abs(diffX) > Math.abs(diffY)){
	   if(diffX > 0 ){
		   slideLeft();
		   setTwo();
	   }
	   else{
		   slideRight();
		   setTwo();
	   }
   }
   else{

	   if(diffY > 0 ){
		   slideUp();
		   setTwo();
	   }
	   else{
		   slideDown();
		   setTwo();
	   }

   }

   document.getElementById("score").innerText = score;

   checkWin();

   if(hasLost() == true){
	   alert("Game Over! You have lost the game. Game will restart");
	   restartGame();
	   alert("Click any arrow key to restart");
   }
});


document.addEventListener('touchmove', (event)=>{
   if(!event.target.className.includes("tile")){
	   return; // "I will do nothing, since the player/user does not touch a tile"
   }

   event.preventDefault();

}, {passive: false}); // Use passive: false, to make preventDefault() work