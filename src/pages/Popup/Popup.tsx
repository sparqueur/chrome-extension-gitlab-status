import React, { useEffect, useState } from 'react';
import './Popup.scss';
import { GitlabConfiguration } from '../../model';
import PopupHeader from "./components/PopupHeader";
import ProjectList from "./components/ProjectList";

function Popup() {

  const [loading, setLoading] = useState<boolean>(true);

  const [gitlabConfiguration, setGitlabConfiugration] = useState<GitlabConfiguration>(
    {
      projects: []
    });


  useEffect(() => {
    function handleGetGitlabConfiguration(gitlabConfiguration: GitlabConfiguration) {
      if (!!gitlabConfiguration) {
        setGitlabConfiugration(gitlabConfiguration);
      }
      setLoading(false);
    }

    chrome.storage.local.get(['status'], function (result: any) {
      handleGetGitlabConfiguration(result.status);
    });
  }, []);


  const openConfiguration = () => {
    chrome.runtime.openOptionsPage(function () {
      window.close();
    });
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div className="App">
      <PopupHeader />
      <ProjectList configuration={gitlabConfiguration} />

      <hr className="my-12" />

      <button type="button" className="btn btn-primary" onClick={openConfiguration}>Configure</button>

    </div>
  );
}

export default Popup;
