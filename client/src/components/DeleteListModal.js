import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'

function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);

    function confirmDelete(event){
        store.deleteList();
    }
    function cancelDelete(event){
        store.disableDelete();
    }
    if(store.listToDelete){
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }
    else{
        let modal = document.getElementById("delete-list-modal");
        if(modal){
            modal.classList.remove("is-visible");
        }
    }
    let name = "no"
    if(store.recentPlaylist){
        name = store.recentPlaylist.name;
    }
    
    return (
        <div 
            class="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft"
            >
                <div class="modal-root">
                    <div class="modal-north">
                        Delete List?
                    </div>
                    <div class="modal-center">
                        <div class="modal-center-content">
                            Are you sure you wish to permanently remove {name} from the playlist?
                        </div>
                    </div>
                    <div class="modal-south">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            class="modal-button" 
                            onClick={confirmDelete}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            class="modal-button" 
                            onClick={cancelDelete}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );

    
}
export default DeleteListModal;