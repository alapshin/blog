Date: 2017-05-26
Title: Custom fonts using Support Library
Category: Android
Tags: android

Support for custom fonts in Android was always tricky.
You had to write custom view that extended `TextView`/`Button`/`Checkbox`/etc.
and use `TextView#setTypeface` to set custom typeface. And then use this custom
view everywhere you may need custom fonts. If you wanted to set custom font
via xml you have to add custom attributes and handle them in your `TextView`.

As an alternative you could use 3rd party libraries that simplify this
task such [Calligraphy][1] by Chris Jenkins or [fontbinding][2] by Lisa
Wray. But while these libraries mostly solve problem of
using custom fonts they still have some limitations. For example, Calligraphy
in its current form doesn't support standard `android:textStyle` attribute
so you can't just set font globally and then use `android:textStyle="bold"`
to get bold variant of this font. Instead you have to declare number of
styles such as

```xml
<style name="AppTheme.TextAppearance.Bold" parent="Base.TextAppearance.AppCompat">
    <item name="fontPath">fonts/OpenSans-Bold.ttf</item>
    <item name="android:textStyle">bold</item>
</style>
```

and use them

```xml
<TextView
    android:id="@+id/textview"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/foobar"
    android:textAppearance="@style/AppTheme.TextAppearance.Bold"/>
```

And while this is not hard you still have to write these styles and then
remember to use them instead of default attribute.

Starting from Android O developer preview everything is changed and now we have
official support for custom fonts. And what is more important is that this
functionality already available in Support Library (with minor caveat) and
works pretty much same way.

So what we need to do to enable custom fonts using support library?

First, we need to include our custom font into application. In the past
you would add custom fonts into `assets` folder but now there is special
resource type for fonts. To create such resource you need to add `*.ttf` file
with the font to `res/font` directory in you project. After that you can load
typeface using `ResourceCompat.getFont(context, R.font.fontname)`

Right now you may think this is not much better that loading typefaces directly
from assets and you would be right if this is was all that supported. Thankfully
this is not the case. Main improvement comes with the ability to declare font
family and use it as a single unit. To declare font family you need to create
xml file in `res/font` folder that contains

```xml
<font
    app:font="@font/nunito_regular"
    android:font="@font/nunito_regular"
    app:fontStyle="normal"
    android:fontStyle="normal"
    app:fontWeight="400"
    android:fontWeight="400"/>

<font
    app:font="@font/nunito_italic"
    android:font="@font/nunito_italic"
    app:fontStyle="italic"
    android:fontStyle="italic"
    app:fontWeight="400"
    android:fontWeight="400"/>

<font
    app:font="@font/nunito_bold"
    android:font="@font/nunito_bold"
    app:fontStyle="normal"
    android:fontStyle="normal"
    app:fontWeight="700"
    android:fontWeight="700"/>

<font
    app:font="@font/nunito_bold_italic"
    android:font="@font/nunito_bold_italic"
    app:fontStyle="italic"
    android:fontStyle="italic"
    app:fontWeight="700"
    android:fontWeight="700"/>
```

As you can see we have to duplicate every `android:` attribute with `app:` and
this is caveat that was mentioned before. Without them when you request
different style (bold or/and italic) Android will fake it using normal font
instead of using specified font. Usually this is not something you want.

To use font family from the xml you would use existing attributes
`android:fontFamily` and `android:textStyle`

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context="com.alapshin.fontcompat.MainActivity">

  <TextView
      android:id="@+id/pacifico"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:layout_marginTop="16dp"
      android:fontFamily="@font/pacifico"
      android:text="@string/pangram"
      android:textSize="20sp"
      app:layout_constraintLeft_toLeftOf="parent"
      app:layout_constraintRight_toRightOf="parent"
      app:layout_constraintTop_toTopOf="parent"/>

  <TextView
      android:id="@+id/nunito_regular"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:layout_marginTop="8dp"
      android:fontFamily="@font/nunito"
      android:text="@string/pangram"
      android:textSize="20sp"
      app:layout_constraintLeft_toLeftOf="parent"
      app:layout_constraintRight_toRightOf="parent"
      app:layout_constraintTop_toBottomOf="@+id/pacifico" />

  <TextView
      android:id="@+id/nunito_bold"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:layout_marginTop="8dp"
      android:fontFamily="@font/nunito"
      android:text="@string/pangram"
      android:textSize="20sp"
      android:textStyle="bold"
      app:layout_constraintLeft_toLeftOf="parent"
      app:layout_constraintRight_toRightOf="parent"
      app:layout_constraintTop_toBottomOf="@+id/nunito_regular" />

  <TextView
      android:id="@+id/nunito_italic"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:layout_marginTop="8dp"
      android:fontFamily="@font/nunito"
      android:text="@string/pangram"
      android:textSize="20sp"
      android:textStyle="italic"
      app:layout_constraintLeft_toLeftOf="parent"
      app:layout_constraintRight_toRightOf="parent"
      app:layout_constraintTop_toBottomOf="@+id/nunito_bold" />

  <TextView
      android:id="@+id/nunito_bold_italic"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:layout_marginTop="8dp"
      android:fontFamily="@font/nunito"
      android:text="@string/pangram"
      android:textSize="20sp"
      android:textStyle="bold|italic"
      app:layout_constraintLeft_toLeftOf="parent"
      app:layout_constraintRight_toRightOf="parent"
      app:layout_constraintTop_toBottomOf="@+id/nunito_italic" />

  <TextView
      android:id="@+id/nunito_bold_italic_manual"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:layout_marginTop="8dp"
      android:text="@string/pangram"
      android:textSize="20sp"
      app:layout_constraintLeft_toLeftOf="parent"
      app:layout_constraintRight_toRightOf="parent"
      app:layout_constraintTop_toBottomOf="@+id/nunito_bold_italic" />

</android.support.constraint.ConstraintLayout>
```

Even if your `minSdkVersion` is less than 16 you still can use
`android:fontFamilty` while using AppCompat and everything will work.

Maybe there is some corner cases that didn't crop up during my initial testing
but right now custom fonts works surprisingly well with Support Library. So big
thanks for Google engineers that implemented this feature.

If you want to know more about custom fonts support you can read official
[documentation][3]. Also keep an eye on Support Library [changelog][4] there are
could be more changes in custom fonts support. For example, particular detail
about need to use `app:` attributes in font family declaration is taken from
there.

Last but not least I want to give big thanks to Mark Allison of `Styling Android`
fame for writing about custom fonts support before IO17. You could check his
articles([part 1][5], [part 2][6]) for more details.

Demo application for this post is available on [Github][7]


[1]: https://github.com/chrisjenx/Calligraphy
[2]: https://github.com/lisawray/fontbinding
[3]: https://developer.android.com/preview/features/working-with-fonts.html
[4]: https://developer.android.com/topic/libraries/support-library/revisions.html
[5]: https://blog.stylingandroid.com/android-o-fonts/
[6]: https://blog.stylingandroid.com/android-o-fonts-part-2/
[7]: https://github.com/alapshin/support-fonts-demo
