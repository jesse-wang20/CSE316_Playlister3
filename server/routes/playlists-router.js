/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()

router.post('/playlist/:id', PlaylistController.updatePlaylistById)
router.post('/playlist', PlaylistController.createPlaylist)
router.delete('/playlist/:id', PlaylistController.deletePlaylistById)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlists', PlaylistController.getPlaylists)
router.get('/playlistpairs', PlaylistController.getPlaylistPairs)

module.exports = router