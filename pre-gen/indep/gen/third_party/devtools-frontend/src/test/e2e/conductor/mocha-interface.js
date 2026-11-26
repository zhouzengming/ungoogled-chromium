// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { createMochaInterface } from '../../conductor/mocha-interface.js';
import { StateProvider } from './state-provider.js';
const devtoolsTestInterface = createMochaInterface({
    description: 'DevTools test interface',
    stateProvider: StateProvider.instance,
});
// eslint-disable-next-line no-restricted-syntax
export default devtoolsTestInterface;
//# sourceMappingURL=mocha-interface.js.map