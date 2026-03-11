"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.first = void 0;
const first = (promises, predicate) => {
    const newPromises = promises.map(p => new Promise((resolve, reject) => p.then(v => !!predicate(v) && resolve(v), reject)));
    newPromises.push(Promise.all(promises).then(() => undefined));
    return Promise.race(newPromises);
};
exports.first = first;
//# sourceMappingURL=first.js.map