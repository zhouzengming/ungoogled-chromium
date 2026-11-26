// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from '//resources/js/assert.js';
import { loadTimeData } from 'chrome://resources/js/load_time_data.js';
import { browserProxyFactory } from '../tab_search.mojom-webui.js';
import { compareTimeDescending, getTabDescriptionParts, tokenToString } from './tab_delegate_utils.js';
function isTabGroup(item) {
    return 'sessionId' in item;
}
export class RecentTabsDelegate {
    browserProxy_ = browserProxyFactory.getInstance();
    client_;
    listenerIds_ = [];
    tabs_ = [];
    tabGroups_ = [];
    items_ = [];
    init(sectionClient) {
        this.client_ = sectionClient;
        const callbackRouter = this.browserProxy_.callbackRouter;
        this.listenerIds_.push(callbackRouter.tabsChanged.addListener((profileData) => {
            this.onTabsChanged_(profileData);
        }), callbackRouter.tabsRemoved.addListener((tabsRemovedInfo) => {
            this.onTabsRemoved_(tabsRemovedInfo);
        }));
    }
    getHeader() {
        return loadTimeData.getString('recentlyClosed');
    }
    async getItems() {
        await this.updateItems_();
        return this.items_.map(item => this.toSectionItem_(item));
    }
    onItemClick(item) {
        const data = item.data;
        assert(data);
        const id = isTabGroup(data) ? data.sessionId : data.tabId;
        this.browserProxy_.handler.openRecentlyClosedEntry(id);
    }
    async updateItems_() {
        const { profileData } = await this.browserProxy_.handler.getProfileData();
        this.tabs_ = profileData.recentlyClosedTabs;
        this.tabGroups_ = profileData.recentlyClosedTabGroups;
        this.items_ = this.extractAndSortItems_();
    }
    notifyClient_() {
        this.client_?.onItemsChanged(this.items_.map(item => this.toSectionItem_(item)));
    }
    onTabsChanged_(profileData) {
        this.tabs_ = profileData.recentlyClosedTabs;
        this.tabGroups_ = profileData.recentlyClosedTabGroups;
        this.items_ = this.extractAndSortItems_();
        this.notifyClient_();
    }
    onTabsRemoved_(tabsRemovedInfo) {
        if (tabsRemovedInfo.recentlyClosedTabs.length === 0) {
            return;
        }
        const newTabIds = new Set(tabsRemovedInfo.recentlyClosedTabs.map(t => t.tabId));
        this.tabs_ = [
            ...tabsRemovedInfo.recentlyClosedTabs,
            ...this.tabs_.filter(t => !newTabIds.has(t.tabId)),
        ];
        this.items_ = this.extractAndSortItems_();
        this.notifyClient_();
    }
    extractAndSortItems_() {
        const groupIds = new Set(this.tabGroups_.map(group => tokenToString(group.id)));
        const filteredTabs = this.tabs_.filter(tab => !tab.groupId || !groupIds.has(tokenToString(tab.groupId)));
        const allItems = [...filteredTabs, ...this.tabGroups_];
        return this.sortItems_(allItems);
    }
    sortItems_(items) {
        items.sort((a, b) => compareTimeDescending(a.lastActiveTime, b.lastActiveTime));
        return items;
    }
    toSectionItem_(item) {
        return isTabGroup(item) ? this.tabGroupToSectionItem_(item) :
            this.tabToSectionItem_(item);
    }
    tabToSectionItem_(tab) {
        return {
            title: [tab.title],
            description: getTabDescriptionParts([tab.url], tab.lastActiveElapsedText),
            prefixIcon: {
                url: tab.url,
            },
            data: tab,
        };
    }
    tabGroupToSectionItem_(tabGroup) {
        const description = [];
        const tabCount = tabGroup.tabCount;
        description.push({
            text: loadTimeData.getStringF(tabCount === 1 ? 'oneTab' : 'tabCount', tabCount),
        });
        if (tabGroup.lastActiveElapsedText) {
            description.push({
                text: tabGroup.lastActiveElapsedText,
            });
        }
        return {
            title: [tabGroup.title],
            description,
            data: tabGroup,
        };
    }
}
