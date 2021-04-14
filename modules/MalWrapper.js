const { URL } = require('url');
const fetch = require('cross-fetch');
const HttpError = require('./HttpError');

module.exports = class MalWrapper {
  constructor() {
    this.baseURL = 'https://api.jikan.moe/v3';
  }

  async send(args, params) {
    const res = await fetch(this.createUrl(args, params));
    const data = await res.json();
    if (res.status !== 200) throw new HttpError(res);
    else return data;
  }

  createUrl(args, params) {
    const url = new URL(this.baseURL);
    //args.filter((a) => a) create an array with the existing args
    url.pathname += `/${args.filter((a) => a).join('/')}`;
    Object.keys(params).forEach((p) => {
      console.log('zzzzzzzzzzzzzzzzzzzz EHHHHHHH ha entrado!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      url.searchParams.set(p, params[p]);
    });
    //url href constains the whole url, url.origin+url.pahtname
    return url.href;
  }

  /**
   *
   * @param {string} type anime, manga, people, characters
   * @param {integer} page optional page number
   * @param {string} subtype returns a filtered list
   */
  async findTop(type, page, subtype) {
    return await this.send(['top', type, page, subtype]);
  }

  /**
   *
   * @param {string} username username
   * @param {string} request profile, history, friends, animelist, mangalist
   * @param {string} data watching, ptw, onhold, ect
   * @param {Object} param page sort search
   */
  async findUser(username, request, data, param) {
    return await this.send(['user', username, request, data], param);
  }
};
