# @s-ui/tealium-tracker
> Tool to track events like click or change and, if a tag is present on the element dispatch a link event to tealium.

This tool is meant to be used with the [@s-ui/html-tagger](https://github.com/SUI-Components/sui/tree/master/packages/sui-html-tagger) tool but you can define your own tags and it will work asswell.ls
cd
# Use:

## Basic usage: 

To use it require it from the desired file as this:
```javascript
require('@s-ui/tealium-tracker')()
```
The package will: 
#### 1. Init listeners:

This will add a document listener watching for:
- 1. `click` event
- 2. `input` change event

Once we click on any `'A', 'BUTTON', 'DIV', 'INPUT', 'SVG'` the listener callback will act and check if we or any of our parents with that whitelisted types have the tag `data-tealium-tag`

If the tag exists it will call a throttle function that will call utag.link function. If there's no utag present on the site the package will warn you with a console message.


## Custom event dispatcher usage: 


```javascript
require('@s-ui/tealium-tracker')({ customEventName: 'MyCustomEventName' })
```

The package will:

#### 1. Init listeners:

This will add a document listener watching for:
- 1. `click` event
- 2. `input` change event
- 3. `customEvent` trigger

Once we click on any `'A', 'BUTTON', 'DIV', 'INPUT', 'SVG'` the listener callback will act and check if we or any of our parents with that whitelisted types have the tag `data-tealium-tag`

If the tag exists it will call a throttle function that will call utag.link function. If there's no utag present on the site the package will warn you with a console message.

#### 2. Populate window.dispatchCustomEvent function

For retro-compatibility reasons we populate this function to the window so the sites could dispatch their own custom event without problem.

```javascript
    window.dispatchCustomEvent = (detail) => dispatchEvent({ eventName: this.customEventName, detail })
```

## Anchor delay use case

Some trackers like xiti inject an image in our site with the purpose of do the track effective. If we made a native redirection we could fall on image load cancelations due the redirection of the page. To avoid that you can init the tracker in a anchorDelay mode that will add the anchor as a callback of our link call and delay the location.reload for ensure purposes.



```javascript
require('@s-ui/tealium-tracker')({ handleAnchorDelay: true })
```

You can use it both with the custom event

```javascript
require('@s-ui/tealium-tracker')({ handleAnchorDelay: true, customEventName: 'MyCustomEventName' })
```
