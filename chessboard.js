class Player{
    constructor(color){
        this.color = color
        this.inCheck = false
        this.checkingPiece = ""
        this.king = (color === "white") ? "e1" : "e8"
        this.kingside = true
        this.queenside = true
    }
    underAttack(id){ // Determines if an opposing piece can be placed on a square in a given move
    
    /* This loop determines if there is an opposing king on an adjacent square*/
        for (let i = -1; i <= 1; i++){
            for (let j = -1; j<=1; j++){
                if (i === j && j === 0){
                    continue
                }
                if (getPiece(getId(id, i, j)) === opp.color+"_king"){
                    return true
                }
            }
        }
    /* This section determines if there is an opposing pawn attacking the square */
        let x = cur.color === "white" ? 1 : -1
        if (getPiece(getId(id, 1, x)) === opp.color + "_pawn"){
            return true
        }
        if (getPiece(getId(id, -1, x)) === opp.color + "_pawn"){
            return true
        }
    
    /* This section checks to see if there are any opposing knights attacking the square */

        for (let i = -2; i<=2; i++){
            if (i === 0){
                continue
            }
            let j = 3 - Math.abs(i)
            if (getPiece(getId(id, i, j)) === opp.color + "_knight"){
                return true
            }
            if (getPiece(getId(id, i, -j)) === opp.color + "_knight"){
                return true
            }
        }
    /* This section determines if the piece is under attack by any queens or rooks along the file/rank */
        // Search to the right of the piece for the nearest piece
        let count = 1
        for (let i = ascii(id[0]); i<ascii('h'); i++){
            let piece = getPiece(getId(id, count, 0))
            if (piece === opp.color + "_rook" || piece === opp.color + "_queen"){
                return true
            }
            else if (piece !== "square_image"){
                break
            }
            count++
        }
        // Search to the left of the piece for the nearest piece
        count = -1
        for (let i = ascii(id[0]); i>ascii('a'); i--){
            let piece = getPiece(getId(id, count, 0))
            if (piece === opp.color + "_rook" || piece === opp.color + "_queen"){
                return true
            }
            else if (piece !== "square_image"){
                break
            }
            count--
        }

        // Search above the piece for the nearest piece
        count = 1
        for (let i = id[1]; i<8; i++){
            let piece = getPiece(getId(id, 0, count))
            if (piece === opp.color + "_rook" || piece === opp.color + "_queen"){
                return true
            }
            else if (piece !== "square_image"){
                break
            }
            count++
        }
        count = -1
        for (let i = id[1]; i>1; i--){
            let piece = getPiece(getId(id, 0, count))
            if (piece === opp.color + "_rook" || piece === opp.color + "_queen"){
                return true
            }
            else if (piece !== "square_image"){
                break
            }
            count--
        }


    /* This section determines if this square is under attack by any opposing bishops or queens along the diagonals*/

        // Upper right diagonal
        for (let i = 1; getId(id, i, i) !== -1; i++){
            let piece = getPiece(getId(id, i, i))
            if (piece === opp.color + "_bishop" || piece === opp.color + "_queen"){
                return true
            }
            else if (piece !== "square_image"){
                break
            }
        }
        for (let i = -1; getId(id, i, i) !== -1; i--){
            let piece = getPiece(getId(id, i, i))
            if (piece === opp.color + "_bishop" || piece === opp.color + "_queen"){
                return true
            }
            else if (piece !== "square_image"){
                break
            }
        }
        for (let i = 1; getId(id, i, -i) !== -1; i++){
            let piece = getPiece(getId(id, i, -i))
            if (piece === opp.color + "_bishop" || piece === opp.color + "_queen"){
                return true
            }
            else if (piece !== "square_image"){
                break
            }
        }
        for (let i = 1; getId(id, -i, i) !== -1; i++){
            let piece = getPiece(getId(id, -i, i))
            if (piece === opp.color + "_bishop" || piece === opp.color + "_queen"){
                return true
            }
            else if (piece !== "square_image"){
                break
            }
        }
       return false
    }
}

