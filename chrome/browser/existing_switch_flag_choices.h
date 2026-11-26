// Copyright (c) 2023 The ungoogled-chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef CHROME_BROWSER_EXISTING_SWITCH_FLAG_CHOICES_H_
#define CHROME_BROWSER_EXISTING_SWITCH_FLAG_CHOICES_H_
const FeatureEntry::Choice kForceReducedMotion[] = {
    {flags_ui::kGenericExperimentChoiceDefault, "", ""},
    {"Force reduced motion",
     "force-prefers-reduced-motion",
     ""},
    {"Force no reduced motion",
     "force-prefers-no-reduced-motion",
     ""},
};
const FeatureEntry::Choice kWebRTCIPPolicy[] = {
    {"Disable non proxied udp", "", ""},
    {"Default",
     "webrtc-ip-handling-policy",
     "default"},
    {"Default public and private interfaces",
     "webrtc-ip-handling-policy",
     "default_public_and_private_interfaces"},
    {"Default public interface only",
     "webrtc-ip-handling-policy",
     "default_public_interface_only"},
};
#endif  // CHROME_BROWSER_EXISTING_SWITCH_FLAG_CHOICES_H_
