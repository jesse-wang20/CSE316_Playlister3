import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(storeVar, index, song) {
        super();
        this.app = storeVar;
        this.indexR = index;
        this.currentSong = song;
    }

    doTransaction() {
        this.app.addSong(this.currentSong,this.indexR)
    }
    
    undoTransaction() {
        this.app.deleteSongFull(this.indexR,this.currentSong);
    }
}