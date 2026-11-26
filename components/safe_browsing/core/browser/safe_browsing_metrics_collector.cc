// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "components/safe_browsing/core/browser/safe_browsing_metrics_collector.h"

#include <algorithm>

#include "base/json/values_util.h"
#include "base/logging.h"
#include "base/metrics/histogram_functions.h"
#include "base/strings/strcat.h"
#include "base/strings/string_number_conversions.h"
#include "base/time/time.h"
#include "components/password_manager/core/common/password_manager_pref_names.h"
#include "components/prefs/pref_service.h"
#include "components/prefs/scoped_user_pref_update.h"

namespace {

using EventType = safe_browsing::SafeBrowsingMetricsCollector::EventType;
using UserState = safe_browsing::SafeBrowsingMetricsCollector::UserState;

const int kMetricsLoggingIntervalDay = 1;

// The quota for ESB disabled metrics. ESB disabled metrics should not be logged
// more than the quota in a week.
const int kEsbDisabledMetricsQuota = 3;
// Events that are older than 30 days are removed from pref.
// The ESB enabled duration is considered short if it's under 1 hour, long if
// it's at least 24 hours, and medium if it's in between.
const int kEsbShortEnabledUpperBoundHours = 1;
const int kEsbLongEnabledLowerBoundHours = 24;

std::string EventTypeToPrefKey(const EventType& type) {
  return base::NumberToString(static_cast<int>(type));
}

base::Time PrefValueToTime(const base::Value& value) {
  return base::Time::FromDeltaSinceWindowsEpoch(
      base::Seconds(base::ValueToInt64(value).value_or(0)));
}

}  // namespace

