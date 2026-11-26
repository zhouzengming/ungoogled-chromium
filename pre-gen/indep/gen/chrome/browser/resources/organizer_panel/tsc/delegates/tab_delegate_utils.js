// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export function tokenToString(token) {
    return `${token.high.toString()}#${token.low.toString()}`;
}
export function getHostnameOrUrl(url) {
    try {
        return new URL(url).hostname;
    }
    catch {
        return url;
    }
}
export function compareTimeDescending(timeA, timeB) {
    const valA = timeA?.internalValue ?? 0n;
    const valB = timeB?.internalValue ?? 0n;
    return valB > valA ? 1 : (valB < valA ? -1 : 0);
}
export function getTabDescriptionParts(urls, lastActiveElapsedText) {
    const description = urls.map(url => ({
        text: getHostnameOrUrl(url),
        elideFromStart: true,
    }));
    if (lastActiveElapsedText) {
        description.push({ text: lastActiveElapsedText });
    }
    return description;
}
