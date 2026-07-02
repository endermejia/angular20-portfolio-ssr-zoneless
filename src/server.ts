import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

// Lazily create the Angular App Engine after ensuring manifests are loaded.
let angularAppEngine: AngularAppEngine | undefined;

async function getAngularAppEngine(): Promise<AngularAppEngine> {
  if (!angularAppEngine) {
    // These files are generated at build time next to server.mjs
    try {
      // @ts-expect-error: These files are generated at build time next to server.mjs
      await import('./angular-app-engine-manifest.mjs');
      // @ts-expect-error: These files are generated at build time next to server.mjs
      await import('./angular-app-manifest.mjs');
    } catch {
      // Ignore if not present in certain environments (e.g., dev server)
    }
    angularAppEngine = new AngularAppEngine();
  }
  return angularAppEngine;
}

export async function appEngineHandler(request: Request): Promise<Response> {
  const engine = await getAngularAppEngine();
  const result = await engine.handle(request);
  return result || new Response('Not found', { status: 404 });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(appEngineHandler);
