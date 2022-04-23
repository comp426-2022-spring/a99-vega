const fs = require('fs')
/**
 * Use the fs library to load a file as utf-8
 * 
 * @param {String} filename the full or relative path of the file
 * @returns the text of the file read
 */
 function loadFileAsText(filename) {
  return fs.readFileSync(filename, {encoding:"utf-8", flags:'r'})
}

/**
 * Load the html file from a template and injects body into a placeholder div
 * Default directory for lookup is "./www"
 * The placeholder div will be replaced
 * Do not include ".html" in filenames
 * 
 * @param {String} template the filename of the template html file (do not include .html in name)
 * @param {String} body     the filename of the body html file (do not include .html in name)
 * @param {*} placeholder   the id of the placeholder div used to replace content
 * @returns 
 */
 function loadHTML (template, body, placeholder, directory){
  let path = directory || "./www"
  let html = loadFileAsText(`${path}/${template}.html`)
  let content = loadFileAsText(`${path}/${body}.html`)
  return html.replace(`<div id="${placeholder}"></div>`, content)
}

module.exports = {loadHtml: loadHTML}