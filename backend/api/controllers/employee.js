module.exports = {
  getEmployees(req, res) {
    res.status(200);
    res.json({ employees: 'employees' });
  },
};
