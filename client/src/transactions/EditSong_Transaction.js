import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, index, prevSong, newSong) {
        super();
        this.app = initApp;
        this.indexR = index;
        this.pSong = prevSong;
        this.nSong = newSong;
    }

    doTransaction() {
        this.app.editSongNow( this.pSong, this.indexR);
    }
    
    undoTransaction() {
        this.app.editSongNow( this.nSong, this.indexR);
    }
}