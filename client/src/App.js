import './App.css';
import { React, useContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Banner, ListSelector, PlaylistCards, Statusbar, DeleteListModal, DeleteSongModal, EditSongModal} from './components'
import {GlobalStoreContext} from './store';
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
    const {store} = useContext(GlobalStoreContext);
    function handleKeyDown(event){
        let charCode = String.fromCharCode(event.which).toLowerCase();
        console.log("HERE", charCode)
        if(event.ctrlKey && charCode === 'z'){
            store.undo()
            console.log("UNDOING")
        }
        if(event.ctrlKey && charCode === 'y'){
            store.redo()
            console.log("redo")
        }
    }
    return (
        <Router>
            <div tabIndex = {0} onKeyDown={handleKeyDown}>
                <Banner />
                <Switch>
                    <Route path="/" exact component={ListSelector} />
                    <Route path="/playlist/:id" exact component={PlaylistCards} />

                </Switch>
                <Statusbar />
                <DeleteListModal />
                <DeleteSongModal />
                <EditSongModal />
            </div>
           
            
        </Router>
    )
}

export default App