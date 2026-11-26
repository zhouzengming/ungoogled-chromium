// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Logger for AI Evaluation runs and tasks.
 * Captures suite-level run logs (`eval_run.log`) and granular per-task
 * execution/stderr logs (`agent_logs/agent.log` and `agent_logs/agent_stderr.log`)
 * matching the exact format of scripts/ai_assistance/auto-run/auto-run.ts.
 */
export class EvalLogger {
    // Suite-level run log entries uploaded per run to GCS as eval_run.log.
    #runLogEntries = [];
    // Granular per-task agent execution traces keyed by taskId, uploaded per trajectory to GCS as agent_logs/agent.log.
    #taskLogEntries = new Map();
    // Granular per-task agent stderr traces keyed by taskId, uploaded per trajectory to GCS as agent_logs/agent_stderr.log.
    #taskStderrEntries = new Map();
    #stripAnsi(text) {
        return text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '').trim();
    }
    #recordRunLog(text) {
        const cleanText = this.#stripAnsi(text);
        if (!cleanText) {
            return;
        }
        const timestamp = new Date().toISOString();
        for (const line of cleanText.split('\n')) {
            this.#runLogEntries.push(`[${timestamp}] ${line}`);
        }
    }
    #recordTaskLog(taskId, text, isError = false) {
        const cleanText = this.#stripAnsi(text);
        if (!cleanText) {
            return;
        }
        let entries = this.#taskLogEntries.get(taskId);
        if (!entries) {
            entries = [];
            this.#taskLogEntries.set(taskId, entries);
        }
        const prefix = isError ? '[ERROR] ' : '';
        for (const line of cleanText.split('\n')) {
            entries.push(`${prefix}${line}`);
        }
    }
    #recordTaskStderr(taskId, text) {
        const cleanText = this.#stripAnsi(text);
        if (!cleanText) {
            return;
        }
        let entries = this.#taskStderrEntries.get(taskId);
        if (!entries) {
            entries = [];
            this.#taskStderrEntries.set(taskId, entries);
        }
        for (const line of cleanText.split('\n')) {
            entries.push(line);
        }
    }
    formatError(err) {
        const stack = typeof err.cause === 'object' && err.cause && 'stack' in err.cause ? err.cause.stack : '';
        return `${err.stack}${err.cause ? `\n${stack}` : ''}`;
    }
    append(text) {
        this.#recordRunLog(text);
    }
    taskLog(taskId, text) {
        this.#recordTaskLog(taskId, text);
    }
    taskError(taskId, text) {
        this.#recordTaskLog(taskId, text, /* isError= */ true);
        this.#recordTaskStderr(taskId, text);
    }
    /**
     * Execution log for a single run, uploaded once per run to GCS as `eval_run.log`.
     */
    getRunLogContent() {
        return this.#runLogEntries.join('\n') + '\n';
    }
    getLogContent() {
        return this.getRunLogContent();
    }
    /**
     * Returns the formatted log content for a specific task, uploaded per trajectory to GCS
     * as `agent_logs/agent.log`.
     */
    getTaskLogContent(taskId) {
        const entries = this.#taskLogEntries.get(taskId);
        if (!entries || entries.length === 0) {
            return '(No log entries recorded)\n';
        }
        return entries.join('\n') + '\n';
    }
    /**
     * Returns the formatted stderr content for a specific task, uploaded per trajectory to GCS
     * as `agent_logs/agent_stderr.log`. Returns an empty string if no errors occurred.
     */
    getTaskStderrContent(taskId) {
        const entries = this.#taskStderrEntries.get(taskId);
        if (!entries || entries.length === 0) {
            return '';
        }
        return entries.join('\n') + '\n';
    }
}
//# sourceMappingURL=eval-logger.js.map