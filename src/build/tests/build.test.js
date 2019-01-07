/* eslint-env jest */
import MemoryFileSystem from 'memory-fs';
import project, { table } from './sampleProject';
import build from '../index';

const fs = new MemoryFileSystem();

test('project', async () => {
  const diff1 = await build(project, {
    outputFolderPath: '/',
    fs,
  });
  const folders = Object.keys(fs.data);
  expect(folders).toEqual([
    'tijpetshopmjubxt',
    'tijpetshop19qdr42',
    'history.json',
    'resourcesReference.json',
  ]);
  expect(diff1).toEqual({
    add: ['tijpetshopmjubxt', 'tijpetshop19qdr42'],
    remove: [],
    update: [],
  });

  table.updateBody('read_capacity', 60);
  const diff2 = await build(project, {
    outputFolderPath: '/',
    fs,
  });
  expect(diff2).toEqual({ add: [], remove: [], update: ['tijpetshop19qdr42'] });
});
