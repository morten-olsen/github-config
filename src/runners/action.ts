import path from 'path';
import * as core from '@actions/core';
import * as github from '@actions/github';
import fs from 'fs-extra';
import yaml from 'yaml';
import { apply } from '../actions/apply';
import { get } from '../actions/get';
import { validate } from '../actions/validate';

const readConfigFromInput = () => {
  const config = core.getInput('config');
  if (config) {
    return JSON.parse(config);
  }
  return undefined;
};

const readConfigFromFile = () => {
  const configPath = core.getInput('config-path');
  if (configPath) {
    const config = fs.readFileSync(path.resolve(configPath), 'utf8');
    return yaml.parse(config);
  }
  return undefined;
};

const run = async () => {
  const githubToken = core.getInput('github-token');
  const config = readConfigFromInput() || readConfigFromFile() || {};
  const octo = github.getOctokit(githubToken);

  if (!validate(config)) {
    throw new Error('Invalid config');
  }

  const before = await get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    octo: octo as any,
  });

  await apply({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    octo: octo as any,
    config,
  });

  const after = await get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    octo: octo as any,
  });

  core.setOutput('before', JSON.stringify(before));
  core.setOutput('after', JSON.stringify(after));
};

run().catch((error) => {
  console.error(error);
  core.setFailed(error.message);
  process.exit(1);
});