let inputCoordinates = []

const white = new Player("white")
const black = new Player("black")

let cur = white
let opp = black

let enPassant = ""

let gameReport = []


function inputCoordinate(id){
    inputCoordinates.push(id)
    if (inputCoordinates.length === 2){
        moveAttempt(inputCoordinates)
        inputCoordinates = []
    }
}

function moveAttempt(moveCoordinates){

    let start = document.getElementById(moveCoordinates[0])
    let dest = document.getElementById(moveCoordinates[1])
    if (isLegalMove(start, dest)){
        if (promotion(start,dest)){
            dest.setAttribute("src", "Images/" + cur.color + "_queen.svg")
            start.setAttribute("src", "Images/square_image.png")
        }
        else{
            dest.setAttribute("src", start.getAttribute("src"))
            start.setAttribute("src", "Images/square_image.png")
        }
        if (attacksKing(dest.getAttribute("id"), getPiece(dest.getAttribute("id")))){ // If this move attacks the king, gives check
            opp.inCheck = true
            cur.checkingPiece = dest.getAttribute("id")
        }

        if (!moveCreatesEnPassant(start, dest)){
            enPassant = ""
        }
        addToGameReport(start,dest)

        changeTurns()
    }
    else{
        console.log("Illegal move")
    }
    
}

function promotion(start,dest){
    let startId = start.getAttribute("id")
    let destId = dest.getAttribute("id")

    let piece = getPiece(startId)
    if (piece.includes("pawn") && (destId[1] === "1" || destId[1] === "8")){
        return true
    }
}

function addToGameReport(start,dest){
    let startId = start.getAttribute("id")
    let destId = dest.getAttribute("id")
    let movement = getMovement(startId, destId)

    // So we want to generate a string that is Nc4, a symbol for the knight followed by a the destId
    // So if it's white to move, we want to add a new element to the game report and add the moveId to that
    // If it's black to move, we don't add a new element to the game report

    let piece = getPiece(destId)
    console.log("piece is " + piece)
    let pieceId = piece[6].toUpperCase()
    if (piece.includes("knight")){
        pieceId = "N"
    }
    if (piece.includes("pawn")){
        pieceId = ""
    }  

    let moveId = pieceId + destId

    if (piece.includes("king") && movement[0] === 2){
        moveId = "O-O"
    }
    if (piece.includes("king") && movement[0] === -2){
        moveId = "O-O-O"
    }

    if (cur.color === "white"){
        gameReport.push([])
    }
    gameReport[gameReport.length-1].push(moveId)
    
}

function blocksCheck(dest){
    // We need to determine the path along which the check is coming from

    let destId = dest.getAttribute("id")


    let movement = getMovement(cur.king, opp.checkingPiece)
    if (Math.abs(movement[0]) === Math.abs(movement[1])){
        // Bishop move
        let xsign = 1
        let ysign = 1
        if (movement[0] < 0){
            xsign = -1
        }
        if (movement[1] < 0){
            ysign = -1
        }

        for (let i = Math.abs(movement[0]) - 1; i>0; i--){
            if (arrcmp(getMovement(cur.king, destId),[i * xsign, i * ysign])){ 
                return true
            }
        }
        return false
    }
    else if (movement[0] === 0 || movement[1] === 0){
        // Rook move
        let xIsZero = movement[0] === 0
        let counter = 0
        let sign = 1
        if (xIsZero){
            counter = Math.abs(movement[1])
            if (movement[1] < 0){
                sign = -1
            }
        }
        else{
            counter = Math.abs(movement[0])
            if (movement[0] < 0){
                sign = -1
            }
        }

        for (let i = counter - 1; i>0; i--){
            if (xIsZero){
                if (arrcmp(getMovement(cur.king, destId),[0,i*sign])){
                    return true
                }
            }
            else{
                if (arrcmp(getMovement(cur.king, destId),[i*sign, 0])){
                    return true
                }
            }
        }
        return false
    }


    
    // Let's say a bishop on b6 if giving check to a king on e3.
    // getMovement(king, checking) gives -3,3. That means that the interposing piece must have a getMovement(king, interposing) of -2/-1, 2/1
    
    // Let's say a rook on h8 and a king on h2
    // getMovement(king, checking) gives 0,6. That means that the interposing piece must have a getMovement(king, interposing) of 0,5/4/3/2/1

    // Let's say a pawn on e3 is checking a king on d4
    // getMovement(king, checking) gives -1,-1. That means there are no squares available for the interposing piece
}

