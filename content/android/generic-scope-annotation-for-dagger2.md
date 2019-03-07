Date: 2016-12-12
Title: Generic scope annotation for Dagger 2
Category: Android
Tags: android

Sometimes when using dependency injection it is desirable to reuse single
instance of some class instead of creating new object every time.

Dagger 1 and Dagger 2 formalize this using concept of scopes. From Dagger
documentation:

> Each Dagger component can be associated with a scope by annotating it with the
> scope annotation. The component implementation ensures that there is only one
> provision of each scoped binding per instance of the component. If the
> component declares a scope, it may only contain unscoped bindings or bindings
> of that scope anywhere in the graph. For example:

```java
@Singleton
@Component
interface MyApplicationComponent {
// this component can only inject types using unscoped or  @Singleton bindings
}
```

Dagger 1 only supported a single scope: `@Singleton`. Dagger 2 allows users to
create any number of well-formed scope annotations.

It means that you could have for example one scope for application level
dependencies

```java
@Scope
@Retention(RetentionPolicy.RUNTIME)
public @interface ApplicationScope {
}
```

and another for all activity level dependencies

```java
@Scope
@Retention(RetentionPolicy.RUNTIME)
public @interface ActivityScope {
}
```

In real app it is a good idea to create your dependencies only when necessary
and destroying them when they no longer needed. What it means is that usually
you would have some sort of `ApplicationComponent` containing all dependencies
needed for the duration of application run

```java
@Component(modules = {
    JsonModule.class,
    NetworkModule.class,
    DatabaseModule.class,
})
@ApplicationScope
public interface ApplicationComponent {
}
```

And then have separate components for various features. For example, if you
have *FeatureA* screen that require some dependencies (presenters, viewmodels
etc.) you would have `FeatureAComponent`. Say you also want that certain
dependencies during lifetime of said component where created only once.
This is perfect place to create custom scope

```java
@Scope
@Retention(RetentionPolicy.RUNTIME)
public @interface FeatureAScope {
}
```

annotate component

```java
@Component(modules = {
    FeautureAModule.class,
})
@FeatureAScope
public interface FeautreAComponent {
}
```

and annotate provides method

```java
@Module
public class FeatureAModule {
    @Provides
    @FeatureAScope
    SomeHeavyStuff provideSomeHeavyStuff() {
	return new SomeHeavyStuff();
    }
}
```

Now you have dependency that lives in specific component and created only once.
Everything is good and well but then you add dozens or so unrelated features
that all require separate components and separate scopes and now you have to
create dozens of boilerplate scope annotations.

What you can do instead is create generic annotation that looks like this

```java
@Scope
@Retention(RetentionPolicy.RUNTIME)
public @interface ScopeIn {
    Class<?> value();
}
```

and reuse it everywhere. Since scope is inherently tied to specific component it
makes sense to use component class literal as generic parameter for annotation.
Using this generic annotation we could rewrite previous code like this

```java
@Component(modules = {
    FeautureAModule.class,
})
@ScopeIn(FeatureAComponent.class)
public interface FeautreAComponent {
}
```

and module declaration

```java
@Module
public class FeatureAModule {
    @Provides
    @ScopeIn(FeatureAComponent.class)
    SomeHeavyStuff provideSomeHeavyStuff() {
	return new SomeHeavyStuff();
    }
}
```

Source for this useful trick is excellent [talk][2] from Square about their migration
process from Dagger 1 to Dagger 2. Check it out if you interested.

[2]: https://www.youtube.com/watch?v=7mVRZqsozPw
