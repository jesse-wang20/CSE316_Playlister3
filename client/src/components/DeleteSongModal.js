import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'

function DeleteSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function confirmDelete(event){
        store.DeleteSongTransaction();
    }
    function cancelDelete(event){
        store.disableDeleteSong();
    }
    if(store.songtoDelete){
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }
    else{
        let modal = document.getElementById("delete-song-modal");
        if(modal){
            modal.classList.remove("is-visible");
        }
    }
    let name = "no"
    if(store.recentSong){
        name = store.recentSong.title;
    }
    
    return (
        <div 
            class="modal" 
            id="delete-song-modal" 
            data-animation="slideInOutLeft"
            >
                <div class="modal-root">
                    <div class="modal-north">
                        Delete song?
                    </div>
                    <div class="modal-center">
                        <div class="modal-center-content">
                            Are you sure you wish to permanently remove {name} from the playlist?
                        </div>
                    </div>
                    <div class="modal-south">
                        <input type="button" 
                            id="delete-song-confirm-button" 
                            class="modal-button" 
                            onClick={confirmDelete}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-song-cancel-button" 
                            class="modal-button" 
                            onClick={cancelDelete}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );

    
}
export default DeleteSongModal;