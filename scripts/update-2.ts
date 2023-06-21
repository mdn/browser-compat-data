import {
  compare as compareVersions,
  compareVersions as compareVersionsSort,
} from 'compare-versions';

import {
  BrowserName,
  Identifier,
  SimpleSupportStatement,
} from '../types/types';
import { Minimatch } from 'minimatch';

type TestResultValue = boolean | null;

type BrowserSupportMap = Map<string, TestResultValue>;
type SupportMap = Map<BrowserName, BrowserSupportMap>;
type SupportMatrix = Map<string, SupportMap>;

interface VersionRange {
  start: string;
  stop: string;
}

type Version = string | boolean | null | VersionRange;

interface AddedRemovedStatement {
  version_added: Version;
}

export const inferSupportStatements = (
  versionMap: BrowserSupportMap,
): SimpleSupportStatement[] => {
  const versions = Array.from(versionMap.keys()).sort(compareVersionsSort);
  const versionEntries = versions.map(
    (version) =>
      [version, versionMap.get(version)] as [string, TestResultValue],
  );
  // Collect versions into ranges from versions before null to versions after null.
  // Versions after a non null version are dropped.
  const versionRangeEntries = versionEntries.reduce<
    [VersionRange, TestResultValue][]
  >(
    (carry, [version, result]) => {
      const last = carry[carry.length - 1];
      if (!last) {
        return [[{ start: version, stop: version }, result]];
      } else if (last[1] !== null && result === null) {
        return [...carry, [{ start: last[0].stop, stop: version }, null]];
      } else if (last[1] !== result && result !== null) {
        return [...carry, [{ start: last[0].stop, stop: version }, result]];
      }
      last[0].stop = version;
      last[1] = result;
      return carry;
    },
    [[{ start: '0', stop: '0' }, null]],
  );

  if (versionRangeEntries.every(([, supported]) => supported === null)) {
    return [];
  }

  let currentStatement = { version_added: false };
  const statements = [currentStatement];

  for (const [versionRange, supported] of versionRangeEntries) {
    if (supported === true) {
      currentStatement = {
        version_added:
          versionRange.start === versionRange.stop
            ? versionRange.start
            : versionRange,
      };
      statements.push(currentStatement);
    } else if (supported === false) {
      currentStatement.version_removed =
        versionRange.start === versionRange.stop
          ? versionRange.start
          : versionRange;
    }
  }
};

type ValueState<T = any> = { state: T; filtered?: undefined };
type Reason<N extends string, T, M extends string> = {
  kind: N;
  args: T;
  message: M;
};
type ValueFiltered<
  N extends string = string,
  T = any,
  M extends string = string,
> = { state?: any; filtered: Reason<N, T, M> };
type ValueUndefined = undefined;
type Value<T = any> = ValueState<T> | ValueFiltered | ValueUndefined;

const state = <T>(state: T): ValueState<T> => ({ state });
const reason = <N extends string, T, M extends string>(
  kind: N,
  args: T = {} as T,
  message: M = '' as M,
): ValueFiltered<N, T, M> => ({
  filtered: { kind, args, message },
});

const merge = <T1, T2>(a: Value<T1>, b: Value<T2>): Value<T1 & T2> => {
  if (a === undefined) {
    throw new Error('merge(1) 1 is undefined');
  }
  if (a.filtered) {
    return a;
  } else if (b === undefined) {
    return state(a.state);
  } else if (b.filtered) {
    return { state: a.state, filtered: b.filtered };
  }
  return state(Object.assign({}, a.state, b.state));
};

const expand = <T1, T2>(generator: (value: T1) => Generator<Value<T2>>) =>
  function* (last: () => Generator<Value<T1>>): Generator<Value<T1 & T2>> {
    for (const value of last()) {
      if (value === undefined) {
        continue;
      }
      if (value.filtered) {
        yield value;
        continue;
      }
      for (const props of generator(value.state)) {
        yield merge(value, props);
      }
    }
  };