function isLegalMove(start, dest){
    if (!start.getAttribute("src").includes(cur.color)){ // If you don't select one of your own pieces 
        return false;
    }
    if (dest.getAttribute("src").includes(cur.color)){ // If you attempt to capture one of your own pieces
        return false;
    }
    if (moveCreatesCheck(start,dest)){
        return false
    }

    if (cur.inCheck){

        if (start.getAttribute("src").includes("king")){
            return isLegalKingMove(start,dest)
        }
        if (dest.getAttribute("id") !== opp.checkingPiece && !blocksCheck(dest)){
            return false
        }
        else{
            cur.inCheck = false
            opp.checkingPiece = ""
        }
    }
    if (start.getAttribute("src").includes("king")){ 
        return isLegalKingMove(start,dest)
    }
    if (start.getAttribute("src").includes("bishop")){
        return isLegalBishopMove(start,dest)
    }
    if (start.getAttribute("src").includes("knight")){
        return isLegalKnightMove(start,dest)
    }
    if (start.getAttribute("src").includes("rook")){
        return isLegalRookMove(start,dest)
    }
    if (start.getAttribute("src").includes("queen")){
        return isLegalQueenMove(start,dest)
    }
    if (start.getAttribute("src").includes("pawn")){
        return isLegalPawnMove(start,dest)
    }
    
    
    
    
    

    

    

    // Check to see if the move puts the player in check
        // If it's a king move, check the first piece jetting out from the king in all directions, is that first piece an opposing piece giving check?
        // If it's a king move, check all the squares a knights distance away to see if there is an opposing knight on those squares
        // Otherwise, assess the relationship between the king and the start square. Check to see if there is another piece along that path that can give check

    // if you're in check
        // Does this move capture the opposing checkingPiece
        // Is this a king move that doesn't put the player in check
        // Is dest in between the checking piece and the king

    /*
    if (start.getAttribute("src").includes("bishop")){
        return isLegalBishopMove(start,dest)
    }
    if (start.getAttribute("src").includes("knight")){
        return isLegalKnightMove(start,dest)
    }
    if (start.getAttribute("src").includes("rook")){
        return isLegalRookMove(start,dest)
    }
    if (start.getAttribute("src").includes("queen")){
        return isLegalQueenMove(start,dest)
    }
    if (start.getAttribute("src").includes("king")){
        return isLegalKingMove(start,dest)
    }
    if (start.getAttribute("src").includes("pawn")){
        return isLegalPawnMove(start,dest)
    }
    */


    // changeTurns()
    return true;
}

function changeTurns(){
    if (cur.color === "white"){
        cur = black
        opp = white
    }
    else{
        cur = white
        opp = black
    }
}

function ascii(a){
    return a.charCodeAt()
}

function getId(id, x, y){ // Returns the id of the square x and y coordinates away from the id given
    
    let file = id[0]
    let rank = id[1]

    file = String.fromCharCode(ascii(file) + x) 
    rank = parseInt(rank) + y

    if ((ascii(file) > ascii('h'))  || ascii(file) < ascii('a') || rank > 8 || rank < 1){
        return -1
    }
    
    let newId = file + rank

    

    return newId
}

function getMovement(start, dest){ // Returns the coordinate of the movement from start to dest
    return[ascii(dest[0])-ascii(start[0]), dest[1]-start[1]]
}

