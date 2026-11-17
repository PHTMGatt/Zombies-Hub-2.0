/*
 * Node module hooks so build-time checks can import the app's real data files: an image, audio or video import
 * becomes its absolute file path (a string, as Vite gives a URL), and a relative import without an extension
 * tries .js. Registered by scripts/data-check.mjs (module.registerHooks; synchronous); never used by the app.
 */
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ASSET = /\.(webp|png|jpe?g|gif|avif|svg|mp3|mp4|webm)(\?url)?$/i;

export function resolve(specifier, context, next) {
  if (ASSET.test(specifier) && context.parentURL) {
    const url = new URL(specifier.replace(/\?url$/, ''), context.parentURL);
    return { url: `${url.href}?zh-asset`, shortCircuit: true };
  }
  if (/^\.\.?\//.test(specifier) && !/\.[cm]?jsx?$|\.json$/.test(specifier) && context.parentURL) {
    const url = new URL(`${specifier}.js`, context.parentURL);
    if (existsSync(fileURLToPath(url))) return { url: url.href, shortCircuit: true };
  }
  return next(specifier, context);
}

export function load(url, context, next) {
  if (url.endsWith('?zh-asset')) {
    const file = fileURLToPath(url.replace(/\?zh-asset$/, ''));
    return { format: 'module', source: `export default ${JSON.stringify(file)};`, shortCircuit: true };
  }
  return next(url, context);
}
