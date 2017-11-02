import test from 'ava'
import { Meta, meta, tag } from '../lib'


test('default constructor', t => {
  t.is(new Meta().toString(), '<meta />')
})

test('constructor with name', t => {
  t.is(new Meta('foo').toString(), '<meta name="foo" />')
})

test('constructor with content', t => {
  t.is(new Meta(undefined, 'foo').toString(), '<meta content="foo" />')
})

test('constructor with name and content', t => {
  t.is(new Meta('bar', 'foo').toString(), '<meta name="bar" content="foo" />')
})

// function

test('meta() should be equal new Meta()', t => {
  t.is(meta().toString(), new Meta().toString())
})

test('meta(name, content)', t => {
  t.is(meta('name', 'content').toString(), '<meta name="name" content="content" />')
})

test('meta(name, { props: values })', t => {
  const r = meta('name', { content: 'content', value: 'value', boolean: true })
  const expected = '<meta name="name" content="content" value="value" boolean />'
  t.is(r.toString(), expected)
})


// .content

test('.content(value) should set content prop', t => {
  const r = meta().content('foo')
  t.is(r.toString(), '<meta content="foo" />')
})

test('.content(value) should overwrite content prop', t => {
  const r = meta('foo', 'bar').content('foo')
  t.is(r.toString(), '<meta name="foo" content="foo" />')
})

// statics

test('Meta.charset()', t => {
  t.is(Meta.charset, meta.charset)
  const r = Meta.charset()
  t.is(r.toString(), '<meta charset="utf-8" />')
})

test('Meta.charset(cp1251)', t => {
  const r = Meta.charset('cp1251')
  t.is(r.toString(), '<meta charset="cp1251" />')
})

test('Meta.httpEquiv()', t => {
  t.is(Meta.httpEquiv, meta.httpEquiv)
  t.is(Meta.httpEquiv('foo', 'bar').toString(), '<meta http-equiv="foo" content="bar" />')
})

test('Meta.viewport()', t => {
  t.is(Meta.viewport, meta.viewport)
  t.is(Meta.viewport('foobar').toString(), '<meta name="viewport" content="foobar" />')
})

test('Meta.link()', t => {
  t.is(meta.link, Meta.link)
  t.is(Meta.link().toString(), '<link />')
})

test('Meta.referrer()', t => {
  t.is(Meta.referrer, meta.referrer)
  t.is(Meta.referrer('foobar').toString(), '<meta name="referrer" content="foobar" />')
})

test('Meta.map() with simple values', t => {
  t.is(Meta.viewport, meta.viewport)

  const map = { foo: 'bar', first: 'f1', second: 's2' }
  const expected = '<meta name="foo" content="bar" /><meta name="first" content="f1" /><meta name="second" content="s2" />'
  t.is(Meta.map(map).toString(), expected)
})

test('Meta.map() in tag', t => {
  const map = { first: 'f1', second: 's2' }
  const expected = '<meta name="first" content="f1" /><meta name="second" content="s2" />'

  const r = tag('head').append(Meta.map(map))
  t.is(r.toString(), `<head>${expected}</head>`)
})

test('Meta.map() with charset', t => {
  t.is(Meta.viewport, meta.viewport)

  const map = { foo: 'bar', charset: 'cp1251' }
  const expected = '<meta name="foo" content="bar" /><meta charset="cp1251" />'
  t.is(Meta.map(map).toString(), expected)
})
