#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-2.0-only
"""Apply FV01 (QCS6490 qcom-venus) + FV04 (QCS8550 qcom-iris) VPU hardware acceleration
patches and Debian build optimizations to extracted ungoogled-chromium 156 source tree.
"""
from __future__ import annotations

import sys
from pathlib import Path


REVERT_MODE = False


def replace_once(path: Path, old: str, new: str) -> None:
    if REVERT_MODE:
        old, new = new, old
    txt = path.read_text(encoding="utf-8")
    if new in txt:
        print(f"[already {'reverted' if REVERT_MODE else 'patched'}] {path}")
        return
    cnt = txt.count(old)
    if cnt != 1:
        raise RuntimeError(f"[{path}] expected 1 match, found {cnt} for:\n{old[:240]}")
    path.write_text(txt.replace(old, new, 1), encoding="utf-8")
    print(f"[{'reverted' if REVERT_MODE else 'patched'}] {path}")


def main() -> None:
    global REVERT_MODE
    args = [a for a in sys.argv[1:] if a != "--revert-cpp"]
    REVERT_MODE = "--revert-cpp" in sys.argv[1:]
    src = Path(args[0] if args else "/work/uc-build/src")
    assert (src / "debian" / "rules").exists(), f"Invalid source root: {src}"

    # 1. media/base/media_switches.cc: enable Linux HW decode/encode & VA-API driver check bypass by default
    ms = src / "media/base/media_switches.cc"
    replace_once(
        ms,
        """BASE_FEATURE(kAcceleratedVideoDecodeLinux,
             "AcceleratedVideoDecoder",
#if BUILDFLAG(USE_VAAPI)
             base::FEATURE_ENABLED_BY_DEFAULT);
#else
             base::FEATURE_DISABLED_BY_DEFAULT);
#endif""",
        """BASE_FEATURE(kAcceleratedVideoDecodeLinux,
             "AcceleratedVideoDecoder",
             base::FEATURE_ENABLED_BY_DEFAULT);""",
    )
    replace_once(
        ms,
        """BASE_FEATURE(kAcceleratedVideoEncodeLinux,
             "AcceleratedVideoEncoder",
             base::FEATURE_DISABLED_BY_DEFAULT);""",
        """BASE_FEATURE(kAcceleratedVideoEncodeLinux,
             "AcceleratedVideoEncoder",
             base::FEATURE_ENABLED_BY_DEFAULT);""",
    )
    replace_once(
        ms,
        "BASE_FEATURE(kVaapiIgnoreDriverChecks, base::FEATURE_DISABLED_BY_DEFAULT);",
        "BASE_FEATURE(kVaapiIgnoreDriverChecks, base::FEATURE_ENABLED_BY_DEFAULT);",
    )

    # 2. media/base/decoder.cc:
    #    Centralize runtime Qualcomm VPU backend selection inside ActiveLinuxVideoDecoderType()
    #    so GpuMojoMediaClientLinux, VideoDecoderPipeline, ImageProcessorFactory,
    #    GpuVideoEncodeAcceleratorFactory, and VideoFrameMapperFactory all share one backend:
    #      - FV01 (QCS6490 qcom-venus HFI Gen1) -> native V4L2StatefulVideoDecoder
    #      - FV04 (QCS8550 qcom-iris HFI Gen2)  -> VaapiVideoDecoder (qcom-va-driver: H.264/HEVC/VP9/AV1)
    #                                              with automatic fallback to V4L2StatefulVideoDecoder
    #      - Explicit --enable/disable-features=PreferV4L2VideoAcceleration always honored!
    dec = src / "media/base/decoder.cc"
    replace_once(
        dec,
        '#include "base/feature_list.h"\n',
        '#include <cstring>\n'
        '#include <fcntl.h>\n'
        '#include <linux/videodev2.h>\n'
        '#include <sys/ioctl.h>\n'
        '#include <unistd.h>\n\n'
        '#include "base/feature_list.h"\n'
        '#include "base/strings/stringprintf.h"\n',
    )
    replace_once(
        dec,
        """#if BUILDFLAG(USE_VAAPI) || BUILDFLAG(USE_V4L2_CODEC)
VideoDecoderType ActiveLinuxVideoDecoderType() {
#if BUILDFLAG(USE_VAAPI) && BUILDFLAG(USE_V4L2_CODEC)
  return base::FeatureList::IsEnabled(kPreferV4L2VideoAcceleration)
             ? VideoDecoderType::kV4L2
             : VideoDecoderType::kVaapi;
#elif BUILDFLAG(USE_VAAPI)""",
        """#if BUILDFLAG(USE_VAAPI) || BUILDFLAG(USE_V4L2_CODEC)
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
#elif BUILDFLAG(USE_VAAPI)""",
    )

    # 3. media/gpu/v4l2/v4l2_utils.cc:
    #    - map Qualcomm UBWC Q08C/Q10C V4L2 formats to DRM_FORMAT_MOD_QCOM_COMPRESSED on Desktop Linux
    #    - prioritize /dev/video-dec0 and include HEVC + AV1 in stateful codecs
    vu = src / "media/gpu/v4l2/v4l2_utils.cc"
    replace_once(
        vu,
        """#if BUILDFLAG(IS_LINUX)
  if (video_fourcc == Fourcc(Fourcc::MM21)) {
    modifiers = DRM_FORMAT_MOD_MTK_16L_32S_TILE;
  } else {
    modifiers = DRM_FORMAT_MOD_LINEAR;
  }
#endif""",
        """#if BUILDFLAG(IS_LINUX)
  if (video_fourcc == Fourcc(Fourcc::MM21)) {
    modifiers = DRM_FORMAT_MOD_MTK_16L_32S_TILE;
  } else if (video_fourcc == Fourcc(Fourcc::Q08C) ||
             video_fourcc == Fourcc(Fourcc::Q10C)) {
    modifiers = DRM_FORMAT_MOD_QCOM_COMPRESSED;
  } else {
    modifiers = DRM_FORMAT_MOD_LINEAR;
  }
#endif""",
    )
    replace_once(
        vu,
        """#else
  constexpr char kVideoDevicePattern[] = "/dev/video";
  constexpr int kMaxDevices = 256;
  candidate_paths.reserve(kMaxDevices);""",
        """#else
  constexpr char kVideoDevicePattern[] = "/dev/video";
  constexpr int kMaxDevices = 256;
  candidate_paths.reserve(kMaxDevices + 1);
  candidate_paths.push_back("/dev/video-dec0");""",
    )
    replace_once(
        vu,
        """  constexpr std::array<uint32_t, 4> kSupportedStatefulInputCodecs = {
      V4L2_PIX_FMT_H264,
      V4L2_PIX_FMT_VP8,
      V4L2_PIX_FMT_VP9,
  };""",
        """  constexpr std::array<uint32_t, 5> kSupportedStatefulInputCodecs = {
      V4L2_PIX_FMT_H264,
#if BUILDFLAG(ENABLE_HEVC_PARSER_AND_HW_DECODER)
      V4L2_PIX_FMT_HEVC,
#else
      V4L2_PIX_FMT_H264,
#endif
      V4L2_PIX_FMT_VP8,
      V4L2_PIX_FMT_VP9,
      V4L2_PIX_FMT_AV1,
  };""",
    )

    # 4. media/gpu/v4l2/v4l2_device.cc: prioritize /dev/video-dec0 and /dev/video-enc0 before /dev/video0..255
    vd = src / "media/gpu/v4l2/v4l2_device.cc"
    replace_once(
        vd,
        """#else
  // On mainline Linux we need to check a much larger number of devices, mainly
  // because the device pattern is shared with ISP devices.
  constexpr int kMaxDevices = 256;
  candidate_paths.reserve(kMaxDevices);""",
        """#else
  // On mainline Linux check /dev/video-dec0 or /dev/video-enc0 symlink first,
  // then scan /dev/video0..255 (shared with Qualcomm CamSS ISP nodes).
  constexpr int kMaxDevices = 256;
  candidate_paths.reserve(kMaxDevices + 1);
  if (type == Type::kDecoder) {
    candidate_paths.push_back("/dev/video-dec0");
  } else if (type == Type::kEncoder) {
    candidate_paths.push_back("/dev/video-enc0");
  }""",
    )

    # 5. media/gpu/v4l2/v4l2_stateful_video_decoder.cc: unlock Annex-B HEVC stateful hardware decode
    vsd = src / "media/gpu/v4l2/v4l2_stateful_video_decoder.cc"
    replace_once(
        vsd,
        """    for (auto& a : processed_buffer_and_decode_cbs) {
      decoder_buffer_and_callbacks_.push(std::move(a));
    }

  } else if (VideoCodecProfileToVideoCodec(config_.profile()) ==
             VideoCodec::kHEVC) {
    NOTIMPLEMENTED();
    std::move(decode_cb).Run(DecoderStatus::Codes::kUnsupportedCodec);
    return;
  } else {
    decoder_buffer_and_callbacks_.emplace(std::move(buffer),
                                          std::move(decode_cb));
  }""",
        """    for (auto& a : processed_buffer_and_decode_cbs) {
      decoder_buffer_and_callbacks_.push(std::move(a));
    }

  } else {
    decoder_buffer_and_callbacks_.emplace(std::move(buffer),
                                          std::move(decode_cb));
  }""",
    )

    # 6. content/common/gpu_pre_sandbox_hook_linux.cc & media/gpu/sandbox/hardware_video_encoding_sandbox_hook_linux.cc:
    #    Allow V4L2 nodes, DMA heaps, DRM render nodes, COMMAND_READLINK, and Qualcomm VA-API driver .so
    #    inside the GPU and video-encoding sandboxes on Desktop ARM64 Linux (not just ChromeOS!)
    sb = src / "content/common/gpu_pre_sandbox_hook_linux.cc"
    replace_once(
        sb,
        """      std::ostringstream mediaDevicePath;
      mediaDevicePath << kDevicePath << kMediaDecBase << i;
      permissions->push_back(
          BrokerFilePermission::ReadWrite(mediaDevicePath.str()));
    }
  }""",
        """      std::ostringstream mediaDevicePath;
      mediaDevicePath << kDevicePath << kMediaDecBase << i;
      permissions->push_back(
          BrokerFilePermission::ReadWrite(mediaDevicePath.str()));
    }
    for (size_t i = 0; i < 64; i++) {
      std::ostringstream videoNode;
      videoNode << "/dev/video" << i;
      permissions->push_back(BrokerFilePermission::ReadWrite(videoNode.str()));
    }
    for (size_t i = 0; i < 16; i++) {
      std::ostringstream mediaNode;
      mediaNode << "/dev/media" << i;
      permissions->push_back(BrokerFilePermission::ReadWrite(mediaNode.str()));
    }
    permissions->push_back(BrokerFilePermission::ReadWrite("/dev/dma_heap/system"));
    permissions->push_back(BrokerFilePermission::ReadWrite("/dev/dma_heap/linux,cma"));
    permissions->push_back(BrokerFilePermission::ReadOnly(
        "/usr/lib/aarch64-linux-gnu/dri/qcom_drv_video.so"));
    permissions->push_back(BrokerFilePermission::ReadOnly(
        "/usr/lib/aarch64-linux-gnu/dri/msm_drv_video.so"));
  }""",
    )
    replace_once(
        sb,
        """  if (IsChromeOS() &&
      (options.use_amd_specific_policies ||
       options.use_intel_specific_policies ||
       options.use_nvidia_specific_policies ||
       options.use_virtio_specific_policies || IsArchitectureArm())) {
    command_set.set(sandbox::syscall_broker::COMMAND_READLINK);
  }""",
        """  if (IsArchitectureArm() ||
      (IsChromeOS() &&
       (options.use_amd_specific_policies ||
        options.use_intel_specific_policies ||
        options.use_nvidia_specific_policies ||
        options.use_virtio_specific_policies))) {
    command_set.set(sandbox::syscall_broker::COMMAND_READLINK);
  }""",
    )
    replace_once(
        sb,
        """  AddStandardGpuPermissions(&permissions);
  return permissions;
}""",
        """  if (UseV4L2Codec(options)) {
    AddV4L2GpuPermissions(&permissions, options);
  }
  if (IsArchitectureArm()) {
    AddDrmGpuPermissions(&permissions);
  }
  AddStandardGpuPermissions(&permissions);
  return permissions;
}""",
    )

    esb = src / "media/gpu/sandbox/hardware_video_encoding_sandbox_hook_linux.cc"
    replace_once(
        esb,
        """  static const char kDevImageProc0Path[] = "/dev/image-proc0";
  permissions.push_back(BrokerFilePermission::ReadWrite(kDevImageProc0Path));
#endif  // BUILDFLAG(USE_V4L2_CODEC)""",
        """  static const char kDevImageProc0Path[] = "/dev/image-proc0";
  permissions.push_back(BrokerFilePermission::ReadWrite(kDevImageProc0Path));
  for (size_t i = 0; i < 64; i++) {
    permissions.push_back(
        BrokerFilePermission::ReadWrite(base::StringPrintf("/dev/video%zu", i)));
  }
  permissions.push_back(BrokerFilePermission::ReadWrite("/dev/dma_heap/system"));
  permissions.push_back(BrokerFilePermission::ReadWrite("/dev/dma_heap/linux,cma"));
  permissions.push_back(BrokerFilePermission::ReadOnly(
      "/usr/lib/aarch64-linux-gnu/dri/qcom_drv_video.so"));
  permissions.push_back(BrokerFilePermission::ReadOnly(
      "/usr/lib/aarch64-linux-gnu/dri/msm_drv_video.so"));
#endif  // BUILDFLAG(USE_V4L2_CODEC)""",
    )
    replace_once(
        esb,
        """    if (stat(path.c_str(), &st) == 0) {
      permissions.push_back(options.use_amd_specific_policies
                                ? BrokerFilePermission::ReadWrite(path)
                                : BrokerFilePermission::ReadOnly(path));""",
        """    if (stat(path.c_str(), &st) == 0) {
      permissions.push_back(BrokerFilePermission::ReadWrite(path));""",
    )

    if REVERT_MODE:
        print("ALL_QCOM_FV_CPP_PATCHES_REVERTED_OK")
        return

    # 7. debian/rules, debian/changelog, and debian/etc/default-flags
    rules = src / "debian/rules"
    replace_once(
        rules,
        "defines+=host_cpu=\\\"arm64\\\" use_v4l2_codec=true use_vaapi=true\n"
        "# use_av1_hw_decoder is enabled by default for vaapi, but disabled for\n"
        "# v4l2, we can remove it when chromium enables it for v4l2 by default\n"
        "defines+=use_av1_hw_decoder=true",
        "defines+=host_cpu=\\\"arm64\\\" use_v4l2_codec=true use_vaapi=true\n"
        "defines+=use_av1_hw_decoder=true enable_hevc_parser_and_hw_decoder=true enable_platform_hevc=true",
    )
    replace_once(
        rules,
        "defines+=use_thin_lto=true",
        "defines+=use_thin_lto=false concurrent_links=2 blink_symbol_level=0 v8_symbol_level=0",
    )
    replace_once(
        rules,
        """\tsed -i '/^  solibs =/ s! \\./libtest_trace_processor\\.so!!' out/Release/obj/content/shell/content_shell.ninja
\ttest ! -d pre-gen || python3 debian/deb_pre_gen.py -C out/Release add-ninja-hooks
\t# XtraDeb workaround for https://crbug.com/40943790
\tninja $(CR_VERBOSE) -j$(njobs) -C out/Release ui/webui/resources/cr_components/history_clusters:build_ts
\t$(keepalive) ninja $(CR_VERBOSE) -j$(njobs) -C out/Release chrome chrome_sandbox content_shell chromedriver headless_shell
\tcp out/Release/chrome out/Release/chromium
\tcp out/Release/content_shell out/Release/chromium-shell
\tcp out/Release/headless_shell out/Release/chromium-headless-shell
\tcp out/Release/chrome_sandbox out/Release/chrome-sandbox
\tcp out/Release/chromedriver out/Release/ungoogled-chromedriver""",
        """\ttest ! -d pre-gen || python3 debian/deb_pre_gen.py -C out/Release add-ninja-hooks
\t# XtraDeb workaround for https://crbug.com/40943790
\tninja $(CR_VERBOSE) -j$(njobs) -C out/Release ui/webui/resources/cr_components/history_clusters:build_ts
\t$(keepalive) ninja $(CR_VERBOSE) -j$(njobs) -C out/Release chrome chrome_sandbox chrome_crashpad_handler
\tcp out/Release/chrome out/Release/chromium
\tcp out/Release/chrome_sandbox out/Release/chrome-sandbox""",
    )
    replace_once(
        rules,
        """domain-substitution:
\ttest -d .pc/domain-substitution.VIRTUAL.patch \\
\t|| debian/ungoogled-domain-substitution.sh""",
        """domain-substitution:
\ttest -d .pc/domain-substitution.VIRTUAL.patch \\
\t|| (mkdir -p .pc && debian/ungoogled-domain-substitution.sh)""",
    )

    ctrl = src / "debian/control"
    ctrl_txt = ctrl.read_text(encoding="utf-8")
    for drop_pkg in (
        "ungoogled-chromium-shell",
        "ungoogled-chromium-headless-shell",
        "ungoogled-chromium-driver",
    ):
        marker = f"\nPackage: {drop_pkg}\n"
        if marker in ctrl_txt:
            start = ctrl_txt.index(marker)
            nxt = ctrl_txt.find("\nPackage: ", start + len(marker))
            ctrl_txt = ctrl_txt[:start] + (ctrl_txt[nxt:] if nxt != -1 else "\n")
            print(f"[trimmed stanza] {drop_pkg}")
    ctrl.write_text(ctrl_txt, encoding="utf-8")

    cl = src / "debian/changelog"
    cl_txt = cl.read_text(encoding="utf-8")
    new_entry = (
        "ungoogled-chromium (156.0.8078.108-1.1+fv01fv04) resolute; urgency=medium\n\n"
        "  * Enable Qualcomm Venus (FV01 QCS6490) V4L2 stateful H.264/HEVC/VP9 decode\n"
        "    and Qualcomm Iris (FV04 QCS8550) VA-API + V4L2 H.264/HEVC/VP9/AV1 decode\n"
        "    with automatic runtime board VPU detection and GPU sandbox allowlisting.\n\n"
        " -- DevKit Builder <builder@localhost>  Thu, 26 Nov 2026 00:45:00 +0800\n\n"
    )
    if "+fv01fv04" not in cl_txt[:200]:
        cl.write_text(new_entry + cl_txt, encoding="utf-8")
        print(f"[patched] {cl}")

    df = src / "debian/etc/default-flags"
    df_txt = df.read_text(encoding="utf-8")
    addon = (
        "\n# Qualcomm FV01 (QCS6490 Venus) & FV04 (QCS8550 Iris) GPU/VPU defaults\n"
        "export LIBVA_DRIVER_NAME=\"${LIBVA_DRIVER_NAME:-qcom}\"\n"
        "export IRIS_VAAPI_DEVICE=\"${IRIS_VAAPI_DEVICE:-/dev/video-dec0}\"\n"
        "export IRIS_VAAPI_ENCODER_DEVICE=\"${IRIS_VAAPI_ENCODER_DEVICE:-/dev/video-enc0}\"\n"
        "export CHROMIUM_FLAGS=\"$CHROMIUM_FLAGS --ozone-platform-hint=auto --ignore-gpu-blocklist --enable-gpu-rasterization --enable-zero-copy\"\n"
    )
    if "IRIS_VAAPI_DEVICE" not in df_txt:
        df.write_text(df_txt + addon, encoding="utf-8")
        print(f"[patched] {df}")

    print("ALL_QCOM_FV_CHROMIUM_PATCHES_APPLIED_OK")


if __name__ == "__main__":
    main()
