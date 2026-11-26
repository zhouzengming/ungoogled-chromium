/**
 * Creates a temporary directory for staging evaluation trajectories during a run.
 */
export declare function createTempEvalDir(): string;
/**
 * Generates the default session ID matching autorun's 15-character MD5 hash format.
 */
export declare function createDefaultSessionId(data: unknown, index?: number): string;
export interface Thought {
    subject: string;
    description: string;
    timestamp: number;
}
export interface ToolCall {
    name: string;
    args: Record<string, unknown>;
    timestamp: number;
    status?: 'success' | 'error';
    result?: unknown;
}
export interface Turn {
    turn_id: string;
    role: 'user' | 'gemini';
    timestamp: number;
    tokens: Record<string, never>;
    content: string[];
    thoughts: Thought[];
    tool_calls: ToolCall[];
}
export interface TrajectoryMetadata {
    session_id: string;
    model: string;
    chrome_version: string;
    auto_run_example_id?: string;
}
export interface Trajectory {
    metadata: TrajectoryMetadata;
    data: Turn[];
}
export interface RawRequest {
    current_message: {
        parts: Array<{
            text?: string;
            functionResponse?: {
                name: string;
                response: Record<string, unknown>;
            };
        }>;
    };
    metadata?: {
        client_version?: string;
        string_session_id?: string;
    };
}
export interface RawFunctionCall {
    name: string;
    args: Record<string, unknown>;
}
export interface RawAidaResponse {
    metadata?: {
        rpcGlobalId?: string | number;
        inferenceOptionMetadata?: {
            modelId?: string;
            modelVersion?: string;
        };
    };
    explanation?: string;
    functionCalls?: RawFunctionCall[];
    completed?: boolean;
}
export interface Step {
    session_id?: string;
    request: RawRequest;
    aidaResponse: RawAidaResponse;
}
export type RawExample = Step;
export interface TrajectoryBuilderOptions {
    sessionId?: string;
    autoRunExampleId?: string;
}
/**
 * Standalone utility responsible for collecting AI conversation interaction logs
 * (as emitted by `handleExternalAIRequest` / `aiAssistanceStructuredLog`) and compiling
 * them into standard `trajectory.json` evaluation outputs.
 */
export declare class TrajectoryBuilder {
    #private;
    constructor(options?: TrajectoryBuilderOptions);
    addSteps(steps: Step[]): this;
    /**
     * Appends a single raw interaction step. Deduplicates by rpcGlobalId if present (matching auto-run).
     */
    addStep(step: Step): this;
    /**
     * Builds the complete Trajectory object matching autorun conventions.
     */
    build(): Trajectory;
    /**
     * Builds the trajectory and writes it to disk as formatted JSON.
     */
    writeToFile(filePath: string): Trajectory;
    /**
     * Builds and exports the trajectory to the specified evaluation output directory.
     */
    exportToFile(label: string, outputDir: string): {
        trajectory: Trajectory;
        outputPath: string;
    };
}
/**
 * Formats a trajectory into a clean, human-readable plaintext chat log.
 * Shows user queries, agent explanations, and any tool calls/results.
 */
export declare function formatChatLog(trajectory: Trajectory): string;
export declare function slug(str: string): string;
/**
 * Writes the eval trajectory to the specified output directory.
 * Returns the path of the written `.eval.json` file.
 */
export declare function exportEvalTrajectory(trajectory: Trajectory, label: string, outputDir: string): string;
