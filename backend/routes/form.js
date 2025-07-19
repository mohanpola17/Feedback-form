const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const auth = require('../middleware/auth');
const formController = require('../controllers/formController');

// Rate limiting for public form submissions
const responseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 submissions per windowMs
  message: 'Too many responses from this IP, please try again later.'
});

// Admin: Create a new form (protected)
router.post('/', auth, [
  body('title').isString().notEmpty().withMessage('Title is required'),
  body('questions').isArray({ min: 3, max: 5 }).withMessage('3-5 questions required'),
  body('questions.*.text').isString().notEmpty().withMessage('Question text required'),
  body('questions.*.type').isIn(['text', 'multiple-choice']).withMessage('Invalid question type'),
  body('questions.*.options').custom((opts, { req, path }) => {
    const idx = parseInt(path.split('.')[1], 10);
    const type = req.body.questions[idx]?.type;
    if (type === 'multiple-choice') {
      if (!Array.isArray(opts) || opts.length < 2) return false;
      if (opts.some(opt => typeof opt !== 'string' || !opt.trim())) return false;
    }
    return true;
  }).withMessage('Multiple-choice questions need at least 2 non-empty options'),
], formController.createForm);

// Admin: Get all forms for the logged-in admin (protected, paginated)
router.get('/', auth, formController.getForms);

// Admin: Get responses for a form (protected, paginated)
router.get('/:formId/responses', auth, formController.getFormResponses);

// Admin: Get summary statistics for a form's responses
router.get('/:formId/summary', auth, formController.getFormSummary);
// Admin: Export responses as CSV
router.get('/:formId/export', auth, formController.exportFormResponsesCSV);

// Public: Get a form by public URL (no auth)
router.get('/public/:formId', formController.getFormById);

// Public: Submit a response to a form (no auth, rate limited, validated)
router.post('/public/:formId/response', responseLimiter, [
  body('answers').isArray().withMessage('Answers array required'),
], formController.submitResponse);

module.exports = router; 