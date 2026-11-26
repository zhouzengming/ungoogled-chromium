// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { createMochaInterface } from '../conductor/mocha-interface.js';
import { AiEvalStateProvider } from './ai-eval-state-provider.js';
export const devtoolsAiEvalTestInterface = createMochaInterface({
    description: 'DevTools AI Eval test interface',
    stateProvider: AiEvalStateProvider.instance,
});
//# sourceMappingURL=mocha-interface.js.map