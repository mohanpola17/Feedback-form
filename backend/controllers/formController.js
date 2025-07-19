const Form = require('../models/Form');
const Response = require('../models/Response');
const { Parser } = require('json2csv');
const { validationResult } = require('express-validator');

// Admin: Create a new form
exports.createForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, questions } = req.body;
    const form = new Form({
      title,
      questions,
      owner: req.user.id,
    });
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

// Admin: Get all forms for the logged-in admin (paginated)
exports.getForms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [forms, total] = await Promise.all([
      Form.find({ owner: req.user.id }).skip(skip).limit(limit).lean(),
      Form.countDocuments({ owner: req.user.id })
    ]);
    res.json({ forms, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

// Public: Get a form by public URL
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId).lean();
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

// Public: Submit a response to a form
exports.submitResponse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const form = await Form.findById(req.params.formId).lean();
    if (!form) return res.status(404).json({ error: 'Form not found' });
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length !== form.questions.length) {
      return res.status(400).json({ error: 'Answers required for all questions' });
    }
    // Validate each answer type
    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      const ans = answers[i];
      if (q.type === 'multiple-choice') {
        if (!q.options.includes(ans)) {
          return res.status(400).json({ error: `Invalid answer for question ${i + 1}` });
        }
      } else if (q.type === 'text') {
        if (typeof ans !== 'string' || !ans.trim()) {
          return res.status(400).json({ error: `Text answer required for question ${i + 1}` });
        }
      }
    }
    const response = new Response({
      form: form._id,
      answers,
    });
    await response.save();
    res.status(201).json({ message: 'Response submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

// Admin: Get responses for a form (paginated)
exports.getFormResponses = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, owner: req.user.id }).lean();
    if (!form) return res.status(404).json({ error: 'Form not found or unauthorized' });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [responses, total] = await Promise.all([
      Response.find({ form: form._id }).skip(skip).limit(limit).lean(),
      Response.countDocuments({ form: form._id })
    ]);
    res.json({ responses, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

// Admin: Get summary statistics for a form's responses
exports.getFormSummary = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, owner: req.user.id }).lean();
    if (!form) return res.status(404).json({ error: 'Form not found or unauthorized' });
    const responses = await Response.find({ form: form._id }).lean();
    const summary = form.questions.map((q, idx) => {
      if (q.type === 'text') {
        return {
          question: q.text,
          type: q.type,
          responses: responses.map(r => r.answers[idx])
        };
      } else if (q.type === 'multiple-choice') {
        const counts = {};
        q.options.forEach(opt => { counts[opt] = 0; });
        responses.forEach(r => {
          const answer = r.answers[idx];
          if (counts.hasOwnProperty(answer)) counts[answer]++;
        });
        return {
          question: q.text,
          type: q.type,
          counts
        };
      }
    });
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

// Admin: Export responses as CSV
exports.exportFormResponsesCSV = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, owner: req.user.id }).lean();
    if (!form) return res.status(404).json({ error: 'Form not found or unauthorized' });
    const responses = await Response.find({ form: form._id }).lean();
    const fields = form.questions.map((q, idx) => `Q${idx + 1}: ${q.text}`);
    const data = responses.map(r => {
      const row = {};
      r.answers.forEach((ans, idx) => {
        row[fields[idx]] = ans;
      });
      return row;
    });
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${form.title.replace(/\s+/g, '_')}_responses.csv`);
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
}; 