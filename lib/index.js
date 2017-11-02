
function assignStatic(from, to, list) {
  list.forEach((name) => {
    // eslint-disable-next-line no-param-reassign
    to[name] = from[name]
  })
}

/**
 * Add { name: value } properties to tag
 * @param {Tag} target
 * @param {{ [name]: string }} attrs Object with tag properties
 * @example
 * const div = Tag.div()
 * applyAttrs(div, { id: 'example', class: 'demo' })
 * div.toString() // <div id="example" class="demo"></div>
 */
function applyAttrs(target, attrs) {
  if (typeof attrs === 'object') {
    Object.keys(attrs).forEach(name => target.attr(name, attrs[name]))
  }
  return target
}

class Tag {
  constructor(t = 'div') {
    /**
   * @private
   */
    this.tag = t.replace(/[\s\/\\]+/, '-')

    /**
   * @private
   */
    this.attributes = {}

    /**
   * @private
   */
    this.children = []

    this.selfClosing = false
  }

  /**
   * @private
   */
  makeAttrs() {
    const names = Object.keys(this.attributes)

    if (names.length !== 0) {
      return names.reduce(
        (str, name) => {
          const value = this.attributes[name]
          if (!value) {
            return str
          }
          const strValue = value !== true ? `="${this.attributes[name]}"` : ''
          return `${str} ${name}${strValue}`
        }
        , '',
      )
    }

    return ''
  }

  /**
   * Build all children to xhtml
   * @private
   */
  makeChildren() {
    return this.children.map(e => e.toString()).join('')
  }

  /**
   * Build class tag to xhtml
   * @private
   */
  toString() {
    const contentPart = this.selfClosing && this.children.length === 0
      ? ' />'
      : `>${this.makeChildren()}</${this.tag}>`

    return `<${this.tag}${this.makeAttrs()}${contentPart}`
  }

  /**
   * Set attribute for tag
   * @param {string} name
   * @param {*} value
   */
  attr(name, value) {
    this.attributes[name] = value
    return this
  }

  /**
   * Set children of tag
   * @param {(Tag|string)[]} list
   */
  setChildren(...list) {
    this.children = list
    return this
  }

  append(...list) {
    this.children = this.children.concat(list)
    return this
  }

  prepend(...list) {
    this.children = list.concat(this.children)
    return this
  }

  /**
   * Add css-classes to exists
   * @param {string | string[]} classNames
   */
  class(classNames) {
    const joinedList = Array.isArray(classNames) ? classNames.join(' ') : classNames

    if (this.attributes.class) {
      this.attributes.class += ` ${joinedList}`
    }
    else {
      this.attributes.class = joinedList
    }

    return this
  }

  /**
   * Set id="" for tag
   * @param {string} idString
   */
  id(idString) {
    this.attr('id', idString)
    return this
  }

  /**
   * Create <div></div>
   */
  static div() {
    return new Tag('div')
  }

  /**
   * Create <h1> - <h7>
   * @param {number} level from 1 to 7
   */
  static h(level = 1) {
    return new Tag(`h${level}`)
  }

  /**
   * Create <title></title>
   * @param {string[]} title
   */
  static title(...title) {
    return new Tag('title').setChildren(title.join(' '))
  }

  /**
   * Create <script></script>
   * @param {string} type mime type
   */
  static script(type = 'application/javascript') {
    return new Tag('script').attr('type', type)
  }
}

/**
 * Crate any tag with $t as name
 * @param {string} t name of the tag
 * @example
 * tag('footer').toString() // <footer></footer>
 */
function tag(t) {
  return new Tag(t)
}

assignStatic(Tag, tag, ['div', 'h', 'link', 'title', 'script'])

/**
 * Creates container for tag list
 * @param {Tag[]} list list of tags
 */
function tagMap(list) {
  return {
    list,
    toString() {
      return this.list.join('')
    },
  }
}

class Meta extends Tag {
  constructor(name, content) {
    super('meta')
    this.selfClosing = true

    if (name) {
      this.attr('name', name)
    }

    if (content) {
      this.attr('content', content)
    }
  }

  /**
   *
   * @param {string} value
   */
  content(value) {
    this.attr('content', value)
    return this
  }

  /**
   * Create <meta charset="" />
   * @param {string} charset
   */
  static charset(charset = 'utf-8') {
    return new Meta().attr('charset', charset)
  }

  /**
   * Create <meta http-equiv="" content="" />
   * @param {string} equiv
   * @param {string} content
   */
  static httpEquiv(equiv, content) {
    return new Meta().attr('http-equiv', equiv).content(content)
  }

  /**
   * Create <meta viewport="" />
   * @param {string} viewport
   */
  static viewport(viewport) {
    return new Meta('viewport', viewport)
  }

  /**
   * Create <link />
   */
  static link() {
    const link = new Tag('link')
    link.selfClosing = true
    return link
  }

  /**
   * Create <meta referrer="" />
   * @param {string} referrer
   */
  static referrer(referrer) {
    return new Meta('referrer', referrer)
  }

