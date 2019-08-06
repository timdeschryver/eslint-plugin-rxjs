/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { Rule } from "eslint";
import * as es from "estree";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      category: "RxJS",
      description: "Enforces deep importation from within 'rxjs/operators'.",
      recommended: true
    },
    fixable: null,
    messages: {
      forbidden: "Deep importation from 'rxjs/operators' is required."
    },
    schema: []
  },
  create: context => {
    return {
      ImportDeclaration: (node: es.ImportDeclaration) => {
        const { source } = node;
        if (
          typeof source.value === "string" &&
          /^rxjs\/operators\/?$/.test(source.value)
        ) {
          context.report({
            messageId: "forbidden",
            node: source
          });
        }
      }
    };
  }
};

export = rule;
