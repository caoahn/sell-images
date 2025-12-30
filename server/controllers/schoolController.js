const { School } = require('../models');

exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.findAll();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findByPk(id);
    if (!school) return res.status(404).json({ error: 'School not found' });
    res.json(school);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSchool = async (req, res) => {
  try {
    const { name, code, address, logo } = req.body;
    const school = await School.create({ name, code, address, logo });
    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
