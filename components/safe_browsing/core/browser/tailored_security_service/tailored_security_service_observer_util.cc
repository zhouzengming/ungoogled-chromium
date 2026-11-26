// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "components/safe_browsing/core/browser/tailored_security_service/tailored_security_service_observer_util.h"

#include "components/google/core/common/google_util.h"
#include "components/prefs/pref_service.h"
#include "components/safe_browsing/core/browser/tailored_security_service/tailored_security_service.h"
#include "components/safe_browsing/core/common/safe_browsing_policy_handler.h"
#include "components/sync/base/user_selectable_type.h"
#include "components/sync/service/sync_service.h"
#include "components/sync/service/sync_user_settings.h"
#include "url/gurl.h"

namespace safe_browsing {

bool CanQueryTailoredSecurityForUrl(GURL url) {
  return false;
}

bool CanShowUnconsentedTailoredSecurityDialog(syncer::SyncService* sync_service,
                                              PrefService* prefs) {
    return false;
}

}  // namespace safe_browsing
