import React from "react";
import Game from '../model/chess'
import Square from '../model/square'
import {Stage, Layer} from 'react-konva'
import Board from '../assets/chessBoard.png'
import Piece from "./piece";
import piecemap from "./piecemap";
import {userParam} from 'react-router-dom'
import {Colorcontext} from "../../context/colorcontext";
import {useParams} from 'react-router-dom'



class ChessGame extends React.Component {

    state = {
        gameState: new Game(this.props.color),
        draggedPieceTargetId: "",
        playerTurnToMoveIsWhite: true,
        whiteKingInCheck: false,
        blackKingInCheck: false
    }


    componentDidMount() {

       console.log(this.props.myUsername)
       console.log(this.props.opponentUserName)



    }

    startDragging = (e) =>{
        this.setState({
            draggedPieceTargetId: e.target.attrs.id
        })
    }


    movePiece = (selectedId, finalPosition, currentGame, isMyMove) => {
        var whiteKingInCheck = false
        var blackKingInCheck = false
        var blackCheckmated = false
        var whiteCheckmated = false
        const update = currentGame.movePiece(selectedId, finalPosition, isMyMove)


        if(update === "moved in the same position."){
            this.revertToPreviousState(selectedId)
            return
        }else if(update === "user tried to capture their own piece"){
            this.revertToPreviousState(selectedId)
            return
        }else if(update === "b is in check" || update === "w is in check"){
            if(update[0] === "b"){
                blackKingInCheck = true
            }else {
                whiteKingInCheck = true
            }
        }else if(update === "b has been checkmated" || update === "w has been checkmated"){
            if(update[0] === "b"){
                blackCheckmated = true
            }else{
                whiteCheckmated = true
            }
        }else if(update === "invalid move"){
            this.revertToPreviousState(selectedId)
            return
        }

        if (isMyMove){

        }


        this.setState({
            draggedPieceTargetId: "",
            gameState: currentGame,
            playerTurnToMoveIsWhite: !this.props.color,
            whiteKingInCheck: whiteKingInCheck,
            blackKingInCheck: blackKingInCheck
        })


        if(blackCheckmated){
            alert("White Won By Checkmate")
        }else if(whiteCheckmated){
            alert("Black Won By Checkmate")
        }

    }


    endDragging = (e) => {
        const currentGame = this.state.gameState
        const currentBoard = currentGame.getBoard()
        const finalPosition = this.inferCoord(e.target.x() + 90, e.target.y() + 90, currentBoard)
        const selectedId = this.state.draggedPieceTargetId
        this.movePiece(selectedId, finalPosition, currentGame, true)
    }


   revertToPreviousState = (selectedId) => {
        const oldGS = this.state.gameState
       const oldBoard = oldGS.getBoard()
       const tmpGS = new Game(true)
       const  tmpBoard = []

       for(var i = 0; i < 8; i++){
           tmpBoard.push([])
           for (var j = 0; j < 8; j++){
               if(oldBoard[i][j].getPieceIdOnThisSquare() === selectedId){
                   tmpBoard[i].push(new Square(j,i,null,oldBoard[i][j].canvasCoord))
               }else {
                   tmpBoard[i].push(oldBoard[i][j])
               }
           }
       }


       tmpGS.setBoard(tmpBoard)
       this.setState({
           gameState: tmpGS,
           draggedPieceTargetId: "",
       })

       this.setState({
           gameState: oldGS,
       })
   }


   inferCoord = (x, y, chessBoard) =>{
        var hashmap = {}
       var shotestDistance = Infinity
       for(var i = 0; i < 8; i++){
           for(var j = 0; j < 8; j++){
             const canvasCoord = chessBoard[i][j].getCanvasCoord()

             const delta_x = canvasCoord[0] - x
             const delta_y = canvasCoord[1] - y
             const newDistance = Math.sqrt(delta_x**2 + delta_y**2)
             hashmap[newDistance] = canvasCoord
             if(newDistance < shotestDistance){
                shotestDistance = newDistance
               }
           }
       }
       return hashmap[shotestDistance]
   }

    render() {
        return (
           <React.Fragment>
              <div style={{
              backgroundImage: `url(${Board}`,
              width: "720px",
              height: "720px"}}
              >
                 <Stage width={720} height={720}>
                     <Layer>
                         {this.state.gameState.getBoard().map((row) => {
                             return (<React.Fragment>
                                 {row.map((square)=>{
                                     if(square.isOccupied()){
                                         return(
                                             <Piece
                                                 x = {square.getCanvasCoord()[0]}
                                                 y = {square.getCanvasCoord()[1]}
                                                 imgurls = {piecemap[square.getPiece().name]}
                                                 isWhite = {square.getPiece().color === "white"}
                                                 draggedPieceTargetId = {this.state.draggedPieceTargetId}
                                                 onDragStart = {this.startDragging}
                                                 onDragEnd = {this.endDragging}
                                                 id = {square.getPieceIdOnThisSquare()}
                                                 thisPlayerColorIsWhite = {this.props.color}
                                                 playerTurnToMoveIsWhite = {this.state.playerTurnToMoveIsWhite}
                                                 whiteKingInCheck = {this.state.whiteKingInCheck}
                                                 blackKingInCheck = {this.state.blackKingInCheck}
                                             />
                                         )
                                     }
                                     return
                                 })}
                             </React.Fragment>)
                         })}
                     </Layer>
                 </Stage>
              </div>
           </React.Fragment>

        );
    }

}


const ChessGameWrapper = (props) =>{

    const domainName = 'http://localhost:3000'
    const  color = React.useContext(Colorcontext)
    //const {gameIid} = useParams()

    const [opponentDidJoinTheGame, didJoinGame] = React.useState(false)
    const [opponentUserName, setUserName] = React.useState('')





    return(
        <React.Fragment>
            {opponentDidJoinTheGame} ? (
                <div>
                    <h4> Opponent:: {opponentUserName}</h4>
                    <div style={{display: "flex"}}>
                        <ChessGame
                            gameId = {3}
                            color = {color.didRedirect}/>
                    </div>
                </div>
            )
        </React.Fragment>
    )

}
export default ChessGameWrapper