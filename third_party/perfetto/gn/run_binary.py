# Copyright (C) 2025 The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Runs a binary.

This script exists because GN action only works with python scripts."""

import sys
import subprocess

# Debian cross-build support
import os
wrapper = []
wrapper_env = os.environ.get('HOST_EXEC_WRAPPER')
if wrapper_env:
  wrapper = wrapper_env.split()

if __name__ == '__main__':
  sys.exit(subprocess.call(wrapper + sys.argv[1:]))
