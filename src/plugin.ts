import { Worker } from 'worker_threads';
import { WatchOptions } from './watch';

export interface EsbuildTypeCheckOptions {
	/**
	 * @description Working directory
	 */
	cwd?: string;

	/**
	 * @description The path and filename of the tsconfig.json
	 */
	tsconfig?: string;
}

export function esbuildWatchTypes(options: EsbuildTypeCheckOptions = {}) {
	return {
		name: 'esbuild-plugin-watch-types',
		setup(build) {
			const {
				cwd = process.cwd(),
				tsconfig = build.initialOptions?.tsconfig ?? './tsconfig.json',
			} = options;

			const workerData: WatchOptions = {
				cwd,
				tsconfig,
			};

			new Worker(__dirname + '/watch-worker.js', {
				workerData,
			});
		},
	};
}
