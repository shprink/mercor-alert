

Mercor Alert is Deprecated. everything is happening in this repo: https://github.com/shprink/mercor
============

Alert is a Mootools based Class that allows you to display different type of alerts to users.

This Class is highly customizable. You can change, the size, the position, the style and even the template of you alerts.

Showcases & Documentation
-------------------------

http://mercor.julienrenaux.fr/library.html

How to use Mercor Alerts?
-------------------------

### Insert mandatory files in your Web page

* The Mootools Library (http://http://mootools.net)
* The Mercor Alert JavaScript Class
* The Mercor Alert CSS file

```html
<script type="text/javascript" src="js/mootools-core-1.4.1-full-nocompat.js"></script>
<script src="js/mercor-alert.js" type="text/javascript"></script>
<link rel="stylesheet" href="css/mercor-alert.css" type="text/css" media="screen">
```

### Create your first Alert

```js
window.addEvent('domready',function(){
    var alert = new MercorAlert;
    alert.open({
        'title': 'Praesent bibendum',
        'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum, justo sit.',
        'type': 'success' // notice, error, success
    });
});
```
### Want to customize your Alert?

Visit http://mercor.julienrenaux.fr/library.html for more information.

### License

License MIT.
Gives you the possibility to use and modify this code in every circumstance. 