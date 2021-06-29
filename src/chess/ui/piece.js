import React from "react";
import { Image } from 'react-konva'
import useImage from "use-image";

const Piece = (props) => {
    const choiceOfColor = this.props.isWhite ? 0 : 1
    const [image] = useImage(this.props.imgurls[choiceOfColor])
    const isDragged = props.id === this.props.draggedPieceTargetId

    const canThisPieceEvenBeMovedByThisPlayer = this.props.isWhite === this.props.thisPlayersColorIsWhite
    const isItThatPlayersTurn = this.props.playerTurnToMoveIsWhite === this.props.thisPlayersColorIsWhite

    const thisWhiteKingInCheck = this.props === "wk1" && this.props.whiteKingInCheck
    const thisBlackKingInCheck = this.props === "bk1" && this.props.blackKingInCheck


    return <Image image={image}
                  x={this.props.x - 90}
                  y={this.props.y - 90}
                  draggable={canThisPieceEvenBeMovedByThisPlayer && isItThatPlayersTurn}
                  width={isDragged ? 75 : 60}
                  height={isDragged ? 75 : 60}
                  onDragStart={this.props.onDragStart}
                  onDragEnd={this.props.onDragEnd}
                  fill={(thisWhiteKingInCheck && "red") || (thisBlackKingInCheck && "red")}
                  id={this.props.id}
    />

}

export default Piece