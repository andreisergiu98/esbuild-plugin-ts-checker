import ts, { Diagnostic } from 'typescript';
import chalk from 'chalk';
import { parseTsConfig } from './ts-utils';

const namespace = chalk.blue('[ types ]');

export interface TsOptions {
	cwd: string;
	tsconfig: string;
}

export interface TypeCheckOptions extends TsOptions {
	onFinished: (hasErrors: boolean) => void;
}

function createReportDiagnostic(system: ts.System) {
	const host = {
		getCanonicalFileName: (path) => path,
		getCurrentDirectory: () => system.getCurrentDirectory(),
		getNewLine: () => system.newLine,
	};
	const diagnostics: Diagnostic[] = new Array(1);
	return (diagnostic: Diagnostic) => {
		diagnostics[0] = diagnostic;
		console.log(namespace, ts.formatDiagnosticsWithColorAndContext(diagnostics, host));
		diagnostics[0] = undefined;
	};
}

function reportWatchStatusChanged(diagnostic: Diagnostic) {
	if (diagnostic.code === 6031) {
		console.log(namespace, 'Checking types...');
		return;
	}
	if (diagnostic.code === 6032) {
		console.log(namespace, 'File change detected. Checking types...');
		return;
	}
	console.log(namespace, diagnostic.messageText);
}

function getConfigPath(options: TsOptions) {
	const configPath = ts.findConfigFile(options.cwd, ts.sys.fileExists, options.tsconfig);
	if (!configPath) {
		throw new Error(
			`Could not find tsconfig file '${options.tsconfig}' in path '${options.cwd}'.`
		);
	}
	return configPath;
}

export function runTypeCheck(options: TypeCheckOptions) {
	const config = parseTsConfig(options.tsconfig, options.cwd);

	const program = ts.createProgram(config.fileNames, {
		...config.options,
		noEmit: true,
	});

	const host = ts.createCompilerHost(config.options);

	const emitResult = program.emit();
	const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

	let hasErrors = false;

	allDiagnostics.forEach((diagnostic) => {
		if (diagnostic.category === 1) {
			hasErrors = true;
		}
		console.log(namespace, ts.formatDiagnosticsWithColorAndContext([diagnostic], host));
	});

	options.onFinished(hasErrors);
}

export function runWatcher(options: TsOptions) {
	const configPath = getConfigPath(options);
	const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

	const host = ts.createWatchCompilerHost(
		configPath,
		{},
		ts.sys,
		createProgram,
		createReportDiagnostic(ts.sys),
		reportWatchStatusChanged
	);

	// `createWatchProgram` creates an initial program, watches files, and updates
	// the program over time.
	ts.createWatchProgram(host);
}
