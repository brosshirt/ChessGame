class Player{
    constructor(color){
        this.color = color
        this.inCheck = false
        this.checkingPiece = ""
        this.king = (color === white) ? "e1" : "e8"
    }
    underAttack(id){ // Determines if an opposing piece can be placed on a square in a given move
        /*

            if there is a king an any of the adjacent squares, you're under attack

            if (cur.color = white){
                if there is an opposing pawn on the square up and to the right, then you're under attack
                if there is an opposing pawn on the square up and to the left, then you're under attack
            }
            if (cur.color = black){
                if there is an opposing pawn on the square down and to the left, then you're under attack
                if there is an opposing pawn on the square down and to the right, then you're under attack
            }

            if there is an opposing knight on the square up two and to the right one
            if there is an opposing knight on the square up two and to the left one

            if there is an opposing knight on the square up one and to the right two
            if there is an opposing knight on the square up one and to the left two

            if there is an opposing knight on the square down one and to the right two
            if there is an opposing knight on the square down one and to the left two

            if there is an opposing knight on the square down two and to the right one
            if there is an opposing knight on the square down two and to the left one

            Search to the right of the piece until you get to the nearest piece 
            Search to the left of the piece until you get to the nearest piece 
            Search above the piece until you get to the nearest piece
            Search below the piece until you get to the nearest piece

                if the nearest piece is rook or queen, you're under attack
                
            Search to the upper right of the piece until you get to the nearest piece 
            Search to the upper left of the piece until you get to the nearest piece 
            Search to the lower right of the piece until you get to the nearest piece 
            Search to the lower left of the piece until you get to the nearest piece
            
                if the nearest piece is bishop or queen, you're under attack
        */
       return false
    }
}