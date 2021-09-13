import { workerData } from 'worker_threads';
import { watchMain, WatchOptions } from './watch';

const data = workerData as WatchOptions;
watchMain(data);