function getPiece(id){ // Returns the type of piece on a given square
    if (id === -1){
        return ""
    }
    let square = document.getElementById(id)
    let img_path = square.getAttribute("src")
    let piece = img_path.substring(img_path.indexOf("/") + 1, img_path.indexOf("."))
    
    return piece
}

function isLegalKingMove(start, dest){
    let startId = start.getAttribute("id")
    let destId = dest.getAttribute("id")
    let movement = getMovement(startId, destId)

    if (movement[1] === 0 && (movement[0] === 2 || movement[0] === -2)){
        return isLegalCastle(start,dest)
    }
    if (Math.abs(movement[0]) > 1 || Math.abs(movement[1]) > 1){
        return false
    }
    if (cur.underAttack(destId)){
        return false
    }
    cur.king = destId
    cur.inCheck = false
    opp.checkingPiece = ""
    // changeTurns()
    return true
}

function arrcmp(arr1, arr2){
    console.log("arr1: " + arr1)
    console.log("arr2: " + arr2)
    if (arr1.length !== arr2.length){
        return false
    }
    for (let i = 0; i<arr1.length; i++){
        if (arr1[i] !== arr2[i]){
            return false
        }
    }
    return true
}

function attacksKing(pieceId, pieceType){
    
    console.log("pieceId is " + pieceId)
    console.log("pieceType is " + pieceType)

    // Determine if the piece is a bishop, queen, rook, pawn, or knight
    let movement = getMovement(pieceId, opp.king) 
    
    if (pieceType.includes("king")){
        return false;
    }

    if (pieceType.includes("bishop") || pieceType.includes("queen")){ // Check to see if king is on same diagonal
        if (Math.abs(movement[0]) === Math.abs(movement[1])){ // Then it's a bishops distance away
            let xsign = 1
            let ysign = 1
            if (movement[0] < 0){
                xsign = -1
            }
            if (movement[1] < 0){
                ysign = -1
            }
    
            for (let i = Math.abs(movement[0]) - 1; i>0; i--){
                let interposing = getId(pieceId, i*xsign, i*ysign)
                if (getPiece(interposing) !== "square_image"){
                    return false
                }
            }
            return true
        }
        else if (pieceType.includes("bishop")){
            return false
        }
    }
    if (pieceType.includes("rook") || pieceType.includes("queen")){
        console.log("This runs1")
        if (movement[0] === 0 || movement[1] === 0){ // Rooks distance away
            console.log("This runs2")
            let xIsZero = movement[0] === 0
            let counter = 0
            let sign = 1
            if (xIsZero){
                console.log("This runs3")
                counter = Math.abs(movement[1])
                if (movement[1] < 0){
                    sign = -1
                }
            }
            else{
                console.log("This runs4")
                counter = Math.abs(movement[0])
                if (movement[0] < 0){
                    sign = -1
                }
            } // Now we have a counter variable that is set to the absolute value of the non-zero element and we've got the sign of it    
            console.log("counter: " + counter)
            for (let i = counter - 1; i>0; i--){
                let interposing = 0
                if (xIsZero){ // If there is a piece on the square
                    interposing = getId(pieceId, 0, i*sign) 
                }
                else{
                    interposing = getId(pieceId, i*sign, 0)
                }
                if (getPiece(interposing) !== "square_image"){
                    return false
                }
            }
        }
        else{
            return false
        }
    }
    else if (pieceType.includes("knight")){
        for (let i = -2; i<=2; i++){
            if (i === 0){
                continue
            }
            let j = 3 - Math.abs(i)
            if (getPiece(getId(pieceId, i, j)) === opp.color + "_king" || getPiece(getId(pieceId, i, -j)) === opp.color + "_king"){
                return true
            }
        }
        return false
    }
    else if (pieceType.includes("pawn")){ // piece is a pawn
        let x = cur.color === "white" ? 1 : -1
        if (getPiece(getId(pieceId, 1, x)) === opp.color + "_king" || getPiece(getId(pieceId, -1, x)) === opp.color + "_king"){
            return true
        }
        return false
    }
    return true
}

