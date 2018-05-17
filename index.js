const fs = require('fs');
const profiler = require('v8-profiler-node8');

const lodash = require('lodash');

const set = require('lodash.set');
const unset = require('lodash.unset');


const faker = require('faker')

const runIt = (setFn, unsetFn, runName) => {
  faker.seed(123);

  const snapshot1 = profiler.takeSnapshot();
  snapshot1.export(function(error, result) {
    fs.writeFileSync(`${runName}-1.heapsnapshot`, result);
    snapshot1.delete();
  });

  const obj = {};

  const numCycles = 10000;

  for (let i = 0; i < numCycles; i++) {
    let fillerObj = {
      id: i,
      ...faker.helpers.createCard()
    };

    setFn(obj, "testKey" + i, fillerObj);
  }
  for (let i = 0; i < numCycles; i++) {
    unsetFn(obj, "testKey" + i);
  }

  const snapshot2 = profiler.takeSnapshot();
  snapshot2.export(function(error, result) {
    fs.writeFileSync(`${runName}-2.heapsnapshot`, result);
    snapshot2.delete();
  });
}

runIt(lodash.set, lodash.unset, 'single-package');
runIt(set, unset, 'separate-packages');
