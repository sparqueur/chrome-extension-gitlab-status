import React from "react";
import {GitlabProject} from "../../../model";

const ProjectItem = (props: { project: GitlabProject, host: string }) => {


  function calculateStatus() {
    return <span className="badge rounded-pill">
                {
                  {
                    'none': <span className='text-muted'><i
                        className="bi bi-question-circle"></i></span>,
                    'disconnected': <span className='text-warning'><i
                        className="bi bi-wifi-off"></i></span>,
                    'success': <span className='text-success'><i className="bi bi-check-circle"></i></span>,
                    'error': <span className='text-danger'><i
                        className="bi bi-exclamation-circle-fill"></i></span>
                  }[props.project.status]
                }
              </span>;
  }

  return <li className="list-group-item d-flex justify-content-between align-items-center"><a
      href={`${props.host}/${props.project.project}/-/pipelines?page=1&scope=branches&ref=${props.project.branch}`}
      target="_blank">{props.project.project} ({props.project.branch})</a>
    {calculateStatus()}</li>
}

export default ProjectItem;