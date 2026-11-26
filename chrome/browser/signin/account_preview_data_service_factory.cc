// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "chrome/browser/signin/account_preview_data_service_factory.h"

#include "chrome/browser/browser_process.h"
#include "chrome/browser/metrics/profile_metrics_service_factory.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/signin/identity_manager_factory.h"
#include "chrome/browser/sync/sync_service_factory.h"
#include "chrome/common/channel_info.h"
#include "components/pref_registry/pref_registry_syncable.h"
#include "components/prefs/pref_service.h"
#include "components/signin/core/browser/account_preview_data_service.h"
#include "components/signin/core/browser/account_preview_data_service_impl.h"
#include "components/signin/public/base/signin_switches.h"
#include "content/public/browser/storage_partition.h"

#if BUILDFLAG(IS_CHROMEOS)
#include "chrome/browser/signin/wait_for_network_callback_helper_ash.h"
#else
#include "chrome/browser/signin/wait_for_network_callback_helper_chrome.h"
#endif

AccountPreviewDataServiceFactory::AccountPreviewDataServiceFactory()
    : ProfileKeyedServiceFactory("AccountPreviewDataService") {
  DependsOn(IdentityManagerFactory::GetInstance());
  DependsOn(ProfileMetricsServiceFactory::GetInstance());
  DependsOn(SyncServiceFactory::GetInstance());
}

AccountPreviewDataServiceFactory::~AccountPreviewDataServiceFactory() = default;

// static
signin::AccountPreviewDataService*
AccountPreviewDataServiceFactory::GetForProfile(Profile* profile) {
  return static_cast<signin::AccountPreviewDataService*>(
      GetInstance()->GetServiceForBrowserContext(profile, true));
}

// static
AccountPreviewDataServiceFactory*
AccountPreviewDataServiceFactory::GetInstance() {
  static base::NoDestructor<AccountPreviewDataServiceFactory> instance;
  return instance.get();
}

std::unique_ptr<KeyedService>
AccountPreviewDataServiceFactory::BuildServiceInstanceForBrowserContext(
    content::BrowserContext* context) const {
    return nullptr;
}

void AccountPreviewDataServiceFactory::RegisterProfilePrefs(
    user_prefs::PrefRegistrySyncable* registry) {
  signin::AccountPreviewDataService::RegisterProfilePrefs(registry);
}

bool AccountPreviewDataServiceFactory::ServiceIsCreatedWithBrowserContext()
    const {
  return true;
}

bool AccountPreviewDataServiceFactory::ServiceIsNULLWhileTesting() const {
  return true;
}
