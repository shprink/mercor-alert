/*
---

name: MercorAlert

version: 1.0

description: A lightweight Mootools Class that provides alerts

authors: Julien Renaux

repository: https://github.com/shprink/mercor-alert

requires: Mootools Core/Element.Event

license: MIT

Copyright (c) 2012 Julien Renaux <contact@julienrenaux.fr>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

...
*/

var MercorAlert = new Class({

	Implements : [Events, Options],
	
	options:{		
		'container': {
			'id': 'mercor-alert-container',
			'el': '',
			'position': 'top-right'			
		},
		'node': {
			'id': 'mercor-alert',
			'width' : 300,
			'delay': 5000,
			'opacity' : 0.9,
			'template':	'<div class="mercor-inner">'
				+'<div class="mercor-close" title="Close"></div>'
				+'<div class="mercor-title">{TITLE}</div>'
				+'<div class="mercor-text">{TEXT}</div>'
			+'</div>'
		}
	},

	/**
	 * The node element
	 */
	node: null,
	
	/**
	 * The Close button element
	 */
	buttonClose: null,

	/**
	 * Store the node event
	 */
	event: null,

	initialize: function(options){
		// set the options
		this.setOptions(options);
		// Inject the container to the document
		this._injectContainer();
	},

	_injectContainer: function(){
		// If the container already exist we skip this function
		this.container = $(this.options.container.id);
		if(this.container) return;
		// create the container and inject it into the page
		this.container = new Element('div',{
			'id': this.options.container.id,
			'class': this.options.container.position
		}).inject(this.options.container.el || document.body,'bottom');
	},
	
	_addEvents: function()
	{
		var o = this;
		// Add the delete event
		this.buttonClose.addEvent('click',function(event){
			o.close();
			event.stop();
		});
		
		this.event = new Fx.Tween(this.node,{
			// Duration divided by 3 because 3 actions => Start, Hold, Close
			duration: this.options.node.delay / 3,
			link: 'chain',
			transition: Fx.Transitions.Sine.easeOut,
			onChainComplete : function(){
				this.close();
			}.bind(this)
		});

		// Event Start: Fade In
		this.event.start('opacity',0,this.options.node.opacity);
		// Event Hold
		this.event.start('opacity',this.options.node.opacity,this.options.node.opacity);
		// Event Close: Fade Out
		this.event.start('opacity',this.options.node.opacity,0);

		// Add the Pause event when hovering the container
		this.container.addEvents({
			mouseenter: function(){
				this.event.pause();
		    }.bind(this),
		    mouseleave: function(){
		    	this.event.resume();
		    }.bind(this)
		});
	},

	_injectNode: function(options){
		var title = (options.title || '').toString();
		var text = (options.text || '').toString();
		this.node = new Element('div',{
			html:  this.options.node.template.replace('{TITLE}', title).replace('{TEXT}', text),
			'class': this.options.node.id + ' ' + (options.type || 'success')
		});
		this.node.setStyle('width', this.options.node.width);
		this.node.setStyle('opacity', 0);
		this.node.inject(this.container, 'top');
	},

	open: function(options){
		// Set the container position
		this.container.set('class',this.options.container.position);
		// Inject the node
		this._injectNode(options);
		// Get the button close element
		this.buttonClose = this.node.getElement('.mercor-close');
		// Add events
		this._addEvents();
	},

	close: function(){
		if(!this.node) return;
		this.node.destroy();
	}
});