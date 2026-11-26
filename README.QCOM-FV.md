# ungoogled-chromium 156（高通 FV01 QCS6490 / FV04 QCS8550 硬件视频加速适配版）

本仓库保存适配高通 ARM64 Linux 开发板 **FV01（QCS6490，`qcom-venus`）** 与 **FV04（QCS8550，`qcom-iris`）** 的 `ungoogled-chromium` 完整可编译源码树（基线版本：`156.0.8078.108-1.1xtradeb1.2604.1`，定制包版本：`156.0.8078.108-1.1+fv01fv04`）。

## 1. 主要适配内容

1. **双板运行时解码后端自动选择（`media/base/decoder.cc`）**
   - 在 `ActiveLinuxVideoDecoderType()` 中通过 `VIDIOC_QUERYCAP` 自动识别当前开发板 VPU 驱动，使 `VideoDecoderPipeline`、`GpuMojoMediaClientLinux`、`ImageProcessorFactory`、`GpuVideoEncodeAcceleratorFactory` 与 `VideoFrameMapperFactory` 共享一致的运行时后端：
     - **FV01（QCS6490，`qcom-venus`）**：自动选用原生 `V4L2StatefulVideoDecoder`（无需 VA-API 驱动）；
     - **FV04（QCS8550，`qcom-iris`）**：检测到 `qcom_drv_video.so` 时自动选用 `VaapiVideoDecoder`（支持 H.264 / HEVC / VP9 / AV1 零拷贝硬解），未安装 VA-API 驱动时自动回退至 `V4L2StatefulVideoDecoder`；
     - 显式传入 `--enable-features=PreferV4L2VideoAcceleration` 或 `--disable-features=PreferV4L2VideoAcceleration` 时，始终优先服从命令行参数。
2. **补齐原生 V4L2 状态机解码链路（`media/gpu/v4l2/`）**
   - `v4l2_utils.cc` / `v4l2_device.cc`：优先探测 `/dev/video-dec0` 与 `/dev/video-enc0` 固定符号链接，规避与 `qcom-camss` 摄像头节点的编号竞争；
   - `v4l2_utils.cc`：在状态机输入格式白名单 `kSupportedStatefulInputCodecs` 中启用 `V4L2_PIX_FMT_HEVC` 与 `V4L2_PIX_FMT_AV1`，并将桌面 Linux 下的高通压缩像素格式 `Q08C` / `Q10C` 正确映射至 `DRM_FORMAT_MOD_QCOM_COMPRESSED`；
   - `v4l2_stateful_video_decoder.cc`：移除对 `VideoCodec::kHEVC` 的 `NOTIMPLEMENTED()` 拦截，放行已完成 Annex-B 转换的 HEVC 码流进入硬件解码队列。
3. **桌面 ARM64 Linux GPU 沙箱放行（`content/common/gpu_pre_sandbox_hook_linux.cc`）**
   - 在非 ChromeOS 的桌面 ARM64 Linux 环境下补齐 `AddV4L2GpuPermissions()`、`AddDrmGpuPermissions()` 与 `COMMAND_READLINK`，允许沙箱内 GPU 进程按需访问 `/dev/video-dec0..4`、`/dev/video-enc0..4`、`/dev/video0..63`、`/dev/media0..15`、`/dev/dma_heap/{system,linux,cma}`、`/dev/dri/renderD*` 及 `qcom_drv_video.so`。
4. **默认特性与 Debian 构建配置（`media/base/media_switches.cc`、`debian/`）**
   - 默认开启 `AcceleratedVideoDecoder`、`AcceleratedVideoEncoder` 与 `VaapiIgnoreDriverChecks`；
   - ARM64 构建开启 `use_v4l2_codec=true use_vaapi=true use_av1_hw_decoder=true enable_hevc_parser_and_hw_decoder=true enable_platform_hevc=true`；
   - 针对开发板原生编译关闭 `use_thin_lto` 并裁剪未使用的 `shell` / `headless-shell` / `driver` 目标，仅构建 `ungoogled-chromium`、`ungoogled-chromium-common` 与 `ungoogled-chromium-sandbox`。

## 2. 在开发板（Ubuntu 26.04 ARM64）原生构建

```bash
sudo apt-get update
sudo apt-get build-dep -y .
export DEB_BUILD_OPTIONS="parallel=6 nocheck terse"
dpkg-buildpackage -B -uc -us
```

构建产物位于上级目录：
- `ungoogled-chromium_156.0.8078.108-1.1+fv01fv04_arm64.deb`
- `ungoogled-chromium-common_156.0.8078.108-1.1+fv01fv04_arm64.deb`
- `ungoogled-chromium-sandbox_156.0.8078.108-1.1+fv01fv04_arm64.deb`

## 3. 板级配套要求

- 部署 `/etc/udev/rules.d/61-qcom-vpu-dec.rules`，将 `qcom-venus-decoder` / `qcom-iris-decoder` 固定链接到 `/dev/video-dec0`；
- FV04 若使用 VA-API 路径，需安装 `qcom-va-driver` 并合入主线 `qcom-iris` HFI gen2 解码顺序与缓冲区池补丁；
- 若需在 FV04 上强制切换测试原生 V4L2 路径，可附加启动参数：`--enable-features=PreferV4L2VideoAcceleration`。
