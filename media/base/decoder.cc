// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "media/base/decoder.h"

#include <cstring>
#include <fcntl.h>
#include <linux/videodev2.h>
#include <sys/ioctl.h>
#include <unistd.h>

#include "base/feature_list.h"
#include "base/strings/stringprintf.h"
#include "base/notreached.h"
#include "media/base/media_switches.h"
#include "media/gpu/buildflags.h"

namespace media {

Decoder::Decoder() = default;

Decoder::~Decoder() = default;

bool Decoder::IsPlatformDecoder() const {
  return false;
}

bool Decoder::SupportsDecryption() const {
  return false;
}

const char* GetDecoderName(VideoDecoderType type) {
  switch (type) {
    case VideoDecoderType::kUnknown:
      return "Unknown Video Decoder";
    case VideoDecoderType::kFFmpeg:
      return "FFmpegVideoDecoder";
    case VideoDecoderType::kVpx:
      return "VpxVideoDecoder";
    case VideoDecoderType::kAom:
      return "AomVideoDecoder";
    case VideoDecoderType::kMojo:
      return "MojoVideoDecoder";
    case VideoDecoderType::kDecrypting:
      return "DecryptingVideoDecoder";
    case VideoDecoderType::kDav1d:
      return "Dav1dVideoDecoder";
    case VideoDecoderType::kFuchsia:
      return "FuchsiaVideoDecoder";
    case VideoDecoderType::kMediaCodec:
      return "MediaCodecVideoDecoder";
    case VideoDecoderType::kD3D11:
      return "D3D11VideoDecoder";
    case VideoDecoderType::kVaapi:
      return "VaapiVideoDecoder";
    case VideoDecoderType::kBroker:
      return "VideoDecoderBroker";
    case VideoDecoderType::kVda:
      return "VDAVideoDecoder";
    case VideoDecoderType::kV4L2:
      return "V4L2VideoDecoder";
    case VideoDecoderType::kTesting:
      return "Testing or Mock Video decoder";
    case VideoDecoderType::kOutOfProcess:
      return "OOPVideoDecoder";
    case VideoDecoderType::kVideoToolbox:
      return "VideoToolboxVideoDecoder";
  }
}

const char* GetDecoderName(AudioDecoderType type) {
  switch (type) {
    case AudioDecoderType::kUnknown:
      return "Unknown Audio Decoder";
    case AudioDecoderType::kFFmpeg:
      return "FFmpegAudioDecoder";
    case AudioDecoderType::kMojo:
      return "MojoAudioDecoder";
    case AudioDecoderType::kDecrypting:
      return "DecryptingAudioDecoder";
    case AudioDecoderType::kMediaCodec:
      return "MediaCodecAudioDecoder";
    case AudioDecoderType::kBroker:
      return "AudioDecoderBroker";
    case AudioDecoderType::kPassthroughDTS:
      return "PassthroughDTSAudioDecoder";
    case AudioDecoderType::kTesting:
      return "Testing or Mock Audio decoder";
    case AudioDecoderType::kAudioToolbox:
      return "AudioToolboxAudioDecoder";
    case AudioDecoderType::kMediaFoundation:
      return "MediaFoundationAudioDecoder";
    case AudioDecoderType::kSymphonia:
      return "SymphoniaAudioDecoder";
    case AudioDecoderType::kOpus:
      return "OpusAudioDecoder";
    case AudioDecoderType::kIamf:
      return "IamfAudioDecoder";
  }
}

std::ostream& operator<<(std::ostream& out, AudioDecoderType type) {
  return out << GetDecoderName(type);
}

std::ostream& operator<<(std::ostream& out, VideoDecoderType type) {
  return out << GetDecoderName(type);
}

#if BUILDFLAG(USE_VAAPI) || BUILDFLAG(USE_V4L2_CODEC)
VideoDecoderType ActiveLinuxVideoDecoderType() {
#if BUILDFLAG(USE_VAAPI) && BUILDFLAG(USE_V4L2_CODEC)
  if (auto* fl = base::FeatureList::GetInstance();
      fl && fl->IsFeatureOverridden(kPreferV4L2VideoAcceleration.name)) {
    return base::FeatureList::IsEnabled(kPreferV4L2VideoAcceleration)
               ? VideoDecoderType::kV4L2
               : VideoDecoderType::kVaapi;
  }

  static const VideoDecoderType kAutoDetected = []() {
    bool has_venus = false;
    bool has_iris = false;
    auto probe_node = [&](const char* path) {
      int fd = open(path, O_RDWR | O_NONBLOCK | O_CLOEXEC);
      if (fd < 0) {
        return;
      }
      struct v4l2_capability caps = {};
      if (ioctl(fd, VIDIOC_QUERYCAP, &caps) == 0) {
        const char* drv = reinterpret_cast<const char*>(caps.driver);
        const char* card = reinterpret_cast<const char*>(caps.card);
        if (strstr(drv, "venus") || strstr(card, "Venus") ||
            strstr(card, "venus")) {
          has_venus = true;
        } else if (strstr(drv, "iris") || strstr(card, "Iris") ||
                   strstr(card, "iris")) {
          has_iris = true;
        }
      }
      close(fd);
    };

    probe_node("/dev/video-dec0");
    if (!has_venus && !has_iris) {
      for (int i = 0; i < 32 && !has_venus && !has_iris; ++i) {
        std::string dev = base::StringPrintf("/dev/video%d", i);
        probe_node(dev.c_str());
      }
    }

    const bool has_qcom_vaapi =
        access("/usr/lib/aarch64-linux-gnu/dri/qcom_drv_video.so", R_OK) == 0 ||
        access("/usr/lib/aarch64-linux-gnu/dri/msm_drv_video.so", R_OK) == 0;

    if (has_venus && !has_iris) {
      return VideoDecoderType::kV4L2;
    }
    if (has_iris) {
      return has_qcom_vaapi ? VideoDecoderType::kVaapi
                            : VideoDecoderType::kV4L2;
    }
    return base::FeatureList::IsEnabled(kPreferV4L2VideoAcceleration)
               ? VideoDecoderType::kV4L2
               : VideoDecoderType::kVaapi;
  }();
  return kAutoDetected;
#elif BUILDFLAG(USE_VAAPI)
  return VideoDecoderType::kVaapi;
#elif BUILDFLAG(USE_V4L2_CODEC)
  return VideoDecoderType::kV4L2;
#endif
}
#endif  // BUILDFLAG(USE_VAAPI) || BUILDFLAG(USE_V4L2_CODEC)

}  // namespace media
