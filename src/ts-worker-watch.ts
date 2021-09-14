import { workerData } from 'worker_threads';
import { runWatcher, TsOptions } from './ts';

const data = workerData as TsOptions;
runWatcher(data);
