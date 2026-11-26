import type { OrganizerListSectionClient, OrganizerListSectionDelegate } from '../organizer_list_section_delegate.js';
import type { OrganizerListSectionItem } from '../organizer_list_section_item.js';
import type { RecentlyClosedTab, RecentlyClosedTabGroup } from '../tab_search.mojom-webui.js';
export type RecentlyClosedItem = RecentlyClosedTab | RecentlyClosedTabGroup;
export declare class RecentTabsDelegate implements OrganizerListSectionDelegate<RecentlyClosedItem> {
    private browserProxy_;
    private client_?;
    private listenerIds_;
    private tabs_;
    private tabGroups_;
    private items_;
    init(sectionClient: OrganizerListSectionClient): void;
    getHeader(): string;
    getItems(): Promise<Array<OrganizerListSectionItem<RecentlyClosedItem>>>;
    onItemClick(item: OrganizerListSectionItem<RecentlyClosedItem>): void;
    private updateItems_;
    private notifyClient_;
    private onTabsChanged_;
    private onTabsRemoved_;
    private extractAndSortItems_;
    private sortItems_;
    private toSectionItem_;
    private tabToSectionItem_;
    private tabGroupToSectionItem_;
}
