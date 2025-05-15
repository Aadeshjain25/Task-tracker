

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`/api/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <h3>Tasks</h3>
      <ul>
        {project.tasks.map((task) => (
          <li key={task._id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetails;
