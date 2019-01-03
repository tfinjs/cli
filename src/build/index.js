import assert from 'assert';
import { resolve } from 'path';
import { Project } from '@tfinjs/api';
import { hclPrettify } from '@tfinjs/api/utils';
import {
  mkdirpSync,
  ensureDirSync,
  writeFileSync,
  readFileSync,
} from 'fs-extra';

const build = async (project) => {
  assert(
    project instanceof Project,
    'project must be an instance of Project',
  );
  const resources = project.getResources();
  const newHistory = resources.reduce((map, resource) => {
    const uri = resource.getUri();
    const name = resource.versionedName();
    return {
      ...map,
      [name]: uri,
    };
  }, {});

  const historyFilePath = resolve(project.getDist(), 'history.json');

  let currentHistory = {};
  try {
    currentHistory = JSON.parse(readFileSync(historyFilePath));
  } catch (err) {
    /* do nothing */
  }

  writeFileSync(
    historyFilePath,
    JSON.stringify(
      {
        ...currentHistory,
        ...newHistory,
      },
      null,
      2,
    ),
  );

  await Promise.all(
    resources.map(async (resource) => {
      await resource.build();
    }),
  );
};

export default build;
