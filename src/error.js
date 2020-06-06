/* eslint-disable functional/no-this-expression */

export default class extends Error {
  constructor(status, message, ...params) {
    super(params);
    this.status = status;
    this.message = message;
  }
}
