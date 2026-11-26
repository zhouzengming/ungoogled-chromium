// Copyright 2015 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "components/password_manager/core/browser/sync_credentials_filter.h"

#include <algorithm>

#include "base/feature_list.h"
#include "base/strings/utf_string_conversions.h"
#include "components/password_manager/core/browser/features/password_features.h"
#include "components/password_manager/core/browser/password_manager_util.h"
#include "components/password_manager/core/browser/password_sync_util.h"
#include "components/signin/public/base/consent_level.h"
#include "components/signin/public/identity_manager/account_info.h"
#include "components/signin/public/identity_manager/identity_manager.h"
#include "google_apis/gaia/gaia_auth_util.h"
#include "password_sync_util.h"

namespace password_manager {

SyncCredentialsFilter::SyncCredentialsFilter(PasswordManagerClient* client)
    : client_(client) {}

SyncCredentialsFilter::~SyncCredentialsFilter() = default;

bool SyncCredentialsFilter::ShouldSave(const PasswordForm& form) const {
  if (client_->IsOffTheRecord()) {
    return false;
  }
  return true;
}

bool SyncCredentialsFilter::ShouldSaveGaiaPasswordHash(
    const PasswordForm& form) const {
  return !client_->IsOffTheRecord() &&
         sync_util::IsGaiaCredentialPage(form.signon_realm);
}

bool SyncCredentialsFilter::ShouldSaveEnterprisePasswordHash(
    const PasswordForm& form) const {
  return !client_->IsOffTheRecord() &&
         sync_util::ShouldSaveEnterprisePasswordHash(form,
                                                     *client_->GetPrefs());
}

bool SyncCredentialsFilter::IsSyncAccountEmail(
    const std::string& username) const {
  return sync_util::IsSyncAccountEmail(username, client_->GetIdentityManager(),
                                       signin::ConsentLevel::kSignin);
}

}  // namespace password_manager
