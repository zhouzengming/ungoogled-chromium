// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assertNever } from './transport/messaging.js';
// Helper function to shallow-copy an object and replace some properties.
// Useful to convert from these private types to public types. This will fail to
// compile if a property is missed.
export function replaceProperties(original, replacements) {
    return Object.assign({}, original, replacements);
}
//
// Any enums shared between mojo and glic_api should be checked here. Please
// add a check if you add a new enum.
//
// Ignore FLOATING and DOCKED in the api, as they're just deprecated aliases.
assertNever();
// kUnknown isn't in the public API because this is a closed enum, and will
// not be expanded.
assertNever();
assertNever();
assertNever();
assertNever();
assertNever();
assertNever();
assertNever();
