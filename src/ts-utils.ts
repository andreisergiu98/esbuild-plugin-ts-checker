import { dirname } from 'path';
import {
	sys,
	findConfigFile,
	ParsedCommandLine,
	parseConfigFileTextToJson,
	parseJsonConfigFileContent,
} from 'typescript';
import { inspect } from 'util';

export function parseTsConfig(tsconfig: string, cwd = process.cwd()): ParsedCommandLine {
	const fileName = findConfigFile(cwd, sys.fileExists, tsconfig);

	// if the value was provided, but no file, fail hard
	if (tsconfig !== undefined && !fileName) {
		throw new Error(`failed to open '${fileName}'`);
	}

	let baseDir = cwd;
	let loadedConfig = {};

	if (fileName) {
		const text = sys.readFile(fileName);

		if (text == null) {
			throw new Error(`failed to read '${fileName}'`);
		}

		const result = parseConfigFileTextToJson(fileName, text);

		if (result.error != null) {
			printDiagnostics(result.error);
			throw new Error(`failed to parse '${fileName}'`);
		}

		baseDir = dirname(fileName);
		loadedConfig = result.config;
	}

	const parsedTsConfig = parseJsonConfigFileContent(loadedConfig, sys, baseDir);

	if (parsedTsConfig.errors[0]) {
		printDiagnostics(parsedTsConfig.errors);
	}

	if (parsedTsConfig.options.sourcemap) {
		parsedTsConfig.options.sourcemap = false;
		parsedTsConfig.options.inlineSources = true;
		parsedTsConfig.options.inlineSourceMap = true;
	}

	return parsedTsConfig;
}

export function printDiagnostics(...args) {
	console.log(inspect(args, false, 10, true));
}
