import type { WallpaperSearchHandlerInterface } from '../wallpaper_search.mojom-webui.js';
import { WallpaperSearchClientCallbackRouter } from '../wallpaper_search.mojom-webui.js';
export declare class WallpaperSearchProxy {
    static getInstance(): WallpaperSearchProxy;
    static setInstance(handler: WallpaperSearchHandlerInterface, callbackRouter: WallpaperSearchClientCallbackRouter): void;
    handler: WallpaperSearchHandlerInterface;
    callbackRouter: WallpaperSearchClientCallbackRouter;
    private constructor();
}
