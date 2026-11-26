// Copyright 2023 The ungoogled-chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef SERVICES_NETWORK_PUBLIC_CPP_REFERRER_SANITIZER_H_
#define SERVICES_NETWORK_PUBLIC_CPP_REFERRER_SANITIZER_H_

#include <string>
#include <utility>
#include "net/url_request/referrer_policy.h"
#include "services/network/public/mojom/referrer_policy.mojom-shared.h"
#include "url/gurl.h"

namespace referrer_sanitizer {

COMPONENT_EXPORT(NETWORK_CPP)
std::pair<GURL, net::ReferrerPolicy> sanitize_referrer(
    const GURL& origin,
    const GURL& destination,
    const net::ReferrerPolicy& referrer_policy,
    bool enable_referrers);

COMPONENT_EXPORT(NETWORK_CPP)
std::pair<GURL, network::mojom::ReferrerPolicy> sanitize_referrer(
    const GURL& origin,
    const GURL& destination,
    const network::mojom::ReferrerPolicy& referrer_policy,
    bool enable_referrers);

}  // namespace referrer_sanitizer

#endif  // SERVICES_NETWORK_PUBLIC_CPP_REFERRER_SANITIZER_H_
