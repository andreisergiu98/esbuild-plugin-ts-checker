# esbuild-plugin-watch-types

This is a plugin for [esbuild](https://esbuild.github.io/) that runs TypeScript on a separate process and prints type errors to the console.

This plugin is really only useful in watch mode and if you want to see type errors realtime in the terminal.

**Type errors WON'T make the build fail.**

## Usage

Install esbuild and the plugin

```shell
npm install -D esbuild
npm install -D esbuild-plugin-watch-types
```

Set up a build script

```typescript
import { build } from 'esbuild';
import { esbuildWatchTypes } from 'esbuild-plugin-watch-types';

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
	plugins: [esbuildWatchTypes()],
});
```

Run your builder.

### Screenshot

![Screenshot](./assets/screenshot.png 'Screenshot')

---

### Options

| Name       | Type     | Default value            | Description                                |
| ---------- | -------- | ------------------------ | ------------------------------------------ |
| `cwd`      | `string` | `process.cwd()`          | Working directory                          |
| `tsconfig` | `string` | `esbuildConfig.tsconfig` | The path and filename of the tsconfig.json |

---

### Caveats

Since we are running TypeScript on a separate process, it will use some of the system resources, but the performance of esbuild is not affected directly.
