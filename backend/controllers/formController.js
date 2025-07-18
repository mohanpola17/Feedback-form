const Form = require('../models/Form');
const Response = require('../models/Response');
const { Parser } = require('json2csv');

// Admin: Create a new form
exports.createForm = async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!title || !questions || !Array.isArray(questions) || questions.length < 3) {
      return res.status(400).json({ message: 'Title and 3+ questions required' });
    }
    const form = new Form({
      title,
      questions,
      owner: req.user.id,
    });
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: Get all forms for the logged-in admin
exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find({ owner: req.user.id });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Public: Get a form by public URL
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Public: Submit a response to a form
exports.submitResponse = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length !== form.questions.length) {
      return res.status(400).json({ message: 'Answers required for all questions' });
    }
    const response = new Response({
      form: form._id,
      answers,
    });
    await response.save();
    res.status(201).json({ message: 'Response submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: Get responses for a form
exports.getFormResponses = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, owner: req.user.id });
    if (!form) return res.status(404).json({ message: 'Form not found or unauthorized' });
    const responses = await Response.find({ form: form._id });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: Get summary statistics for a form's responses
exports.getFormSummary = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, owner: req.user.id });
    if (!form) return res.status(404).json({ message: 'Form not found or unauthorized' });
    const responses = await Response.find({ form: form._id });
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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: Export responses as CSV
exports.exportFormResponsesCSV = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.formId, owner: req.user.id });
    if (!form) return res.status(404).json({ message: 'Form not found or unauthorized' });
    const responses = await Response.find({ form: form._id });
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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 