'use strict';

import { Gitlab } from '@gitbeaker/browser';
import { GitlabConfiguration, GitlabProject } from '../../model';


chrome.runtime.onInstalled.addListener(() => {
    console.log("onInstalled...");

    // create alarm after extension is installed / upgraded
    chrome.alarms.create("refreshGitlabStatus", { periodInMinutes: 1 });
    loadConfThenRefreshGitlabStatus();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    loadConfThenRefreshGitlabStatus();
});

function loadConfThenRefreshGitlabStatus() {
    chrome.storage.local.get(['configuration'], function (result: any) {
        if (!result) {
            console.debug('no storage');
            return;
        }
        refreshGitlabStatus(<GitlabConfiguration>result.configuration);
    });
}

async function refreshGitlabStatus(configuration: GitlabConfiguration) {

    if (!configuration) {
        console.log('no configuration');
        return;
    }
    if (!configuration.host || !configuration.token || !configuration.projects) {
        console.log('not configured');
        return;
    }

    const api = new Gitlab({
        host: configuration.host,
        token: configuration.token,
    });

    for (let gitlabProject of configuration.projects) {
        console.log(`Checking projet [${gitlabProject.project}?ref=${gitlabProject.branch}]`);

        try {
            let pipelines = await api.Pipelines.all(gitlabProject.project, { maxPages: 1, perPage: 10, "ref": gitlabProject.branch });
            console.debug(pipelines.length);
            let lastPipeline = pipelines.find((pipeline) => {
                console.debug("status=" + pipeline.status);
                return pipeline.status === "success" || pipeline.status === "failed";
            });
            console.log(`[${gitlabProject.project}?ref=${gitlabProject.branch}] => ${lastPipeline?.status}`)
            switch (lastPipeline?.status) {
                case "failed":
                    gitlabProject.status = "error";
                    break;
                case "success":
                    gitlabProject.status = "success";
                    break;
                default:
                    gitlabProject.status = "disconnected";
                    break;
            }
        } catch (e) {
            console.error(e);
            gitlabProject.status = "disconnected";
        }

    }

    let globalStatus: string;
    if (configuration.projects.findIndex((gitlabProject) => gitlabProject.status === "error") > -1) {
        globalStatus = "error";
    } else if (configuration.projects.findIndex((gitlabProject) => gitlabProject.status === "disconnected") > -1) {
        globalStatus = "disconnected";
    } else {
        globalStatus = "success";
    }
    configuration.globalStatus = <any>globalStatus;

    chrome.action.setIcon(
        {
            path: {
                "16": `/icons/${globalStatus}/icon_16.png`,
                "32": `/icons/${globalStatus}/icon_32.png`,
                "48": `/icons/${globalStatus}/icon_48.png`,
                "128": `/icons/${globalStatus}/icon_128.png`
            }
        }
    )

    chrome.storage.local.get(['status'], function (result: any) {
        notifiyOnStatusChange(globalStatus, result?.status?.globalStatus);

        chrome.storage.local.set({ status: configuration }, function () {
            console.debug("Status saved");
        });
    });
   
}

function notifiyOnStatusChange(newStatus: string, previousStatus: string) {

    console.error(`newStatus=${newStatus} - previousStatus=${previousStatus}`)

    if (newStatus === "disconnected" && (previousStatus === "success" || previousStatus === "none" || previousStatus === undefined)) {
        chrome.notifications.create('NOTFICATION_ID', {
            type: 'basic',
            iconUrl: chrome.runtime.getURL("/icons/disconnected/icon_48.png"),
            title: 'Disconnected pipelines',
            message: 'Some pipelines status could not be retrieved',
            priority: 2
        })
    }

    if (newStatus === "error" && previousStatus !== "error") {
        chrome.notifications.create('NOTFICATION_ID', {
            type: 'basic',
            iconUrl: chrome.runtime.getURL("/icons/error/icon_48.png"),
            title: 'Pipeline failure',
            message: 'Some pipelines are in error',
            priority: 2
        })
    }

}