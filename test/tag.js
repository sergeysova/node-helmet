import test from 'ava'
import { Tag, tag } from '../lib'


const span = () => new Tag('span')
const div = () => new Tag('div')
const em = () => new Tag('em')
const divSelf = () => {
  const d = new Tag('div'); d.selfClosing = true; return d
}

test('default constructor create empty tag', t => {
  t.is(new Tag().toString(), '<div></div>')
})

test('default constructor create any tags', t => {
  t.is(new Tag('blockquote').toString(), '<blockquote></blockquote>')
  t.is(new Tag('h5').toString(), '<h5></h5>')
  t.is(new Tag('body').toString(), '<body></body>')
  t.is(new Tag('custom-element').toString(), '<custom-element></custom-element>')
})

test('tag with spaces will be replaced', t => {
  t.is(new Tag('foo bar').toString(), '<foo-bar></foo-bar>')
})

test('tag with / and \\ will be replaced', t => {
  t.is(new Tag('foo\\bar').toString(), '<foo-bar></foo-bar>')
  t.is(new Tag('foo/bar').toString(), '<foo-bar></foo-bar>')
})

test('self closing tag w/out children', t => {
  const result = div()
  result.selfClosing = true
  t.is(result.toString(), '<div />')
})

// .attr()

test('div with attr foo="bar"', t => {
  const result = div().attr('foo', 'bar')
  t.is(result.toString(), '<div foo="bar"></div>')
})

test('.attr() overwrites last value', t => {
  const r = div().attr('foo', 'foo').attr('foo', 'bar')
  t.is(r.toString(), '<div foo="bar"></div>')
})

test('selfclosed div with attr foo="bar"', t => {
  const result = divSelf().attr('foo', 'bar')
  t.is(result.toString(), '<div foo="bar" />')
})

test('div with many attributes', t => {
  const result = div().attr('one', '1').attr('two', 2).attr('three', 3)
  t.is(result.toString(), '<div one="1" two="2" three="3"></div>')
})

test('selfclosed div with many attributes', t => {
  const result = div().attr('one', '1').attr('two', 2).attr('three', 3)
  result.selfClosing = true
  t.is(result.toString(), '<div one="1" two="2" three="3" />')
})

test('.attr() with empty value should remove attr', t => {
  const r = div().attr('test', 'foobar').attr('test')
  t.is(r.toString(), '<div></div>')
})

test('.attr() with `true` value shoud be without ="true"', t => {
  const r = div().attr('foo', true)
  t.is(r.toString(), '<div foo></div>')
})

// .setChildren()

test('selfopened setChildren with opened children', t => {
  const result = div().setChildren(div())
  t.is(result.toString(), '<div><div></div></div>')
})

test('selfclosed setChildren with opened children', t => {
  const result = div().setChildren(div())
  result.selfClosing = true
  t.is(result.toString(), '<div><div></div></div>')
})

test('selfclosed setChildren with closed children', t => {
  const sec = div()
  sec.selfClosing = true
  const result = div().setChildren(sec)
  result.selfClosing = true
  t.is(result.toString(), '<div><div /></div>')
})

test('selfopened setChildren with closed children', t => {
  const sec = div()
  sec.selfClosing = true
  const result = div().setChildren(sec)
  t.is(result.toString(), '<div><div /></div>')
})

test('setChildren should overwrite', t => {
  const r = div().setChildren(div()).setChildren(span(), span())
  t.is(r.toString(), '<div><span></span><span></span></div>')
})

// .append()

test('append to empty', t => {
  const r = div().append(div())
  t.is(r.toString(), '<div><div></div></div>')
})

test('append after setChildren', t => {
  const r = div().setChildren(div()).append(span())
  t.is(r.toString(), '<div><div></div><span></span></div>')
})

test('append after append', t => {
  const r = div().append(div()).append(span())
  t.is(r.toString(), '<div><div></div><span></span></div>')
})

