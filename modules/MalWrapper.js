const URL = require('url').URL;
const fetch = require('cross-fetch');

module.exports = class MalWrapper {
  constructor() {
    this.baseURL = 'https://api.jikan.moe/v3';
  }

  async send(args, params) {
    const res = await fetch(this.createUrl(args, params));
    const data = await res.json();
    if (res.status !== 200) throw `Response: ${res.status}`;
    else return data;
  }
  createUrl(args, params) {
    const url = new URL(this.baseURL);
    //args.filter((a) => a) create an array with the existing args
    url.pathname += `/${args.filter((a) => a).join('/')}`;
    for (let p in params) {
      url.searchParams.set(p, params[p]);
    }
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
};
