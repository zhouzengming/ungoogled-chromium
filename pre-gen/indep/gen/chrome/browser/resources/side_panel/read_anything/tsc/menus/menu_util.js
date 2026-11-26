// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export var SettingsItemType;
(function (SettingsItemType) {
    SettingsItemType[SettingsItemType["MENU"] = 1] = "MENU";
    SettingsItemType[SettingsItemType["TOGGLE"] = 2] = "TOGGLE";
    SettingsItemType[SettingsItemType["ACTION"] = 3] = "ACTION";
    SettingsItemType[SettingsItemType["RADIO"] = 4] = "RADIO";
    SettingsItemType[SettingsItemType["EXPAND"] = 5] = "EXPAND";
})(SettingsItemType || (SettingsItemType = {}));
// TODO(crbug.com/346612365): Consider renaming this method to be more
// descriptive.
// Returns the index of the item in menuArray that contains the given data.
export function getIndexOfSetting(menuArray, dataToFind) {
    return menuArray.findIndex((item) => (item.data === dataToFind));
}
// Returns the index of the item in menuArray that contains the given data. If
// the given data does not exist in the menuArray anymore, returns the first
// index.
export function getIndexOrDefault(menuArray, data) {
    const index = getIndexOfSetting(menuArray, data);
    if (index < 0 && menuArray.length > 0) {
        return 0;
    }
    return index;
}
