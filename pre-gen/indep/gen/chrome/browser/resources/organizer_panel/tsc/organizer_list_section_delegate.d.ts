import type { OrganizerListSectionItem } from './organizer_list_section_item.js';
export interface OrganizerListSectionClient {
    onItemsChanged(items: Array<OrganizerListSectionItem<unknown>>): void;
}
export interface OrganizerListSectionDelegate<T> {
    init(sectionClient: OrganizerListSectionClient): void;
    getHeader(): string;
    getItems(): Promise<Array<OrganizerListSectionItem<T>>>;
    onItemClick(item: OrganizerListSectionItem<T>): void;
    onItemActionButtonClicked?(item: OrganizerListSectionItem<T>, buttonElement: HTMLElement): Promise<void> | void;
    onItemContextMenuClicked?(item: OrganizerListSectionItem<T>, x: number, y: number): Promise<void> | void;
}
