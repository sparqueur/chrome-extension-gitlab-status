import React from "react";
import {GitlabConfiguration, GitlabProject} from "../../../model";
import ProjectItem from "./ProjectItem";

const ProjectList = (props: { configuration: GitlabConfiguration }) => {


  if (!props.configuration.projects || props.configuration.projects.length === 0) {
    return <div>No projects configured</div>
  }
  console.log(props.configuration)
  return <div className='mb-3'>
    <div className="card mb-3">
    </div>
    <div className="card">

      <ul className="list-group list-group-flush">
        {props.configuration.projects.map(function (gitlabProject: GitlabProject) {
          return <ProjectItem project={gitlabProject} host={props.configuration.host as string} key={gitlabProject.project + gitlabProject.branch}/>
        })}
      </ul>
    </div>
  </div>
}

export default ProjectList;