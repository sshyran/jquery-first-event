/* global describe, beforeEach, $, before, it, assert */

'use strict'

var gulpUtil = require('gulp-util')
var jsdom = require('mocha-jsdom')
var fs = require('fs')
var chai = require('chai')
global.assert = chai.assert

// `live` was removed on jQuery 1.9

;[
  'jquery-1.4.4.js',
  'jquery-1.5.2.js',
  'jquery-1.6.4.js',
  'jquery-1.7.2.js',
  'jquery-1.8.3.js'
].forEach(function (jqueryVersion) {
  describe('firstLive', function () {
    jsdom({
      src: [
        fs.readFileSync('./test/jquery/' + jqueryVersion, 'utf-8'),
        fs.readFileSync('./src/index.js')
      ]
    })

    before(function () {
      gulpUtil.log(jqueryVersion)
    })

    beforeEach(function () {
      $('body *').remove()
    })

    it('should fire callback before others', function () {
      var eventsOrder = []

      $('<p>').appendTo('body')

      $('p')
        .live('click', function () {
          eventsOrder.push('vanilla 1')
        })
        .live('click', function () {
          eventsOrder.push('vanilla 2')
        })
        .firstLive('click', function () {
          eventsOrder.push('first event')
        })
        .trigger('click')

      assert.deepEqual(eventsOrder, ['first event', 'vanilla 1', 'vanilla 2'])
    })

    it('should work with multiple selectors', function () {
      var eventsOrder = []

      $('<p>').appendTo('body')
      $('<div>').appendTo('body')

      $('p, div, span')
        .live('click', function () {
          eventsOrder.push('vanilla 1')
        })
        .live('click', function () {
          eventsOrder.push('vanilla 2')
        })
        .firstLive('click', function () {
          eventsOrder.push('first event')
        })
        .trigger('click')
        .trigger('click')
        .trigger('click')

      assert.deepEqual(eventsOrder, [
        'first event',
        'vanilla 1',
        'vanilla 2',
        'first event',
        'vanilla 1',
        'vanilla 2',
        'first event',
        'vanilla 1',
        'vanilla 2',
        'first event',
        'vanilla 1',
        'vanilla 2',
        'first event',
        'vanilla 1',
        'vanilla 2',
        'first event',
        'vanilla 1',
        'vanilla 2'
      ])
    })

    it('should work with multiple events', function () {
      var eventsOrder = []

      $('<p>').appendTo('body')

      $('p')
        .live('mouseup mousedown', function (event) {
          eventsOrder.push('vanilla ' + event.type)
        })
        .firstLive('mouseup mousedown', function (event) {
          eventsOrder.push('first event ' + event.type)
        })
        .trigger('mousedown')
        .trigger('mouseup')

      assert.deepEqual(eventsOrder, [
        'first event mousedown',
        'vanilla mousedown',
        'first event mouseup',
        'vanilla mouseup'
      ])
    })
  })
})
