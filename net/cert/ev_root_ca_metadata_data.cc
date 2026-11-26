// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "net/cert/internal/chrome_root_store_data.h"

namespace net {

namespace {

static const EVMetadata kEvRootCaMetadata[] = {
    // need some dummy thing to make compiler happy, because
    // arraysize() is implemented as a convoluted template rather than
    // the traditional sizeof(x)/sizeof(*x)
    { { { 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
          0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff } },
      {
        "0",
      }
    }
};

}  // namespace

base::span<const EVMetadata> GetEvRootCaMetadata() {
  return kEvRootCaMetadata;
}

}  // namespace net
