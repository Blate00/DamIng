// routes/archivesRoutes.js
const express = require('express');
const { getArchives } = require('../controllers/archivesController');

const router = express.Router();

router.get('/archives/:projectId', getArchives);

module.exports = router;