test('append more than one', t => {
  const r = div().append(div(), span(), divSelf())
  t.is(r.toString(), '<div><div></div><span></span><div /></div>')
})

test('append more than one after append and setChildren', t => {
  const r = div().append(div()).setChildren(span()).append(span(), span())
  t.is(r.toString(), '<div><span></span><span></span><span></span></div>')
})

// .prepend()

test('prepend to empty', t => {
  const r = div().prepend(div())
  t.is(r.toString(), '<div><div></div></div>')
})

test('prepend after setChildren', t => {
  const r = div().setChildren(div()).prepend(span())
  t.is(r.toString(), '<div><span></span><div></div></div>')
})

test('prepend after prepend', t => {
  const r = div().prepend(div()).prepend(span())
  t.is(r.toString(), '<div><span></span><div></div></div>')
})

test('prepend more than one', t => {
  const r = div().prepend(div(), span(), divSelf())
  t.is(r.toString(), '<div><div></div><span></span><div /></div>')
})

test('prepend more than one setChildren', t => {
  const r = div().prepend(div()).setChildren(div()).prepend(span(), em())
  t.is(r.toString(), '<div><span></span><em></em><div></div></div>')
})

test('prepend with append after setChildren', t => {
  const r = div().setChildren(div()).prepend(span()).append(em())
  t.is(r.toString(), '<div><span></span><div></div><em></em></div>')
})

// .class()

test('add new class', t => {
  const r = div().class('foo')
  t.is(r.toString(), '<div class="foo"></div>')
})

test('add space separated classes', t => {
  const r = div().class('foo bar')
  t.is(r.toString(), '<div class="foo bar"></div>')
})

test('add array of classes', t => {
  const r = div().class(['foo', 'bar'])
  t.is(r.toString(), '<div class="foo bar"></div>')
})

test('add new class to existing', t => {
  const r = div().attr('class', 'bar').class('foo')
  t.is(r.toString(), '<div class="bar foo"></div>')
})

test('add new class with chained call', t => {
  const r = div().class('foo').class('bar')
  t.is(r.toString(), '<div class="foo bar"></div>')
})

test('add new class double (not unique)', t => {
  const r = div().class('foo').class('foo')
  t.is(r.toString(), '<div class="foo foo"></div>')
})

test.todo('add class and escape danger symbols')

// .id()

test('set id for tag', t => {
  const r = div().id('foo')
  t.is(r.toString(), '<div id="foo"></div>')
})

test('set id overwrite last value', t => {
  const r = div().id('foo').id('bar')
  t.is(r.toString(), '<div id="bar"></div>')
})

test('unset id with .id()', t => {
  const r = div().id('foo').id()
  t.is(r.toString(), '<div></div>')

  const r2 = div().id()
  t.is(r2.toString(), '<div></div>')
})

// static

test('Tag.div()', t => {
  t.is(tag.div, Tag.div)

  t.is(Tag.div().toString(), '<div></div>')
})

test('Tag.h()', t => {
  t.is(tag.h, Tag.h)

  t.is(Tag.h().toString(), '<h1></h1>')
  t.is(Tag.h(5).toString(), '<h5></h5>')
})

test('Tag.title()', t => {
  t.is(tag.title, Tag.title)
  t.is(Tag.title().toString(), '<title></title>')
})

test('Tag.title(value)', t => {
  t.is(Tag.title('example value').toString(), '<title>example value</title>')
})

test('Tag.title(value, value)', t => {
  t.is(Tag.title('foo', 'bar').toString(), '<title>foo bar</title>')
})

test('Tag.script()', t => {
  t.is(tag.script, Tag.script)
  t.is(Tag.script().toString(), '<script type="application/javascript"></script>')
})

test('Tag.script(foo/bar)', t => {
  t.is(Tag.script('foo/bar').toString(), '<script type="foo/bar"></script>')
})

// function

test('tag(div) should equal new Tag(div)', t => {
  t.is(tag('div').toString(), new Tag('div').toString())
})