const provide = <T1, T2>(op: (value: T1) => Value<T2> | undefined) =>
  function* (last: () => Generator<Value<T1>>): Generator<Value<T1 & T2>> {
    for (const value of last()) {
      if (value === undefined || value.filtered) {
        yield value;
        continue;
      }
      yield merge(value, op(value.state));
    }
  };

const filter = (condition: any, reason: () => ValueFiltered): Value => {
  if (!condition) {
    return reason();
  }
  return undefined;
};

const nestGenerator = (a: Generator, b: GeneratorFunction) => {};

const compose = (...funcs: any[]) =>
  funcs.reduceRight((last, next) => next.bind(null, last));

interface UpdateState {
  allStatements: SimpleSupportStatement[];
  bcd: Identifier;
  browser: BrowserName;
  browserMap: SupportMap;
  defaultStatements: SimpleSupportStatement[];
  entry: Identifier;
  inferredStatements: SimpleSupportStatement[];
  path: string;
  statements: SimpleSupportStatement[];
  supportMatrix: SupportMatrix;
  versionMap: BrowserSupportMap;
}

const expandSupportMatrix = () =>
  expand(function* ({ supportMatrix }: Pick<UpdateState, 'supportMatrix'>) {
    for (const [path, browserMap] of supportMatrix.entries()) {
      yield state({ path, browserMap });
    }
  });

const filterPath = (pathFilter: Minimatch | string) => {
  if (typeof pathFilter === 'object' && pathFilter.constructor === Minimatch) {
    return provide(({ path }: Pick<UpdateState, 'path'>) =>
      filter(pathFilter.match(path), () => reason('path', { path })),
    );
  }
  return provide(({ path }: Pick<UpdateState, 'path'>) =>
    filter(path === pathFilter || path.startsWith(`${pathFilter}.`), () =>
      reason('path', { path }),
    ),
  );
};

const provideEntry = () =>
  provide(({ bcd, path }: Pick<UpdateState, 'bcd' | 'path'>) =>
    state({
      entry: findEntry(bcd, path),
    }),
  );

const filterEntryExists = () =>
  provide(({ path, entry }: Pick<UpdateState, 'entry' | 'path'>) =>
    filter(entry && entry.__compat, () => reason('entryExists', { path })),
  );

const expandBrowserMap = () =>
  expand(function* ({ browserMap }: Pick<UpdateState, 'browserMap'>) {
    for (const [browser, versionMap] of browserMap.entries()) {
      yield state({ browser, versionMap });
    }
  });

const filterBrowser = (browserFilter: BrowserName[]) =>
  provide(({ browser }: { browser: BrowserName }) =>
    filter(browserFilter.includes(browser), () =>
      reason('browser', { browser }),
    ),
  );

const provideInferredStatements = () =>
  provide(({ versionMap }: Pick<UpdateState, 'versionMap'>) =>
    state({ inferredStatements: inferSupportStatements(versionMap) }),
  );

const filterOneInferred = () =>
  provide(
    ({
      path,
      browser,
      inferredStatements,
    }: Pick<UpdateState, 'browser' | 'inferredStatements' | 'path'>) =>
      filter(inferredStatements.length === 1, () =>
        reason(
          'inferredStatements',
          { path, browser },
          `${path} skipped for ${browser} due to multiple inferred statements`,
        ),
      ),
  );

