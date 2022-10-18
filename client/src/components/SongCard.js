import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { song, index } = props;
    const [deleteSongActive, setDeleteSongActive] = useState(false);
    const [editSongActive, setEditSongActive] = useState(false);
    const firstIndex = 0;
    let cardClass = "list-card unselected-list-card";
    function handleEditSong(event){
        event.stopPropagation();
        let val = !editSongActive;
        if (val){
            let id = event.target.id.substring("song-".length);
            id = id.replace('-card','')
            store.editSong(id);
        }
        setEditSongActive();
    } 
    function handleDeleteSong(event){
        event.stopPropagation();
        let val = !deleteSongActive;
        if (val){
            let id = event.target.id.substring("remove-song-".length);
            store.deleteSong(id);
        }
        setDeleteSongActive();
    }
    function handleDragEnter(event){
        event.preventDefault();
    }
    function handleDragLeave(event){
        event.preventDefault();
        // console.log("TARGET", target)
        // console.log("TARGETID", targetId)
    }
    function handleDragStart(event){
        console.log("DRAG start")
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        targetId = parseInt(targetId)
        console.log("targetID is ", targetId)
        store.setStartMoveSongActive(targetId);

    }
    function handleDragOver(event){
        event.preventDefault();
       // console.log("TARGET", target)
       // console.log("TARGETID", targetId)
    }
    function handleDrop(event){
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        targetId = parseInt(targetId)
        console.log("targetID is ", targetId)
        store.setEndMoveSongActive(targetId);
    }
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleEditSong}
            onClick={handleDeleteSong}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable = "true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;