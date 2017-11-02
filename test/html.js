import test from 'ava'
import { html, Html, meta, tag } from '../lib'


const tpl = (head, body) => `<html><head>${head}</head><body>${body}</body></html>`

test('default constructor', t => {
  t.is(new Html().toString(), tpl('', ''))
})

test('html() should be equal new Html().doctype()', t => {
  t.is(html().toString(), new Html().doctype().toString())
})

// .head

test('add single tag to head', t => {
  const r = new Html().head(meta('foo'))
  t.is(r.toString(), tpl('<meta name="foo" />', ''))
})

test('add many tags to head', t => {
  const r = new Html().head(meta('foo'), meta('bar'), meta('baz'))
  t.is(r.toString(), tpl('<meta name="foo" /><meta name="bar" /><meta name="baz" />', ''))
})

test('add text to head', t => {
  const r = new Html().head('foo', 'bar')
  t.is(r.toString(), tpl('foobar', ''))
})

test('add text and tags to head', t => {
  const r = new Html().head('foo', meta('bar'), 'baz')
  t.is(r.toString(), tpl('foo<meta name="bar" />baz', ''))
})

test('add to non empty head', t => {
  const r = new Html().head(meta('foo')).head(meta('bar'))
  t.is(r.toString(), tpl('<meta name="foo" /><meta name="bar" />', ''))
})

// .body

test('add single tag to body', t => {
  const r = new Html().body(tag('foo'))
  t.is(r.toString(), tpl('', '<foo></foo>'))
})

test('add many tags to body', t => {
  const r = new Html().body(tag('foo'), tag('bar'), tag('baz'))
  t.is(r.toString(), tpl('', '<foo></foo><bar></bar><baz></baz>'))
})

test('add text to body', t => {
  const r = new Html().body('foo', 'bar')
  t.is(r.toString(), tpl('', 'foobar'))
})

test('add text and tags to body', t => {
  const r = new Html().body('foo', tag('bar'), 'baz')
  t.is(r.toString(), tpl('', 'foo<bar></bar>baz'))
})

// .prependHead

test('prepend to head', t => {
  const r = new Html().head(meta('foo')).prependHead(meta('bar'))
  t.is(r.toString(), tpl('<meta name="bar" /><meta name="foo" />', ''))
})

test('prepend to empty head', t => {
  const r = new Html().prependHead(meta('bar'))
  t.is(r.toString(), tpl('<meta name="bar" />', ''))
})

// .prependBody

test('prepend to body', t => {
  const r = new Html().body(tag('foo')).prependBody(tag('bar'))
  t.is(r.toString(), tpl('', '<bar></bar><foo></foo>'))
})

test('prepend to empty body', t => {
  const r = new Html().prependBody(tag('bar'))
  t.is(r.toString(), tpl('', '<bar></bar>'))
})

// .xmlns

test('add xmlns to html', t => {
  const r = new Html().xmlns('test-it-please')
  t.is(r.toString(), '<html xmlns="test-it-please"><head></head><body></body></html>')
})

// .lang

test('add lang to html', t => {
  const r = new Html().lang('en_US')
  t.is(r.toString(), '<html lang="en_US"><head></head><body></body></html>')
})

// .class

test('add class to html', t => {
  const r = new Html().class('foo').class('bar')
  t.is(r.toString(), '<html class="foo bar"><head></head><body></body></html>')
})

test('doctype for html5', t => {
  const r = new Html().doctype()
  t.is(r.toString(), `<!DOCTYPE HTML>${tpl('', '')}`)
})

test('doctype with param', t => {
  const dct = [
    ['5', '<!DOCTYPE HTML>'],
    [5, '<!DOCTYPE HTML>'],
    ['strict', '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'],
    ['transitional', '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'],
    ['frameset', '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">'],
  ]

  dct.forEach(([dt, expected]) => {
    const r = new Html().doctype(dt)
    t.is(r.toString(), `${expected}${tpl('', '')}`)
  })
})
