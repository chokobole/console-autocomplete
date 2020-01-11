// Copyright (c) 2020 Wonyong Kim (chokobole33@gmail.com) . All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { writeFileSync } from 'fs';

import { bashTemplate } from './shell_template';

if (process.argv.length < 4) {
  process.exit(1);
}

writeFileSync(
  process.argv[3],
  bashTemplate({
    command: process.argv[2],
  })
);