function isLegalBishopMove(start, dest){
    let startId = start.getAttribute("id")
    let destId = dest.getAttribute("id")
    let movement = getMovement(startId, destId)

    if (Math.abs(movement[0]) !== Math.abs(movement[1])){
        return false
    }
    // Check each of the squares between start and dest to determine if there is a piece on any of the squares
    let xsign = 1
    let ysign = 1
    if (movement[0] < 0){
        xsign = -1
    }
    if (movement[1] < 0){
        ysign = -1
    }
    for (let i = 1; i<Math.abs(movement[0]); i++){
        let id = getId(startId, i * xsign, i * ysign)
        if (getPiece(id) !== "square_image"){
            return false
        }
    }
    // changeTurns()
    return true

}
function isLegalKnightMove(start,dest){
    let startId = start.getAttribute("id")
    let destId = dest.getAttribute("id")
    let movement = getMovement(startId, destId)

    if (Math.abs(movement[0]) === 1 && Math.abs(movement[1]) === 2 || Math.abs(movement[0]) === 2 && Math.abs(movement[1]) === 1){
        // changeTurns()
        return true
    }
    return false
    
}
function isLegalQueenMove(start,dest){
    if (isLegalBishopMove(start,dest)){
        return true
    }
    else if (isLegalRookMove(start,dest)){
        return true
    }
    else{
        return false
    }
}
function isLegalRookMove(start, dest){
    let startId = start.getAttribute("id")
    let destId = dest.getAttribute("id")
    let movement = getMovement(startId, destId)

    if (movement[0] !== 0 && movement[1] !== 0){
        return false
    }
    console.log("movement[0]: " + movement[0])
    console.log("movement[1]: " + movement[1])

    let xIsZero = movement[0] === 0
    let counter = 0
    let sign = 1
    
    if (xIsZero){
        counter = Math.abs(movement[1])
        if (movement[1] < 0){
            sign = -1
        }
    }
    else{
        counter = Math.abs(movement[0])
        if (movement[0] < 0){
            sign = -1
        }
    }
    for (let i = 1; i<counter; i++){
        if (xIsZero){
            let id = getId(startId, 0, i*sign)
            if (getPiece(id) !== "square_image"){
                return false
            }
        }
        else{
            let id = getId(startId, i*sign, 0)
            if (getPiece(id) !== "square_image"){
                return false
            }
        }
    }
    // changeTurns()
    return true
}
function isLegalPawnMove(start, dest){
    let startId = start.getAttribute("id")
    let destId = dest.getAttribute("id")
    let movement = getMovement(startId, destId)

    if (cur.color === "white"){
        if (movement[0] === 0 && movement[1] === 2){
            if (startId[1] !== '2'){
                return false
            }
            if (getPiece(getId(startId, 0, 1)) !== "square_image" || getPiece(getId(startId, 0, 2)) !== "square_image"){
                return false
            }
            enPassant = getId(startId, 0, 1)
        }
        else if (movement[0] === 0 && movement[1] === 1){
            if (getPiece(getId(startId, 0, 1)) !== "square_image"){
                return false
            }
        }
        else if (movement[1] === 1 && (movement[0] === 1 || movement[0] === -1)){ 
            console.log("THIS SHOULD RUN")
            if (!getPiece(destId).includes(opp.color)){
                console.log("THIS SHOULD RUN2")
                console.log("ENPASSANT IS " + enPassant)
                console.log("ID IS " + getId(destId,0,-1))
                 if (enPassant === destId){
                    console.log("THIS SHOULD RUN3")
                    document.getElementById(getId(destId, 0, -1)).setAttribute("src", "Images/square_image.png")
                 }
                 else{
                     return false
                 }
            }
        }
        else{
            return false
        }
    }
    if (cur.color === "black"){
        if (movement[0] === 0 && movement[1] === -2){
            if (startId[1] !== '7'){
                return false
            }
            if (getPiece(getId(startId, 0, -1)) !== "square_image" || getPiece(getId(startId, 0, -2)) !== "square_image"){
                return false
            }
            enPassant = getId(startId, 0, -1)
        }
        else if (movement[0] === 0 && movement[1] === -1){
            if (getPiece(getId(startId, 0, -1)) !== "square_image"){
                return false
            }
        }
        else if (movement[1] === -1 && (movement[0] === 1 || movement[0] === -1)){ 
            if (!getPiece(destId).includes(opp.color)){
                 if (enPassant === getId(destId, 0, 1)){
                    document.getElementById(getId(destId, 0, 1)).setAttribute("src", "Images/square_image.png")
                 }
                 else{
                     return false
                 }
            }
        }
        else{
            return false
        }
    }
    // changeTurns()
    return true
    // Duplicate for black, it may be possible to just set a sign 1 or -1 depending on whether you're black or not
}