const filterRelease = (releaseFilter: string | false) => {
  if (releaseFilter || releaseFilter === false) {
    const releaseFilterMatch =
      releaseFilter && releaseFilter.match(/([\d.]+)-([\d.]+)/);
    if (releaseFilterMatch) {
      return provide(
        ({
          inferredStatements: [inferredStatement],
        }: Pick<UpdateState, 'inferredStatements'>) => {
          if (typeof inferredStatement.version_added !== 'string') {
            return reason('inferredReleaseFilterNonString');
          }
          const inferredAdded = inferredStatement.version_added.replace(
            /(([\d.]+)> )?≤/,
            '',
          );
          if (
            compareVersions(inferredAdded, releaseFilterMatch[1], '<') ||
            compareVersions(inferredAdded, releaseFilterMatch[2], '>')
          ) {
            return reason('inferredAddedOutsideFilterRange');
          }
          if (typeof inferredStatement.version_removed === 'string') {
            const inferredRemoved = inferredStatement.version_removed.replace(
              /(([\d.]+)> )?≤/,
              '',
            );
            if (
              compareVersions(inferredRemoved, releaseFilterMatch[1], '<') ||
              compareVersions(inferredRemoved, releaseFilterMatch[2], '>')
            ) {
              return reason('inferredRemovedOutsideFilterRange');
            }
          }
          return undefined;
        },
      );
    }
    return provide(
      ({
        inferredStatements: [inferredStatement],
      }: Pick<UpdateState, 'inferredStatements'>) =>
        filter(
          releaseFilter === inferredStatement.version_added &&
            (!inferredStatement.version_removed ||
              releaseFilter === inferredStatement.version_removed),
          () => reason('inferredReleaseNotEqualFilter'),
        ),
    );
  }
  return provide(() => undefined);
};

const filterExactOnly = () =>
  provide(({ statements }: Pick<UpdateState, 'statements'>) =>
    filter(
      statements.every(
        (statement) =>
          (typeof statement.version_added !== 'string' ||
            !statement.version_added.includes('≤')) &&
          (typeof statement.version_removed !== 'string' ||
            !statement.version_removed.includes('≤')),
      ),
      () => reason('versionExactOnly'),
    ),
  );

const filterDefaultStatements = () =>
  provide(
    ({
      inferredStatements: [inferredStatement],
      defaultStatements,
    }: Pick<UpdateState, 'defaultStatements' | 'inferredStatements'>) =>
      filter(
        defaultStatements.length > 0 ||
          inferredStatement.version_added !== false,
        () => reason('defaultStatementsExists'),
      ),
  );

const persistNonDefault = () =>
  provide(
    ({
      inferredStatements: [inferredStatement],
      allStatements,
      defaultStatements,
    }: Pick<
      UpdateState,
      'allStatements' | 'defaultStatements' | 'inferredStatements'
    >) =>
      defaultStatements.length === 0
        ? state({
            statements: [
              inferredStatement,
              ...allStatements.filter((statement) => !('flags' in statement)),
            ],
          })
        : undefined,
  );

const filterDefaultStatements2 = () =>
  provide(
    ({
      path,
      browser,
      defaultStatements,
    }: Pick<UpdateState, 'browser' | 'defaultStatements' | 'path'>) =>
      filter(defaultStatements.length === 1, () =>
        reason(
          'oneDefaultStatement',
          {},
          `${path} skipped for ${browser} due to multiple default statements`,
        ),
      ),
  );

const filterDefaultRemoved = () =>
  provide(
    ({
      path,
      browser,
      defaultStatements: [simpleStatement],
    }: Pick<UpdateState, 'browser' | 'defaultStatements' | 'path'>) =>
      filter(!simpleStatement.version_removed, () =>
        reason(
          '',
          {},
          `${path} skipped for ${browser} due to added+removed statement`,
        ),
      ),
  );

const filterCurrentPreview = () =>
  provide(
    ({
      path,
      browser,
      defaultStatements: [simpleStatement],
    }: Pick<UpdateState, 'browser' | 'defaultStatements' | 'path'>) =>
      filter(
        typeof simpleStatement.version_added === 'string' &&
          simpleStatement.version_added === 'preview',
        () =>
          reason(
            '',
            {},
            `${path} skipped for ${browser}; BCD says support was added in a version newer than there are results for`,
          ),
      ),
  );

const filterCurrentBeforeSupport = () =>
  provide(
    ({
      path,
      browser,
      versionMap,
      defaultStatements: [simpleStatement],
      inferredStatements: [inferredStatement],
    }: Pick<
      UpdateState,
      | 'browser'
      | 'defaultStatements'
      | 'inferredStatements'
      | 'path'
      | 'versionMap'
    >) => {
      if (inferredStatement.version_added === false) {
        const latestNonNullVersion = Array.from(versionMap.entries())
          .filter(([, result]) => result !== null)
          .reduceRight(
            (latest, [version]) =>
              !latest || compareVersions(version, latest, '>')
                ? version
                : latest,
            '',
          );
        if (
          compareVersions(
            latestNonNullVersion,
            simpleStatement.version_added.replace('≤', ''),
            '<',
          )
        ) {
          logger.warn(
            `${path} skipped for ${browser}; BCD says support was added in a version newer than there are results for`,
          );
          return false;
        }
      }
      return true;
    },
  );

