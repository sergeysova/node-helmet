import test from 'ava'
import { helmet, Helmet, meta, tag } from '../lib'


const tpl = (head, body) => `<!DOCTYPE HTML><html><head>${head}</head><body>${body}</body></html>`

test('default constructor', t => {
  t.is(new Helmet().toString(), '<html><head></head><body></body></html>')
})

test('helmet() should be equal new Helmet().doctype()', t => {
  t.is(helmet().toString(), new Helmet().doctype().toString())
})

// .title

test('add title to head', t => {
  const r = helmet().title('Example title')
  t.is(r.toString(), tpl('<title>Example title</title>', ''))
})

test('title not overwrites', t => {
  const r = helmet().title('Example title').title('foo bar')
  t.is(r.toString(), tpl('<title>Example title</title><title>foo bar</title>', ''))
})

test.todo('maybe title should be overwrites?')

// .link

test('.link() should add <link /> to <head>', t => {
  const r = helmet().link('foo', 'bar')
  const expected = meta.link().attr('rel', 'foo').attr('href', 'bar').toString()
  t.is(r.toString(), tpl(expected, ''))
})

test('.link() with props', t => {
  const r = helmet().link('foo', 'bar', { example: 'value' })
  const expected = meta.link()
    .attr('rel', 'foo')
    .attr('href', 'bar')
    .attr('example', 'value')
    .toString()
  t.is(r.toString(), tpl(expected, ''))
})

// .stylesheet

test('stylesheet() should add <link> to head', t => {
  const r = helmet().stylesheet('/test/path.css')
  const expected = meta.link()
    .attr('rel', 'stylesheet')
    .attr('href', '/test/path.css')
  t.is(r.toString(), tpl(expected.toString(), ''))
})

test('stylesheet() with props', t => {
  const r = helmet().stylesheet('/test/path.css', { type: 'text/css' })
  const expected = meta.link()
    .attr('rel', 'stylesheet')
    .attr('href', '/test/path.css')
    .attr('type', 'text/css')
  t.is(r.toString(), tpl(expected.toString(), ''))
})

// .script

test('script() should add <script> to body', t => {
  const r = helmet().script('/path/src.js')
  const expected = tag('script')
    .attr('type', 'application/javascript')
    .attr('src', '/path/src.js')
  t.is(r.toString(), tpl('', expected.toString()))
})

test('script() with type', t => {
  const r = helmet().script('/path/src.js', 'demo/mime-type')
  const expected = tag('script')
    .attr('type', 'demo/mime-type')
    .attr('src', '/path/src.js')
  t.is(r.toString(), tpl('', expected.toString()))
})

test('script() with type and props', t => {
  const r = helmet().script('/path/src.js', 'demo/mime-type', { key: 'value', boolean: true })
  const expected = tag('script')
    .attr('type', 'demo/mime-type')
    .attr('src', '/path/src.js')
    .attr('key', 'value')
    .attr('boolean', true)
  t.is(r.toString(), tpl('', expected.toString()))
})

// .inlineScript

test('inlineScript() should add <script></script> to body', t => {
  const script = 'function(a,b){return a+b}'
  const r = helmet().inlineScript(script)
  const expected = tag('script')
    .attr('type', 'application/javascript')
    .attr('charset', 'utf-8')
    .setChildren(`(${script})()`)
  t.is(r.toString(), tpl('', expected.toString()))
})

test('inlineScript() with props', t => {
  const script = 'function(a,b){return a+b}'
  const r = helmet().inlineScript(script, { async: true })
  const expected = tag('script')
    .attr('type', 'application/javascript')
    .attr('charset', 'utf-8')
    .setChildren(`(${script})()`)
    .attr('async', true)
  t.is(r.toString(), tpl('', expected.toString()))
})

test('inlineScript() with props and IIFE arguments', t => {
  const script = 'function(a,b){return a+b}'
  const r = helmet().inlineScript(script, { async: true }, [1, 2])
  const expected = tag('script')
    .attr('type', 'application/javascript')
    .attr('charset', 'utf-8')
    .setChildren(`(${script})(1, 2)`)
    .attr('async', true)
  t.is(r.toString(), tpl('', expected.toString()))
})

test('div() should add <div> to body', t => {
  const r = helmet().div()
  const expected = tag('div')
  t.is(r.toString(), tpl('', expected.toString()))
})

test('div() with props', t => {
  const r = helmet().div({ id: 'demo', 'data-target': 'foo' })
  const expected = tag('div').id('demo').attr('data-target', 'foo')
  t.is(r.toString(), tpl('', expected.toString()))
})

test('div() with props and content', t => {
  const r = helmet().div({ id: 'demo', 'data-target': 'foo' }, tag('main'))
  const expected = tag('div')
    .id('demo')
    .attr('data-target', 'foo')
    .setChildren(tag('main'))
  t.is(r.toString(), tpl('', expected.toString()))
})

test('div() with props and multi content', t => {
  const r = helmet().div({ id: 'demo', 'data-target': 'foo' }, tag('header'), tag('main'))
  const expected = tag('div')
    .id('demo')
    .attr('data-target', 'foo')
    .append(tag('header'))
    .append(tag('main'))
  t.is(r.toString(), tpl('', expected.toString()))
})

