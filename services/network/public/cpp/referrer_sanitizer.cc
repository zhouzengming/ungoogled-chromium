// Copyright 2023 The ungoogled-chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "services/network/public/cpp/referrer_sanitizer.h"

#include "base/feature_list.h"
#include "services/network/public/cpp/features.h"
#include "url/origin.h"

namespace referrer_sanitizer {

static GURL sanitize_referrer_internal(const GURL& origin,
                                       const GURL& destination) {
  if ((base::FeatureList::IsEnabled(network::features::kNoCrossOriginReferrers) ||
       base::FeatureList::IsEnabled(network::features::kMinimalReferrers)) &&
      !url::IsSameOriginWith(origin, destination)) {
    return GURL();
  } else if (base::FeatureList::IsEnabled(network::features::kMinimalReferrers)) {
    return url::Origin::Create(origin).GetURL();
  }
  return origin;
}

std::pair<GURL, net::ReferrerPolicy> sanitize_referrer(
    const GURL& origin,
    const GURL& destination,
    const net::ReferrerPolicy& referrer_policy,
    bool enable_referrers) {
  if (!enable_referrers) {
    return {GURL(), net::ReferrerPolicy::NO_REFERRER};
  }
  return {sanitize_referrer_internal(std::move(origin), std::move(destination)),
          referrer_policy};
}

std::pair<GURL, network::mojom::ReferrerPolicy> sanitize_referrer(
    const GURL& origin,
    const GURL& destination,
    const network::mojom::ReferrerPolicy& referrer_policy,
    bool enable_referrers) {
  if (!enable_referrers) {
    return {GURL(), network::mojom::ReferrerPolicy::kNever};
  }
  return {sanitize_referrer_internal(std::move(origin), std::move(destination)),
          referrer_policy};
}

}  // namespace referrer_sanitizer
