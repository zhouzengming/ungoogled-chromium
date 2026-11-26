// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { PuppeteerDevToolsConnection } from '../../front_end/core/protocol_client/PuppeteerDevToolsConnection.js';
let registeredExtensions = false;
export async function createTargetUniverse(session, options) {
    // DevTools modules contain top-level await in their ES module graphs.
    // Because Node executes test scripts as CommonJS, top-level static imports
    // of these modules fail at startup with ERR_REQUIRE_ASYNC_MODULE.
    // We use dynamic `import()` at runtime to load the ESM graph asynchronously.
    const [Common, Host, SDKModule, RootModule, Foundation] = await Promise.all([
        import('../../front_end/core/common/common.js'),
        import('../../front_end/core/host/host.js'),
        import('../../front_end/core/sdk/sdk.js'),
        import('../../front_end/core/root/root.js'),
        import('../../front_end/foundation/foundation.js'),
    ]);
    if (!registeredExtensions) {
        registeredExtensions = true;
        // Register experiments expected by models
        RootModule.Runtime.experiments.register({
            name: RootModule.ExperimentNames.ExperimentName.INSTRUMENTATION_BREAKPOINTS,
            title: 'Instrumentation breakpoints',
            aboutFlag: 'devtools-instrumentation-breakpoints',
            isEnabled: RootModule.Runtime.hostConfig.devToolsInstrumentationBreakpoints?.enabled ?? false,
            requiresChromeRestart: false,
        });
    }
    const originalHostConfig = { ...RootModule.Runtime.hostConfig };
    const originalInspectorFrontendHost = Host.InspectorFrontendHost.InspectorFrontendHostInstance;
    for (const key of Object.keys(RootModule.Runtime.hostConfig)) {
        delete RootModule.Runtime.hostConfig[key];
    }
    if (options?.hostConfig) {
        Object.assign(RootModule.Runtime.hostConfig, options.hostConfig);
    }
    const hostInstance = options?.inspectorFrontendHost ?? Host.InspectorFrontendHost.InspectorFrontendHostInstance;
    Host.InspectorFrontendHost.installInspectorFrontendHost(hostInstance);
    const settingStorage = new Common.Settings.SettingsStorage({});
    const universe = new Foundation.Universe.Universe({
        settingsCreationOptions: {
            syncedStorage: settingStorage,
            globalStorage: settingStorage,
            localStorage: settingStorage,
            settingRegistrations: Common.SettingRegistration.getRegisteredSettings(),
            ...options?.settingsCreationOptions,
        },
        hostConfig: options?.hostConfig ?? {},
        inspectorFrontendHost: hostInstance,
        supportsEmulation: options?.supportsEmulation ?? false,
        overrideAutoStartModels: options?.overrideAutoStartModels,
    });
    const connection = new PuppeteerDevToolsConnection(session);
    const cleanup = () => {
        connection.dispose('Target universe cleanup');
        for (const key of Object.keys(RootModule.Runtime.hostConfig)) {
            delete RootModule.Runtime.hostConfig[key];
        }
        Object.assign(RootModule.Runtime.hostConfig, originalHostConfig);
        Host.InspectorFrontendHost.installInspectorFrontendHost(originalInspectorFrontendHost);
    };
    const targetManager = universe.context.get(SDKModule.TargetManager.TargetManager);
    const target = targetManager.createTarget('main', '', SDKModule.Target.Type.FRAME, 
    /* parentTarget */ null, session.id(), undefined, connection);
    return { target, universe, session, cleanup };
}
//# sourceMappingURL=TargetUniverse.js.map