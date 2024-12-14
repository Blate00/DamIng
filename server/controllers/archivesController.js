const archivesModel = require('../models/db/archivesModel');


const getArchives = async (req, res) => {
  const { projectId } = req.params;

  try {
    const documents = await archivesModel.getDocumentsByProjectId(projectId);
    const project = await archivesModel.getProjectNameById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      documents,
      projectName: project.project_name,
    });
  } catch (error) {
    console.error('Error fetching archives:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  getArchives,
};