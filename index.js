#!/usr/bin/env node
const fs = require('fs');
const util = require('util');
const path = require('path');
const program = require('commander');
const dotenv = require('dotenv');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const handleError = error => {
  console.error(error);
  process.exit(1);
}

program
  .version(require('./package.json').version)
  .usage('[options] <container name>')
  .arguments('<container name>')
  .option('-t, --template <template>', 'The template file, defaults to ./Dockerrun.aws.template.json')
  .option('-o, --output <output>', 'The output file, defaults to ./Dockerrun.aws.json')
  .option('-e, --env <env>', 'The dotenv file, defaults to ./.env')
  .action(async containerName => {

    if(!containerName) {
      return handleError('Must provide container name');
    }

    try {
      const template = program.template && path.resolve(program.template) || path.resolve('Dockerrun.aws.template.json');
      const output = program.output && path.resolve(program.output) || path.resolve('Dockerrun.aws.json');
      const env = program.env && path.resolve(program.env) || path.resolve('.env');

      console.log(`using template ${template}, output ${output}, env ${env}`)

      const config = dotenv.parse(await readFile(env, { encoding: 'utf8' }).catch(handleError));
      const dockerrun = require(template);

      const dockerrunEnvironment = dockerrun.containerDefinitions.find(container => container.name === containerName).environment;
      Object.keys(config).forEach(name => dockerrunEnvironment.push({ name, value: config[name] }));
      await writeFile(output, JSON.stringify(dockerrun, null, 2)).catch(handleError);
    } catch (e) {
      return handleError(e);
    }
  });

program.parse(process.argv);