// Copyright (c) 2020 Wonyong Kim (chokobole33@gmail.com) . All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { readFileSync } from 'fs';

import { Flag } from './flag';

interface FlagInfo extends Flag {
  shouldRemove?: boolean;
}

export interface Env {
  cword: number;
}

export function makeSuggestionHelper(
  env: Env,
  flags: Flag[],
  argv: string[],
  idxFrom: number
): string[] {
  const subFlags = flags.filter(flag => {
    return flag.subFlags && flag.subFlags.length > 0;
  });
  const optionalFlags = flags.filter(flag => {
    return (
      (flag.shortName && flag.shortName.length > 0) || (flag.longName && flag.longName.length > 0)
    );
  });
  const positionalFlags = flags.filter(flag => {
    return flag.name && flag.name.length > 0;
  });

  // if it is null means that optional arguments should be come.
  // otherwise value shoud be come.
  let needsValue = false;
  let start = idxFrom;
  if (subFlags.length === 0) {
    if (idxFrom + positionalFlags.length > env.cword) {
      return [];
    }
    start = idxFrom + positionalFlags.length;
  }

  for (let i = start; i < env.cword; i += 1) {
    if (needsValue) {
      needsValue = false;
      continue;
    }

    let idx = optionalFlags.findIndex(flag => {
      return flag.shortName === argv[i] || flag.longName === argv[i];
    });
    if (idx !== -1) {
      const flagInfo: FlagInfo = optionalFlags[idx];
      if (!flagInfo.isSequential) {
        flagInfo.shouldRemove = true;
      }
      needsValue = flagInfo.needsValue || false;
    } else {
      if (subFlags.length > 0) {
        idx = subFlags.findIndex(flag => {
          return flag.name === argv[i];
        });
        if (idx !== -1) {
          return makeSuggestionHelper(env, subFlags[idx].subFlags!, argv, i + 1);
        }
      }
      // Failed to auto complete.
      return [];
    }
  }

  if (needsValue) {
    return [];
  }

  const suggestions: string[] = [];
  optionalFlags.forEach((flag: FlagInfo) => {
    if (flag.shouldRemove) return;

    if (
      flag.shortName &&
      (argv.length === env.cword || flag.shortName.startsWith(argv[env.cword]))
    ) {
      suggestions.push(flag.shortName);
    }

    if (flag.longName && (argv.length === env.cword || flag.longName.startsWith(argv[env.cword]))) {
      suggestions.push(flag.longName);
    }
  });

  subFlags.forEach(flag => {
    if (flag.name && (argv.length === env.cword || flag.name.startsWith(argv[env.cword]))) {
      suggestions.push(flag.name);
    }
  });

  return suggestions;
}

export function makeSuggestion(argv: string[]): string[] {
  // argv: node /path/to/console-autocompletion /path/to/json command flags
  if (argv.length < 4) {
    return [];
  }

  const env: Env = {
    cword: process.env.COMP_CWORD ? parseInt(process.env.COMP_CWORD) : 0,
  };

  const content = readFileSync(argv[2]).toString();
  const flags: Flag[] = JSON.parse(content);
  argv.splice(0, 3);
  return makeSuggestionHelper(env, flags, argv, 1);
}
