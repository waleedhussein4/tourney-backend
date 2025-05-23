const express = require('express');
const { createTournament, getTournamentById, getAllTournaments, updateTournament, deleteTournament, getTournamentDisplayData, handleApplicationSubmission, handleJoinAsSolo, handleJoinAsTeam, editTitle, editDescription, editRules, editContactInfo, editStartDate, editEndDate, getManageTournamentDisplayData, getTrendingTournaments, getTournamentCategories, updateScores, acceptApplication, rejectApplication, postUpdate, editSoloParticipants, editTeamParticipants, editMatches, startTournament, endTournament, getMyTournaments, getPaginatedTournaments, getFilteredTournaments, getTournamentCategoriesWithImages, depositIntoTournamentBank, shuffleBrackets } = require('../controller/tourneyController');
const router = express();
const { auth, getAuth } = require("../middleware/requireAuth")


//tournaments
router.get('/', getAllTournaments);


// get paginated tournaments
router.get('/getPaginatedTournaments/:page', getPaginatedTournaments);


router.post('/getFilteredTournaments/:page', getFilteredTournaments);


//new tourney
router.post('/', auth, createTournament);


router.get('/tournament', getAuth, getTournamentDisplayData)


router.get('/tournament/manage', auth, getManageTournamentDisplayData)


router.post('/tournament/submitApplication', auth, handleApplicationSubmission)


router.post('/tournament/joinAsSolo', auth, handleJoinAsSolo)


router.post('/tournament/joinAsTeam', auth, handleJoinAsTeam)


router.post('/tournament/editTitle', auth, editTitle)


router.post('/tournament/editDescription', auth, editDescription)


router.post('/tournament/editRules', auth, editRules);


router.post('/tournament/editContactInfo', auth, editContactInfo);


router.post('/tournament/editStartDate', auth, editStartDate)


router.post('/tournament/editEndDate', auth, editEndDate)


router.get('/getTrendingTournaments', getTrendingTournaments)


router.get('/getMyTournaments', auth, getMyTournaments)


router.get('/getTournamentCategories', getTournamentCategories)


router.get('/getTournamentCategoriesWithImages', getTournamentCategoriesWithImages)


router.post('/tournament/acceptApplication', auth, acceptApplication)


router.post('/tournament/rejectApplication', auth, rejectApplication)


router.post('/tournament/postUpdate', auth, postUpdate)


router.post('/updateScores', auth, updateScores)


router.post('/editSoloParticipants', auth, editSoloParticipants)


router.post('/editTeamParticipants', auth, editTeamParticipants)


router.post('/editMatches', auth, editMatches)


router.post('/startTournament', auth, startTournament)


router.post('/endTournament', auth, endTournament)


router.post('/depositIntoTournamentBank', auth, depositIntoTournamentBank)


router.post('/shuffleBrackets', auth, shuffleBrackets)


//delete
router.delete('/', deleteTournament);


//update
router.patch('/', updateTournament);


module.exports = router;