  /**
   * Create list of meta tags
   * @param {{ [name]: string }} metaMap Map of the meta { name: content }
   * @example
   * Meta.map({
   *   charset: 'utf-8',
   *   referrer: 'origin',
       viewport: 'width=device-width, initial-scale=1',
   * })
   * // produces
   * // <meta charset="utf-8" />
   * // <meta name="referrer" content="origin" />
   * // <meta name="viewport" content="width=device-width, initial-scale=1" />
   */
  static map(metaMap) {
    const head = []

    Object.keys(metaMap).forEach((metaName) => {
      if (metaName === 'charset') {
        head.push(Meta.charset(metaMap.charset))
      }
      else {
        head.push(new Meta(metaName, metaMap[metaName]))
      }
    })

    return tagMap(head)
  }
}

/**
 * Create <meta name="$name" ...$props />
 * @param {string} name
 * @param {{ [name]: string } | string} props
 */
function meta(name, props) {
  const metaTag = new Meta(name)

  if (typeof props === 'string') {
    metaTag.content(props)
  }
  else if (typeof props === 'object') {
    Object.keys(props).forEach((prop) => {
      metaTag.attr(prop, props[prop])
    })
  }

  return metaTag
}

assignStatic(Meta, meta, ['charset', 'httpEquiv', 'viewport', 'link', 'referrer', 'map'])

const HTML_VERSION_5 = 5

class Html extends Tag {
  constructor() {
    super('html')

    this.headTag = tag('head')
    this.bodyTag = tag('body')
    this.append(this.headTag, this.bodyTag)

    this.docTypeTag = ''
  }

  /**
   * @private
   */
  toString() {
    return this.docTypeTag + super.toString()
  }

  /**
   * Append tags to <head></head>
   * @param {Tag[]} list
   */
  head(...list) {
    this.headTag.append(...list)
    return this
  }

  /**
   * Append tags to <body></body>
   * @param {Tag[]} list
   */
  body(...list) {
    this.bodyTag.append(...list)
    return this
  }

  prependBody(...list) {
    this.bodyTag.prepend(...list)
    return this
  }

  prependHead(...list) {
    this.headTag.prepend(...list)
    return this
  }

  /**
   * Add xmlns="" to <body>
   * @param {string} xmlns
   */
  xmlns(xmlns) {
    this.attr('xmlns', xmlns)
    return this
  }

  /**
   * Add lang="" to <body>
   * @param {string} lang
   */
  lang(lang) {
    this.attr('lang', lang)
    return this
  }

  /**
   *
   * @param {5|'5'|'strict'|'transitional'|'frameset'} version
   */
  doctype(version = HTML_VERSION_5) {
    const prefix = '<!DOCTYPE HTML'

    switch (version) {
      case 'strict':
        this.docTypeTag = `${prefix} PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`
        break

      case 'transitional':
        this.docTypeTag = `${prefix} PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">`
        break

      case 'frameset':
        this.docTypeTag = `${prefix} PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">`
        break

      case HTML_VERSION_5:
      case '5':
      default:
        this.docTypeTag = `${prefix}>`
    }

    return this
  }
}

function html(version = HTML_VERSION_5) {
  return new Html().doctype(version)
}

class Helmet extends Html {
  /**
   * Append <title>$title</title> to <head>
   * @param {string} title
   */
  title(title) {
    return this.head(Tag.title(title))
  }

  /**
   * Append <link rel="$rel" href="$href" ...$props /> to <head>
   * @param {string} rel type of link
   * @param {string} href relative or absolute path
   * @param {{ [name]: string }} props Object with tag properties
   */
  link(rel, href, props) {
    const link = Meta.link()
      .attr('rel', rel)
      .attr('href', href)

    applyAttrs(link, props)

    this.head(link)
    return this
  }

  /**
   * Append <link rel="stylesheet" href="$href" ...$props /> to <head>
   * @param {string} href relative or absolute path to css stylesheet
   * @param {{ [name]: string }} props Object with tag properties
   */
  stylesheet(href, props) {
    this.link('stylesheet', href, props)

    return this
  }

  /**
   * Append <script src="$src" ...$props></script> to <body>
   * @param {string} src relative or absolute path to script
   * @param {string} type MIME-type of script
   * @param {{ [name]: string }} props Object with tag properties
   */
  script(src, type = 'application/javascript', props) {
    const script = Tag.script(type).attr('src', src)
    applyAttrs(script, props)
    this.body(script)
    return this
  }

  /**
   * Append <script ...$props>$content</script>
   * @param {string} content
   * @param {Object} props
   * @param {array} args
   */
  inlineScript(content, props, args = []) {
    const script = Tag.script((props && props.type) || 'application/javascript')
      .attr('charset', 'utf-8')

    applyAttrs(script, props)
    script.setChildren(`(${content})(${args.join(', ')})`)
    this.body(script)
    return this
  }

  /**
   * Append <div ...$props>$content</div> to <body>
   * @param {{ [name]: string }} props
   * @param {Tag|Tag[]} content
   */
  div(props, ...content) {
    const rootDiv = tag('div')

    if (props) {
      applyAttrs(rootDiv, props)
      if (content && content.length !== 0) {
        rootDiv.setChildren(...content)
      }
    }

    this.prependBody(rootDiv)
    return this
  }
}

function helmet() {
  return new Helmet().doctype()
}


module.exports = {
  Tag,
  tag,

  Meta,
  meta,

  Html,
  html,

  Helmet,
  helmet,
}

