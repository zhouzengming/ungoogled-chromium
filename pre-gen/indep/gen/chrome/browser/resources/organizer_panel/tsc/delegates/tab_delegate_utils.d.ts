import type { Token } from '//resources/mojo/mojo/public/mojom/base/token.mojom-webui.js';
import type { OrganizerListSectionItemDescriptionPart } from '../organizer_list_section_item.js';
export declare function tokenToString(token: Token): string;
export declare function getHostnameOrUrl(url: string): string;
export declare function compareTimeDescending(timeA: {
    internalValue: bigint;
} | null | undefined, timeB: {
    internalValue: bigint;
} | null | undefined): number;
export declare function getTabDescriptionParts(urls: string[], lastActiveElapsedText?: string): OrganizerListSectionItemDescriptionPart[];
