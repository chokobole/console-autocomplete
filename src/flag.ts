// Copyright (c) 2020 Wonyong Kim (chokobole33@gmail.com) . All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

export interface Flag {
  // name, shortName and longName should contain alphabet or digit only.
  name?: string;
  shortName?: string; // It starts with "-"
  longName?: string; // It starts with "--"
  help?: string;
  isSequential?: boolean; // Indicates it can be set repeatedly. shortName or longName should be set.
  needsValue?: boolean; // Indicates it needs value. shortName or longName should be set.
  subFlags?: Flag[]; // name should be set.
}
