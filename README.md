# esbuild-plugin-ts-checker

A plugin for [esbuild](https://esbuild.github.io/) that runs TypeScript in a worker thread.

The plugin works both when building and in watch mode. The only difference is that in watch mode type errors are only printed to the console, so the build won't fail.

## Usage

Install esbuild and the plugin

```shell
npm install -D esbuild
npm install -D esbuild-plugin-ts-checker
```

Set up a build script

```typescript
import { build } from 'esbuild';
import { esbuildTsChecker } from 'esbuild-plugin-ts-checker';

await build({
	entryPoints: [
		//
	],
	outdir: 'dist',
	platform: 'node',
	target: 'node14',
	bundle: true,
	sourcemap: 'external',
	watch: true,
	plugins: [esbuildTsChecker()],
});
```

Run your builder.

### Watch mode screenshot

![Screenshot](./assets/screenshot.png 'Screenshot')

---

### Options

| Name          | Type      | Default value            | Description                                                                |
| ------------- | --------- | ------------------------ | -------------------------------------------------------------------------- |
| `cwd`         | `string`  | `process.cwd()`          | Working directory                                                          |
| `tsconfig`    | `string`  | `esbuildConfig.tsconfig` | The path and filename of tsconfig.json                                     |
| `watch`       | `boolean` | `esbuildConfig.watch`    | Runs type checking in watch mode.                                          |
| `enableBuild` | `boolean` | `true`                   | Whether to enable type checking at build when not in watch mode.           |
| `failOnError` | `boolean` | `true`                   | Whether to exit with exit code 1 if type checking returns errors at build. |

---