namespace safe_browsing {

SafeBrowsingMetricsCollector::SafeBrowsingMetricsCollector(
    PrefService* pref_service)
    : pref_service_(pref_service) {
  pref_change_registrar_.Init(pref_service_);
}

void SafeBrowsingMetricsCollector::Shutdown() {
  pref_change_registrar_.RemoveAll();
}

// static
void SafeBrowsingMetricsCollector::
    LogSafeBrowsingNotificationRevocationSourceHistogram(
        NotificationRevocationSource source) {
  base::UmaHistogramEnumeration("SafeBrowsing.NotificationRevocationSource",
                                source);
}

void SafeBrowsingMetricsCollector::StartLogging() {
}

void SafeBrowsingMetricsCollector::LogMetricsAndScheduleNextLogging() {
  LogDailyOptInMetrics();
  LogDailyEventMetrics();
  MaybeLogDailyEsbProtegoPingSent();
  RemoveOldEventsFromPref();

  ScheduleNextLoggingAfterInterval(base::Days(kMetricsLoggingIntervalDay));
}

void SafeBrowsingMetricsCollector::MaybeLogDailyEsbProtegoPingSent() {
}

void SafeBrowsingMetricsCollector::ScheduleNextLoggingAfterInterval(
    base::TimeDelta interval) {
  metrics_collector_timer_.Stop();
  metrics_collector_timer_.Start(
      FROM_HERE, interval, this,
      &SafeBrowsingMetricsCollector::LogMetricsAndScheduleNextLogging);
}

void SafeBrowsingMetricsCollector::LogDailyOptInMetrics() {
}

void SafeBrowsingMetricsCollector::LogDailyEventMetrics() {
}

void SafeBrowsingMetricsCollector::RemoveOldEventsFromPref() {
}

void SafeBrowsingMetricsCollector::AddSafeBrowsingEventToPref(
    EventType event_type) {
}

void SafeBrowsingMetricsCollector::AddBypassEventToPref(
    ThreatSource threat_source) {
  EventType event;
  switch (threat_source) {
    case ThreatSource::LOCAL_PVER4:
    case ThreatSource::LOCAL_PVER5_LOCAL_BLOCKLIST:
      event = EventType::DATABASE_INTERSTITIAL_BYPASS;
      break;
    case ThreatSource::CLIENT_SIDE_DETECTION:
      event = EventType::CSD_INTERSTITIAL_BYPASS;
      break;
    case ThreatSource::URL_REAL_TIME_CHECK:
      event = EventType::URL_REAL_TIME_INTERSTITIAL_BYPASS;
      break;
    case ThreatSource::NATIVE_PVER5_REAL_TIME:
      event = EventType::HASH_PREFIX_REAL_TIME_INTERSTITIAL_BYPASS;
      break;
    case ThreatSource::ANDROID_SAFEBROWSING_REAL_TIME:
      event = EventType::ANDROID_SAFEBROWSING_REAL_TIME_INTERSTITIAL_BYPASS;
      break;
    case ThreatSource::ANDROID_SAFEBROWSING:
      event = EventType::ANDROID_SAFEBROWSING_INTERSTITIAL_BYPASS;
      break;
    case ThreatSource::GLIC_COUNTER_ABUSE:
      event = EventType::GLIC_COUNTER_ABUSE_INTERSTITIAL_BYPASS;
      break;
    default:
      NOTREACHED() << "Unexpected threat source.";
  }
  AddSafeBrowsingEventToPref(event);
}

std::optional<base::Time> SafeBrowsingMetricsCollector::GetLatestEventTimestamp(
    EventType event_type) {
  return GetLatestEventTimestamp(base::BindRepeating(
      [](const EventType& target_event_type, const EventType& event_type) {
        return target_event_type == event_type;
      },
      event_type));
}

std::optional<base::Time> SafeBrowsingMetricsCollector::GetLatestEventTimestamp(
    EventTypeFilter event_type_filter) {
  // Events are not logged when Safe Browsing is disabled.
    return std::nullopt;
}

std::optional<base::Time>
SafeBrowsingMetricsCollector::GetLatestSecuritySensitiveEventTimestamp() {
  return GetLatestEventTimestamp(base::BindRepeating(
      &SafeBrowsingMetricsCollector::IsSecuritySensitiveEventType));
}

void SafeBrowsingMetricsCollector::AddSafeBrowsingEventAndUserStateToPref(
    UserState user_state,
    EventType event_type) {
}

void SafeBrowsingMetricsCollector::OnEnhancedProtectionPrefChanged() {
}

const base::DictValue*
SafeBrowsingMetricsCollector::GetSafeBrowsingEventDictionary(
    UserState user_state) {
  return nullptr;
}

std::optional<SafeBrowsingMetricsCollector::Event>
SafeBrowsingMetricsCollector::GetLatestEventFromEventType(
    UserState user_state,
    EventType event_type) {
  const base::DictValue* event_dict =
      GetSafeBrowsingEventDictionary(user_state);

  if (!event_dict) {
    return std::nullopt;
  }

  const base::ListValue* timestamps =
      event_dict->FindList(EventTypeToPrefKey(event_type));

  if (timestamps && timestamps->size() > 0) {
    base::Time time = PrefValueToTime(timestamps->back());
    return Event(event_type, time);
  }

  return std::nullopt;
}

std::optional<SafeBrowsingMetricsCollector::Event>
SafeBrowsingMetricsCollector::GetLatestEventFromEventTypeFilter(
    UserState user_state,
    EventTypeFilter event_type_filter) {
  std::vector<Event> bypass_events;
  for (int event_type_int = 0; event_type_int <= EventType::kMaxValue;
       event_type_int += 1) {
    EventType event_type = static_cast<EventType>(event_type_int);
    if (!event_type_filter.Run(event_type)) {
      continue;
    }
    const std::optional<Event> latest_event =
        GetLatestEventFromEventType(user_state, event_type);
    if (latest_event) {
      bypass_events.emplace_back(latest_event.value());
    }
  }

  const auto latest_event = std::max_element(
      bypass_events.begin(), bypass_events.end(),
      [](const Event& a, const Event& b) { return a.timestamp < b.timestamp; });

  return (latest_event != bypass_events.end())
             ? std::optional<Event>(*latest_event)
             : std::nullopt;
}

void SafeBrowsingMetricsCollector::LogEnhancedProtectionDisabledMetrics() {
  base::UmaHistogramCounts100(
      "SafeBrowsing.EsbDisabled.TimesDisabledLast28Days." +
          GetTimesDisabledSuffix(),
      GetEventCountSince(UserState::kEnhancedProtection,
                         EventType::USER_STATE_DISABLED,
                         base::Time::Now() - base::Days(28)));

  int disabled_times_last_week = GetEventCountSince(
      UserState::kEnhancedProtection, EventType::USER_STATE_DISABLED,
      base::Time::Now() - base::Days(7));
  if (disabled_times_last_week <= kEsbDisabledMetricsQuota) {
    LogThrottledEnhancedProtectionDisabledMetrics();
  }
}

void SafeBrowsingMetricsCollector::
    LogThrottledEnhancedProtectionDisabledMetrics() {
  const base::DictValue* event_dict =
      GetSafeBrowsingEventDictionary(UserState::kEnhancedProtection);
  if (!event_dict) {
    return;
  }

  std::optional<SafeBrowsingMetricsCollector::Event> latest_bypass_event =
      GetLatestEventFromEventTypeFilter(
          UserState::kEnhancedProtection,
          base::BindRepeating(
              &SafeBrowsingMetricsCollector::IsBypassEventType));
  if (latest_bypass_event) {
    base::UmaHistogramEnumeration(
        "SafeBrowsing.EsbDisabled.LastBypassEventType",
        latest_bypass_event->type);
  }

  std::optional<SafeBrowsingMetricsCollector::Event>
      latest_security_sensitive_event = GetLatestEventFromEventTypeFilter(
          UserState::kEnhancedProtection,
          base::BindRepeating(
              &SafeBrowsingMetricsCollector::IsSecuritySensitiveEventType));
  if (latest_security_sensitive_event) {
    base::UmaHistogramEnumeration(
        "SafeBrowsing.EsbDisabled.LastSecuritySensitiveEventType",
        latest_security_sensitive_event->type);
  }

  const std::optional<Event> latest_enabled_event = GetLatestEventFromEventType(
      UserState::kEnhancedProtection, EventType::USER_STATE_ENABLED);
  if (latest_enabled_event) {
    const auto days_since_enabled =
        (base::Time::Now() - latest_enabled_event.value().timestamp).InDays();
    base::UmaHistogramCounts100("SafeBrowsing.EsbDisabled.LastEnabledInterval",
                                /* sample */ days_since_enabled);
  }
}

int SafeBrowsingMetricsCollector::GetEventCountSince(UserState user_state,
                                                     EventType event_type,
                                                     base::Time since_time) {
  const base::DictValue* event_dict =
      GetSafeBrowsingEventDictionary(user_state);
  if (!event_dict) {
    return 0;
  }
  const base::ListValue* timestamps =
      event_dict->FindList(EventTypeToPrefKey(event_type));
  if (!timestamps) {
    return 0;
  }

  return std::ranges::count_if(*timestamps, [&](const base::Value& timestamp) {
    return PrefValueToTime(timestamp) > since_time;
  });
}

bool SafeBrowsingMetricsCollector::IsBypassEventType(const EventType& type) {
  switch (type) {
    case EventType::USER_STATE_DISABLED:
    case EventType::USER_STATE_ENABLED:
    case EventType::SECURITY_SENSITIVE_SAFE_BROWSING_INTERSTITIAL:
    case EventType::SECURITY_SENSITIVE_SSL_INTERSTITIAL:
    case EventType::SECURITY_SENSITIVE_PASSWORD_PROTECTION:
    case EventType::SECURITY_SENSITIVE_DOWNLOAD:
    case EventType::DOWNLOAD_DEEP_SCAN:
      return false;
    case EventType::DATABASE_INTERSTITIAL_BYPASS:
    case EventType::CSD_INTERSTITIAL_BYPASS:
    case EventType::URL_REAL_TIME_INTERSTITIAL_BYPASS:
    case EventType::DANGEROUS_DOWNLOAD_BYPASS:
    case EventType::PASSWORD_REUSE_MODAL_BYPASS:
    case EventType::EXTENSION_ALLOWLIST_INSTALL_BYPASS:
    case EventType::NON_ALLOWLISTED_EXTENSION_RE_ENABLED:
    case EventType::HASH_PREFIX_REAL_TIME_INTERSTITIAL_BYPASS:
    case EventType::ANDROID_SAFEBROWSING_REAL_TIME_INTERSTITIAL_BYPASS:
    case EventType::ANDROID_SAFEBROWSING_INTERSTITIAL_BYPASS:
    case EventType::GLIC_COUNTER_ABUSE_INTERSTITIAL_BYPASS:
      return true;
  }
}

bool SafeBrowsingMetricsCollector::IsSecuritySensitiveEventType(
    const EventType& type) {
  switch (type) {
    case EventType::USER_STATE_DISABLED:
    case EventType::USER_STATE_ENABLED:
    case EventType::DATABASE_INTERSTITIAL_BYPASS:
    case EventType::CSD_INTERSTITIAL_BYPASS:
    case EventType::URL_REAL_TIME_INTERSTITIAL_BYPASS:
    case EventType::DANGEROUS_DOWNLOAD_BYPASS:
    case EventType::PASSWORD_REUSE_MODAL_BYPASS:
    case EventType::EXTENSION_ALLOWLIST_INSTALL_BYPASS:
    case EventType::NON_ALLOWLISTED_EXTENSION_RE_ENABLED:
    case EventType::HASH_PREFIX_REAL_TIME_INTERSTITIAL_BYPASS:
    case EventType::ANDROID_SAFEBROWSING_REAL_TIME_INTERSTITIAL_BYPASS:
    case EventType::ANDROID_SAFEBROWSING_INTERSTITIAL_BYPASS:
    case EventType::GLIC_COUNTER_ABUSE_INTERSTITIAL_BYPASS:
      return false;
    case EventType::SECURITY_SENSITIVE_SAFE_BROWSING_INTERSTITIAL:
    case EventType::SECURITY_SENSITIVE_SSL_INTERSTITIAL:
    case EventType::SECURITY_SENSITIVE_PASSWORD_PROTECTION:
    case EventType::SECURITY_SENSITIVE_DOWNLOAD:
    case EventType::DOWNLOAD_DEEP_SCAN:
      return true;
  }
}

std::string_view SafeBrowsingMetricsCollector::GetUserStateMetricSuffix(
    const UserState& user_state) {
  switch (user_state) {
    case UserState::kStandardProtection:
      return "StandardProtection";
    case UserState::kEnhancedProtection:
      return "EnhancedProtection";
    case UserState::kManaged:
      return "Managed";
  }
}

std::string SafeBrowsingMetricsCollector::GetTimesDisabledSuffix() {
  const std::optional<Event> latest_enabled_event = GetLatestEventFromEventType(
      UserState::kEnhancedProtection, EventType::USER_STATE_ENABLED);

  if (!latest_enabled_event) {
    // This code path could be possible if ESB was enabled via policy but
    // later disabled by the user, since policy enables/disables are not
    // tracked. It's also possible if it's been longer than kEventMaxDurationDay
    // days since the latest enabled event.
    return "NeverEnabled";
  }
  const auto hours_since_enabled =
      (base::Time::Now() - latest_enabled_event.value().timestamp).InHours();
  return hours_since_enabled < kEsbShortEnabledUpperBoundHours
             ? "ShortEnabled"
             : hours_since_enabled < kEsbLongEnabledLowerBoundHours
                   ? "MediumEnabled"
                   : "LongEnabled";
}

SafeBrowsingMetricsCollector::Event::Event(EventType type, base::Time timestamp)
    : type(type), timestamp(timestamp) {}

}  // namespace safe_browsing
