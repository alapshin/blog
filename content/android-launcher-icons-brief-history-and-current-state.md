Date: 2017-06-10
Title: Android launcher icons: past, present and near future
Tags: android, icons
Category: Android

A launcher icon is a graphic that represents your application. Launcher icon
is used by launcher applications and appear on the user's home screen. It's
one of the first things that user will see after installing your app so it
is very important to make sure that you provide icon in correct size, format and
shape to make good first impression.

#### Size and format
First thing first. Your app could be installed on the devices with different
screen density so you should provide launcher icon in different sizes.

Official [documentation][1] specifies following sizes for different screen
densities

<table class="table">
  <tr>
    <th scope="row">Screen density</th>
    <td>ldpi (120dpi)<br></th>
    <td>mdpi (160dpi)<br></th>
    <td>hdpi (240dpi)<br></th>
    <td>xhdpi (320dpi)<br></th>
    <td>xxhdpi (480dpi)<br></th>
    <td>xxxhdpi (640dpi)<br></th>
  </tr>
  <tr>
    <th scope="row">Icon size</td>
    <td>36px</td>
    <td>48px</td>
    <td>72px</td>
    <td>96px</td>
    <td>144px</td>
    <td>192px</td>
  </tr>
</table>

Also documentation provides information about what format should be used for
icons

> Launcher icons should be 32-bit PNGs with an alpha channel for transparency.

#### Drawables vs mipmaps
Because launcher icon have to be provided as PNG image and have to be
optimized for different screen densities standard approach would be to create
multiple images of correct size, assign them same name (for example `ic_launcher.png`)
and place them `drawables-*` folders. And then specify this icon in `AndroidManifest.xml`

```xml
<application
    android:icon="@drawable/ic_launcher">
...
</application>
```

While this approach is correct and still works it is no longer recommended by
Google. Starting from Android 5.0 [recommended][2] approach is to place launcher
icons into `mipmap-*` folders

> It's best practice to place your app icons in `mipmap-` folders (not the
> `drawable-` folders) because they are used at resolutions different from the
> device's current density.

Another reason to use `mipmaps` for launcher icons instead of `drawables`
is the [fact][3] that `mipmaps` will not be removed from resulting apk if your
app uses density splits:

> One thing I mentioned in another thread that is worth pointing out -- if you
> are building different versions of your app for different densities, you
> should know about the `mipmap` resource directory.  This is exactly like
> `drawable` resources, except it does not participate in density stripping when
> creating the different apk targets.

If you create new project using recent Android Studio your launcher icon will be
created using `mipmaps` by default. To migrate existing `drawables` launcher
icons you need to copy them in appropriate `mipmap-` folders and change `AndroidManifest.xml`

```xml
<application
    android:icon="@mipmap/ic_launcher">
...
</application>
```

#### Don't be a square
With release of Android 7.1 and Pixel line of phones in the autumn of 2016
Google also introduced new launcher called Pixel Launcher. One interesting
aspect of this launcher is support for round icons. This feature allows your
to specify additional icon that should be used by launcher if it wants to draw
circular icons. This is what official [documentation][4] says about it

> Apps can now define circular launcher icons, which are used on devices that
> support them. When a launcher requests an app icon, the framework returns
> either `android:icon` or `android:roundIcon`, depending on the device build
> configuration. Because of this, apps should make sure to define both
> `android:icon` and `1android:roundIcon` resources when responding to launcher
> intents.

If your app has rectangular launcher icon it may be a good idea to create
separate round icon and declare it in `AndroidManifest.xml` to better fit
into overall system design

```xml
<application
    android:icon="@drawable/ic_launcher"
    android:roundIcon="@drawable/ic_launcher">
...
</application>
```

#### Adaptive icons
Upcoming release of Android O takes idea of different shapes for launcher icons
further and introduces concept of [Adaptive Icons].

> For example, a launcher icon can display a circular shape on one OEM device,
> and display a squircle on another device. Each device OEM provides a mask,
> which the system then uses to render all icons with the same shape. The new
> launcher icons are also used in shortcuts, the Settings app, sharing dialogs,
> and the overview screen.

Main idea behind this feature is that instead of providing launcher icons as
single image you provide two images: background and foreground and let the
system create icon of correct shape for you.

Also starting with Android Studio 3.0 you could create such adaptive icons
using [Image Asset Studio][6].

While two links to official documentation provides good explanation about
what adaptive icons is and how to create them using Android Studio we can also
use new Image Asset Studio to create legacy launcher icons for devices running
Android older than upcoming O release. There is [great article][7] from Mark
Allison from Styling Android about that.


[1]: https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher.html#size
[2]: https://android-developers.googleblog.com/2014/10/getting-your-apps-ready-for-nexus-6-and.html
[3]: https://plus.google.com/+DianneHackborn/posts/QTA9McYan1L
[4]: https://developer.android.com/about/versions/nougat/android-7.1.html#circular-icons
[5]: https://developer.android.com/preview/features/adaptive-icons.html
[6]: https://developer.android.com/studio/write/image-asset-studio.html
[7]: https://blog.stylingandroid.com/adaptive-icons/