function moveCreatesEnPassant(start, dest){
    let startId = start.getAttribute("id")
    let destId = dest.getAttribute("id")
    let movement = getMovement(startId, destId)

    if (!getPiece(destId).includes("pawn")){
        return false
    }
    if (movement[0] === 0 && (movement[1] === 2 || movement[1] === -2)){
        return true
    }
}
function isLegalCastle(start,dest){
    let startId = start.getAttribute("id")
    let destId = dest.getAttribute("id")
    let movement = getMovement(startId, destId)

    if (movement[0] === 2){ //kingside castle attempt
        if (!cur.kingside){
            return false
        }
        for (let i = 1; i<3; i++){
            let id = getId(startId, i, 0)
            if (getPiece(id) !== "square_image"){
                return false
            }
        }
        for (let i = 0; i<3; i++){
            let id = getId(startId, i, 0)
            if (cur.underAttack(id)){
                return false
            }
        }
        rookStartImg = document.getElementById(getId(startId, 3, 0))
        rookDestImg = document.getElementById(getId(startId, 1, 0))
        rookDestImg.setAttribute("src", rookStartImg.getAttribute("src"))
        rookStartImg.setAttribute("src", "Images/square_image.png")
        if (attacksKing(getId(startId, 1, 0), cur.color + "_rook")){
            opp.inCheck = true
            cur.checkingPiece = getId(startId, 1, 0)
        }
        return true
    }
    if (movement[0] === -2){ //queenside castle attempt
        if (!cur.queenside){
            return false
        }
        for (let i = -1; i>-4; i--){
            let id = getId(startId, i, 0)
            if (getPiece(id) !== "square_image"){
                return false
            }
        }
        for (let i = 0; i>-3; i--){
            let id = getId(startId, i, 0)
            if (cur.underAttack(id)){
                return false
            }
        }
        // Move the rook 3 squares to the right of the king to the square 1 square to the right of the king
        rookStartImg = document.getElementById(getId(startId, -4, 0))
        rookDestImg = document.getElementById(getId(startId, -1, 0))
        rookDestImg.setAttribute("src", rookStartImg.getAttribute("src"))
        rookStartImg.setAttribute("src", "Images/square_image.png")
        if (attacksKing(getId(startId, -1, 0), cur.color + "_rook")){
            opp.inCheck = true
            cur.checkingPiece = getId(startId, -1, 0)
        }
        return true
    }
}

