import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
// OUR TRANSACTIONS
import MoveSong_Transaction from '../transactions/MoveSong_Transaction.js';
import AddSong_Transaction from '../transactions/AddSong_Transaction.js';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction.js';
import EditSong_Transaction from '../transactions/EditSong_Transaction.js';

import api from '../api'
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION",
    MARK_SONG_FOR_EDIT: "MARK_SONG_FOR_EDIT",
    MOVE_SONG_START: "MOVE_SONG_START",
    MOVE_SONG_END: "MOVE_SONG_END",
    CLEAR: "CLEAR"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listToDelete: null,
        recentPlaylist: null,
        songToDelete: null,
        recentSong: null,
        modalOpen: null,
        hasTransUndo: null,
        hasTransRedo: null,
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload, listToDelete, recentPlaylist } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listToDelete: listToDelete,
                    recentPlaylist: recentPlaylist,
                    modalOpen: true,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    modalOpen: false,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songtoDelete: listToDelete,
                    recentSong: recentPlaylist,
                    modalOpen: true,
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_EDIT: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songtoEdit: listToDelete,
                    recentSong: recentPlaylist,
                    modalOpen: true,
                });
            }
            case GlobalStoreActionType.MOVE_SONG_START: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    firstIndex: payload,
                    modalOpen: false,
                });
            }
            case GlobalStoreActionType.MOVE_SONG_END: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    secondIndex: payload,
                    modalOpen: false,
                });
            }
            case GlobalStoreActionType.CLEAR: {
                console.log("IN HERE,",tps.hasTransactionToUndo())
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    hasTransUndo: tps.hasTransactionToUndo(),
                    hasTransRedo: tps.hasTransactionToRedo(),
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                store.history.push("/playlist/" + playlist._id);
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }
    store.deleteList = function(){
        const id = store.listToDelete;
        async function asyncDeleteList(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                console.log("DELETED SUCCESSFULLY")
                store.loadIdNamePairs();
                store.history.push("/");
            }
        }
        asyncDeleteList(id).catch(err => console.log(err));
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: null,
            listToDelete: null,
       })
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.createNewList = function() {
        async function asyncCreateNewList() {
            let bodyObj = {
                name: "Untitled",
                songs: [], 
            }
            let response = await api.createPlaylist(bodyObj);
            let playlist = response.data.playlist;
            if (response.data.success){
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist,
                });
                store.history.push("/playlist/" + playlist._id);
            }
        }
        asyncCreateNewList();   
        // async function asyncCreateNewList(){
        //     console.log("HERE");
        //     let response = api.createPlaylist();
        //     console.log("Done");
        // }
    }
    store.MoveSongTransaction = function(start, end){
        console.log("STart", start)
        console.log("END", end)

        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    store.MoveSong = function(start, end) {
        let list = store.currentList;
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        let currentID = store.currentList._id;
        async function asyncAddSong() {
            let response = await api.updatePlaylistById(currentID,store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                storeReducer({
                    type: GlobalStoreActionType.CLEAR,
                });
                console.log("CURRENTL LIST AFTER ADDING", store.currentList)
                store.history.push("/playlist/" + store.currentList._id);
            }
        }
        asyncAddSong();
        
    }
    store.DeleteSongTransaction = function(index, song) {
        let transaction = new DeleteSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.AddSong_Transaction = () => {
        console.log("from adding button")
        let song = {
            title: "Untitled",
            artist: "Unknown",
            youTubeId: "dQw4w9WgXcQ",
        }
        let index = store.currentList.songs.length
        
        let transaction = new AddSong_Transaction(store, index, song );
        tps.addTransaction(transaction);
    }
    store.addSong = function(song,index){
        if(!song && !index){
            console.log("from adding button")
            song = {
                title: "Untitled",
                artist: "Unknown",
                youTubeId: "dQw4w9WgXcQ",
            }
            index = store.currentList.songs.length
        }
        store.currentList.songs.splice(index,0,song)
        let currentID = store.currentList._id
        async function asyncAddSong() {
            let response = await api.updatePlaylistById(currentID,store.currentList);
            if (response.data.success) {
                console.log("SUCCESS IN ADDING")
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                storeReducer({
                    type: GlobalStoreActionType.CLEAR,
                    payload: store.currentList
                });
                console.log("CURRENTL LIST AFTER ADDING", store.currentList)
                store.history.push("/playlist/" + store.currentList._id);
            }
        }
        asyncAddSong();
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
        storeReducer({
            type: GlobalStoreActionType.CLEAR,
            payload: store.currentList
        });
    }
    store.redo = function () {
        tps.doTransaction();
        storeReducer({
            type: GlobalStoreActionType.CLEAR,
            payload: store.currentList
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }
    store.setStartMoveSongActive = function (index) {
        storeReducer({
            type: GlobalStoreActionType.MOVE_SONG_START,
            payload: index
        });
    }
    store.setEndMoveSongActive = function (index) {
        storeReducer({
            type: GlobalStoreActionType.MOVE_SONG_END,
            payload: index
        });
        console.log(store.firstIndex)
        store.MoveSongTransaction(store.firstIndex,index)
    }
    
    store.setdeleteNameActive = function (deletedID) {
        async function asyncCreateNewList() {
            let response = await api.getPlaylistById(deletedID);
                if (response.data.success) {
                    let playlist = response.data.playlist;

                    console.log("Playlist is", playlist);
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                            payload: null,
                            listToDelete: deletedID,
                            recentPlaylist: playlist,
                    })
                    console.log("STORE HAS", store.recentPlaylist)
                    }
                }
            }
        asyncCreateNewList();
    }
    store.deleteSong = function(songID) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
            payload: null,
            listToDelete: songID,
            recentPlaylist: store.currentList.songs[songID],
        })
    }
    store.editSong = function(songID){
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_EDIT,
            payload: null,
            listToDelete: songID,
            recentPlaylist: store.currentList.songs[songID],
        })
    }
    store.editSongTransaction = function(song){
        let index = store.songToDelete;
        let transaction = new EditSong_Transaction(store,index, song, store.currentList.songs[index]);
        tps.addTransaction(transaction);
    }
    store.editSongNow = function(song, index){
        if(!song){
            song = store.recentSong;
        }
        if(!index){
            index = store.songtoEdit;
        }
        store.currentList.songs[index] = song;
        let currentID = store.currentList._id
        console.log("EDITING SONG", song, "s ", index)
        async function asyncEditSong() {
            let response = await api.updatePlaylistById(currentID,store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                storeReducer({
                    type: GlobalStoreActionType.CLEAR,
                    payload: store.currentList
                });
                store.history.push("/playlist/" + store.currentList._id);
            }
        }
        asyncEditSong()
    }
    store.deleteSongFull = function(index, song){
        if(!song && !index){
            song = store.recentSong;
            index = store.songtoDelete;
        }
        store.currentList.songs.splice(index,1)
        let currentID = store.currentList._id
        async function asyncAddSong() {
            let response = await api.updatePlaylistById(currentID,store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                storeReducer({
                    type: GlobalStoreActionType.CLEAR,
                });
                store.history.push("/playlist/" + store.currentList._id);
            }
        }
        asyncAddSong();
    }

    store.disableEditSong = function(){
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList,
            songtoDelete: null,
        })
        let modal = document.getElementById("edit-song-modal");
        if(modal){
            modal.classList.remove("is-visible");
        }
    }

    store.disableDeleteSong = function(){
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList,
            songtoDelete: null,
        })
        let modal = document.getElementById("delete-song-modal");
        if(modal){
            modal.classList.remove("is-visible");
        }
    }
    store.disableDelete = function(){
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList,
            songtoDelete: null,
        })
       let modal = document.getElementById("delete-list-modal");
        if(modal){
            modal.classList.remove("is-visible");
        }
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}