const persistInferredRange = () =>
  provide(
    ({
      inferredStatements: [inferredStatement],
      defaultStatements: [simpleStatement],
      allStatements,
    }: Pick<
      UpdateState,
      'allStatements' | 'defaultStatements' | 'inferredStatements'
    >) => {
      if (
        typeof simpleStatement.version_added === 'string' &&
        typeof inferredStatement.version_added === 'string' &&
        inferredStatement.version_added.includes('<=')
      ) {
        const { lower, upper } = splitRange(inferredStatement.version_added);
        const simpleAdded = simpleStatement.version_added.replace('≤', '');
        if (
          simpleStatement.version_added === 'preview' ||
          compareVersions(simpleAdded, lower, '<=') ||
          compareVersions(simpleAdded, upper, '>')
        ) {
          simpleStatement.version_added = inferredStatement.version_added;
          return allStatements;
        }
      }
      return true;
    },
  );

const persistAddedOverPartial = () =>
  provide(
    ({
      defaultStatements: [simpleStatement],
      inferredStatements: [inferredStatement],
    }: Pick<UpdateState, 'defaultStatements' | 'inferredStatements'>) => {
      if (
        !(
          typeof simpleStatement.version_added === 'string' &&
          inferredStatement.version_added === true
        ) &&
        simpleStatement.version_added !== inferredStatement.version_added
      ) {
        // When a "mirrored" statement will be replaced with a statement
        // documenting lack of support, notes describing partial implementation
        // status are no longer relevant.
        if (
          !inferredStatement.version_added &&
          simpleStatement.partial_implementation
        ) {
          return state({ statements: [{ version_added: false }] });
        }
      }
      return undefined;
    },
  );

const persistAddedOver = () =>
  provide(
    ({
      defaultStatements: [simpleStatement],
      inferredStatements: [inferredStatement],
      allStatements,
    }: Pick<
      UpdateState,
      'allStatements' | 'defaultStatements' | 'inferredStatements'
    >) => {
      if (
        !(
          typeof simpleStatement.version_added === 'string' &&
          inferredStatement.version_added === true
        ) &&
        simpleStatement.version_added !== inferredStatement.version_added
      ) {
        // Positive test results do not conclusively indicate that a partial
        // implementation has been completed.
        if (!simpleStatement.partial_implementation) {
          simpleStatement.version_added = inferredStatement.version_added;
          return state({ statements: allStatements });
        }
      }
      return undefined;
    },
  );

const persistRemoved = () =>
  provide(
    ({
      inferredStatements: [inferredStatement],
      defaultStatements: [simpleStatement],
      allStatements,
    }: Pick<
      UpdateState,
      'allStatements' | 'defaultStatements' | 'inferredStatements'
    >) => {
      if (typeof inferredStatement.version_removed === 'string') {
        simpleStatement.version_removed = inferredStatement.version_removed;
        return state({ statements: allStatements });
      }
      return undefined;
    },
  );

const update = (bcd, supportMatrix, filter) => {
  compose(
    expand(function* () {
      yield state({ bcd, supportMatrix });
    }),
    expandSupportMatrix(),
    filterPath(filter.path),
    provideEntry(),
    filterEntryExists(),
    expandBrowserMap(),

    filterBrowser(filter.browser),
    provideInferredStatements(),
    filterOneInferred(),
    filterRelease(filter.release),
    filterDefaultStatements(),

    persistNonDefault(),
    filterDefaultStatements2(),
    filterDefaultRemoved(),
    filterCurrentPreview(),
    filterCurrentBeforeSupport(),

    persistInferredRange(),
    persistAddedOverPartial(),
    persistAddedOver(),
    persistRemoved(),
    filterExactOnly(),
  )();
};
