/* global describe, beforeEach, it, $, assert */

'use strict'

var jsdom = require('mocha-jsdom')
var fs = require('fs')
var chai = require('chai')
global.assert = chai.assert

;['1.11.3'].forEach(function (jQueryVersion) {
  describe('firstOn jQuery v' + jQueryVersion, function () {
    jsdom({
      src: [
        fs.readFileSync('./test/jquery/jquery-' + jQueryVersion + '.js', 'utf-8'),
        fs.readFileSync('./src/index.js')
      ]
    })

    beforeEach(function () {
      $('body *').remove()
    })

    it('should fire callback before others', function () {
      var eventsOrder = []

      $('<p>').appendTo('body')

      $('p')
        .on('click', function () {
          eventsOrder.push('vanilla 1')
        })
        .on('click', function () {
          eventsOrder.push('vanilla 2')
        })
        .firstOn('click', function () {
          eventsOrder.push('first event')
        })
        .trigger('click')

      assert.deepEqual(eventsOrder, ['first event', 'vanilla 1', 'vanilla 2'])
    })

    it('should work with multiple selectors', function () {
      var eventsOrder = []

      $('<p>').appendTo('body')
      $('<div>').appendTo('body')
      $('<span>').appendTo('body')

      $('p, div, span')
        .on('click', function () {
          eventsOrder.push('vanilla 1')
        })
        .on('click', function () {
          eventsOrder.push('vanilla 2')
        })
        .firstOn('click', function () {
          eventsOrder.push('first event')
        })
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
        'vanilla 2'
      ])
    })

    it('should work with multiple events', function () {
      var eventsOrder = []

      $('<p>').appendTo('body')

      $('p')
        .on('mouseup mousedown', function (event) {
          eventsOrder.push('vanilla ' + event.type)
        })
        .firstOn('mouseup mousedown', function (event) {
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