import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { song, index } = props;
    const [deleteSongActive, setDeleteSongActive] = useState(false);
    const [editSongActive, setEditSongActive] = useState(false);
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
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleEditSong}
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
                onClick={handleDeleteSong}
            />
        </div>
    );
}

export default SongCard;