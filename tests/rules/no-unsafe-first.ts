/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import rule = require("../../source/rules/no-unsafe-first");
import { ruleTester } from "../utils";

const setup = stripIndent`
  import { EMPTY, Observable, of } from "rxjs";
  import { first, switchMap, take, tap } from "rxjs/operators";

  function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
    return source => source;
  }

  type Actions = Observable<any>;
  const actions = of({});
  const actions$ = of({});
  const that = { actions };

  const differentSource = of({});
`;

ruleTester({ types: true }).run("no-unsafe-first", rule, {
  valid: [
    {
      code: stripIndent`
        // actions nested first
        ${setup}
        const safePipedOfTypeFirstEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `
    },
    {
      code: stripIndent`
        // actions nested take
        ${setup}
        const safePipedOfTypeTakeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `
    },
    {
      code: stripIndent`
        // actions property nested first
        ${setup}
        const safePipedOfTypeFirstEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `
    },
    {
      code: stripIndent`
        // actions property nested take
        ${setup}
        const safePipedOfTypeTakeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `
    },
    {
      code: stripIndent`
        // epic nested first
        ${setup}
        const safePipedOfTypeFirstEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `
    },
    {
      code: stripIndent`
        // epic nested take
        ${setup}
        const safePipedOfTypeTakeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `
    },
    {
      code: stripIndent`
        // non-matching options
        ${setup}
        const safePipedOfTypeFirstEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          first()
        );
      `,
      options: [{ observable: "foo" }]
    },
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/43
        // non-matching default observable
        ${setup}
        const effect = differentSource.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          take(1)
        );
      `
    }
  ],
  invalid: [
    {
      code: stripIndent`
        // actions first
        ${setup}
        const unsafePipedOfTypeFirstEffect = actions$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 19,
          column: 11,
          endLine: 19,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        // actions take
        ${setup}
        const unsafePipedOfTypeTakeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 19,
          column: 11,
          endLine: 19,
          endColumn: 15
        }
      ]
    },
    {
      code: stripIndent`
        // actions property first
        ${setup}
        const unsafePipedOfTypeFirstEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 19,
          column: 11,
          endLine: 19,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        // actions property take
        ${setup}
        const unsafePipedOfTypeTakeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 19,
          column: 11,
          endLine: 19,
          endColumn: 15
        }
      ]
    },
    {
      code: stripIndent`
        // epic first
        ${setup}
        const unsafePipedOfTypeFirstEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 19,
          column: 11,
          endLine: 19,
          endColumn: 16
        }
      ]
    },
    {
      code: stripIndent`
        //epic take
        ${setup}
        const unsafePipedOfTypeTakeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
        );
      `,
      errors: [
        {
          messageId: "forbidden",
          line: 19,
          column: 11,
          endLine: 19,
          endColumn: 15
        }
      ]
    },
    {
      code: stripIndent`
        // matching options
        ${setup}
        const unsafePipedOfTypeTakeEpic = (foo: Actions) => foo.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
        );
      `,
      options: [
        {
          observable: "foo"
        }
      ],
      errors: [
        {
          messageId: "forbidden",
          line: 19,
          column: 11,
          endLine: 19,
          endColumn: 15
        }
      ]
    }
  ]
});
