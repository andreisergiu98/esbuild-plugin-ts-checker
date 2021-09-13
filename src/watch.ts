import ts from 'typescript';
import chalk from 'chalk';

const namespace = chalk.blue('[ types ]');

export interface WatchOptions {
	cwd: string;
	tsconfig: string;
}

export function watchMain(options: WatchOptions) {
	const configPath = ts.findConfigFile(options.cwd, ts.sys.fileExists, options.tsconfig);
	if (!configPath) {
		throw new Error(
			`Could not find tsconfig file '${options.tsconfig}' in path '${options.cwd}'.`
		);
	}

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

function createReportDiagnostic(system: ts.System) {
	const host = {
		getCanonicalFileName: (path) => path,
		getCurrentDirectory: () => system.getCurrentDirectory(),
		getNewLine: () => system.newLine,
	};
	const diagnostics = new Array(1);
	return (diagnostic) => {
		diagnostics[0] = diagnostic;
		console.log(namespace, ts.formatDiagnosticsWithColorAndContext(diagnostics, host));
		diagnostics[0] = undefined;
	};
}

function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
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
