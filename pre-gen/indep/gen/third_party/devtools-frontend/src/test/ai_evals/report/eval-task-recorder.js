// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { TaskOutputFile, uploadTaskCompleted, uploadTaskContent, uploadTaskFile, } from './gcs-upload.js';
import { exportEvalTrajectory, formatChatLog, } from './trajectory-builder.js';
/**
 * Records a task failure to GCS (`eval_task_completed.json` + `.marker`) and in-memory `taskStatuses`.
 */
export function recordTaskFailure(taskId, runId, durationSeconds, taskStatuses) {
    uploadTaskCompleted({
        taskId,
        runId,
        status: 'FAILED',
        // Failed tasks receive 0.0 as they encountered an error or timeout prior to completing.
        score: 0.0,
        durationSeconds,
        tokens: {},
    });
    taskStatuses.push({ taskId, status: 'FAILED', score: 0.0 });
}
/**
 * Handles a task failure during preparation or execution.
 * Logs the failure and immediately uploads diagnostic logs
 * (`agent_logs/agent.log` and `agent_logs/agent_stderr.log`) before sealing `eval_task_completed.marker`.
 */
export function handleTaskFailure(options) {
    const { runId, taskId, phase, durationSeconds, logger, taskStatuses } = options;
    logger.append(`[Task ${taskId}] ${phase} failed (${durationSeconds}s)`);
    uploadTaskContent(runId, taskId, TaskOutputFile.AGENT_LOG, logger.getTaskLogContent(taskId));
    uploadTaskContent(runId, taskId, TaskOutputFile.AGENT_STDERR, logger.getTaskStderrContent(taskId));
    recordTaskFailure(taskId, runId, durationSeconds, taskStatuses);
}
/**
 * Uploads every per-task artifact to GCS. Returns true only if all of them
 * were uploaded successfully.
 */
export function uploadTaskArtifacts(runId, taskId, logger, trajectory, evalOutputPath) {
    const trajectoryUploaded = uploadTaskFile(runId, taskId, TaskOutputFile.TRAJECTORY, evalOutputPath);
    const agentLogUploaded = uploadTaskContent(runId, taskId, TaskOutputFile.AGENT_LOG, logger.getTaskLogContent(taskId));
    const chatLogUploaded = uploadTaskContent(runId, taskId, TaskOutputFile.CHAT_LOG, formatChatLog(trajectory));
    const agentStderrUploaded = uploadTaskContent(runId, taskId, TaskOutputFile.AGENT_STDERR, logger.getTaskStderrContent(taskId));
    return trajectoryUploaded && agentLogUploaded && chatLogUploaded && agentStderrUploaded;
}
/**
 * Derives the task score and status and reports the completion both to GCS and
 * to the in-memory run summary (`taskStatuses`).
 */
export function recordTaskCompletion(taskId, runId, durationSeconds, taskStatuses, allUploadsSucceeded, hasError = false, customScore) {
    const baseScore = customScore ?? (hasError ? 0.0 : 1.0);
    const score = allUploadsSucceeded ? baseScore : 0.0;
    // Status indicates execution outcome (PASSED if prompt turns completed and uploaded without error,
    // FAILED if upload failed, assertion failures occurred, or score is 0.0).
    const status = (!allUploadsSucceeded || hasError || score <= 0.0) ? 'FAILED' : 'PASSED';
    uploadTaskCompleted({
        taskId,
        runId,
        status,
        score,
        durationSeconds,
        tokens: {},
    });
    taskStatuses.push({ taskId, status, score });
}
/**
 * Exports the task trajectory to disk (`outputDir`), uploads all task artifacts,
 * and seals `eval_task_completed.marker`.
 * Returns the path of the exported `.eval.json` file.
 */
export function finalizeEvalTask(options) {
    const { runId, taskId, label, trajectory, outputDir, durationSeconds, logger, taskStatuses, hasError = false, customScore, } = options;
    logger.append(`[Task ${taskId}] Finished execution (${durationSeconds}s)`);
    const evalOutputPath = exportEvalTrajectory(trajectory, label, outputDir);
    const allUploadsSucceeded = uploadTaskArtifacts(runId, taskId, logger, trajectory, evalOutputPath);
    recordTaskCompletion(taskId, runId, durationSeconds, taskStatuses, allUploadsSucceeded, hasError, customScore);
    return evalOutputPath;
}
//# sourceMappingURL=eval-task-recorder.js.map