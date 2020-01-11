// Copyright (c) 2020 Wonyong Kim (chokobole33@gmail.com) . All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

export interface TemplateOptions {
  command: string;
  ignoreWorkdBreaks?: string[];
  commandJsonPath?: string;
}

export function bashTemplate(options: TemplateOptions): string {
  const ignoreWorkdBreaks = options.ignoreWorkdBreaks
    ? options.ignoreWorkdBreaks.map((c: string) => `-n ${c}`).join(' ')
    : '';
  const commandJsonPath = options.commandJsonPath
    ? options.commandJsonPath
    : `~/.console-autocompletion/${options.command}.json`;

  return `#!/usr/bin/env bash

# THIS FILE IS AUTO GENERATED!! DO NOT EDIT!!!

if ! command -v ${options.command} &> /dev/null; then
  return
fi

_${options.command}_completion() {
  local words cwod
  if type _get_comp_words_by_ref &>/dev/null; then
    _get_comp_words_by_ref ${ignoreWorkdBreaks} -w words -i cword
  else
    cword="$COMP_CWORD"
    words=("\${COMP_WORDS[@]}")
  fi

  local prev_ifs="$IFS"
  IFS=$'\\n' COMPREPLY=($(COMP_CWORD="$cword"
                        COMP_LINE="$COMP_LINE"
                        COMP_POINT="$COMP_POINT"
                        console-autocompletion ${commandJsonPath} "\${words[@]}"
                        2>/dev/null)) || return $?
  IFS="$prev_ifs"

  if type __ltrim_colon_completions &>/dev/null; then
    __ltrim_colon_completions "\${words[cword]}"
  fi

  return 0
}

complete -o default -F _${options.command}_completion ${options.command}`;
}
