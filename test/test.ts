import 'mocha';
import { assert } from 'chai';
import { Flag } from '../src/flag';
import { Env, makeSuggestionHelper } from '../src/suggestion';
import flagSet from './flags.json';

function deepCopy(arr) {
  return JSON.parse(JSON.stringify(arr));
}

describe('flag autocompetion', () => {
  it('onlyOptionals', () => {
    let argv = ['program'];
    const env: Env = {
      cword: 1,
    };
    const flags = flagSet['onlyOptionals'] as Flag[];
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), [
      '-n1',
      '--number1',
      '-n2',
      '--number2',
    ]);
    argv = ['program', '-'];
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), [
      '-n1',
      '--number1',
      '-n2',
      '--number2',
    ]);
    argv = ['program', '--'];
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), [
      '--number1',
      '--number2',
    ]);
    argv = ['program', '-n1'];
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['-n1']);
    env.cword = 2;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), []);
    argv = ['program', '-n1', '1'];
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), []);
    env.cword = 3;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['-n2', '--number2']);
    argv = ['program', '--n', '1'];
    env.cword = 1;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), [
      '--number1',
      '--number2',
    ]);
  });

  it('onlyPositionals', () => {
    let argv = ['program'];
    const env: Env = {
      cword: 1,
    };
    const flags = flagSet['onlyPositionals'] as Flag[];
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), []);
    argv = ['program', '1'];
    env.cword = 1;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), []);
    argv = ['program', '1'];
    env.cword = 2;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), []);
  });

  it('positionalAndOptionals', () => {
    let argv = ['program'];
    const env: Env = {
      cword: 1,
    };
    const flags = flagSet['positionalAndOptionals'] as Flag[];
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), []);
    argv = ['program', '1'];
    env.cword = 1;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), []);
    argv = ['program', '1'];
    env.cword = 2;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['-n2', '--number2']);
  });

  it('sequentials', () => {
    let argv = ['program'];
    const env: Env = {
      cword: 1,
    };
    const flags = flagSet['sequentials'] as Flag[];
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['-n']);
    argv = ['program', '-n'];
    env.cword = 2;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), []);
    argv = ['program', '-n', '1'];
    env.cword = 3;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['-n']);
  });

  it('subFlag', () => {
    let argv = ['program'];
    const env: Env = {
      cword: 1,
    };
    const flags = flagSet['subFlag'] as Flag[];
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['-v', 'add']);
    argv = ['program', '-v'];
    env.cword = 2;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['add']);
    argv = ['program', '-v', 'a'];
    env.cword = 2;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['add']);
    argv = ['program', '-v', 'add'];
    env.cword = 3;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['-n1', '-n2']);
    argv = ['program', 'a'];
    env.cword = 1;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['add']);
    argv = ['program', 'add'];
    env.cword = 2;
    assert.deepEqual(makeSuggestionHelper(env, deepCopy(flags), argv, 1), ['-n1', '-n2']);
  });
});
