// Copyright (c) 2020 The ungoogled-chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef CHROME_BROWSER_UNGOOGLED_FLAG_CHOICES_H_
#define CHROME_BROWSER_UNGOOGLED_FLAG_CHOICES_H_
const FeatureEntry::Choice kExtensionHandlingChoices[] = {
    {flags_ui::kGenericExperimentChoiceDefault, "", ""},
    {"Download as regular file",
     "extension-mime-request-handling",
     "download-as-regular-file"},
    {"Always prompt for install",
     "extension-mime-request-handling",
     "always-prompt-for-install"},
};
const FeatureEntry::Choice kShowAvatarButtonChoices[] = {
    {flags_ui::kGenericExperimentChoiceDefault, "", ""},
    {"Always",
     "show-avatar-button",
     "always"},
    {"Incognito and Guest",
     "show-avatar-button",
     "incognito-and-guest"},
    {"Never",
     "show-avatar-button",
     "never"}
};
const FeatureEntry::Choice kScrollEventChangesTab[] = {
    {flags_ui::kGenericExperimentChoiceDefault, "", ""},
    {"Always",
     "scroll-tabs",
     "always"},
    {"Never",
     "scroll-tabs",
     "never"}
};
const FeatureEntry::Choice kBookmarkBarNewTab[] = {
    {flags_ui::kGenericExperimentChoiceDefault, "", ""},
    {"Never",
     "bookmark-bar-ntp",
     "never"},
};
const FeatureEntry::Choice kOmniboxAutocompleteFiltering[] = {
    {flags_ui::kGenericExperimentChoiceDefault, "", ""},
    {"Search suggestions only",
     "omnibox-autocomplete-filtering",
     "search"},
    {"Search suggestions and bookmarks",
     "omnibox-autocomplete-filtering",
     "search-bookmarks"},
    {"Search suggestions and internal chrome pages",
     "omnibox-autocomplete-filtering",
     "search-chrome"},
    {"Search suggestions, bookmarks, and internal chrome pages",
     "omnibox-autocomplete-filtering",
     "search-bookmarks-chrome"},
};
const FeatureEntry::Choice kCloseWindowWithLastTab[] = {
    {flags_ui::kGenericExperimentChoiceDefault, "", ""},
    {"Never",
     "close-window-with-last-tab",
     "never"},
};
const FeatureEntry::Choice kCloseConfirmation[] = {
    {flags_ui::kGenericExperimentChoiceDefault, "", ""},
    {"Show confirmation with last window",
     "close-confirmation",
     "last"},
    {"Show confirmation with multiple windows",
     "close-confirmation",
     "multiple"},
};
const FeatureEntry::Choice kTabHoverCards[] = {
    {flags_ui::kGenericExperimentChoiceDefault, "", ""},
    {"None",
     "tab-hover-cards",
     "none"},
    {"Tooltip",
     "tab-hover-cards",
     "tooltip"},
};
const FeatureEntry::FeatureParam kSpoofWebGL_Blank[] = {
    {blink::features::kSpoofWebGLRenderer, " "},
    {blink::features::kSpoofWebGLVendor, " "},
};
const FeatureEntry::FeatureParam kSpoofWebGL_Amd[] = {
    {blink::features::kSpoofWebGLRenderer, "Radeon R9 200 Series, or similar"},
    {blink::features::kSpoofWebGLVendor, "AMD"},
};
const FeatureEntry::FeatureParam kSpoofWebGL_Apple[] = {
    {blink::features::kSpoofWebGLRenderer, "Apple GPU"},
    {blink::features::kSpoofWebGLVendor, "Apple Inc."},
};
const FeatureEntry::FeatureParam kSpoofWebGL_Intel[] = {
    {blink::features::kSpoofWebGLRenderer, "Intel(R) HD Graphics, or similar"},
    {blink::features::kSpoofWebGLVendor, "Intel"},
};
const FeatureEntry::FeatureParam kSpoofWebGL_Mesa[] = {
    {blink::features::kSpoofWebGLRenderer, "llvmpipe"},
    {blink::features::kSpoofWebGLVendor, "Mesa"},
};
const FeatureEntry::FeatureParam kSpoofWebGL_Nvidia[] = {
    {blink::features::kSpoofWebGLRenderer, "NVIDIA GeForce GTX 980, or similar"},
    {blink::features::kSpoofWebGLVendor, "NVIDIA Corporation"},
};
const FeatureEntry::FeatureParam kSpoofWebGL_Qualcomm[] = {
    {blink::features::kSpoofWebGLRenderer, "Adreno (TM) 610"},
    {blink::features::kSpoofWebGLVendor, "Qualcomm"},
};
const FeatureEntry::FeatureVariation kSpoofWebGLChoices[] = {
    {"Blank", kSpoofWebGL_Blank, nullptr},
    {"AMD Radeon R9 200", kSpoofWebGL_Amd, nullptr},
    {"Apple", kSpoofWebGL_Apple, nullptr},
    {"Intel", kSpoofWebGL_Intel, nullptr},
    {"Mesa LLVMpipe", kSpoofWebGL_Mesa, nullptr},
    {"NVIDIA GeForce GTX 980", kSpoofWebGL_Nvidia, nullptr},
    {"Qualcomm Adreno 610", kSpoofWebGL_Qualcomm, nullptr},
};
#endif  // CHROME_BROWSER_UNGOOGLED_FLAG_CHOICES_H_
