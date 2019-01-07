import defaultFsModule from 'fs';
import { resolve } from 'path';
import getHistoryDiff from '../getHistoryDiff';

const createHistory = (project, fs = defaultFsModule) => {
  const resources = project.getResources();

  const newHistory = resources.reduce((map, resource) => {
    const uri = resource.getUri();
    const name = resource.versionedName();
    const contentHash = resource.getContentHash();
    return {
      ...map,
      [name]: {
        uri,
        contentHash,
      },
    };
  }, {});

  const historyFilePath = resolve(project.getDist(), 'history.json');
  const resourcesReferenceFilePath = resolve(
    project.getDist(),
    'resourcesReference.json',
  );

  let currentHistory = {};
  try {
    currentHistory = JSON.parse(fs.readFileSync(historyFilePath));
  } catch (err) {
    /* do nothing */
  }

  const diff = getHistoryDiff(currentHistory, newHistory);

  fs.writeFileSync(historyFilePath, JSON.stringify(newHistory, null, 2));
  fs.writeFileSync(
    resourcesReferenceFilePath,
    JSON.stringify(
      {
        ...currentHistory,
        ...newHistory,
      },
      null,
      2,
    ),
  );
  return diff;
};

export default createHistory;
