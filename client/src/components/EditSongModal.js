import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'

function EditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    function handleConfirm(event){
        let sname = document.getElementById("editSongTitle").value;
        let sartist = document.getElementById("editSongArtist").value
        let sytid = document.getElementById("editSongYTID").value
        let newSong = {
            title:sname,
            artist:sartist,
            youTubeId:sytid
        }
        store.editSongTransaction(newSong);
        // store.editSongNow();
    }
    function handleCancel(event){
        store.disableEditSong();
    }
    if(store.songtoEdit){
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }
    else{
        let modal = document.getElementById("edit-song-modal");
        if(modal){
            modal.classList.remove("is-visible");
        }
    }
    let name = "no"
    //console.log("MODAL ", store.recentSong)
    if(store.recentSong){
        name = store.recentSong.title;
        document.getElementById("editSongTitle").value = name;
    }
    let artist = "no"
    if(store.recentSong){
        artist = store.recentSong.artist;
        document.getElementById("editSongArtist").value = artist;
    }
    let youtubeID = "K"
    if(store.recentSong){
        youtubeID = store.recentSong.youTubeId;
        document.getElementById("editSongYTID").value = youtubeID;
    }
    //console.log("name is ", name)
    return (
        <div 
        class="modal" 
        id="edit-song-modal" 
        data-animation="slideInOutLeft">
            <div class="modal-root" id='verify-edit-song-root'>
                <div class="modal-north">
                    Edit song
                </div>
                <div class="modal-center">
                    <b>Title:</b>
                    <input id = "editSongTitle" type="text1" />
                    <b>Artist:</b>
                    <input id = "editSongArtist" type="text2"/>
                    <b>You Tube Id:</b>
                    <input id = "editSongYTID" type="text3" />
                </div>
                <div class="modal-south">
                    <input type="button" 
                        id="edit-song-confirm-button" 
                        class="modal-button" 
                        onClick={handleConfirm}
                        value='Confirm' />
                    <input type="button" 
                        id="edit-song-cancel-button" 
                        class="modal-button" 
                        onClick={handleCancel}
                        value='Cancel' />
                </div>
            </div>
        </div>
    )  ;

    
}
export default EditSongModal;