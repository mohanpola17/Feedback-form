const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const formController = require('../controllers/formController');

// Admin: Create a new form (protected)
router.post('/', auth, formController.createForm);

// Admin: Get all forms for the logged-in admin (protected)
router.get('/', auth, formController.getForms);

// Admin: Get responses for a form (protected)
router.get('/:formId/responses', auth, formController.getFormResponses);

// Admin: Get summary statistics for a form's responses
router.get('/:formId/summary', auth, formController.getFormSummary);
// Admin: Export responses as CSV
router.get('/:formId/export', auth, formController.exportFormResponsesCSV);

// Public: Get a form by public URL (no auth)
router.get('/public/:formId', formController.getFormById);

// Public: Submit a response to a form (no auth)
router.post('/public/:formId/response', formController.submitResponse);

module.exports = router; 