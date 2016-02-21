# tdn.scale-to-fit
Angular directive &amp; styles designed to keep an img/video filling its container

## Dependencies
- Angular `>=1.2.0`
- jQuery `.width()`

## Install with Bower
```sh
$ bower install tdn.scale-to-fit
```

## Notes
- Only designed to be used with with media files like videos or images

## Examples

```html
<!-- the following are equivalent -->
<div class="container" scale-to-fit-container>
  <img src="example-1200-900.jpg" scale-to-fit="'1200:900'" />
</div>
<div class="container" scale-to-fit-container>
  <img src="example-1200-900.jpg" scale-to-fit="'4:3'" />
</div>
<div class="container" scale-to-fit-container>
  <img src="example-1200-900.jpg" scale-to-fit="{width: 1200, height:900}" />
</div>
<div class="container" scale-to-fit-container>
  <img src="example-1200-900.jpg" scale-to-fit="{width:4, height:3}" />
</div>

<!-- vertical-align valid values: 'center' (default), 'top', 'bottom', 'inherit' -->
<!-- 'inherit' takes on default browser behavior -->
<div class="container" scale-to-fit-container>
  <img src="example-1200-900.jpg" scale-to-fit="'4:3'" vertical-align="'top'" />
</div>
<!-- horizontal-align valid values: 'center' (default), 'left', 'right', 'inherit' -->
<!-- 'inherit' takes on default browser behavior -->
<div class="container" scale-to-fit-container>
  <img src="example-1200-900.jpg" scale-to-fit="'4:3'" horizontal-align="'left'" />
</div>
```
