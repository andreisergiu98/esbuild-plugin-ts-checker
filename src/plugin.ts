import { Plugin } from 'esbuild';
import { Worker } from 'worker_threads';
import { TsOptions } from './ts';

export interface EsbuildTypeCheckOptions {
	/**
	 * @description Working directory
	 */
	cwd?: string;

	/**
	 * @description The path and filename of the tsconfig.json
	 */
	tsconfig?: string;

	/**
	 * @default "esbuildConfig.watch"
	 * @description Runs type checking in watch mode. This will only print the errors in the terminal and will not make the build fail.
	 */
	watch?: boolean;

	/**
	 * @default true
	 * @description Whether to enable type checking at build when not in watch mode.
	 */
	enableBuild?: boolean;

	/**
	 * @default true
	 * @description Whether to exit with exit code 1 if type checking returns errors at build.
	 */
	failOnError?: boolean;
}

export function esbuildTsChecker(options: EsbuildTypeCheckOptions = {}): Plugin {
	return {
		name: 'esbuild-plugin-ts-checker',
		async setup(build) {
			const {
				cwd = process.cwd(),
				tsconfig = build.initialOptions?.tsconfig ?? './tsconfig.json',
				watch = !!build.initialOptions?.watch,
				enableBuild = true,
				failOnError = true,
			} = options;

			const workerData: TsOptions = {
				cwd,
				tsconfig,
			};

			if (watch === false && enableBuild) {
				const worker = new Worker(__dirname + '/ts-worker-check.js', {
					workerData,
				});

				worker.on('message', (hasErrors: boolean) => {
					if (failOnError && hasErrors) {
						process.exit(1);
					}
				});
			}

			if (watch) {
				new Worker(__dirname + '/ts-worker-watch.js', {
					workerData,
				});
			}
		},
	};
}
