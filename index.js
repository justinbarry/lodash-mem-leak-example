const fs = require('fs');
const profiler = require('v8-profiler-node8');

const lodash = require('lodash');

const set = require('lodash.set');
const unset = require('lodash.unset');

const runIt = (setFn, unsetFn, runName) => {
  const snapshot1 = profiler.takeSnapshot();
  snapshot1.export(function(error, result) {
    fs.writeFileSync(`${runName}-1.heapsnapshot`, result);
    snapshot1.delete();
  });

  const obj = {};
  for (let i = 0; i < 1000000; i++) {
    setFn(obj, "testKey.ob" + i, {});
    unsetFn(obj, "testKey.ob" + i);
  }

  const snapshot2 = profiler.takeSnapshot();
  snapshot2.export(function(error, result) {
    fs.writeFileSync(`${runName}-2.heapsnapshot`, result);
    snapshot2.delete();
  });
}

runIt(lodash.set, lodash.unset, 'single-package');
runIt(set, unset, 'separate-packages');
