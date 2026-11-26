// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

use crate::print_rust_log;
use std::panic::PanicHookInfo;
use std::ffi::CStr;

/// Routes `panic!` and similar macros to `LOG(FATAL)`.
pub(crate) fn init() {
    // We don't call `std::panic::take_hook` to store and use the old/default hook.
    // Among other things this means that `RUST_BACKTRACE=1` has no effect on
    // Chromium binaries/tests.  This seems okay, because `LOG(FATAL)` should
    // print the callstack (and task trace, crash keys, etc.).
    std::panic::set_hook(Box::new(panic_hook));
}

#[cfg(any(target_arch="x86", target_arch="x86_64", target_arch="loongarch64"))]
fn panic_hook(info: &PanicHookInfo<'_>) {
    print_rust_log::print_rust_log(
        &format_args!("{info}"),
        info.location().map(|loc| unsafe { CStr::from_ptr(loc.file().as_ptr() as *const i8) } ).unwrap_or(c"<unknown file>"),
        info.location().map(|loc| loc.line()),
        print_rust_log::LogSeverity::Fatal,
    )
}

#[cfg(any(target_arch="powerpc64", target_arch="arm", target_arch="aarch64"))]
fn panic_hook(info: &PanicHookInfo<'_>) {
    print_rust_log::print_rust_log(
        &format_args!("{info}"),
        info.location().map(|loc| unsafe { CStr::from_ptr(loc.file().as_ptr() as *const u8) } ).unwrap_or(c"<unknown file>"),
        info.location().map(|loc| loc.line()),
        print_rust_log::LogSeverity::Fatal,
    )
}
