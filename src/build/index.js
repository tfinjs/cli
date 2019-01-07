import defaultFsModule from 'fs';
import assert from 'assert';
import mkdirp from 'mkdirp';
import { Project } from '@tfinjs/api';
import createHistory from './createHistory';

const build = async (project, { outputFolderPath, fs = defaultFsModule }) => {
  assert(project instanceof Project, 'project must be an instance of Project');

  project.setFs(fs);

  project.setDist(outputFolderPath);

  mkdirp.sync(outputFolderPath, {
    fs,
  });

  /* build */
  const resources = project.getResources();

  await Promise.all(
    resources.map(async (resource) => {
      await resource.build();
    }),
  );

  /* create the history.json file */
  return createHistory(project, fs);
};

export default build;
