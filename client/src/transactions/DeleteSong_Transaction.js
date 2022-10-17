import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * DeleteSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, prevIndex, song) {
        super();
        this.app = initApp;
        this.indexR = prevIndex;
        this.songR = song;
    }

    doTransaction() {
        this.app.deleteSongFull(this.indexR, this.songR);
    }
    
    undoTransaction() {
        this.app.addSong(this.songR, this.indexR);
    }
}