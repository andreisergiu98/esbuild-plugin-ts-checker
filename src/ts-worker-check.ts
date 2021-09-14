import { workerData, parentPort } from 'worker_threads';
import { runTypeCheck, TsOptions } from './ts';

const data = workerData as TsOptions;

function onFinished(hasErrors: boolean) {
	parentPort.postMessage(hasErrors);
}

runTypeCheck({
	...data,
	onFinished,
});