function moveCreatesCheck(start, dest){
    let startId = start.getAttribute("id")
    let destId = dest.getAttribute("id")
    let movement = getMovement(startId, destId)

    let pieceToKing = getMovement(cur.king, startId) // This is the movement between the king and the piece, let's us know if it could be blocking a check

    if (pieceToKing[0] === 0 || pieceToKing[1] === 0 || Math.abs(pieceToKing[0]) === Math.abs(pieceToKing[1])){ // This this piece could theoretically be blocking a check
        // Check to see if there are any pieces in between the king and the piece
        if (pieceToKing[0] === 0){ // Then we need to check each square on the direction up/down the file
            console.log("7")
            let sign = 1
            if (pieceToKing[1] < 0){
                sign = -1
            }
            for (let i = sign; i !== pieceToKing[1]; i+=sign){ // Check each square in between the king and the piece for an interposing piece
                let id = getId(cur.king, 0, i)
                if (getPiece(id) !== "square_image"){
                    return false
                }
            }

            // Now we need to continue along the file until we arrive at another piece, if that piece is not a rook or a queen then we're good
            for (let i = pieceToKing[1]+sign; true/*until we find a piece*/; i+=sign){
                let id = getId(cur.king, 0, i)
                let piece = getPiece(id)
                if (id === -1){ // If you go off the board without coming across another piece
                    return false
                }
                else if (piece === "square_image"){ // If you're going over a blank square
                    continue
                }
                else if (piece === opp.color + "_rook" || piece === opp.color + "_queen"){ // Then we need to check to see if the movement keeps the block
                    break
                }
                else{ // If there is another type of piece besides an opposing rook and a queen along the file
                    return false
                }
            }
            if (movement[0] === 0){ // If the piece stays on the same file, and thus maintains the block
                return false
            }
        }
        else if (pieceToKing[1] === 0){ // Then we need to check each square on the direction along the rank
            let sign = 1
            if (pieceToKing[0] < 0){
                sign = -1
            }
            for (let i = sign; i !== pieceToKing[0]; i+=sign){
                let id = getId(cur.king, i, 0)
                if (getPiece(id) !== "square_image"){
                    return false
                }
            }
            // Add in the same code for the file and diagonal and we'll be good
            for (let i = pieceToKing[0]+sign; true/*until we find a piece*/; i+=sign){
                let id = getId(cur.king, i, 0)
                let piece = getPiece(id)
                if (id === -1){ // If you go off the board without coming across another piece
                    return false
                }
                else if (piece === "square_image"){ // If you're going over a blank square
                    continue
                }
                else if (piece === opp.color + "_rook" || piece === opp.color + "_queen"){ // Then we need to check to see if the movement keeps the block
                    break
                }
                else{ // If there is another type of piece besides an opposing rook and a queen along the rank
                    return false
                }
            }
            if (movement[1] === 0){ // If the piece stays on the same rank, and thus maintains the block
                return false
            }
        }
        else{ // We need to check along the diagonal
            let xsign = pieceToKing[0] > 0 ? 1 : -1
            let ysign = pieceToKing[1] > 0 ? 1 : -1

            for (let i = 1; i < Math.abs(pieceToKing[0]); i++){
                let id = getId(cur.king, i*xsign, i*ysign)
                if (getPiece(id) !== "square_image"){
                    return false
                } 
            }
            for (let i = Math.abs(pieceToKing[0])+1; true/*until we find a piece*/; i++){
                let id = getId(cur.king, i*xsign, i*ysign)
                let piece = getPiece(id)
                if (id === -1){ // If you go off the board without coming across another piece
                    return false
                }
                else if (piece === "square_image"){ // If you're going over a blank square
                    continue
                }
                else if (piece === opp.color + "_bishop" || piece === opp.color + "_queen"){ // Then we need to check to see if the movement keeps the block
                    break
                }
                else{ // If there is another type of piece besides an opposing rook and a queen along the rank
                    return false
                }
            }
            let xsign2 = movement[0] > 0 ? 1 : -1
            let ysign2 = movement[1] > 0 ? 1 : -1 
            if (Math.abs(movement[0]) === Math.abs(movement[1]) && xsign2 === xsign && ysign2 === ysign){ // If the piece stays on the same diagonal, and thus maintains the block.
                return false
            }
        }
        return true
    }
    return false

}

function printGameReport(){
    for (let i = 0; i<gameReport.length; i++){
        console.log(i + 1 + " " + gameReport[i][0] + " " + gameReport[i][1])
    }
}

