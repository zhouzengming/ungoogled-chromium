/**
 * Logger for AI Evaluation runs and tasks.
 * Captures suite-level run logs (`eval_run.log`) and granular per-task
 * execution/stderr logs (`agent_logs/agent.log` and `agent_logs/agent_stderr.log`)
 * matching the exact format of scripts/ai_assistance/auto-run/auto-run.ts.
 */
export declare class EvalLogger {
    #private;
    formatError(err: Error): string;
    append(text: string): void;
    taskLog(taskId: string, text: string): void;
    taskError(taskId: string, text: string): void;
    /**
     * Execution log for a single run, uploaded once per run to GCS as `eval_run.log`.
     */
    getRunLogContent(): string;
    getLogContent(): string;
    /**
     * Returns the formatted log content for a specific task, uploaded per trajectory to GCS
     * as `agent_logs/agent.log`.
     */
    getTaskLogContent(taskId: string): string;
    /**
     * Returns the formatted stderr content for a specific task, uploaded per trajectory to GCS
     * as `agent_logs/agent_stderr.log`. Returns an empty string if no errors occurred.
     */
    getTaskStderrContent(taskId: string): string;
}
