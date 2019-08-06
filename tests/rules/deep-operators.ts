/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import rule = require("../../source/rules/deep-operators");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("deep-operators", rule, {
  valid: [
    `import { Observable } from "rxjs/Observable";`,
    `import { map } from "rxjs/operators/map";`,
    `import { Observable } from 'rxjs/Observable';`,
    `import { map } from 'rxjs/operators/map';`
  ],
  invalid: [
    {
      code: `import { tap } from "rxjs/operators";`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      code: `import { tap } from 'rxjs/operators';`,
      errors: [
        {
          messageId: "forbidden",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 37
        }
      ]
    }
  ]
});
