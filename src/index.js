// The Cloudflare entry point. Everything the Worker actually does lives in
// worker.js, which takes the sign page's HTML as a parameter so it can be tested
// as ordinary JavaScript; this file is the import plus the wiring.

import SIGN_HTML from '../afk-sign_1.html';
import { handleRequest } from './worker.js';

export default {
  async fetch(request, env) {
    return handleRequest(request, env, SIGN_HTML);
  },
};
