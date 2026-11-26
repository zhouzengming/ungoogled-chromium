interface UserMetrics {
    Action: Record<string, number>;
}
declare global {
    interface Window {
        Host: {
            UserMetrics: UserMetrics;
            userMetrics: {
                actionTaken(name: number): void;
            };
        };
    }
}
export {};
