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
			'duration': 5000,
			'opacity' : 0.9,
			'template':	'<div class="mercor-inner">'
				+'<div class="mercor-close" title="Close"></div>'
				+'<div class="mercor-title">{TITLE}</div>'
				+'<div class="mercor-text">{TEXT}</div>'
			+'</div>'
		},
		'fade': {
			'duration': 250,
		    'transition': 'linear'
		},
		onOpen: null,
		onClose: null,
		onFadeIn: null,
		onFadeOut: null
	},

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
	
	_setupNode: function(){
		this.buttonClose = this.node.getElement('.mercor-close');
		var close = function(){
			this.close();
		}.bind(this);
		// Add the delete event
		this.buttonClose.addEvent('click',function(event){
			close();
			event.stop();
		});
		this.fade = new Fx.Morph(this.node, {
			duration: this.options.fade.duration,
			transition: this.options.fade.transition
		});
		close.delay(this.options.node.duration);
	},
	
	_fadeIn: function(){
		this.fade.start({'opacity': [0, 1]});
		this.fireEvent('fadeIn');
	},
	
	_fadeOut: function(){
		this.fade.start({'opacity': [1,0]});
		this.fireEvent('fadeOut');
	},

	open: function(options){
		this.container.set('class',this.options.container.position);
		this._injectNode(options);
		this._setupNode();
		this._fadeIn();
		this.fireEvent('open');
	},

	close: function(){
		if (this.fade){
			this.fade.addEvent('onChainComplete',function(){
				if(!this.node) return;
				this.node.destroy();
			}.bind(this));
			this._fadeOut();
		}
		this.fireEvent('close');
	}
});

MercorAlert.Request = new Class({
	
	Extends: MercorAlert,

	Implements : [Events, Options],
	
	options:{
		'request': {
			'url': '',
			'method': 'get',
			'asynch': true,
			'data': '',
			'success': function(responseText, body){body.set('text', responseText);}
	    }
	},
	
	initialize: function(options){
		this.parent(options);
	},
	
	_load: function() {
		this.header.set('html',this.options.title);
		var requestOptions = {
			url : this.options.request.url,
			data : this.options.request.data,
			async : this.options.request.async,
			method : this.options.request.method,
			onRequest: function(){
				this._loadStart();
				this.fireEvent('request');
			}.bind(this),
			onSuccess: function(responseText){
				this.options.request.success(responseText).inject(this.content);
				this.fireEvent('success');
			}.bind(this),
			onFailure: function() {
				this._failure();
				this.fireEvent('failure');
			}.bind(this),
			onComplete: function() {
				this.content.inject(this.body);
				this._loadStop();
				this.fireEvent('complete');
			}.bind(this)
		};
		this.request = new Request(requestOptions);
		this.request.send();
	}

});